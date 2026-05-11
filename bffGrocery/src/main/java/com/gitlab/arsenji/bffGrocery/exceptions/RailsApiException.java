package com.gitlab.arsenji.bffGrocery.exceptions;

public class RailsApiException extends RuntimeException {
    public RailsApiException(String message) {
        super(message);
    }
}
