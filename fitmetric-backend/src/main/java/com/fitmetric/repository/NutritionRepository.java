package com.fitmetric.repository;

import com.fitmetric.model.NutritionEntry;
import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for NutritionEntry entity operations.
 *
 * Provides methods for retrieving nutrition data by date ranges
 * and calculating daily calorie totals.
 */
@Repository
public interface NutritionRepository extends JpaRepository<NutritionEntry, UUID> {

    /**
     * Retrieves all nutrition entries for a user, ordered by date descending.
     *
     * @param user The user entity
     * @return List of nutrition entries (newest first)
     */
    List<NutritionEntry> findByUserOrderByDateDesc(User user);

    /**
     * Finds nutrition entries for a specific date.
     * Used to display today's food log.
     *
     * @param user The user entity
     * @param date The date to filter by
     * @return List of entries for that date, ordered by creation time
     */
    @Query("SELECT n FROM NutritionEntry n WHERE n.user = :user AND n.date = :date ORDER BY n.createdAt DESC")
    List<NutritionEntry> findByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);

    /**
     * Calculates total calories consumed on a specific date.
     *
     * @param user The user entity
     * @param date The date to calculate for
     * @return Total calories for that date (0 if no entries)
     */
    @Query("SELECT COALESCE(SUM(n.calories), 0) FROM NutritionEntry n WHERE n.user = :user AND n.date = :date")
    Integer getTotalCaloriesForDate(@Param("user") User user, @Param("date") LocalDate date);

    /**
     * Gets nutrition entries within a date range for analytics.
     *
     * @param user The user entity
     * @param startDate Start of date range
     * @param endDate End of date range
     * @return List of entries in the range
     */
    @Query("SELECT n FROM NutritionEntry n WHERE n.user = :user AND n.date BETWEEN :startDate AND :endDate ORDER BY n.date ASC")
    List<NutritionEntry> findByUserAndDateRange(@Param("user") User user,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);
}