package com.fitmetric.repository;

import com.fitmetric.model.User;
import com.fitmetric.model.WaterLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for WaterLog entity operations.
 *
 * Provides methods for tracking daily water intake totals
 * and retrieving hydration history.
 */
@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, UUID> {

    /**
     * Retrieves all water logs for a user, ordered by creation date descending.
     *
     * @param user The user entity
     * @return List of water logs (newest first)
     */
    List<WaterLog> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Calculates total water consumed on a specific date.
     *
     * @param user The user entity
     * @param date The date to calculate for
     * @return Total water in milliliters (0 if no entries)
     */
    @Query("SELECT COALESCE(SUM(w.amountMl), 0) FROM WaterLog w WHERE w.user = :user AND w.date = :date")
    Integer getTotalWaterForDate(@Param("user") User user, @Param("date") LocalDate date);
}