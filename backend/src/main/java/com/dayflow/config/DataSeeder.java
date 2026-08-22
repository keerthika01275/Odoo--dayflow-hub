package com.dayflow.config;

import com.dayflow.entity.Department;
import com.dayflow.entity.Employee;
import com.dayflow.entity.User;
import com.dayflow.entity.enums.AccountStatus;
import com.dayflow.entity.enums.EmployeeStatus;
import com.dayflow.entity.enums.Role;
import com.dayflow.repository.DepartmentRepository;
import com.dayflow.repository.EmployeeRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) seedDepartments();
        if (employeeRepository.count() == 0) seedEmployees();
        if (userRepository.count() == 0) seedUsers();
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
        departmentRepository.saveAll(departments);
        log.info("✓ Seeded {} departments", departments.size());
    }

    private void seedEmployees() {
        Department it = departmentRepository.findByName("Information Technology").orElse(null);
        Department hr = departmentRepository.findByName("Human Resources").orElse(null);
        Department finance = departmentRepository.findByName("Finance").orElse(null);
        Department marketing = departmentRepository.findByName("Marketing").orElse(null);
        Department sales = departmentRepository.findByName("Sales").orElse(null);
        Department ops = departmentRepository.findByName("Operations").orElse(null);

        if (it == null || hr == null) { log.warn("Departments missing, skipping employee seeding"); return; }

        employeeRepository.saveAll(List.of(
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
        ));
        log.info("✓ Seeded 7 employees");
    }

    private void seedUsers() {
        String adminPass = passwordEncoder.encode("Admin@123");
        String hrPass    = passwordEncoder.encode("Priya@123");
        String empPass   = passwordEncoder.encode("Rahul@123");

        userRepository.saveAll(List.of(
            // ADMIN account
            User.builder().employeeId("EMP000").email("admin@dayflow.com")
                .passwordHash(adminPass).role(Role.ADMIN)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build(),

            // HR account
            User.builder().employeeId("EMP001").email("priya@dayflow.com")
                .passwordHash(hrPass).role(Role.HR)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build(),

            // EMPLOYEE accounts
            User.builder().employeeId("EMP002").email("rahul@dayflow.com")
                .passwordHash(empPass).role(Role.EMPLOYEE)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build(),

            User.builder().employeeId("EMP003").email("anitha@dayflow.com")
                .passwordHash(passwordEncoder.encode("Anitha@123")).role(Role.EMPLOYEE)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build(),

            User.builder().employeeId("EMP004").email("deepak@dayflow.com")
                .passwordHash(passwordEncoder.encode("Deepak@123")).role(Role.EMPLOYEE)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build(),

            User.builder().employeeId("EMP005").email("kavitha@dayflow.com")
                .passwordHash(passwordEncoder.encode("Kavitha@123")).role(Role.EMPLOYEE)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build(),

            User.builder().employeeId("EMP006").email("suresh@dayflow.com")
                .passwordHash(passwordEncoder.encode("Suresh@123")).role(Role.EMPLOYEE)
                .emailVerified(true).accountStatus(AccountStatus.ACTIVE).build()
        ));

        log.info("✓ Seeded 7 user accounts");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        log.info("  DAYFLOW Demo Credentials:");
        log.info("  ADMIN    → admin@dayflow.com   / Admin@123");
        log.info("  HR       → priya@dayflow.com   / Priya@123");
        log.info("  EMPLOYEE → rahul@dayflow.com   / Rahul@123");
        log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
}
