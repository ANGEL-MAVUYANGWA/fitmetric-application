package com.fitmetric.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Data Transfer Object for water intake logging.
 *
 * Validates that amount is positive and date is provided.
 * Amount is in milliliters.
 */
@Data
public class WaterLogRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1 ml")
    private Integer amountMl;
}