package com.gitlab.arsenji.bffGrocery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record SessionResponseDto(
        Long id,
        @JsonProperty("employee_id") Long employeeId,
        String mode,
        String status,
        @JsonProperty("created_at") String createdAt,
        @JsonProperty("completed_at") String completedAt,
        List<SessionItemResponseDto> items
) {}
