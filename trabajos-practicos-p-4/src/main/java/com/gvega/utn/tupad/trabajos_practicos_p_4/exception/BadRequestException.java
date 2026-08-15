package com.gvega.utn.tupad.trabajos_practicos_p_4.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}