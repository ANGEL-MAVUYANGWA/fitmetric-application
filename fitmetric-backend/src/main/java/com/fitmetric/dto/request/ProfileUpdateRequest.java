package com.fitmetric.dto.request;

import lombok.Data;

/**
 * Data Transfer Object for updating user profile settings.
 *
 * All fields are optional - only provided fields will be updated.
 * This allows partial updates of the user profile.
 */
@Data
public class ProfileUpdateRequest {
    private String name;
    private Integer age;
    private Double startingWeight;
    private Double targetWeight;
    private String goalType;
    private Double weeklyWeightLossGoal;
    private Integer dailyCalorieGoal;
    private Integer dailyWaterGoal;
    private Integer heightCm;
    private String gender;
}