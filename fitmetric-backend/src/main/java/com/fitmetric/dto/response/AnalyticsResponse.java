package com.fitmetric.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

/**
 * Analytics data response for charts and trend analysis.
 * Contains historical data points for weight, nutrition,
 * and other metrics over time.
 */
@Data
@Builder
public class AnalyticsResponse {
    private List<WeightDataPoint> weightHistory;
    private List<NutritionDataPoint> nutritionHistory;
    private Map<String, Double> summaryStats;

    @Data
    @Builder
    public static class WeightDataPoint {
        private String date;
        private Double weight;
        private String timeOfDay;
    }

    @Data
    @Builder
    public static class NutritionDataPoint {
        private String date;
        private Integer calories;
        private Double protein;
        private Double carbs;
        private Double fat;
    }
}