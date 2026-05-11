package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.dto.EmployeeDto;
import com.gitlab.arsenji.bffGrocery.dto.EmployeeFormDto;
import com.gitlab.arsenji.bffGrocery.enums.Role;
import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.repository.EmployeesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeesRepository employeesRepository;
    private final PasswordEncoder passwordEncoder;

    public java.util.List<Employees> findAll() {
        return employeesRepository.findAllByDeletedAtIsNull();
    }

    public EmployeeDto getByLogin(String login) {
        Employees employee = employeesRepository.findByLoginAndDeletedAtIsNull(login)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        String createdAt = employee.getCreatedAt() != null ? employee.getCreatedAt().toString() : null;
        return new EmployeeDto(employee.getId(), employee.getFirstname(), employee.getLastname(), createdAt);
    }

    public EmployeeFormDto toFormDto(Long id) {
        Employees emp = employeesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сотрудник не найден"));
        return new EmployeeFormDto(emp.getId(), emp.getLogin(), null,
                emp.getFirstname(), emp.getLastname(), emp.getRole());
    }

    public void saveEmployee(EmployeeFormDto dto) {
        Employees employee;

        if (dto.id() != null) {
            employee = employeesRepository.findById(dto.id())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сотрудник не найден"));
        } else {
            if (dto.newPassword() == null || dto.newPassword().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пароль обязателен для нового сотрудника");
            }
            employee = new Employees();
        }

        employee.setLogin(dto.login());
        employee.setFirstname(dto.firstname());
        employee.setLastname(dto.lastname());
        employee.setRole(dto.role() != null ? dto.role() : Role.EMPLOYEE);

        if (dto.newPassword() != null && !dto.newPassword().isBlank()) {
            employee.setPasswordHash(passwordEncoder.encode(dto.newPassword()));
        }

        employeesRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employees employee = employeesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Сотрудник не найден"));
        employee.setDeletedAt(LocalDateTime.now());
        employeesRepository.save(employee);
    }
}
