package com.dayflow.repository;

import com.dayflow.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeId(String employeeId);
    Optional<Employee> findByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    List<Employee> findByDepartmentId(Long departmentId);
}
