package com.gitlab.arsenji.bffGrocery.dto;

import com.gitlab.arsenji.bffGrocery.enums.Mode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateSessionRequestClient(
        @NotNull Mode mode,
        @NotNull @NotEmpty @Valid List<SessionItemsRequestClientDto> items
) {}
