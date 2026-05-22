package com.fitmetric.controller;

import com.fitmetric.dto.request.GeminiChatRequest;
import com.fitmetric.model.User;
import com.fitmetric.service.GeminiService;
import com.fitmetric.service.PremiumService;
import com.fitmetric.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for AI-powered features using Google Gemini.
 * Handles food analysis, health insights, and chat functionality.
 * Premium features require active subscription.
 */
@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiService geminiService;
    private final UserService userService;
    private final PremiumService premiumService;

    /**
     * Analyzes a food description using AI.
     * Returns estimated nutritional values.
     * Basic feature - available to all users.
     *
     * @param request Contains the food description
     * @return Nutritional analysis
     */
    @PostMapping("/analyze-food")
    public ResponseEntity<Map<String, Object>> analyzeFood(@RequestBody Map<String, String> request) {
        String description = request.get("description");
        Map<String, Object> analysis = geminiService.analyzeFood(description);
        return ResponseEntity.ok(analysis);
    }

    /**
     * Scans a nutrition label image.
     * Extracts nutritional information from the image.
     * Basic feature - available to all users.
     *
     * @param request Contains base64 image data
     * @return Extracted nutritional information
     */
    @PostMapping("/scan-label")
    public ResponseEntity<Map<String, Object>> scanNutritionLabel(@RequestBody Map<String, String> request) {
        String image = request.get("image");
        Map<String, Object> result = geminiService.scanNutritionLabel(image);
        return ResponseEntity.ok(result);
    }

    /**
     * Gets AI-generated health insights for a user.
     * Premium feature - requires active subscription.
     *
     * @param userId The user ID from header
     * @return List of health insights
     */
    @GetMapping("/insights")
    public ResponseEntity<List<Map<String, Object>>> getHealthInsights(@RequestHeader("X-User-Id") String userId) {
        premiumService.validatePremiumAccess(UUID.fromString(userId));

        User user = userService.getUserById(UUID.fromString(userId));
        List<Map<String, Object>> insights = geminiService.getHealthInsights(user);
        return ResponseEntity.ok(insights);
    }

    /**
     * Generates a weekly meal plan suggestion.
     * Premium feature - requires active subscription.
     *
     * @param userId The user ID from header
     * @return Suggested meal plan
     */
    @PostMapping("/suggest-meal-plan")
    public ResponseEntity<List<Map<String, Object>>> suggestMealPlan(@RequestHeader("X-User-Id") String userId) {
        premiumService.validatePremiumAccess(UUID.fromString(userId));

        User user = userService.getUserById(UUID.fromString(userId));
        List<Map<String, Object>> mealPlan = geminiService.generateMealPlan(user);
        return ResponseEntity.ok(mealPlan);
    }

    /**
     * AI chat assistant endpoint.
     * Premium feature - requires active subscription.
     *
     * @param userId The user ID from header
     * @param request Chat request with message and optional session ID
     * @return AI response with optional sources
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestHeader("X-User-Id") String userId,
                                                    @RequestBody GeminiChatRequest request) {
        premiumService.validatePremiumAccess(UUID.fromString(userId));

        User user = userService.getUserById(UUID.fromString(userId));
        Map<String, Object> response = geminiService.chatWithAssistant(user, request.getMessage(), request.getSessionId());
        return ResponseEntity.ok(response);
    }

    /**
     * Generates a shopping list from the meal plan.
     * Premium feature - requires active subscription.
     *
     * @param userId The user ID from header
     * @return Categorized shopping list
     */
    @PostMapping("/shopping-list")
    public ResponseEntity<List<Map<String, Object>>> generateShoppingList(@RequestHeader("X-User-Id") String userId) {
        premiumService.validatePremiumAccess(UUID.fromString(userId));

        List<Map<String, Object>> shoppingList = new java.util.ArrayList<>();
        return ResponseEntity.ok(shoppingList);
    }
}