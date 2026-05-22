package com.fitmetric.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Reminder entity for user-configurable notifications.
 *
 * Users can set custom reminders for various activities:
 * - Weigh-in reminders
 - Meal logging reminders
 * - Water intake reminders
 * - Supplement reminders
 *
 * The reminder system helps users build consistent health habits.
 */
@Entity
@Table(name = "reminders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String reminderTime;
    private String type;
    private Boolean enabled;
    private LocalDateTime createdAt;

    /**
     * Sets the creation timestamp and default values before persisting.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (enabled == null) {
            enabled = true;
        }
    }
}