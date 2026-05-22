package com.fitmetric.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * Data Transfer Object for body measurements.
 *
 * All measurements are optional, allowing users to track
 * only the metrics they care about.
 * Measurements are expected in centimeters.
 */
@Data
public class MeasurementRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    private Double waistCm;
    private Double chestCm;
    private Double hipsCm;
    private Double thighsCm;
    private Double armsCm;
    private Double neckCm;
}