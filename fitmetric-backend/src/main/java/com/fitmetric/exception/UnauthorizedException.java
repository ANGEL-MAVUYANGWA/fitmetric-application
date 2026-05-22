package com.fitmetric.exception;

/**
 * Exception thrown when a user attempts to access a resource
 * without proper authentication.
 *
 * This triggers a 401 Unauthorized response when caught by the
 * global exception handler.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}