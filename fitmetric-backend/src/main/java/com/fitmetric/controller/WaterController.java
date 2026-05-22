package com.fitmetric.controller;

import com.fitmetric.dto.request.WaterLogRequest;
import com.fitmetric.model.WaterLog;
import com.fitmetric.service.WaterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for water intake tracking operations.
 * Handles logging water consumption and checking hydration goals.
 */
@RestController
@RequestMapping("/api/water")
@RequiredArgsConstructor
public class WaterController {

    private final WaterService waterService;

    /**
     * Adds a new water intake log.
     *
     * @param userId The user ID from header
     * @param request Water log data (amount in ml, date)
     * @return Created water log
     */
    @PostMapping("/log")
    public ResponseEntity<WaterLog> addWaterLog(@RequestHeader("X-User-Id") String userId,
                                                @Valid @RequestBody WaterLogRequest request) {
        WaterLog log = waterService.addWaterLog(UUID.fromString(userId), request);
        return ResponseEntity.ok(log);
    }

    /**
     * Retrieves all water logs for a user.
     *
     * @param userId The user ID from header
     * @return List of water logs
     */
    @GetMapping("/logs")
    public ResponseEntity<List<WaterLog>> getWaterLogs(@RequestHeader("X-User-Id") String userId) {
        List<WaterLog> logs = waterService.getUserWaterLogs(UUID.fromString(userId));
        return ResponseEntity.ok(logs);
    }

    /**
     * Gets total water intake for a specific date.
     *
     * @param userId The user ID from header
     * @param date The date to calculate for (YYYY-MM-DD)
     * @return Total water in milliliters
     */
    @GetMapping("/total")
    public ResponseEntity<Map<String, Object>> getTotalWaterForDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String date) {
        Integer total = waterService.getTotalWaterForDate(
                UUID.fromString(userId),
                LocalDate.parse(date));

        Map<String, Object> response = new HashMap<>();
        response.put("date", date);
        response.put("totalMl", total);
        return ResponseEntity.ok(response);
    }

    /**
     * Gets today's water intake.
     *
     * @param userId The user ID from header
     * @return Today's water total
     */
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodayWater(@RequestHeader("X-User-Id") String userId) {
        Integer total = waterService.getTodayWaterTotal(UUID.fromString(userId));
        Boolean metGoal = waterService.hasMetWaterGoal(UUID.fromString(userId));

        Map<String, Object> response = new HashMap<>();
        response.put("totalMl", total);
        response.put("metGoal", metGoal);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a water log entry.
     *
     * @param userId The user ID from header
     * @param logId The log ID to delete
     * @return Success response
     */
    @DeleteMapping("/log/{logId}")
    public ResponseEntity<Map<String, Object>> deleteWaterLog(@RequestHeader("X-User-Id") String userId,
                                                              @PathVariable String logId) {
        waterService.deleteWaterLog(UUID.fromString(userId), UUID.fromString(logId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}