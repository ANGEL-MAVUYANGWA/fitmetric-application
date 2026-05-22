package com.fitmetric.repository;

import com.fitmetric.model.BodyMeasurement;
import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for BodyMeasurement entity operations.
 *
 * Provides methods for retrieving body measurement history
 * for tracking physical changes over time.
 */
@Repository
public interface MeasurementRepository extends JpaRepository<BodyMeasurement, UUID> {

    /**
     * Retrieves all body measurements for a user, ordered by date descending.
     *
     * @param user The user entity
     * @return List of measurements (newest first)
     */
    List<BodyMeasurement> findByUserOrderByDateDesc(User user);

    /**
     * Finds measurements for a specific date.
     *
     * @param user The user entity
     * @param date The date to filter by
     * @return List of measurements for that date
     */
    List<BodyMeasurement> findByUserAndDate(User user, LocalDate date);
}