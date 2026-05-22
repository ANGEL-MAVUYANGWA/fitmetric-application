package com.fitmetric.repository;

import com.fitmetric.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity operations.
 *
 * This interface extends JpaRepository which provides CRUD operations
 * and pagination capabilities. Spring Data JPA automatically implements
 * these methods based on the method naming convention.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds a user by their email address.
     * Email is unique in the system, so this returns at most one result.
     *
     * @param email The user's email address
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user with the given email already exists.
     * Used during signup to prevent duplicate accounts.
     *
     * @param email The email address to check
     * @return true if a user with this email exists
     */
    boolean existsByEmail(String email);
}