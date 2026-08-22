package com.dayflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    @Column(name = "basic_salary", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal basicSalary = BigDecimal.ZERO;

    @Column(name = "housing_allowance", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal housingAllowance = BigDecimal.ZERO;

    @Column(name = "transport_allowance", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal transportAllowance = BigDecimal.ZERO;

    @Column(name = "other_allowance", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal otherAllowance = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(name = "net_salary", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal netSalary = BigDecimal.ZERO;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void calculateNetSalary() {
        BigDecimal totalEarnings = (basicSalary != null ? basicSalary : BigDecimal.ZERO)
                .add(housingAllowance != null ? housingAllowance : BigDecimal.ZERO)
                .add(transportAllowance != null ? transportAllowance : BigDecimal.ZERO)
                .add(otherAllowance != null ? otherAllowance : BigDecimal.ZERO);

        BigDecimal totalDeductions = (deductions != null ? deductions : BigDecimal.ZERO);
        this.netSalary = totalEarnings.subtract(totalDeductions);
    }
}
