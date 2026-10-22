package com.gvega.utn.tupad.trabajos_practicos_p_4.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}