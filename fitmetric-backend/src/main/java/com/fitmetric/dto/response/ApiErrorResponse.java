package com.fitmetric.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response format for API errors.
 *
 * Provides consistent error structure across all endpoints,
 * making it easier for frontend applications to handle errors.
 */
@Data
@Builder
public class ApiErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
}