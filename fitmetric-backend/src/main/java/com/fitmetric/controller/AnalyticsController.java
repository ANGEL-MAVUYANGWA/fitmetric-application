package com.fitmetric.controller;

import com.fitmetric.dto.response.AnalyticsResponse;
import com.fitmetric.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for analytics and reporting operations.
 * Provides data for charts, trends, and progress tracking.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Gets complete analytics data for a user.
     * Includes weight history, nutrition history, and summary statistics.
     *
     * @param userId The user ID from header
     * @param days Number of days to look back (default 30)
     * @return Analytics response with all data
     */
    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "30") int days) {
        AnalyticsResponse response = analyticsService.getAnalytics(UUID.fromString(userId), days);
        return ResponseEntity.ok(response);
    }

    /**
     * Gets weight trend data for the chart.
     *
     * @param userId The user ID from header
     * @param days Number of days to include (default 30)
     * @return List of weight data points
     */
    @GetMapping("/weight-trend")
    public ResponseEntity<List<AnalyticsResponse.WeightDataPoint>> getWeightTrend(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "30") int days) {
        List<AnalyticsResponse.WeightDataPoint> trend = analyticsService.getWeightTrend(UUID.fromString(userId), days);
        return ResponseEntity.ok(trend);
    }

    /**
     * Gets calorie trend data for the chart.
     *
     * @param userId The user ID from header
     * @param days Number of days to include (default 30)
     * @return List of nutrition data points
     */
    @GetMapping("/calorie-trend")
    public ResponseEntity<List<AnalyticsResponse.NutritionDataPoint>> getCalorieTrend(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "30") int days) {
        List<AnalyticsResponse.NutritionDataPoint> trend = analyticsService.getCalorieTrend(UUID.fromString(userId), days);
        return ResponseEntity.ok(trend);
    }
}