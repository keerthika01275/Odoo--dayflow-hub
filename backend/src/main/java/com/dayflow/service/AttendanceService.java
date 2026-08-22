package com.dayflow.service;

import com.dayflow.dto.AttendanceRequest;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.Employee;
import com.dayflow.entity.enums.AttendanceStatus;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.DuplicateResourceException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Value("${office.latitude:11.0168}")
    private double officeLatitude;

    @Value("${office.longitude:76.9558}")
    private double officeLongitude;

    @Value("${office.allowed-radius-meters:200.0}")
    private double allowedRadiusMeters;

    @Transactional
    public Attendance checkIn(String email, AttendanceRequest request) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();

        Optional<Attendance> existingOpt = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today);
        if (existingOpt.isPresent()) {
            throw new DuplicateResourceException("You have already checked in today (" + today + ")");
        }

        // Server timestamp for security
        LocalDateTime now = LocalDateTime.now();

        // Calculate distance from office geofence
        double distanceMeters = calculateDistanceInMeters(
                request.getLatitude(), request.getLongitude(),
                officeLatitude, officeLongitude
        );

        boolean insideGeofence = distanceMeters <= allowedRadiusMeters;
        AttendanceStatus status = insideGeofence ? AttendanceStatus.PRESENT : AttendanceStatus.LOCATION_EXCEPTION;

        String remarks = insideGeofence
                ? "Checked in at office (" + String.format("%.1f", distanceMeters) + "m)"
                : "Location Exception: Checked in " + String.format("%.1f", distanceMeters) + "m from office";

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkIn(now)
                .checkInLatitude(request.getLatitude())
                .checkInLongitude(request.getLongitude())
                .status(status)
                .remarks(remarks)
                .build();

        log.info("Check-in recorded for {}: {} [Inside Geofence: {}]", employee.getEmployeeId(), status, insideGeofence);
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public Attendance checkOut(String email, AttendanceRequest request) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today)
                .orElseThrow(() -> new BadRequestException("No check-in record found for today. You must check in first."));

        if (attendance.getCheckOut() != null) {
            throw new DuplicateResourceException("You have already checked out today");
        }

        LocalDateTime now = LocalDateTime.now();
        attendance.setCheckOut(now);
        attendance.setCheckOutLatitude(request.getLatitude());
        attendance.setCheckOutLongitude(request.getLongitude());

        // Calculate working hours
        if (attendance.getCheckIn() != null) {
            Duration duration = Duration.between(attendance.getCheckIn(), now);
            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();
            attendance.setRemarks(attendance.getRemarks() + " | Worked: " + hours + "h " + minutes + "m");
        }

        log.info("Check-out recorded for {}", employee.getEmployeeId());
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getMyAttendance(String email, LocalDate date, LocalDate from, LocalDate to) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (date != null) {
            return attendanceRepository.findByEmployeeIdAndDate(employee.getId(), date)
                    .map(List::of)
                    .orElse(List.of());
        }
        if (from != null && to != null) {
            return attendanceRepository.findByEmployeeIdAndDateBetween(employee.getId(), from, to);
        }
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employee.getId());
    }

    public List<Attendance> getAttendanceByEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
    }

    public Optional<Attendance> getTodayAttendance(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return attendanceRepository.findByEmployeeIdAndDate(employee.getId(), LocalDate.now());
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceExceptions() {
        return attendanceRepository.findByStatus(AttendanceStatus.LOCATION_EXCEPTION);
    }

    /**
     * Haversine formula to calculate distance between two coordinates in meters
     */
    private double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth's radius in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
