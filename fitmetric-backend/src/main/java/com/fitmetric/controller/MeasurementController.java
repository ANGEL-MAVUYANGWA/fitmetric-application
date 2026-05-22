package com.fitmetric.controller;

import com.fitmetric.dto.request.MeasurementRequest;
import com.fitmetric.model.BodyMeasurement;
import com.fitmetric.service.MeasurementService;
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
 * REST controller for body measurement operations.
 * Handles tracking waist, chest, hips, and other body measurements.
 */
@RestController
@RequestMapping("/api/measurements")
@RequiredArgsConstructor
public class MeasurementController {

    private final MeasurementService measurementService;

    /**
     * Adds a new body measurement entry.
     *
     * @param userId The user ID from header
     * @param request Measurement data (waist, chest, hips, etc.)
     * @return Created measurement entry
     */
    @PostMapping
    public ResponseEntity<BodyMeasurement> addMeasurement(@RequestHeader("X-User-Id") String userId,
                                                          @Valid @RequestBody MeasurementRequest request) {
        BodyMeasurement measurement = measurementService.addMeasurement(UUID.fromString(userId), request);
        return ResponseEntity.ok(measurement);
    }

    /**
     * Retrieves all body measurements for a user.
     *
     * @param userId The user ID from header
     * @return List of measurements (newest first)
     */
    @GetMapping
    public ResponseEntity<List<BodyMeasurement>> getMeasurements(@RequestHeader("X-User-Id") String userId) {
        List<BodyMeasurement> measurements = measurementService.getUserMeasurements(UUID.fromString(userId));
        return ResponseEntity.ok(measurements);
    }

    /**
     * Gets measurements for a specific date.
     *
     * @param userId The user ID from header
     * @param date The date to query (YYYY-MM-DD)
     * @return List of measurements for that date
     */
    @GetMapping("/date")
    public ResponseEntity<List<BodyMeasurement>> getMeasurementsForDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String date) {
        List<BodyMeasurement> measurements = measurementService.getMeasurementsForDate(
                UUID.fromString(userId),
                LocalDate.parse(date));
        return ResponseEntity.ok(measurements);
    }

    /**
     * Gets the most recent measurements.
     *
     * @param userId The user ID from header
     * @return Latest measurements
     */
    @GetMapping("/latest")
    public ResponseEntity<BodyMeasurement> getLatestMeasurements(@RequestHeader("X-User-Id") String userId) {
        BodyMeasurement measurement = measurementService.getLatestMeasurements(UUID.fromString(userId));
        return ResponseEntity.ok(measurement);
    }

    /**
     * Gets the change in waist measurement over time.
     *
     * @param userId The user ID from header
     * @return Waist change in centimeters
     */
    @GetMapping("/waist-change")
    public ResponseEntity<Map<String, Object>> getWaistChange(@RequestHeader("X-User-Id") String userId) {
        Double change = measurementService.getWaistChange(UUID.fromString(userId));

        Map<String, Object> response = new HashMap<>();
        response.put("waistChangeCm", change);
        response.put("isImprovement", change < 0);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a measurement entry.
     *
     * @param userId The user ID from header
     * @param measurementId The measurement ID to delete
     * @return Success response
     */
    @DeleteMapping("/{measurementId}")
    public ResponseEntity<Map<String, Object>> deleteMeasurement(@RequestHeader("X-User-Id") String userId,
                                                                 @PathVariable String measurementId) {
        measurementService.deleteMeasurement(UUID.fromString(userId), UUID.fromString(measurementId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}