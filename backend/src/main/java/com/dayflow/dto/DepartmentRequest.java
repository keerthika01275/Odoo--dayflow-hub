package com.dayflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;

    @Builder.Default
    private String status = "ACTIVE";
}
