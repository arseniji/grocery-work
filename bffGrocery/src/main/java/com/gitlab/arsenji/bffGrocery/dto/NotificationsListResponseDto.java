package com.gitlab.arsenji.bffGrocery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record NotificationsListResponseDto(
        @JsonProperty("has_active_campaign") boolean hasActiveCampaign,
        List<NotificationResponseDto> notifications
) {}
