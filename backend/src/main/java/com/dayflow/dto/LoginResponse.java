package com.dayflow.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String employeeId;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}
