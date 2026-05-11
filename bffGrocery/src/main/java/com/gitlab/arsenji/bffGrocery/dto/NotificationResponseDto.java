package com.gitlab.arsenji.bffGrocery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NotificationResponseDto(
        Long id,
        String type,
        @JsonProperty("campaign_title") String campaignTitle,
        String description,
        @JsonProperty("created_at") String createdAt
) {}
