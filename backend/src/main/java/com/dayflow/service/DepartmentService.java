package com.dayflow.service;

import com.dayflow.dto.DepartmentRequest;
import com.dayflow.dto.DepartmentResponse;
import com.dayflow.entity.Department;
import com.dayflow.exception.DuplicateResourceException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(DepartmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return DepartmentResponse.fromEntity(dept);
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Department with name '" + request.getName() + "' already exists");
        }
        Department dept = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        return DepartmentResponse.fromEntity(departmentRepository.save(dept));
    }

    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!dept.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Department with name '" + request.getName() + "' already exists");
        }

        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        if (request.getStatus() != null) dept.setStatus(request.getStatus());

        return DepartmentResponse.fromEntity(departmentRepository.save(dept));
    }

    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }
}
