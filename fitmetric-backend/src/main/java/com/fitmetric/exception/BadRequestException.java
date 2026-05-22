package com.fitmetric.exception;

/**
 * Exception thrown when a request contains invalid or malformed data.
 *
 * This triggers a 400 Bad Request response when caught by the
 * global exception handler.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}