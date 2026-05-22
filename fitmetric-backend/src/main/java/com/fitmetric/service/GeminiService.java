package com.fitmetric.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fitmetric.config.GeminiConfig;
import com.fitmetric.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service for interacting with Google Gemini AI.
 *
 * Provides food analysis, health insights, and chat functionality using
 * Google's Gemini large language model.
 *
 * @author FitMetric Team
 * @version 1.0.0
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;

    /**
     * Analyzes a food description and returns estimated nutritional values.
     *
     * @param description Natural language food description
     * @return Map containing name, calories, protein, carbs, fat, and optional ingredients
     */
    public Map<String, Object> analyzeFood(String description) {
        if (!geminiConfig.isGeminiConfigured()) {
            log.warn("Gemini API not configured. Returning mock analysis for: {}", description);
            return getMockFoodAnalysis(description);
        }

        String prompt = buildFoodAnalysisPrompt(description);

        try {
            String response = callGeminiApi(prompt);
            return parseJsonResponse(response);
        } catch (Exception e) {
            log.error("Food analysis failed for description: {}", description, e);
            return getMockFoodAnalysis(description);
        }
    }

    /**
     * Scans a nutrition label image and extracts nutritional information.
     *
     * @param base64Image Base64 encoded image data
     * @return Map containing extracted nutritional values
     */
    public Map<String, Object> scanNutritionLabel(String base64Image) {
        if (!geminiConfig.isGeminiConfigured()) {
            log.warn("Gemini API not configured. Returning mock label scan result");
            return getMockLabelScanResult();
        }

        try {
            ObjectNode requestBody = buildVisionRequest(base64Image);
            String response = callGeminiApiWithImage(requestBody);
            return parseJsonResponse(response);
        } catch (Exception e) {
            log.error("Label scanning failed", e);
            return getMockLabelScanResult();
        }
    }

    /**
     * Generates personalized health insights based on user data.
     *
     * @param user The user entity containing health data
     * @return List of health insights with categories and impacts
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getHealthInsights(User user) {
        if (!geminiConfig.isGeminiConfigured()) {
            log.warn("Gemini API not configured. Returning mock insights for user: {}", user.getId());
            return getMockInsights();
        }

        String prompt = buildInsightsPrompt(user);

        try {
            String response = callGeminiApi(prompt);
            return parseInsightsResponse(response);
        } catch (Exception e) {
            log.error("Health insights generation failed for user: {}", user.getId(), e);
            return getMockInsights();
        }
    }

    /**
     * Generates a weekly meal plan based on user profile.
     *
     * @param user The user entity
     * @return List of planned meals for the week
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> generateMealPlan(User user) {
        if (!geminiConfig.isGeminiConfigured()) {
            log.warn("Gemini API not configured. Returning mock meal plan for user: {}", user.getId());
            return getMockMealPlan();
        }

        String prompt = buildMealPlanPrompt(user);

        try {
            String response = callGeminiApi(prompt);
            return parseMealPlanResponse(response);
        } catch (Exception e) {
            log.error("Meal plan generation failed for user: {}", user.getId(), e);
            return getMockMealPlan();
        }
    }

    /**
     * Sends a chat message to the AI health assistant.
     *
     * @param user The user entity for context
     * @param userMessage User's message
     * @param sessionId Optional chat session ID for continuity
     * @return AI response with optional sources
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> chatWithAssistant(User user, String userMessage, String sessionId) {
        if (!geminiConfig.isGeminiConfigured()) {
            log.warn("Gemini API not configured. Returning mock chat response for user: {}", user.getId());
            return getMockChatResponse(userMessage, sessionId);
        }

        String prompt = buildChatPrompt(user, userMessage);

        try {
            String response = callGeminiApi(prompt);
            Map<String, Object> result = parseJsonResponse(response);
            result.put("sessionId", sessionId != null ? sessionId : UUID.randomUUID().toString());
            return result;
        } catch (Exception e) {
            log.error("Chat assistant failed for user: {}", user.getId(), e);
            return getMockChatResponse(userMessage, sessionId);
        }
    }

    /**
     * Builds the prompt for food analysis.
     */
    private String buildFoodAnalysisPrompt(String description) {
        return String.format("""
            Analyze this food or drink description and provide estimated nutritional values.
            Food description: "%s"
            
            Return a JSON object with the following fields:
            - name: The name of the food item
            - calories: Estimated calories (integer)
            - protein: Estimated protein in grams (number)
            - carbs: Estimated carbohydrates in grams (number)
            - fat: Estimated fat in grams (number)
            - ingredients: Array of key ingredients (optional)
            
            Be realistic with portion sizes.
            """, description);
    }

    /**
     * Builds the request body for vision API calls.
     */
    private ObjectNode buildVisionRequest(String base64Image) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        ArrayNode contents = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();

        // Add image part
        ObjectNode imagePart = objectMapper.createObjectNode();
        ObjectNode inlineData = objectMapper.createObjectNode();
        inlineData.put("mimeType", "image/jpeg");
        inlineData.put("data", base64Image);
        imagePart.set("inlineData", inlineData);
        parts.add(imagePart);

        // Add text instruction part
        ObjectNode textPart = objectMapper.createObjectNode();
        textPart.put("text", """
            Extract nutritional information from this food label.
            Focus on per-serving values.
            Return a JSON object with:
            - name: Product name
            - calories: Calories per serving
            - protein: Protein in grams per serving
            - carbs: Carbohydrates in grams per serving
            - fat: Fat in grams per serving
            - servingSizeWeight: Weight of one serving in grams (if available)
            """);
        parts.add(textPart);

        content.set("parts", parts);
        contents.add(content);
        requestBody.set("contents", contents);

        return requestBody;
    }

    /**
     * Builds the prompt for health insights generation.
     */
    private String buildInsightsPrompt(User user) {
        int age = (user.getProfile() != null && user.getProfile().getAge() != null)
                ? user.getProfile().getAge() : 30;
        String gender = (user.getProfile() != null && user.getProfile().getGender() != null)
                ? user.getProfile().getGender() : "male";
        int height = (user.getProfile() != null && user.getProfile().getHeightCm() != null)
                ? user.getProfile().getHeightCm() : 175;
        String goal = (user.getProfile() != null && user.getProfile().getGoalType() != null)
                ? user.getProfile().getGoalType() : "lose";

        return String.format("""
            You are a health analytics AI. Analyze this user's data and provide 4 detailed health insights.
            
            User Profile:
            - Goal: %s
            - Age: %d
            - Gender: %s
            - Height: %d cm
            
            Provide 4 insights covering:
            1. Weight trend analysis
            2. Calorie consistency
            3. Macronutrient distribution
            4. A specific actionable recommendation
            
            Return a JSON array with objects containing:
            - category (string): One of ["Weight Trend", "Calorie Analysis", "Macro Balance", "Action Plan"]
            - title (string): Short title for the insight
            - description (string): Detailed explanation (2-3 sentences)
            - impact (string): One of ["positive", "neutral", "negative"]
            """,
                goal, age, gender, height);
    }

    /**
     * Builds the prompt for meal plan generation.
     */
    private String buildMealPlanPrompt(User user) {
        int calorieTarget = (user.getProfile() != null && user.getProfile().getDailyCalorieGoal() != null)
                ? user.getProfile().getDailyCalorieGoal() : 2000;
        int age = (user.getProfile() != null && user.getProfile().getAge() != null)
                ? user.getProfile().getAge() : 30;
        String gender = (user.getProfile() != null && user.getProfile().getGender() != null)
                ? user.getProfile().getGender() : "male";
        int height = (user.getProfile() != null && user.getProfile().getHeightCm() != null)
                ? user.getProfile().getHeightCm() : 175;
        String goal = (user.getProfile() != null && user.getProfile().getGoalType() != null)
                ? user.getProfile().getGoalType() : "lose";

        return String.format("""
            Generate a 7-day meal plan for a person with these characteristics:
            - Goal: %s weight
            - Daily calorie target: %d calories
            - Age: %d
            - Gender: %s
            - Height: %d cm
            
            Provide breakfast, lunch, dinner, and two snacks for each day (Sunday through Saturday).
            Use dayOfWeek: 0 for Sunday, 1 for Monday, etc.
            Use mealType values: 'breakfast', 'lunch', 'dinner', 'snack1', 'snack2'
            
            Return a JSON array where each object has:
            - dayOfWeek (integer 0-6)
            - mealType (string)
            - name (string)
            - calories (integer)
            - protein (number)
            - carbs (number)
            - fat (number)
            - ingredients (array of strings)
            """,
                goal, calorieTarget, age, gender, height);
    }

    /**
     * Builds the prompt for chat assistant.
     */
    private String buildChatPrompt(User user, String userMessage) {
        String name = user.getName() != null ? user.getName() : "User";
        String goal = (user.getProfile() != null && user.getProfile().getGoalType() != null)
                ? user.getProfile().getGoalType() : "lose";
        int calorieTarget = (user.getProfile() != null && user.getProfile().getDailyCalorieGoal() != null)
                ? user.getProfile().getDailyCalorieGoal() : 2000;

        return String.format("""
            You are FitMetric Pro's AI Health Assistant. You provide helpful, science-based fitness and nutrition advice.
            
            User Context:
            - Name: %s
            - Goal: %s weight
            - Daily calorie target: %d kcal
            
            Be encouraging, concise, and professional. If asked about medical advice, remind the user to consult a doctor.
            
            User Question: %s
            """,
                name, goal, calorieTarget, userMessage);
    }

    /**
     * Calls the Gemini API with a text prompt.
     */
    private String callGeminiApi(String prompt) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        ArrayNode contents = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode textPart = objectMapper.createObjectNode();
        textPart.put("text", prompt);
        parts.add(textPart);
        content.set("parts", parts);
        contents.add(content);
        requestBody.set("contents", contents);

        ObjectNode generationConfig = objectMapper.createObjectNode();
        generationConfig.put("temperature", geminiConfig.getTemperature());
        generationConfig.put("maxOutputTokens", geminiConfig.getMaxTokens());
        generationConfig.put("responseMimeType", "application/json");
        requestBody.set("generationConfig", generationConfig);

        String url = "/models/" + geminiConfig.getModel() + ":generateContent?key=" + geminiConfig.getApiKey();

        return geminiWebClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(geminiConfig.getTimeoutSeconds()));
    }

    /**
     * Calls the Gemini API with an image request body.
     */
    private String callGeminiApiWithImage(ObjectNode requestBody) {
        String url = "/models/" + geminiConfig.getModel() + ":generateContent?key=" + geminiConfig.getApiKey();

        return geminiWebClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(geminiConfig.getTimeoutSeconds()));
    }

    /**
     * Parses JSON response from Gemini API.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String text = jsonNode.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            return objectMapper.readValue(text, Map.class);
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
            return new HashMap<>();
        }
    }

    /**
     * Parses insights response from Gemini API.
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseInsightsResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String text = jsonNode.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            JsonNode insightsNode = objectMapper.readTree(text);
            if (insightsNode.isArray()) {
                return objectMapper.readValue(insightsNode.toString(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));
            }
        } catch (Exception e) {
            log.error("Failed to parse insights response", e);
        }
        return getMockInsights();
    }

    /**
     * Parses meal plan response from Gemini API.
     */
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseMealPlanResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            String text = jsonNode.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            JsonNode mealsNode = objectMapper.readTree(text);
            if (mealsNode.isArray()) {
                return objectMapper.readValue(mealsNode.toString(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));
            }
        } catch (Exception e) {
            log.error("Failed to parse meal plan response", e);
        }
        return getMockMealPlan();
    }

    /**
     * Returns mock food analysis data when Gemini API is unavailable.
     */
    private Map<String, Object> getMockFoodAnalysis(String description) {
        Map<String, Object> result = new HashMap<>();
        String displayName = description.length() > 50 ? description.substring(0, 50) : description;
        result.put("name", displayName);
        result.put("calories", 250);
        result.put("protein", 15.0);
        result.put("carbs", 30.0);
        result.put("fat", 10.0);
        result.put("ingredients", List.of("Configure Gemini API for accurate analysis"));
        return result;
    }

    /**
     * Returns mock label scan data when Gemini API is unavailable.
     */
    private Map<String, Object> getMockLabelScanResult() {
        Map<String, Object> result = new HashMap<>();
        result.put("name", "Scanned Product");
        result.put("calories", 200);
        result.put("protein", 10.0);
        result.put("carbs", 25.0);
        result.put("fat", 8.0);
        result.put("servingSizeWeight", 100);
        return result;
    }

    /**
     * Returns mock health insights when Gemini API is unavailable.
     */
    private List<Map<String, Object>> getMockInsights() {
        List<Map<String, Object>> insights = new ArrayList<>();

        Map<String, Object> insight1 = new HashMap<>();
        insight1.put("category", "Weight Trend");
        insight1.put("title", "Consistency is Key");
        insight1.put("description", "Continue logging your weight daily to see meaningful trends.");
        insight1.put("impact", "neutral");
        insights.add(insight1);

        Map<String, Object> insight2 = new HashMap<>();
        insight2.put("category", "Action Plan");
        insight2.put("title", "Configure Gemini API");
        insight2.put("description", "Add your Gemini API key to enable personalized AI insights.");
        insight2.put("impact", "neutral");
        insights.add(insight2);

        Map<String, Object> insight3 = new HashMap<>();
        insight3.put("category", "Calorie Analysis");
        insight3.put("title", "Track Your Meals");
        insight3.put("description", "Logging all meals helps identify patterns in your eating habits.");
        insight3.put("impact", "positive");
        insights.add(insight3);

        Map<String, Object> insight4 = new HashMap<>();
        insight4.put("category", "Macro Balance");
        insight4.put("title", "Balance Your Macros");
        insight4.put("description", "Aim for balanced protein, carbs, and fat distribution.");
        insight4.put("impact", "positive");
        insights.add(insight4);

        return insights;
    }

    /**
     * Returns mock meal plan when Gemini API is unavailable.
     */
    private List<Map<String, Object>> getMockMealPlan() {
        List<Map<String, Object>> meals = new ArrayList<>();
        String[] mealTypes = {"breakfast", "lunch", "dinner", "snack1", "snack2"};
        String[] mealNames = {"Oatmeal with Berries", "Grilled Chicken Salad", "Salmon with Rice",
                "Greek Yogurt", "Apple with Peanut Butter"};
        List<String> ingredients = List.of("Configure Gemini API for detailed ingredients");

        for (int day = 0; day < 7; day++) {
            for (int i = 0; i < mealTypes.length; i++) {
                Map<String, Object> meal = new HashMap<>();
                meal.put("dayOfWeek", day);
                meal.put("mealType", mealTypes[i]);
                meal.put("name", mealNames[i % mealNames.length]);
                meal.put("calories", 400 + i * 50);
                meal.put("protein", 20.0);
                meal.put("carbs", 30.0);
                meal.put("fat", 15.0);
                meal.put("ingredients", ingredients);
                meals.add(meal);
            }
        }

        return meals;
    }

    /**
     * Returns mock chat response when Gemini API is unavailable.
     */
    private Map<String, Object> getMockChatResponse(String userMessage, String sessionId) {
        Map<String, Object> result = new HashMap<>();
        result.put("text", "I'm currently in demo mode. To get full AI-powered responses, please configure your Gemini API key.");
        result.put("sources", new ArrayList<>());
        result.put("sessionId", sessionId != null ? sessionId : UUID.randomUUID().toString());
        return result;
    }
}