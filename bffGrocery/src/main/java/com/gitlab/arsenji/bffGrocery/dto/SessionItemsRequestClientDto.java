package com.gitlab.arsenji.bffGrocery.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SessionItemsRequestClientDto(
        @NotBlank String barcode,
        @NotNull @Min(1) Integer quantity
) {}
