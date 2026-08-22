package com.dayflow.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRequest {
    private BigDecimal basicSalary;
    private BigDecimal housingAllowance;
    private BigDecimal transportAllowance;
    private BigDecimal otherAllowance;
    private BigDecimal deductions;
    private LocalDate effectiveFrom;
}
