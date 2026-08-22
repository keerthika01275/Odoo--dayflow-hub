package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import com.dayflow.entity.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    List<Attendance> findByEmployeeIdOrderByDateDesc(Long employeeId);
    List<Attendance> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate fromDate, LocalDate toDate);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByStatus(AttendanceStatus status);
    long countByDateAndStatus(LocalDate date, AttendanceStatus status);
    long countByDate(LocalDate date);
    void deleteByEmployeeId(Long employeeId);
}

