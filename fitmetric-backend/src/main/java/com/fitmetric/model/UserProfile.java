package com.fitmetric.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * User profile entity containing health and goal settings.
 * This is a one-to-one relationship with the User entity.
 */
@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private Integer age;
    private Double startingWeight;
    private Double targetWeight;
    private String goalType;
    private Double weeklyWeightLossGoal;
    private Integer dailyCalorieGoal;
    private Integer dailyWaterGoal;
    private Integer heightCm;
    private String gender;
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}