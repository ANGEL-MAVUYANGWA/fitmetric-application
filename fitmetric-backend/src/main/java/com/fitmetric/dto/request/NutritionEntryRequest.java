package com.fitmetric.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Data Transfer Object for creating a new nutrition entry.
 *
 * Calories are required; macros (protein, carbs, fat) are optional
 * but recommended for complete tracking.
 */
@Data
public class NutritionEntryRequest {

    @NotBlank(message = "Food name is required")
    private String name;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Calories are required")
    @Min(value = 0, message = "Calories cannot be negative")
    private Integer calories;

    @Min(value = 0, message = "Protein cannot be negative")
    private Double protein;

    @Min(value = 0, message = "Carbs cannot be negative")
    private Double carbs;

    @Min(value = 0, message = "Fat cannot be negative")
    private Double fat;
}