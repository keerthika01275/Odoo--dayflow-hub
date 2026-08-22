package com.dayflow.dto;

import com.dayflow.entity.Employee;
import com.dayflow.entity.enums.EmployeeStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private DepartmentResponse department;
    private String designation;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private String profilePicture;
    private EmployeeStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EmployeeResponse fromEntity(Employee emp) {
        if (emp == null) return null;
        return EmployeeResponse.builder()
                .id(emp.getId())
                .employeeId(emp.getEmployeeId())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .address(emp.getAddress())
                .department(DepartmentResponse.fromEntity(emp.getDepartment()))
                .designation(emp.getDesignation())
                .joiningDate(emp.getJoiningDate())
                .salary(emp.getSalary())
                .profilePicture(emp.getProfilePicture())
                .status(emp.getStatus())
                .createdAt(emp.getCreatedAt())
                .updatedAt(emp.getUpdatedAt())
                .build();
    }
}
