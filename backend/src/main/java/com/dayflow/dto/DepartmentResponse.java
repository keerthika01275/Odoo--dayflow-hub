package com.dayflow.dto;

import com.dayflow.entity.Department;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
    private Long id;
    private String name;
    private String description;
    private String status;

    public static DepartmentResponse fromEntity(Department dept) {
        if (dept == null) return null;
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .status(dept.getStatus())
                .build();
    }
}
