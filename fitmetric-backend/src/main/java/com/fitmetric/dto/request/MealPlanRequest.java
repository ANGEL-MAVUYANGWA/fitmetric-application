package com.fitmetric.dto.request;

import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object for saving a weekly meal plan.
 *
 * Contains a list of meals for the entire week.
 * Each meal specifies which day and meal type it belongs to.
 */
@Data
public class MealPlanRequest {

    private List<MealItemRequest> meals;

    @Data
    public static class MealItemRequest {
        private Integer dayOfWeek;
        private String mealType;
        private String name;
        private Integer calories;
        private Double protein;
        private Double carbs;
        private Double fat;
        private List<String> ingredients;
    }
}