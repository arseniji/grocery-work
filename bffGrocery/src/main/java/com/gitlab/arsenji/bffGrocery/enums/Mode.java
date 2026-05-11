package com.gitlab.arsenji.bffGrocery.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Mode {
    RECEIVE,
    INVENTORY,
    WRITE_OFF;
    @JsonCreator
    public static Mode fromString(String value) {
        return valueOf(value.toUpperCase());
    }
}
