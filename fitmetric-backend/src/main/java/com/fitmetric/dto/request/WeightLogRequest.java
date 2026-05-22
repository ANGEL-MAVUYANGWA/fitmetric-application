package com.fitmetric.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Data Transfer Object for creating a new weight log entry.
 *
 * Validates that weight is a positive number and date is provided.
 * Time of day is optional - can be MORNING or EVENING.
 */
@Data
public class WeightLogRequest {

    @NotNull(message = "Weight value is required")
    @DecimalMin(value = "20.0", message = "Weight must be at least 20 kg")
    private Double weight;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String timeOfDay;
    private String note;
}