package com.fitmetric.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Nutrition entry entity for tracking food and calorie consumption.
 *
 * This entity stores detailed nutritional information for each meal or snack,
 * including calories, protein, carbohydrates, and fats.
 * Used for daily calorie tracking and macro nutrient analysis.
 */
@Entity
@Table(name = "nutrition_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate date;

    private String name;
    private Integer calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private LocalDateTime createdAt;

    /**
     * Sets the creation timestamp before persisting the entity.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}