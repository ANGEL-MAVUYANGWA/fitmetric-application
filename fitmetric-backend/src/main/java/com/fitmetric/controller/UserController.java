package com.fitmetric.controller;

import com.fitmetric.dto.request.ProfileUpdateRequest;
import com.fitmetric.dto.response.DashboardSummaryResponse;
import com.fitmetric.model.User;
import com.fitmetric.model.UserProfile;
import com.fitmetric.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for user profile operations.
 * Handles retrieving and updating user profile information.
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Retrieves the user's profile information.
     *
     * @param userId The user ID from header
     * @return User profile data
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@RequestHeader("X-User-Id") String userId) {
        User user = userService.getUserById(UUID.fromString(userId));
        return ResponseEntity.ok(user.getProfile());
    }

    /**
     * Updates the user's profile settings.
     *
     * @param userId The user ID from header
     * @param request Profile update data
     * @return Updated user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<UserProfile> updateProfile(@RequestHeader("X-User-Id") String userId,
                                                     @Valid @RequestBody ProfileUpdateRequest request) {
        UserProfile profile = userService.updateUserProfile(UUID.fromString(userId), request);
        return ResponseEntity.ok(profile);
    }

    /**
     * Gets dashboard summary data for a user.
     * Includes current weight, progress percent, daily totals, etc.
     *
     * @param userId The user ID from header
     * @return Dashboard summary response
     */
    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(@RequestHeader("X-User-Id") String userId) {
        DashboardSummaryResponse summary = userService.getDashboardSummary(UUID.fromString(userId));
        return ResponseEntity.ok(summary);
    }

    /**
     * Gets the user's basic information.
     *
     * @param userId The user ID from header
     * @return User information
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestHeader("X-User-Id") String userId) {
        User user = userService.getUserById(UUID.fromString(userId));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("isPremium", user.isPremium());
        response.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(response);
    }
}