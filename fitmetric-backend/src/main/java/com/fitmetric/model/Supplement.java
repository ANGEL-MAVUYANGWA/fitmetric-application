package com.fitmetric.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supplement entity for tracking vitamins, medications, and supplements.
 *
 * Users can create a custom stack of supplements they take regularly.
 * This includes vitamins, prescription medications, and over-the-counter supplements.
 * Each supplement has a dosage, type, purpose, and frequency.
 */
@Entity
@Table(name = "supplements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String dosage;
    private String type;
    private String purpose;
    private String frequency;
    private LocalDateTime createdAt;

    /**
     * Sets the creation timestamp before persisting the entity.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}