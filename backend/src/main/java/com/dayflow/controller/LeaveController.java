package com.dayflow.controller;

import com.dayflow.dto.LeaveRequestDto;
import com.dayflow.dto.LeaveReviewDto;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveRequest> applyLeave(Authentication authentication, @Valid @RequestBody LeaveRequestDto request) {
        return new ResponseEntity<>(leaveService.applyLeave(authentication.getName(), request), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(Authentication authentication) {
        return ResponseEntity.ok(leaveService.getMyLeaves(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<LeaveRequest> approveLeave(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) LeaveReviewDto reviewDto) {
        return ResponseEntity.ok(leaveService.approveLeave(id, authentication.getName(), reviewDto));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<LeaveRequest> rejectLeave(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) LeaveReviewDto reviewDto) {
        return ResponseEntity.ok(leaveService.rejectLeave(id, authentication.getName(), reviewDto));
    }
}
