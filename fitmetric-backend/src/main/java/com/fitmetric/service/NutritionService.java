package com.fitmetric.service;

import com.fitmetric.dto.request.NutritionEntryRequest;
import com.fitmetric.model.NutritionEntry;
import com.fitmetric.model.User;
import com.fitmetric.repository.NutritionRepository;
import com.fitmetric.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for nutrition tracking business logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NutritionService {

    private final NutritionRepository nutritionRepository;
    private final UserRepository userRepository;  // Use UserRepository directly instead of UserService

    @Transactional
    public NutritionEntry addNutritionEntry(UUID userId, NutritionEntryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        NutritionEntry entry = NutritionEntry.builder()
                .user(user)
                .date(request.getDate())
                .name(request.getName())
                .calories(request.getCalories())
                .protein(request.getProtein() != null ? request.getProtein() : 0.0)
                .carbs(request.getCarbs() != null ? request.getCarbs() : 0.0)
                .fat(request.getFat() != null ? request.getFat() : 0.0)
                .build();

        NutritionEntry saved = nutritionRepository.save(entry);
        log.info("Added nutrition entry for user {}: {} ({} calories)", userId, request.getName(), request.getCalories());

        return saved;
    }

    public List<NutritionEntry> getUserNutritionEntries(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return nutritionRepository.findByUserOrderByDateDesc(user);
    }

    public List<NutritionEntry> getEntriesForDate(UUID userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return nutritionRepository.findByUserAndDate(user, date);
    }

    public Integer getTotalCaloriesForDate(UUID userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return nutritionRepository.getTotalCaloriesForDate(user, date);
    }

    public List<NutritionEntry> getEntriesInDateRange(UUID userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return nutritionRepository.findByUserAndDateRange(user, startDate, endDate);
    }

    @Transactional
    public void deleteNutritionEntry(UUID userId, UUID entryId) {
        NutritionEntry entry = nutritionRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Nutrition entry not found"));

        if (!entry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this entry");
        }

        nutritionRepository.delete(entry);
        log.info("Deleted nutrition entry {} for user {}", entryId, userId);
    }
}