package com.fitmetric.exception;

/**
 * Exception thrown when a requested resource is not found in the database.
 *
 * This is a runtime exception that triggers a 404 Not Found response
 * when caught by the global exception handler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}