package com.dayflow.controller;

import com.dayflow.dto.EmployeeRequest;
import com.dayflow.dto.EmployeeResponse;
import com.dayflow.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/me")
    public ResponseEntity<EmployeeResponse> getMyProfile(Authentication authentication) {
        String employeeId = extractEmployeeId(authentication);
        return ResponseEntity.ok(employeeService.getEmployeeByEmployeeId(employeeId));
    }

    @PutMapping("/me")
    public ResponseEntity<EmployeeResponse> updateMyProfile(
            Authentication authentication,
            @RequestBody EmployeeRequest request) {
        String employeeId = extractEmployeeId(authentication);
        return ResponseEntity.ok(employeeService.updateMyProfile(employeeId, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return new ResponseEntity<>(employeeService.createEmployee(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    private String extractEmployeeId(Authentication authentication) {
        // Authentication principal is the email; extract employeeId via service
        return employeeService.getEmployeeEntityByEmail(authentication.getName()).getEmployeeId();
    }
}
