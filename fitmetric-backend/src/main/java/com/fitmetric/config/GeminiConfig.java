package com.fitmetric.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration class for Google Gemini AI integration.
 *
 * This class sets up the WebClient for making API calls to Google's Gemini API.
 * WebClient is a non-blocking, reactive HTTP client that supports asynchronous
 * request handling.
 *
 * To fully implement Gemini AI functionality, you need to:
 * 1. Obtain an API key from Google AI Studio (https://makersuite.google.com/app/apikey)
 * 2. Add the API key to your application.yml or as an environment variable
 *
 * @author FitMetric Team
 * @version 1.0.0
 */
@Configuration
public class GeminiConfig {

    /**
     * Gemini API key obtained from Google AI Studio.
     * Set via environment variable GEMINI_API_KEY or in application.yml
     */
    @Value("${gemini.api.key:}")
    private String apiKey;

    /**
     * Base URL for the Gemini API.
     * Default is the production endpoint.
     */
    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1}")
    private String baseUrl;

    /**
     * Gemini model to use for API calls.
     */
    @Value("${gemini.api.model:gemini-2.0-flash-exp}")
    private String model;

    /**
     * Maximum number of retries for API calls.
     */
    @Value("${gemini.api.max-retries:3}")
    private int maxRetries;

    /**
     * Timeout in seconds for API calls.
     */
    @Value("${gemini.api.timeout-seconds:30}")
    private int timeoutSeconds;

    /**
     * Temperature for response generation (0.0 to 1.0).
     * Higher values produce more creative responses.
     */
    @Value("${gemini.api.temperature:0.7}")
    private double temperature;

    /**
     * Maximum tokens in the response.
     */
    @Value("${gemini.api.max-tokens:2048}")
    private int maxTokens;

    /**
     * Creates a WebClient bean configured for Gemini API calls.
     * WebClient is a non-blocking, reactive client for making HTTP requests.
     *
     * The WebClient is configured with:
     * - Base URL pointing to the Gemini API endpoint
     * - Default Content-Type header set to application/json
     *
     * @return Configured WebClient instance ready for API calls
     */
    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Checks if Gemini API is configured and available.
     * This method verifies that an API key has been provided.
     *
     * @return true if API key is present and non-empty, false otherwise
     */
    public boolean isGeminiConfigured() {
        return apiKey != null && !apiKey.isEmpty() && !"YOUR_API_KEY_HERE".equals(apiKey);
    }

    /**
     * Gets the configured API key.
     *
     * @return The Gemini API key
     */
    public String getApiKey() {
        return apiKey;
    }

    /**
     * Gets the base URL for the Gemini API.
     *
     * @return The base URL string
     */
    public String getBaseUrl() {
        return baseUrl;
    }

    /**
     * Gets the Gemini model name.
     *
     * @return The model name
     */
    public String getModel() {
        return model;
    }

    /**
     * Gets the maximum number of retries.
     *
     * @return Maximum retry count
     */
    public int getMaxRetries() {
        return maxRetries;
    }

    /**
     * Gets the timeout duration in seconds.
     *
     * @return Timeout in seconds
     */
    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    /**
     * Gets the temperature for response generation.
     *
     * @return Temperature value between 0.0 and 1.0
     */
    public double getTemperature() {
        return temperature;
    }

    /**
     * Gets the maximum tokens for responses.
     *
     * @return Maximum token count
     */
    public int getMaxTokens() {
        return maxTokens;
    }
}