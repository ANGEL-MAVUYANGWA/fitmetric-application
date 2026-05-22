package com.fitmetric.controller;

import com.fitmetric.dto.request.WeightLogRequest;
import com.fitmetric.model.WeightLog;
import com.fitmetric.service.WeightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for weight tracking operations.
 * Handles adding, retrieving, and deleting weight logs.
 */
@RestController
@RequestMapping("/api/weight")
@RequiredArgsConstructor
public class WeightController {

    private final WeightService weightService;

    /**
     * Adds a new weight log entry.
     *
     * @param userId The user ID from header
     * @param request Weight log data
     * @return Created weight log
     */
    @PostMapping("/log")
    public ResponseEntity<WeightLog> addWeightLog(@RequestHeader("X-User-Id") String userId,
                                                  @Valid @RequestBody WeightLogRequest request) {
        WeightLog log = weightService.addWeightLog(UUID.fromString(userId), request);
        return ResponseEntity.ok(log);
    }

    /**
     * Retrieves all weight logs for a user.
     *
     * @param userId The user ID from header
     * @return List of weight logs (newest first)
     */
    @GetMapping("/logs")
    public ResponseEntity<List<WeightLog>> getWeightLogs(@RequestHeader("X-User-Id") String userId) {
        List<WeightLog> logs = weightService.getUserWeightLogs(UUID.fromString(userId));
        return ResponseEntity.ok(logs);
    }

    /**
     * Gets the most recent weight log.
     *
     * @param userId The user ID from header
     * @return Latest weight log
     */
    @GetMapping("/latest")
    public ResponseEntity<WeightLog> getLatestWeightLog(@RequestHeader("X-User-Id") String userId) {
        WeightLog log = weightService.getLatestWeightLog(UUID.fromString(userId));
        return ResponseEntity.ok(log);
    }

    /**
     * Gets weight logs within a date range.
     *
     * @param userId The user ID from header
     * @param startDate Start date (YYYY-MM-DD)
     * @param endDate End date (YYYY-MM-DD)
     * @return List of weight logs in the range
     */
    @GetMapping("/range")
    public ResponseEntity<List<WeightLog>> getWeightLogsInRange(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<WeightLog> logs = weightService.getWeightLogsInDateRange(
                UUID.fromString(userId),
                java.time.LocalDate.parse(startDate),
                java.time.LocalDate.parse(endDate));
        return ResponseEntity.ok(logs);
    }

    /**
     * Deletes a weight log entry.
     *
     * @param userId The user ID from header
     * @param logId The log ID to delete
     * @return Success response
     */
    @DeleteMapping("/log/{logId}")
    public ResponseEntity<Map<String, Object>> deleteWeightLog(@RequestHeader("X-User-Id") String userId,
                                                               @PathVariable String logId) {
        weightService.deleteWeightLog(UUID.fromString(userId), UUID.fromString(logId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}