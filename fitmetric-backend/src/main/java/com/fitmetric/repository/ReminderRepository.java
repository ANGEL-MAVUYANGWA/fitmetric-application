package com.fitmetric.repository;

import com.fitmetric.model.Reminder;
import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Reminder entity operations.
 *
 * Provides methods for retrieving active reminders
 * for a specific user.
 */
@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {

    /**
     * Retrieves all enabled reminders for a user.
     * Used by the notification system to determine which
     * reminders to process.
     *
     * @param user The user entity
     * @return List of enabled reminders
     */
    List<Reminder> findByUserAndEnabledTrue(User user);
}