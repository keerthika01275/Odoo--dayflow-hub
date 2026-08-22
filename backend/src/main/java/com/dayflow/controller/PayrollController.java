package com.dayflow.controller;

import com.dayflow.dto.PayrollRequest;
import com.dayflow.entity.Payroll;
import com.dayflow.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/me")
    public ResponseEntity<Payroll> getMyPayroll(Authentication authentication) {
        return ResponseEntity.ok(payrollService.getMyPayroll(authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<Payroll>> getAllPayroll() {
        return ResponseEntity.ok(payrollService.getAllPayroll());
    }

    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<Payroll> getPayrollByEmployeeId(@PathVariable String employeeId) {
        return ResponseEntity.ok(payrollService.getPayrollByEmployeeId(employeeId));
    }

    @PutMapping("/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payroll> updatePayroll(
            @PathVariable String employeeId,
            @RequestBody PayrollRequest request) {
        return ResponseEntity.ok(payrollService.updatePayroll(employeeId, request));
    }
}
