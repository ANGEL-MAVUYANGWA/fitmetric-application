package com.fitmetric.service;

import com.fitmetric.dto.request.LoginRequest;
import com.fitmetric.dto.request.ProfileUpdateRequest;
import com.fitmetric.dto.request.SignupRequest;
import com.fitmetric.dto.response.AuthResponse;
import com.fitmetric.dto.response.DashboardSummaryResponse;
import com.fitmetric.model.User;
import com.fitmetric.model.UserProfile;
import com.fitmetric.repository.UserRepository;
import com.fitmetric.repository.WeightLogRepository;
import com.fitmetric.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final WeightLogRepository weightLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse createUser(SignupRequest request) {
        log.info("Creating user with email: {}", request.getEmail());

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPremium(false);

        User savedUser = userRepository.save(user);
        log.info("User saved with ID: {}", savedUser.getId());

        // Create profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setAge(30);
        profile.setStartingWeight(80.0);
        profile.setTargetWeight(75.0);
        profile.setGoalType("lose");
        profile.setWeeklyWeightLossGoal(0.5);
        profile.setDailyCalorieGoal(2000);
        profile.setDailyWaterGoal(2500);
        profile.setHeightCm(175);
        profile.setGender("male");

        savedUser.setProfile(profile);
        userRepository.save(savedUser);
        log.info("Profile saved");

        // Generate token
        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());

        // Build response
        return AuthResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .token(token)
                .tokenType("Bearer")
                .premium(savedUser.isPremium())
                .expiresIn(System.currentTimeMillis() + 86400000)
                .build();
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .token(token)
                .tokenType("Bearer")
                .premium(user.isPremium())
                .expiresIn(System.currentTimeMillis() + 86400000)
                .build();
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public UserProfile updateUserProfile(UUID userId, ProfileUpdateRequest request) {
        User user = getUserById(userId);
        UserProfile profile = user.getProfile();

        if (profile == null) {
            throw new RuntimeException("User profile not found");
        }

        if (request.getName() != null) user.setName(request.getName());
        if (request.getAge() != null) profile.setAge(request.getAge());
        if (request.getStartingWeight() != null) profile.setStartingWeight(request.getStartingWeight());
        if (request.getTargetWeight() != null) profile.setTargetWeight(request.getTargetWeight());
        if (request.getGoalType() != null) profile.setGoalType(request.getGoalType());
        if (request.getWeeklyWeightLossGoal() != null) profile.setWeeklyWeightLossGoal(request.getWeeklyWeightLossGoal());
        if (request.getDailyCalorieGoal() != null) profile.setDailyCalorieGoal(request.getDailyCalorieGoal());
        if (request.getDailyWaterGoal() != null) profile.setDailyWaterGoal(request.getDailyWaterGoal());
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        if (request.getGender() != null) profile.setGender(request.getGender());

        userRepository.save(user);
        return profile;
    }

    @Transactional
    public void upgradeToPremium(UUID userId) {
        User user = getUserById(userId);
        user.setPremium(true);
        userRepository.save(user);
    }

    public DashboardSummaryResponse getDashboardSummary(UUID userId) {
        return DashboardSummaryResponse.builder()
                .currentWeight(80.0)
                .progressPercent(0.0)
                .todayCalories(0)
                .todayWater(0)
                .weeklyChange(0.0)
                .streakDays(0)
                .build();
    }
}