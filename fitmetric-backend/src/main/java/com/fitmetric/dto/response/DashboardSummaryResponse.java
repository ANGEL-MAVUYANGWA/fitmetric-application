package com.fitmetric.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private Double currentWeight;
    private Double progressPercent;
    private Integer todayCalories;
    private Integer todayWater;
    private Double weeklyChange;
    private Integer streakDays;
    private List<Achievement> achievements;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Achievement {
        private String id;
        private String title;
        private String description;
        private boolean earned;
        private double progress;
    }
}