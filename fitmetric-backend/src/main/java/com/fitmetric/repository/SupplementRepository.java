package com.fitmetric.repository;

import com.fitmetric.model.Supplement;
import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Supplement entity operations.
 *
 * Provides methods for managing user supplement stacks.
 */
@Repository
public interface SupplementRepository extends JpaRepository<Supplement, UUID> {

    /**
     * Retrieves all supplements for a user.
     *
     * @param user The user entity
     * @return List of supplements in the user's stack
     */
    List<Supplement> findByUser(User user);
}