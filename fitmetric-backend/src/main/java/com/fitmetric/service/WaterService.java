package com.fitmetric.service;

import com.fitmetric.dto.request.WaterLogRequest;
import com.fitmetric.model.User;
import com.fitmetric.model.WaterLog;
import com.fitmetric.repository.UserRepository;
import com.fitmetric.repository.WaterLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for water intake tracking business logic.
 * Handles logging water consumption, calculating daily totals,
 * and checking hydration goals.
 *
 * @author FitMetric Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WaterService {

    private final WaterLogRepository waterLogRepository;
    private final UserRepository userRepository;

    /**
     * Adds a new water intake log for a user.
     *
     * @param userId The user's unique identifier
     * @param request The water log request containing amount in ml and date
     * @return The created WaterLog entity
     */
    @Transactional
    public WaterLog addWaterLog(UUID userId, WaterLogRequest request) {
        // Retrieve the user from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Create a new water log entry
        WaterLog waterEntry = WaterLog.builder()
                .user(user)
                .date(request.getDate())
                .amountMl(request.getAmountMl())
                .build();

        // Save the water log to the database
        WaterLog savedEntry = waterLogRepository.save(waterEntry);

        // Log the successful addition using Lombok's logger (not to be confused with waterEntry)
        log.info("Added water log for user {}: {} ml on {}", userId, request.getAmountMl(), request.getDate());

        return savedEntry;
    }

    /**
     * Retrieves all water logs for a user.
     *
     * @param userId The user's unique identifier
     * @return List of water logs (newest first)
     */
    public List<WaterLog> getUserWaterLogs(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return waterLogRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Calculates total water consumed on a specific date.
     *
     * @param userId The user's unique identifier
     * @param date The date to calculate for
     * @return Total water in milliliters (0 if no entries)
     */
    public Integer getTotalWaterForDate(UUID userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return waterLogRepository.getTotalWaterForDate(user, date);
    }

    /**
     * Gets water consumption for the current day.
     *
     * @param userId The user's unique identifier
     * @return Total water consumed today in milliliters
     */
    public Integer getTodayWaterTotal(UUID userId) {
        return getTotalWaterForDate(userId, LocalDate.now());
    }

    /**
     * Checks if the user has met their daily water goal.
     *
     * @param userId The user's unique identifier
     * @return true if water intake meets or exceeds daily goal
     */
    public boolean hasMetWaterGoal(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Get daily water goal from user profile, default to 2500ml if not set
        Integer dailyGoal = user.getProfile() != null ? user.getProfile().getDailyWaterGoal() : 2500;
        Integer todayTotal = getTotalWaterForDate(userId, LocalDate.now());

        return todayTotal >= dailyGoal;
    }

    /**
     * Deletes a water log entry.
     * Verifies ownership before deletion for security.
     *
     * @param userId The user's unique identifier
     * @param logId The water log ID to delete
     */
    @Transactional
    public void deleteWaterLog(UUID userId, UUID logId) {
        // Find the water log entry
        WaterLog waterEntry = waterLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Water log not found"));

        // Verify that the log belongs to the requesting user
        if (!waterEntry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this log");
        }

        // Delete the log
        waterLogRepository.delete(waterEntry);

        // Log the deletion
        log.info("Deleted water log {} for user {}", logId, userId);
    }
}