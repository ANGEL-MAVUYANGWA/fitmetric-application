package com.fitmetric.controller;

import com.fitmetric.dto.request.NutritionEntryRequest;
import com.fitmetric.model.NutritionEntry;
import com.fitmetric.service.NutritionService;
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
 * REST controller for nutrition tracking operations.
 * Handles food logging, calorie tracking, and macro management.
 */
@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    /**
     * Adds a new nutrition entry.
     *
     * @param userId The user ID from header
     * @param request Nutrition entry data
     * @return Created nutrition entry
     */
    @PostMapping("/log")
    public ResponseEntity<NutritionEntry> addNutritionEntry(@RequestHeader("X-User-Id") String userId,
                                                            @Valid @RequestBody NutritionEntryRequest request) {
        NutritionEntry entry = nutritionService.addNutritionEntry(UUID.fromString(userId), request);
        return ResponseEntity.ok(entry);
    }

    /**
     * Retrieves all nutrition entries for a user.
     *
     * @param userId The user ID from header
     * @return List of nutrition entries (newest first)
     */
    @GetMapping("/logs")
    public ResponseEntity<List<NutritionEntry>> getNutritionEntries(@RequestHeader("X-User-Id") String userId) {
        List<NutritionEntry> entries = nutritionService.getUserNutritionEntries(UUID.fromString(userId));
        return ResponseEntity.ok(entries);
    }

    /**
     * Gets nutrition entries for a specific date.
     *
     * @param userId The user ID from header
     * @param date The date to query (YYYY-MM-DD)
     * @return List of entries for that date
     */
    @GetMapping("/date")
    public ResponseEntity<List<NutritionEntry>> getEntriesForDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String date) {
        List<NutritionEntry> entries = nutritionService.getEntriesForDate(
                UUID.fromString(userId),
                LocalDate.parse(date));
        return ResponseEntity.ok(entries);
    }

    /**
     * Gets total calories for a specific date.
     *
     * @param userId The user ID from header
     * @param date The date to calculate for (YYYY-MM-DD)
     * @return Total calories for that date
     */
    @GetMapping("/calories")
    public ResponseEntity<Map<String, Object>> getTotalCaloriesForDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String date) {
        Integer total = nutritionService.getTotalCaloriesForDate(
                UUID.fromString(userId),
                LocalDate.parse(date));

        Map<String, Object> response = new HashMap<>();
        response.put("date", date);
        response.put("totalCalories", total);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a nutrition entry.
     *
     * @param userId The user ID from header
     * @param entryId The entry ID to delete
     * @return Success response
     */
    @DeleteMapping("/log/{entryId}")
    public ResponseEntity<Map<String, Object>> deleteNutritionEntry(@RequestHeader("X-User-Id") String userId,
                                                                    @PathVariable String entryId) {
        nutritionService.deleteNutritionEntry(UUID.fromString(userId), UUID.fromString(entryId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}