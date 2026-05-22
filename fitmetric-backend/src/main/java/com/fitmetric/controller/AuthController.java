package com.fitmetric.controller;

import com.fitmetric.dto.request.LoginRequest;
import com.fitmetric.dto.request.SignupRequest;
import com.fitmetric.dto.response.AuthResponse;
import com.fitmetric.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for authentication operations.
 * Handles user registration, login, and premium upgrades.
 * These endpoints are publicly accessible.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Registers a new user account.
     * Creates a user with default profile settings.
     *
     * @param request Signup request with email, password, and name
     * @return Authentication response with JWT token
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = userService.createUser(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Authenticates an existing user.
     * Validates credentials and returns JWT token.
     *
     * @param request Login request with email and password
     * @return Authentication response with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Upgrades a user to premium membership.
     * Requires authentication.
     *
     * @param userId The user ID from header
     * @return Success response
     */
    @PostMapping("/upgrade")
    public ResponseEntity<Map<String, Object>> upgradePremium(@RequestHeader("X-User-Id") String userId) {
        userService.upgradeToPremium(UUID.fromString(userId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Successfully upgraded to premium");
        return ResponseEntity.ok(response);
    }
}