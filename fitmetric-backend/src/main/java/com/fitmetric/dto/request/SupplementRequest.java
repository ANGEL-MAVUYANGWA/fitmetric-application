package com.fitmetric.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Data Transfer Object for creating or updating a supplement.
 *
 * Supplements can be vitamins, medications, or general supplements.
 * Frequency indicates how often it should be taken (daily, weekly, as-needed).
 */
@Data
public class SupplementRequest {

    @NotBlank(message = "Supplement name is required")
    private String name;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    private String type;
    private String purpose;
    private String frequency;
}