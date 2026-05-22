package com.fitmetric.controller;

import com.fitmetric.dto.request.MealPlanRequest;
import com.fitmetric.model.PlannedMeal;
import com.fitmetric.service.MealPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for meal planning operations.
 * Handles creating, retrieving, and managing weekly meal plans.
 */
@RestController
@RequestMapping("/api/meal-plan")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService mealPlanService;

    /**
     * Saves or replaces the user's weekly meal plan.
     *
     * @param userId The user ID from header
     * @param request Meal plan data for the entire week
     * @return List of saved planned meals
     */
    @PostMapping
    public ResponseEntity<List<PlannedMeal>> saveMealPlan(@RequestHeader("X-User-Id") String userId,
                                                          @Valid @RequestBody MealPlanRequest request) {
        List<PlannedMeal> meals = mealPlanService.saveMealPlan(UUID.fromString(userId), request);
        return ResponseEntity.ok(meals);
    }

    /**
     * Retrieves the user's complete meal plan.
     *
     * @param userId The user ID from header
     * @return List of all planned meals
     */
    @GetMapping
    public ResponseEntity<List<PlannedMeal>> getMealPlan(@RequestHeader("X-User-Id") String userId) {
        List<PlannedMeal> meals = mealPlanService.getMealPlan(UUID.fromString(userId));
        return ResponseEntity.ok(meals);
    }

    /**
     * Gets meals for a specific day of the week.
     *
     * @param userId The user ID from header
     * @param dayOfWeek Day number (0 = Sunday, 6 = Saturday)
     * @return List of meals for that day
     */
    @GetMapping("/day")
    public ResponseEntity<List<PlannedMeal>> getMealsForDay(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam int dayOfWeek) {
        List<PlannedMeal> meals = mealPlanService.getMealsForDay(UUID.fromString(userId), dayOfWeek);
        return ResponseEntity.ok(meals);
    }

    /**
     * Gets today's meals.
     *
     * @param userId The user ID from header
     * @return List of meals for today
     */
    @GetMapping("/today")
    public ResponseEntity<List<PlannedMeal>> getTodayMeals(@RequestHeader("X-User-Id") String userId) {
        List<PlannedMeal> meals = mealPlanService.getTodayMeals(UUID.fromString(userId));
        return ResponseEntity.ok(meals);
    }

    /**
     * Gets total calories for a specific day.
     *
     * @param userId The user ID from header
     * @param dayOfWeek Day number
     * @return Total calories for that day
     */
    @GetMapping("/calories")
    public ResponseEntity<Map<String, Object>> getTotalCaloriesForDay(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam int dayOfWeek) {
        int total = mealPlanService.getTotalCaloriesForDay(UUID.fromString(userId), dayOfWeek);

        Map<String, Object> response = new HashMap<>();
        response.put("dayOfWeek", dayOfWeek);
        response.put("totalCalories", total);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes the user's entire meal plan.
     *
     * @param userId The user ID from header
     * @return Success response
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteMealPlan(@RequestHeader("X-User-Id") String userId) {
        mealPlanService.deleteMealPlan(UUID.fromString(userId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a specific meal from the plan.
     *
     * @param userId The user ID from header
     * @param mealId The meal ID to delete
     * @return Success response
     */
    @DeleteMapping("/{mealId}")
    public ResponseEntity<Map<String, Object>> deleteMeal(@RequestHeader("X-User-Id") String userId,
                                                          @PathVariable String mealId) {
        mealPlanService.deleteMeal(UUID.fromString(userId), UUID.fromString(mealId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}