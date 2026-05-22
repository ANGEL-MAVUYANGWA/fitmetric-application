package com.fitmetric.service;

import com.fitmetric.dto.request.MealPlanRequest;
import com.fitmetric.model.PlannedMeal;
import com.fitmetric.model.User;
import com.fitmetric.repository.MealPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for meal planning business logic.
 * Handles saving, retrieving, and managing weekly meal plans.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final UserService userService;

    /**
     * Saves or replaces the user's weekly meal plan.
     * Existing meal plan is deleted and replaced with the new one.
     *
     * @param userId The user's unique identifier
     * @param request The meal plan request containing all meals for the week
     * @return List of saved PlannedMeal entities
     */
    @Transactional
    public List<PlannedMeal> saveMealPlan(UUID userId, MealPlanRequest request) {
        User user = userService.getUserById(userId);

        // Delete existing meal plan
        List<PlannedMeal> existing = mealPlanRepository.findByUser(user);
        mealPlanRepository.deleteAll(existing);

        // Save new meal plan
        List<PlannedMeal> meals = new ArrayList<>();
        for (MealPlanRequest.MealItemRequest item : request.getMeals()) {
            PlannedMeal meal = PlannedMeal.builder()
                    .user(user)
                    .dayOfWeek(item.getDayOfWeek())
                    .mealType(item.getMealType())
                    .name(item.getName())
                    .calories(item.getCalories())
                    .protein(item.getProtein())
                    .carbs(item.getCarbs())
                    .fat(item.getFat())
                    .ingredients(item.getIngredients() != null ? String.join(",", item.getIngredients()) : null)
                    .build();
            meals.add(mealPlanRepository.save(meal));
        }

        log.info("Saved meal plan with {} meals for user {}", meals.size(), userId);
        return meals;
    }

    /**
     * Retrieves the user's complete meal plan.
     *
     * @param userId The user's unique identifier
     * @return List of all planned meals
     */
    public List<PlannedMeal> getMealPlan(UUID userId) {
        User user = userService.getUserById(userId);
        return mealPlanRepository.findByUser(user);
    }

    /**
     * Retrieves meals for a specific day of the week.
     *
     * @param userId The user's unique identifier
     * @param dayOfWeek Day number (0 = Sunday, 6 = Saturday)
     * @return List of meals for that day
     */
    public List<PlannedMeal> getMealsForDay(UUID userId, Integer dayOfWeek) {
        User user = userService.getUserById(userId);
        return mealPlanRepository.findByUserAndDayOfWeek(user, dayOfWeek);
    }

    /**
     * Gets today's meals based on current day of week.
     *
     * @param userId The user's unique identifier
     * @return List of meals for today
     */
    public List<PlannedMeal> getTodayMeals(UUID userId) {
        int today = java.time.LocalDate.now().getDayOfWeek().getValue() % 7;
        return getMealsForDay(userId, today);
    }

    /**
     * Calculates total calories for a specific day.
     *
     * @param userId The user's unique identifier
     * @param dayOfWeek Day number
     * @return Total calories for that day
     */
    public int getTotalCaloriesForDay(UUID userId, Integer dayOfWeek) {
        List<PlannedMeal> meals = getMealsForDay(userId, dayOfWeek);
        return meals.stream().mapToInt(meal -> meal.getCalories() != null ? meal.getCalories() : 0).sum();
    }

    /**
     * Deletes the user's entire meal plan.
     *
     * @param userId The user's unique identifier
     */
    @Transactional
    public void deleteMealPlan(UUID userId) {
        User user = userService.getUserById(userId);
        List<PlannedMeal> meals = mealPlanRepository.findByUser(user);
        mealPlanRepository.deleteAll(meals);
        log.info("Deleted meal plan for user {}", userId);
    }

    /**
     * Deletes a specific meal from the plan.
     *
     * @param userId The user's unique identifier
     * @param mealId The meal ID to delete
     */
    @Transactional
    public void deleteMeal(UUID userId, UUID mealId) {
        PlannedMeal meal = mealPlanRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        if (!meal.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this meal");
        }

        mealPlanRepository.delete(meal);
        log.info("Deleted meal {} for user {}", mealId, userId);
    }
}