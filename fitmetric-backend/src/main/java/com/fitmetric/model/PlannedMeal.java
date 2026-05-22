package com.fitmetric.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Planned meal entity for weekly meal preparation.
 *
 * This entity stores pre-planned meals for each day of the week.
 * Users can generate meal plans using AI or create them manually.
 * The plan helps with grocery shopping and maintaining dietary consistency.
 *
 * Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
@Entity
@Table(name = "meal_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlannedMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer dayOfWeek;
    private String mealType;
    private String name;
    private Integer calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private String ingredients;
    private LocalDateTime createdAt;

    /**
     * Sets the creation timestamp before persisting the entity.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}