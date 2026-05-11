package com.gitlab.arsenji.bffGrocery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SessionItemResponseDto(
        Long id,
        String barcode,
        @JsonProperty("product_name") String productName,
        Integer quantity,
        @JsonProperty("created_at") String createdAt
) {}
