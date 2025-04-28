package com.pfe.department_service.exception;

public class DepartmentNotFoundException extends RuntimeException {
    public DepartmentNotFoundException(Long message) {
        super(String.valueOf(message));
    }
}
