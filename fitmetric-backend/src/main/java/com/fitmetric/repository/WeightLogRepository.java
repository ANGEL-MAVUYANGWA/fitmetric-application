package com.fitmetric.repository;

import com.fitmetric.model.User;
import com.fitmetric.model.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for WeightLog entity operations.
 *
 * Provides specialized queries for weight trend analysis and
 * retrieving logs for specific date ranges.
 */
@Repository
public interface WeightLogRepository extends JpaRepository<WeightLog, UUID> {

    /**
     * Retrieves all weight logs for a user, ordered by date descending.
     * Most recent logs come first for display purposes.
     *
     * @param user The user entity
     * @return List of weight logs sorted by date (newest first)
     */
    List<WeightLog> findByUserOrderByDateDesc(User user);

    /**
     * Gets the most recent weight log for a user.
     * Used to display current weight on the dashboard.
     *
     * @param user The user entity
     * @return Optional containing the latest weight log if exists
     */
    Optional<WeightLog> findTopByUserOrderByDateDesc(User user);

    /**
     * Finds weight logs within a specific date range.
     * Used for generating trend charts and analytics.
     *
     * @param user The user entity
     * @param startDate Beginning of date range (inclusive)
     * @param endDate End of date range (inclusive)
     * @return List of weight logs in chronological order
     */
    @Query("SELECT w FROM WeightLog w WHERE w.user = :user AND w.date BETWEEN :startDate AND :endDate ORDER BY w.date ASC")
    List<WeightLog> findByUserAndDateRange(@Param("user") User user,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    /**
     * Gets the first (oldest) weight log for a user.
     * Used to calculate total progress from starting weight.
     *
     * @param user The user entity
     * @return Optional containing the earliest weight log
     */
    Optional<WeightLog> findFirstByUserOrderByDateAsc(User user);
}