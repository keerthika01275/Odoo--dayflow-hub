package com.dayflow.controller;

import com.dayflow.dto.AttendanceRequest;
import com.dayflow.entity.Attendance;
import com.dayflow.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(Authentication authentication, @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.checkIn(authentication.getName(), request));
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(Authentication authentication, @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.checkOut(authentication.getName(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Attendance>> getMyAttendance(Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getMyAttendance(authentication.getName()));
    }

    @GetMapping("/me/today")
    public ResponseEntity<Attendance> getTodayAttendance(Authentication authentication) {
        return attendanceService.getTodayAttendance(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/exceptions")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<Attendance>> getExceptions() {
        return ResponseEntity.ok(attendanceService.getAttendanceExceptions());
    }
}
