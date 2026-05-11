package com.gitlab.arsenji.bffGrocery.dto;

import com.gitlab.arsenji.bffGrocery.enums.Role;

public record EmployeeFormDto(
        Long id,
        String login,
        String newPassword,
        String firstname,
        String lastname,
        Role role
) {}
