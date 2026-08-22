package com.dayflow.service;

import com.dayflow.dto.EmployeeRequest;
import com.dayflow.dto.EmployeeResponse;
import com.dayflow.entity.Department;
import com.dayflow.entity.Employee;
import com.dayflow.entity.enums.Role;
import com.dayflow.exception.DuplicateResourceException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(EmployeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return EmployeeResponse.fromEntity(emp);
    }

    public EmployeeResponse getEmployeeByEmployeeId(String employeeId) {
        Employee emp = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));
        return EmployeeResponse.fromEntity(emp);
    }

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException("Employee ID '" + request.getEmployeeId() + "' already exists");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Employee emp = Employee.builder()
                .employeeId(request.getEmployeeId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .department(dept)
                .designation(request.getDesignation())
                .joiningDate(request.getJoiningDate())
                .salary(request.getSalary())
                .profilePicture(request.getProfilePicture())
                .status(request.getStatus())
                .build();

        return EmployeeResponse.fromEntity(employeeRepository.save(emp));
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Check for duplicate email only if email changed
        if (!emp.getEmail().equals(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already taken");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        emp.setFirstName(request.getFirstName());
        emp.setLastName(request.getLastName());
        emp.setEmail(request.getEmail());
        emp.setPhone(request.getPhone());
        emp.setAddress(request.getAddress());
        emp.setDepartment(dept);
        emp.setDesignation(request.getDesignation());
        emp.setJoiningDate(request.getJoiningDate());
        emp.setSalary(request.getSalary());
        emp.setProfilePicture(request.getProfilePicture());
        if (request.getStatus() != null) emp.setStatus(request.getStatus());

        return EmployeeResponse.fromEntity(employeeRepository.save(emp));
    }

    public EmployeeResponse updateMyProfile(String employeeId, EmployeeRequest request) {
        Employee emp = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        // Employees can only update phone, address, profilePicture
        emp.setPhone(request.getPhone());
        emp.setAddress(request.getAddress());
        emp.setProfilePicture(request.getProfilePicture());

        return EmployeeResponse.fromEntity(employeeRepository.save(emp));
    }

    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    public Employee getEmployeeEntityByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + employeeId));
    }

    public Employee getEmployeeEntityByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
    }
}
