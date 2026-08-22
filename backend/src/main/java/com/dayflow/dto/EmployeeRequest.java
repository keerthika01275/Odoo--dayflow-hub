package com.dayflow.dto;

import com.dayflow.entity.enums.EmployeeStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeRequest {

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String address;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotBlank(message = "Designation is required")
    private String designation;

    private LocalDate joiningDate;

    @Positive(message = "Salary must be positive")
    private BigDecimal salary;

    private String profilePicture;

    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;
}
