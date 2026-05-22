package com.fitmetric.service;

import com.fitmetric.dto.response.AnalyticsResponse;
import com.fitmetric.model.NutritionEntry;
import com.fitmetric.model.WeightLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service layer for analytics and reporting business logic.
 * Provides aggregated data for charts, trends, and progress tracking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final WeightService weightService;
    private final NutritionService nutritionService;

    /**
     * Generates complete analytics data for a user.
     * Includes weight history, nutrition history, and summary statistics.
     *
     * @param userId The user's unique identifier
     * @param days Number of days to look back (default 30)
     * @return AnalyticsResponse with all analytics data
     */
    public AnalyticsResponse getAnalytics(UUID userId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);

        // Get weight history
        List<WeightLog> weightLogs = weightService.getWeightLogsInDateRange(userId, startDate, endDate);
        List<AnalyticsResponse.WeightDataPoint> weightHistory = weightLogs.stream()
                .map(log -> AnalyticsResponse.WeightDataPoint.builder()
                        .date(log.getDate().toString())
                        .weight(log.getWeight())
                        .timeOfDay(log.getTimeOfDay())
                        .build())
                .collect(Collectors.toList());

        // Get nutrition history
        List<NutritionEntry> nutritionEntries = nutritionService.getEntriesInDateRange(userId, startDate, endDate);

        // Group nutrition by date for daily totals
        Map<LocalDate, AnalyticsResponse.NutritionDataPoint> nutritionMap = new HashMap<>();
        for (NutritionEntry entry : nutritionEntries) {
            nutritionMap.computeIfAbsent(entry.getDate(), date ->
                    AnalyticsResponse.NutritionDataPoint.builder()
                            .date(date.toString())
                            .calories(0)
                            .protein(0.0)
                            .carbs(0.0)
                            .fat(0.0)
                            .build()
            );

            AnalyticsResponse.NutritionDataPoint point = nutritionMap.get(entry.getDate());
            point.setCalories(point.getCalories() + entry.getCalories());
            point.setProtein(point.getProtein() + (entry.getProtein() != null ? entry.getProtein() : 0));
            point.setCarbs(point.getCarbs() + (entry.getCarbs() != null ? entry.getCarbs() : 0));
            point.setFat(point.getFat() + (entry.getFat() != null ? entry.getFat() : 0));
        }

        List<AnalyticsResponse.NutritionDataPoint> nutritionHistory = new ArrayList<>(nutritionMap.values());
        nutritionHistory.sort((a, b) -> a.getDate().compareTo(b.getDate()));

        // Calculate summary statistics
        Map<String, Double> summaryStats = calculateSummaryStats(userId, weightLogs, nutritionEntries);

        return AnalyticsResponse.builder()
                .weightHistory(weightHistory)
                .nutritionHistory(nutritionHistory)
                .summaryStats(summaryStats)
                .build();
    }

    /**
     * Gets weight trend data for the chart.
     *
     * @param userId The user's unique identifier
     * @param days Number of days to include
     * @return List of weight data points
     */
    public List<AnalyticsResponse.WeightDataPoint> getWeightTrend(UUID userId, int days) {
        AnalyticsResponse analytics = getAnalytics(userId, days);
        return analytics.getWeightHistory();
    }

    /**
     * Gets calorie trend data for the chart.
     *
     * @param userId The user's unique identifier
     * @param days Number of days to include
     * @return List of nutrition data points
     */
    public List<AnalyticsResponse.NutritionDataPoint> getCalorieTrend(UUID userId, int days) {
        AnalyticsResponse analytics = getAnalytics(userId, days);
        return analytics.getNutritionHistory();
    }

    /**
     * Calculates summary statistics for the user's progress.
     *
     * @param userId The user's unique identifier
     * @param weightLogs List of weight logs
     * @param nutritionEntries List of nutrition entries
     * @return Map of statistic names to values
     */
    private Map<String, Double> calculateSummaryStats(UUID userId, List<WeightLog> weightLogs, List<NutritionEntry> nutritionEntries) {
        Map<String, Double> stats = new HashMap<>();

        // Weight statistics
        if (!weightLogs.isEmpty()) {
            double minWeight = weightLogs.stream().mapToDouble(WeightLog::getWeight).min().orElse(0);
            double maxWeight = weightLogs.stream().mapToDouble(WeightLog::getWeight).max().orElse(0);
            double avgWeight = weightLogs.stream().mapToDouble(WeightLog::getWeight).average().orElse(0);
            double startWeight = weightLogs.get(weightLogs.size() - 1).getWeight();
            double currentWeight = weightLogs.get(0).getWeight();
            double totalChange = currentWeight - startWeight;

            stats.put("minWeight", minWeight);
            stats.put("maxWeight", maxWeight);
            stats.put("avgWeight", avgWeight);
            stats.put("totalWeightChange", totalChange);
            stats.put("currentWeight", currentWeight);
        }

        // Nutrition statistics
        if (!nutritionEntries.isEmpty()) {
            double avgDailyCalories = nutritionEntries.stream()
                    .collect(Collectors.groupingBy(NutritionEntry::getDate))
                    .values().stream()
                    .mapToDouble(dayEntries -> dayEntries.stream().mapToInt(NutritionEntry::getCalories).sum())
                    .average()
                    .orElse(0);

            double avgProtein = nutritionEntries.stream().mapToDouble(e -> e.getProtein() != null ? e.getProtein() : 0).average().orElse(0);
            double avgCarbs = nutritionEntries.stream().mapToDouble(e -> e.getCarbs() != null ? e.getCarbs() : 0).average().orElse(0);
            double avgFat = nutritionEntries.stream().mapToDouble(e -> e.getFat() != null ? e.getFat() : 0).average().orElse(0);

            stats.put("avgDailyCalories", avgDailyCalories);
            stats.put("avgProtein", avgProtein);
            stats.put("avgCarbs", avgCarbs);
            stats.put("avgFat", avgFat);
        }

        return stats;
    }
}