package com.gitlab.arsenji.bffGrocery.service;

import com.gitlab.arsenji.bffGrocery.model.entity.Employees;
import com.gitlab.arsenji.bffGrocery.model.repository.EmployeesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserDetailsService implements UserDetailsService {

    private final EmployeesRepository employeesRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Employees employee = employeesRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Сотрудник не найден: " + login));

        return new User(
                employee.getLogin(),
                employee.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name()))
        );
    }
}
