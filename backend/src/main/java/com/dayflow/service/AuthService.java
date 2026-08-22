package com.dayflow.service;

import com.dayflow.dto.LoginRequest;
import com.dayflow.dto.LoginResponse;
import com.dayflow.dto.RegisterRequest;
import com.dayflow.entity.Employee;
import com.dayflow.entity.User;
import com.dayflow.entity.enums.AccountStatus;
import com.dayflow.entity.enums.Role;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.DuplicateResourceException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Secure registration flow:
     * 1. Find employee by employeeId
     * 2. Validate that provided email matches employee's official email
     * 3. Check no existing account
     * 4. Hash password with BCrypt
     * 5. Create user account (role comes from employee record config - defaulting rules)
     */
    public LoginResponse register(RegisterRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Find employee by employeeId
        Employee employee = employeeRepository.findByEmployeeId(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee found with ID: " + request.getEmployeeId() + ". Please contact HR or Admin."));

        // Validate email matches employee's official email
        if (!employee.getEmail().equalsIgnoreCase(request.getEmail())) {
            throw new BadRequestException(
                    "Email does not match the official email on record for employee " + request.getEmployeeId());
        }

        // Check if account already exists
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new DuplicateResourceException(
                    "A DAYFLOW account already exists for employee ID: " + request.getEmployeeId());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        // Determine role from employee context
        // Admin and HR roles are seeded directly. New registrations default to EMPLOYEE
        // unless the employee is seeded with a specific role mapping
        Role role = determineRole(employee);

        // Hash password with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Create user account
        User user = User.builder()
                .employeeId(employee.getEmployeeId())
                .email(employee.getEmail())
                .passwordHash(hashedPassword)
                .role(role)
                .emailVerified(true)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        userRepository.save(user);
        log.info("New DAYFLOW account created for employee: {} with role: {}", employee.getEmployeeId(), role);

        // Generate JWT and return login response
        String token = jwtService.generateToken(user.getEmail(), user.getEmployeeId(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .build();
    }

    /**
     * Determine role based on employee designation:
     * EMP000 (System Admin) → ADMIN
     * Employees in HR department with HR-related designations → HR
     * All others → EMPLOYEE
     */
    private Role determineRole(Employee employee) {
        if ("EMP000".equals(employee.getEmployeeId())) {
            return Role.ADMIN;
        }
        String designation = employee.getDesignation() != null ? employee.getDesignation().toLowerCase() : "";
        String deptName = employee.getDepartment() != null && employee.getDepartment().getName() != null
                ? employee.getDepartment().getName().toLowerCase() : "";

        if ((deptName.contains("human resource") || deptName.equals("hr"))
                && (designation.contains("hr") || designation.contains("human resource")
                    || designation.contains("manager") || designation.contains("specialist"))) {
            return Role.HR;
        }
        return Role.EMPLOYEE;
    }

    /**
     * Login flow:
     * 1. Find user by email
     * 2. Verify BCrypt password
     * 3. Check account status
     * 4. Generate and return JWT
     */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Your account is " + user.getAccountStatus().name().toLowerCase() +
                    ". Please contact the administrator.");
        }

        Employee employee = employeeRepository.findByEmployeeId(user.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        String token = jwtService.generateToken(user.getEmail(), user.getEmployeeId(), user.getRole().name());
        log.info("User logged in: {} [{}]", user.getEmail(), user.getRole());

        return LoginResponse.builder()
                .token(token)
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .build();
    }

    public LoginResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Employee employee = employeeRepository.findByEmployeeId(user.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        return LoginResponse.builder()
                .token(null)
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .build();
    }
}
