package com.dayflow.repository;

import com.dayflow.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    Optional<Payroll> findByEmployeeId(Long employeeId);
    Optional<Payroll> findByEmployeeEmployeeId(String employeeId);
    void deleteByEmployeeId(Long employeeId);
}

