package com.fitmetric.repository;

import com.fitmetric.model.PlannedMeal;
import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for PlannedMeal entity operations.
 *
 * Provides methods for retrieving weekly meal plans
 * and filtering by day of week.
 */
@Repository
public interface MealPlanRepository extends JpaRepository<PlannedMeal, UUID> {

    /**
     * Retrieves all planned meals for a user.
     *
     * @param user The user entity
     * @return List of all planned meals
     */
    List<PlannedMeal> findByUser(User user);

    /**
     * Retrieves planned meals for a specific day of the week.
     *
     * @param user The user entity
     * @param dayOfWeek Day number (0 = Sunday, 6 = Saturday)
     * @return List of meals planned for that day
     */
    List<PlannedMeal> findByUserAndDayOfWeek(User user, Integer dayOfWeek);
}