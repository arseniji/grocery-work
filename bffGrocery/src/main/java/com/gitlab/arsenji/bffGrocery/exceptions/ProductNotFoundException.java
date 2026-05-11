package com.gitlab.arsenji.bffGrocery.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String barcode) {
        super("Продукт не найден по баркоду: " + barcode);
    }
}
