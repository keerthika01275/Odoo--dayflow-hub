package com.dayflow.service;

import com.dayflow.dto.PayrollRequest;
import com.dayflow.entity.Employee;
import com.dayflow.entity.Payroll;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public Payroll getMyPayroll(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return payrollRepository.findByEmployeeId(employee.getId())
                .orElseGet(() -> createDefaultPayroll(employee));
    }

    public List<Payroll> getAllPayroll() {
        return payrollRepository.findAll();
    }

    public Payroll getPayrollByEmployeeId(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        return payrollRepository.findByEmployeeId(employee.getId())
                .orElseGet(() -> createDefaultPayroll(employee));
    }

    @Transactional
    public Payroll updatePayroll(String employeeId, PayrollRequest request) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        Optional<Payroll> payrollOpt = payrollRepository.findByEmployeeId(employee.getId());

        Payroll payroll = payrollOpt.orElseGet(() -> Payroll.builder()
                .employee(employee)
                .effectiveFrom(LocalDate.now())
                .build());

        if (request.getBasicSalary() != null) payroll.setBasicSalary(request.getBasicSalary());
        if (request.getHousingAllowance() != null) payroll.setHousingAllowance(request.getHousingAllowance());
        if (request.getTransportAllowance() != null) payroll.setTransportAllowance(request.getTransportAllowance());
        if (request.getOtherAllowance() != null) payroll.setOtherAllowance(request.getOtherAllowance());
        if (request.getDeductions() != null) payroll.setDeductions(request.getDeductions());
        if (request.getEffectiveFrom() != null) payroll.setEffectiveFrom(request.getEffectiveFrom());

        // Calculate formula: Net = Basic + Housing + Transport + Other - Deductions
        payroll.calculateNetSalary();

        log.info("Payroll updated for employee {}: Net Salary = {}", employeeId, payroll.getNetSalary());
        return payrollRepository.save(payroll);
    }

    private Payroll createDefaultPayroll(Employee employee) {
        BigDecimal basic = employee.getSalary() != null ? employee.getSalary() : new BigDecimal("50000");
        BigDecimal housing = basic.multiply(new BigDecimal("0.20")); // 20%
        BigDecimal transport = basic.multiply(new BigDecimal("0.10")); // 10%
        BigDecimal other = new BigDecimal("2000");
        BigDecimal deductions = basic.multiply(new BigDecimal("0.05")); // 5%

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .basicSalary(basic)
                .housingAllowance(housing)
                .transportAllowance(transport)
                .otherAllowance(other)
                .deductions(deductions)
                .effectiveFrom(LocalDate.now())
                .build();

        payroll.calculateNetSalary();
        return payrollRepository.save(payroll);
    }
}
