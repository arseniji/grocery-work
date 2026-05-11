package com.gitlab.arsenji.bffGrocery.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductDto(
        @JsonProperty("rails_id") Long railsId,
        String barcode,
        @JsonProperty("product_name") String productName,
        Integer quantity,
        @JsonProperty("measurement_unit") String measurementUnit
){}
