package com.gitlab.arsenji.bffGrocery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmployeeDto(
        Long id,
        String firstname,
        String lastname,
        @JsonProperty("created_at") String createdAt
) {}
