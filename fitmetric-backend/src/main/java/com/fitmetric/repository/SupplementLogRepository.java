package com.fitmetric.repository;

import com.fitmetric.model.Supplement;
import com.fitmetric.model.SupplementLog;
import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for SupplementLog entity operations.
 *
 * Provides methods for tracking supplement adherence and
 * checking if supplements have been taken on specific dates.
 */
@Repository
public interface SupplementLogRepository extends JpaRepository<SupplementLog, UUID> {

    /**
     * Retrieves supplement logs for a specific date.
     *
     * @param user The user entity
     * @param date The date to filter by
     * @return List of supplement logs for that date
     */
    List<SupplementLog> findByUserAndDate(User user, LocalDate date);

    /**
     * Finds a specific supplement log for a supplement and date.
     * Used to check if a supplement has already been logged for the day.
     *
     * @param supplement The supplement entity
     * @param date The date to check
     * @return Optional containing the log if it exists
     */
    Optional<SupplementLog> findBySupplementAndDate(Supplement supplement, LocalDate date);

    /**
     * Counts how many supplements were taken on a specific date.
     *
     * @param user The user entity
     * @param date The date to count for
     * @return Number of supplements taken that day
     */
    @Query("SELECT COUNT(s) FROM SupplementLog s WHERE s.user = :user AND s.date = :date AND s.taken = true")
    Integer countTakenForDate(@Param("user") User user, @Param("date") LocalDate date);
}