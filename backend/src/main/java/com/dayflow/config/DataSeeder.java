package com.dayflow.config;

import com.dayflow.entity.Attendance;
import com.dayflow.entity.Department;
import com.dayflow.entity.Employee;
import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.Payroll;
import com.dayflow.entity.User;
import com.dayflow.entity.enums.AccountStatus;
import com.dayflow.entity.enums.AttendanceStatus;
import com.dayflow.entity.enums.EmployeeStatus;
import com.dayflow.entity.enums.LeaveStatus;
import com.dayflow.entity.enums.LeaveType;
import com.dayflow.entity.enums.Role;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.LeaveRepository;
import com.dayflow.repository.PayrollRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDepartments();
        seedEmployees();
        seedUsers();
        if (attendanceRepository.count() == 0) seedAttendance();
        if (leaveRepository.count() == 0) seedLeaveRequests();
        if (payrollRepository.count() == 0) seedPayroll();
    }

    private void seedDepartments() {
        List<Department> departments = List.of(
            Department.builder().name("Information Technology").description("Manages IT infrastructure and software development").status("ACTIVE").build(),
            Department.builder().name("Human Resources").description("Manages employee relations and recruitment").status("ACTIVE").build(),
            Department.builder().name("Finance").description("Manages financial operations and accounting").status("ACTIVE").build(),
            Department.builder().name("Marketing").description("Manages brand promotion and marketing campaigns").status("ACTIVE").build(),
            Department.builder().name("Sales").description("Manages customer relations and sales operations").status("ACTIVE").build(),
            Department.builder().name("Operations").description("Manages daily business operations and logistics").status("ACTIVE").build()
        );
        for (Department d : departments) {
            if (!departmentRepository.existsByName(d.getName())) {
                departmentRepository.save(d);
            }
        }
        log.info("✓ Verified department seeding");
    }

    private void seedEmployees() {
        Department it = departmentRepository.findByName("Information Technology").orElse(null);
        Department hr = departmentRepository.findByName("Human Resources").orElse(null);
        Department finance = departmentRepository.findByName("Finance").orElse(null);
        Department marketing = departmentRepository.findByName("Marketing").orElse(null);
        Department sales = departmentRepository.findByName("Sales").orElse(null);
        Department ops = departmentRepository.findByName("Operations").orElse(null);

        if (it == null || hr == null) { log.warn("Departments missing, skipping employee seeding"); return; }

        List<Employee> defaultEmployees = List.of(
            Employee.builder().employeeId("EMP000").firstName("System").lastName("Admin")
                .email("admin@dayflow.com").phone("+91 99999 00000").address("Dayflow HQ, Coimbatore, Tamil Nadu")
                .department(it).designation("System Administrator").joiningDate(LocalDate.of(2020, 1, 1))
                .salary(new BigDecimal("150000")).status(EmployeeStatus.ACTIVE).build(),

            Employee.builder().employeeId("EMP001").firstName("Priya").lastName("Sharma")
                .email("priya@dayflow.com").phone("+91 98765 43210").address("42, Anna Nagar, Chennai, Tamil Nadu")
                .department(hr).designation("HR Manager").joiningDate(LocalDate.of(2021, 3, 15))
                .salary(new BigDecimal("85000")).status(EmployeeStatus.ACTIVE).build(),

            Employee.builder().employeeId("EMP002").firstName("Rahul").lastName("Kumar")
                .email("rahul@dayflow.com").phone("+91 98765 11111").address("15, RS Puram, Coimbatore, Tamil Nadu")
                .department(it).designation("Software Engineer").joiningDate(LocalDate.of(2022, 6, 1))
                .salary(new BigDecimal("65000")).status(EmployeeStatus.ACTIVE).build(),

            Employee.builder().employeeId("EMP003").firstName("Anitha").lastName("Krishnan")
                .email("anitha@dayflow.com").phone("+91 87654 22222").address("23, Saibaba Colony, Coimbatore, Tamil Nadu")
                .department(finance).designation("Senior Accountant").joiningDate(LocalDate.of(2021, 9, 10))
                .salary(new BigDecimal("72000")).status(EmployeeStatus.ACTIVE).build(),

            Employee.builder().employeeId("EMP004").firstName("Deepak").lastName("Raj")
                .email("deepak@dayflow.com").phone("+91 76543 33333").address("8, Race Course, Coimbatore, Tamil Nadu")
                .department(marketing).designation("Marketing Executive").joiningDate(LocalDate.of(2023, 1, 15))
                .salary(new BigDecimal("55000")).status(EmployeeStatus.ACTIVE).build(),

            Employee.builder().employeeId("EMP005").firstName("Kavitha").lastName("Selvam")
                .email("kavitha@dayflow.com").phone("+91 65432 44444").address("10, Gandhipuram, Coimbatore, Tamil Nadu")
                .department(sales).designation("Sales Manager").joiningDate(LocalDate.of(2020, 11, 20))
                .salary(new BigDecimal("90000")).status(EmployeeStatus.ACTIVE).build(),

            Employee.builder().employeeId("EMP006").firstName("Suresh").lastName("Babu")
                .email("suresh@dayflow.com").phone("+91 54321 55555").address("33, Singanallur, Coimbatore, Tamil Nadu")
                .department(ops).designation("Operations Analyst").joiningDate(LocalDate.of(2022, 4, 5))
                .salary(new BigDecimal("60000")).status(EmployeeStatus.ACTIVE).build()
        );

        for (Employee e : defaultEmployees) {
            if (!employeeRepository.existsByEmployeeId(e.getEmployeeId())) {
                employeeRepository.save(e);
            }
        }
        log.info("✓ Verified employee seeding");
    }

    private void seedUsers() {
        String adminPass = passwordEncoder.encode("Admin@123");
        String hrPass    = passwordEncoder.encode("Priya@123");
        String empPass   = passwordEncoder.encode("Rahul@123");

        upsertUser("EMP000", "admin@dayflow.com", adminPass, Role.ADMIN);
        upsertUser("EMP001", "priya@dayflow.com", hrPass, Role.HR);
        upsertUser("EMP002", "rahul@dayflow.com", empPass, Role.EMPLOYEE);
        upsertUser("EMP003", "anitha@dayflow.com", passwordEncoder.encode("Anitha@123"), Role.EMPLOYEE);
        upsertUser("EMP004", "deepak@dayflow.com", passwordEncoder.encode("Deepak@123"), Role.EMPLOYEE);
        upsertUser("EMP005", "kavitha@dayflow.com", passwordEncoder.encode("Kavitha@123"), Role.EMPLOYEE);
        upsertUser("EMP006", "suresh@dayflow.com", passwordEncoder.encode("Suresh@123"), Role.EMPLOYEE);

        log.info("✓ Verified 7 user accounts seeding");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("  DAYFLOW Demo Credentials:");
        log.info("  ADMIN    → admin@dayflow.com   / Admin@123");
        log.info("  HR       → priya@dayflow.com   / Priya@123");
        log.info("  EMPLOYEE → rahul@dayflow.com   / Rahul@123");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    private void upsertUser(String empId, String email, String passwordHash, Role role) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> userRepository.findByEmployeeId(empId)
                .orElse(User.builder().employeeId(empId).email(email).build()));

        user.setEmployeeId(empId);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setRole(role);
        user.setEmailVerified(true);
        user.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(user);
    }

    private void seedAttendance() {
        Employee rahul = employeeRepository.findByEmployeeId("EMP002").orElse(null);
        Employee priya = employeeRepository.findByEmployeeId("EMP001").orElse(null);
        Employee anitha = employeeRepository.findByEmployeeId("EMP003").orElse(null);
        Employee suresh = employeeRepository.findByEmployeeId("EMP006").orElse(null);

        if (rahul == null || priya == null) return;

        LocalDate today = LocalDate.now();

        attendanceRepository.saveAll(List.of(
            Attendance.builder()
                .employee(priya)
                .date(today)
                .checkIn(today.atTime(9, 2))
                .checkInLatitude(11.0168)
                .checkInLongitude(76.9558)
                .status(AttendanceStatus.PRESENT)
                .remarks("Checked in at office (12.4m)")
                .build(),

            Attendance.builder()
                .employee(anitha)
                .date(today)
                .checkIn(today.atTime(9, 15))
                .checkInLatitude(11.0169)
                .checkInLongitude(76.9559)
                .status(AttendanceStatus.PRESENT)
                .remarks("Checked in at office (24.1m)")
                .build(),

            Attendance.builder()
                .employee(suresh)
                .date(today)
                .checkIn(today.atTime(9, 45))
                .checkInLatitude(11.0450)
                .checkInLongitude(76.9820)
                .status(AttendanceStatus.LOCATION_EXCEPTION)
                .remarks("Location Exception: Checked in 3.4km from office")
                .build()
        ));
        log.info("✓ Seeded sample attendance records");
    }

    private void seedLeaveRequests() {
        Employee rahul = employeeRepository.findByEmployeeId("EMP002").orElse(null);
        Employee deepak = employeeRepository.findByEmployeeId("EMP004").orElse(null);
        Employee kavitha = employeeRepository.findByEmployeeId("EMP005").orElse(null);

        if (deepak == null || kavitha == null) return;

        LocalDate today = LocalDate.now();

        leaveRepository.saveAll(List.of(
            LeaveRequest.builder()
                .employee(deepak)
                .leaveType(LeaveType.SICK)
                .startDate(today.plusDays(1))
                .endDate(today.plusDays(2))
                .reason("Medical appointment and viral recovery")
                .status(LeaveStatus.PENDING)
                .build(),

            LeaveRequest.builder()
                .employee(kavitha)
                .leaveType(LeaveType.PAID)
                .startDate(today.plusDays(5))
                .endDate(today.plusDays(7))
                .reason("Attending family wedding")
                .status(LeaveStatus.APPROVED)
                .reviewedBy("priya@dayflow.com")
                .reviewComment("Approved. Have a great time!")
                .build(),

            LeaveRequest.builder()
                .employee(rahul)
                .leaveType(LeaveType.PAID)
                .startDate(today.minusDays(10))
                .endDate(today.minusDays(8))
                .reason("Vacation trip")
                .status(LeaveStatus.APPROVED)
                .reviewedBy("priya@dayflow.com")
                .reviewComment("Approved")
                .build()
        ));
        log.info("✓ Seeded sample leave requests");
    }

    private void seedPayroll() {
        List<Employee> employees = employeeRepository.findAll();
        for (Employee emp : employees) {
            BigDecimal basic = emp.getSalary() != null ? emp.getSalary() : new BigDecimal("50000");
            BigDecimal housing = basic.multiply(new BigDecimal("0.20"));
            BigDecimal transport = basic.multiply(new BigDecimal("0.10"));
            BigDecimal other = new BigDecimal("2000");
            BigDecimal deductions = basic.multiply(new BigDecimal("0.05"));

            Payroll payroll = Payroll.builder()
                .employee(emp)
                .basicSalary(basic)
                .housingAllowance(housing)
                .transportAllowance(transport)
                .otherAllowance(other)
                .deductions(deductions)
                .effectiveFrom(LocalDate.of(2024, 1, 1))
                .build();

            payroll.calculateNetSalary();
            payrollRepository.save(payroll);
        }
        log.info("✓ Seeded payroll records for {} employees", employees.size());
    }
}
