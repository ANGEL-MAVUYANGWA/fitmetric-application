package com.fitmetric.dto.request;

import lombok.Data;

/**
 * Data Transfer Object for AI chat requests.
 *
 * The sessionId allows for maintaining conversation context
 * across multiple messages.
 */
@Data
public class GeminiChatRequest {
    private String message;
    private String sessionId;
}