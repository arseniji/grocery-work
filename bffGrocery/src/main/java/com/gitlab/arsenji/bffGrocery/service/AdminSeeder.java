package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.enums.Role;
import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.repository.EmployeesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements ApplicationRunner {

    private final EmployeesRepository employeesRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.login}")
    private String adminLogin;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (employeesRepository.findByLoginAndDeletedAtIsNull(adminLogin).isEmpty()) {
            Employees admin = new Employees();
            admin.setLogin(adminLogin);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setFirstname("Admin");
            admin.setLastname("Admin");
            admin.setRole(Role.ADMIN);
            employeesRepository.save(admin);
            log.info("Admin user '{}' created", adminLogin);
        }
    }
}
