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
 * Body measurement entity for tracking physical body changes.
 *
 * This entity stores various body measurements that help users track
 * non-scale victories. Even when weight doesn't change significantly,
 * body measurements can show progress through body recomposition.
 *
 * Measurements are stored in centimeters.
 */
@Entity
@Table(name = "measurements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BodyMeasurement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate date;

    private Double waistCm;
    private Double chestCm;
    private Double hipsCm;
    private Double thighsCm;
    private Double armsCm;
    private Double neckCm;
    private LocalDateTime createdAt;

    /**
     * Sets the creation timestamp before persisting the entity.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}