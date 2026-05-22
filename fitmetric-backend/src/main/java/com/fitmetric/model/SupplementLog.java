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
 * Supplement log entity for tracking when supplements are taken.
 *
 * This entity records daily adherence to supplement protocols.
 * It helps users maintain consistency and track their compliance
 * with medication or vitamin regimens.
 */
@Entity
@Table(name = "supplement_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplementLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplement_id", nullable = false)
    private Supplement supplement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate date;

    private Boolean taken;
    private LocalDateTime createdAt;

    /**
     * Sets the creation timestamp and default values before persisting.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (taken == null) {
            taken = true;
        }
    }
}