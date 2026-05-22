package com.fitmetric.service;

import com.fitmetric.model.User;
import com.fitmetric.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for premium membership management.
 * Handles subscription upgrades, feature access control, and expiration management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PremiumService {

    private final UserService userService;
    private final UserRepository userRepository;

    /**
     * Upgrades a user to premium membership.
     * Sets premium status to true.
     *
     * @param userId The user's unique identifier
     */
    @Transactional
    public void upgradeToPremium(UUID userId) {
        User user = userService.getUserById(userId);
        user.setPremium(true);
        userRepository.save(user);
        log.info("User {} upgraded to premium", userId);
    }

    /**
     * Downgrades a user from premium to free tier.
     *
     * @param userId The user's unique identifier
     */
    @Transactional
    public void downgradeToFree(UUID userId) {
        User user = userService.getUserById(userId);
        user.setPremium(false);
        userRepository.save(user);
        log.info("User {} downgraded to free tier", userId);
    }

    /**
     * Checks if a user has premium access.
     *
     * @param userId The user's unique identifier
     * @return true if user is premium
     */
    public boolean isPremiumUser(UUID userId) {
        User user = userService.getUserById(userId);
        return user.isPremium();
    }

    /**
     * Validates if a user can access a premium feature.
     *
     * @param userId The user's unique identifier
     * @throws RuntimeException if user is not premium
     */
    public void validatePremiumAccess(UUID userId) {
        if (!isPremiumUser(userId)) {
            throw new RuntimeException("Premium subscription required for this feature");
        }
    }

    /**
     * Gets available premium features for a user.
     *
     * @param userId The user's unique identifier
     * @return List of feature names available to the user
     */
    public List<String> getAvailableFeatures(UUID userId) {
        List<String> features = new ArrayList<>();

        // Basic features for all users
        features.add("WEIGHT_TRACKING");
        features.add("BASIC_ANALYTICS");
        features.add("WATER_TRACKING");
        features.add("MEASUREMENT_TRACKING");
        features.add("NUTRITION_TRACKING");
        features.add("MEAL_PLANNING");

        // Premium features - only available to premium users
        if (isPremiumUser(userId)) {
            features.add("AI_INSIGHTS");
            features.add("AI_CHAT_ASSISTANT");
            features.add("ADVANCED_ANALYTICS");
            features.add("SUPPLEMENT_TRACKING");
            features.add("DATA_EXPORT");
            features.add("UNLIMITED_MEAL_PLANNING");
        }

        return features;
    }
}