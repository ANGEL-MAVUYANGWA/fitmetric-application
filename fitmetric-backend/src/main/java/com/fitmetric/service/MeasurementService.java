package com.fitmetric.service;

import com.fitmetric.dto.request.MeasurementRequest;
import com.fitmetric.model.BodyMeasurement;
import com.fitmetric.model.User;
import com.fitmetric.repository.MeasurementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for body measurement tracking business logic.
 * Handles recording and retrieving body measurements for non-scale victory tracking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MeasurementService {

    private final MeasurementRepository measurementRepository;
    private final UserService userService;

    /**
     * Adds a new body measurement entry for a user.
     *
     * @param userId The user's unique identifier
     * @param request The measurement data (waist, chest, hips, etc.)
     * @return Created BodyMeasurement entity
     */
    @Transactional
    public BodyMeasurement addMeasurement(UUID userId, MeasurementRequest request) {
        User user = userService.getUserById(userId);

        BodyMeasurement measurement = BodyMeasurement.builder()
                .user(user)
                .date(request.getDate())
                .waistCm(request.getWaistCm())
                .chestCm(request.getChestCm())
                .hipsCm(request.getHipsCm())
                .thighsCm(request.getThighsCm())
                .armsCm(request.getArmsCm())
                .neckCm(request.getNeckCm())
                .build();

        BodyMeasurement saved = measurementRepository.save(measurement);
        log.info("Added body measurements for user {} on {}", userId, request.getDate());

        return saved;
    }

    /**
     * Retrieves all body measurements for a user.
     *
     * @param userId The user's unique identifier
     * @return List of measurements (newest first)
     */
    public List<BodyMeasurement> getUserMeasurements(UUID userId) {
        User user = userService.getUserById(userId);
        return measurementRepository.findByUserOrderByDateDesc(user);
    }

    /**
     * Gets measurements for a specific date.
     *
     * @param userId The user's unique identifier
     * @param date The date to query
     * @return List of measurements for that date
     */
    public List<BodyMeasurement> getMeasurementsForDate(UUID userId, LocalDate date) {
        User user = userService.getUserById(userId);
        return measurementRepository.findByUserAndDate(user, date);
    }

    /**
     * Gets the most recent measurements for a user.
     *
     * @param userId The user's unique identifier
     * @return The latest measurements, or null if none exist
     */
    public BodyMeasurement getLatestMeasurements(UUID userId) {
        List<BodyMeasurement> measurements = getUserMeasurements(userId);
        return measurements.isEmpty() ? null : measurements.get(0);
    }

    /**
     * Calculates the total change in waist measurement over time.
     *
     * @param userId The user's unique identifier
     * @return Change in waist circumference in centimeters
     */
    public Double getWaistChange(UUID userId) {
        List<BodyMeasurement> measurements = getUserMeasurements(userId);

        if (measurements.size() < 2) {
            return 0.0;
        }

        BodyMeasurement oldest = measurements.get(measurements.size() - 1);
        BodyMeasurement newest = measurements.get(0);

        if (oldest.getWaistCm() != null && newest.getWaistCm() != null) {
            return newest.getWaistCm() - oldest.getWaistCm();
        }

        return 0.0;
    }

    /**
     * Deletes a measurement entry.
     * Verifies ownership before deletion.
     *
     * @param userId The user's unique identifier
     * @param measurementId The measurement ID to delete
     */
    @Transactional
    public void deleteMeasurement(UUID userId, UUID measurementId) {
        BodyMeasurement measurement = measurementRepository.findById(measurementId)
                .orElseThrow(() -> new RuntimeException("Measurement not found"));

        if (!measurement.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this measurement");
        }

        measurementRepository.delete(measurement);
        log.info("Deleted measurement {} for user {}", measurementId, userId);
    }
}