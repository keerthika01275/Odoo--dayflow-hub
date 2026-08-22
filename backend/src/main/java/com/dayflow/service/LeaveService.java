package com.dayflow.service;

import com.dayflow.dto.LeaveRequestDto;
import com.dayflow.dto.LeaveReviewDto;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.enums.LeaveStatus;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public LeaveRequest applyLeave(String email, LeaveRequestDto request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LeaveRequest leave = LeaveRequest.builder()
                .employee(employee)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        log.info("Leave request submitted by employee {}: {} to {}", employee.getEmployeeId(), request.getStartDate(), request.getEndDate());
        return leaveRepository.save(leave);
    }

    public List<LeaveRequest> getMyLeaves(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return leaveRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId());
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @Transactional
    public LeaveRequest approveLeave(Long id, String reviewerEmail, LeaveReviewDto reviewDto) {
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setReviewedBy(reviewerEmail);
        leave.setReviewComment(reviewDto != null ? reviewDto.getReviewComment() : "Approved");

        log.info("Leave request {} approved by {}", id, reviewerEmail);
        return leaveRepository.save(leave);
    }

    @Transactional
    public LeaveRequest rejectLeave(Long id, String reviewerEmail, LeaveReviewDto reviewDto) {
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setReviewedBy(reviewerEmail);
        leave.setReviewComment(reviewDto != null ? reviewDto.getReviewComment() : "Rejected");

        log.info("Leave request {} rejected by {}", id, reviewerEmail);
        return leaveRepository.save(leave);
    }
}
