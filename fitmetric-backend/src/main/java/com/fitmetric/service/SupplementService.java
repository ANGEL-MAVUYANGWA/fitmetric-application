package com.fitmetric.service;

import com.fitmetric.dto.request.SupplementRequest;
import com.fitmetric.model.Supplement;
import com.fitmetric.model.SupplementLog;
import com.fitmetric.model.User;
import com.fitmetric.repository.SupplementLogRepository;
import com.fitmetric.repository.SupplementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service layer for supplement and medication tracking business logic.
 * Handles managing supplement stacks and logging daily adherence.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SupplementService {

    private final SupplementRepository supplementRepository;
    private final SupplementLogRepository supplementLogRepository;
    private final UserService userService;

    /**
     * Adds a new supplement to the user's stack.
     *
     * @param userId The user's unique identifier
     * @param request The supplement data (name, dosage, type, etc.)
     * @return Created Supplement entity
     */
    @Transactional
    public Supplement addSupplement(UUID userId, SupplementRequest request) {
        User user = userService.getUserById(userId);

        Supplement supplement = Supplement.builder()
                .user(user)
                .name(request.getName())
                .dosage(request.getDosage())
                .type(request.getType())
                .purpose(request.getPurpose())
                .frequency(request.getFrequency())
                .build();

        Supplement savedSupplement = supplementRepository.save(supplement);
        log.info("Added supplement '{}' for user {}", request.getName(), userId);

        return savedSupplement;
    }

    /**
     * Retrieves all supplements in the user's stack.
     *
     * @param userId The user's unique identifier
     * @return List of supplements
     */
    public List<Supplement> getUserSupplements(UUID userId) {
        User user = userService.getUserById(userId);
        return supplementRepository.findByUser(user);
    }

    /**
     * Deletes a supplement from the user's stack.
     *
     * @param userId The user's unique identifier
     * @param supplementId The supplement ID to delete
     */
    @Transactional
    public void deleteSupplement(UUID userId, UUID supplementId) {
        Supplement supplement = supplementRepository.findById(supplementId)
                .orElseThrow(() -> new RuntimeException("Supplement not found"));

        if (!supplement.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this supplement");
        }

        supplementRepository.delete(supplement);
        log.info("Deleted supplement {} for user {}", supplementId, userId);
    }

    /**
     * Logs that a supplement was taken on a specific date.
     *
     * @param userId The user's unique identifier
     * @param supplementId The supplement ID
     * @param date The date when taken
     * @return Created SupplementLog entity
     */
    @Transactional
    public SupplementLog logSupplement(UUID userId, UUID supplementId, LocalDate date) {
        User user = userService.getUserById(userId);
        Supplement supplement = supplementRepository.findById(supplementId)
                .orElseThrow(() -> new RuntimeException("Supplement not found"));

        // Check if already logged for this date
        SupplementLog existingLogEntry = supplementLogRepository.findBySupplementAndDate(supplement, date).orElse(null);
        if (existingLogEntry != null) {
            log.warn("Supplement {} already logged for date {}", supplementId, date);
            return existingLogEntry;
        }

        SupplementLog supplementLogEntry = SupplementLog.builder()
                .user(user)
                .supplement(supplement)
                .date(date)
                .taken(true)
                .build();

        SupplementLog savedLogEntry = supplementLogRepository.save(supplementLogEntry);
        log.info("Logged supplement {} as taken for user {} on {}", supplementId, userId, date);

        return savedLogEntry;
    }

    /**
     * Removes a supplement log (undoes the taken status).
     *
     * @param userId The user's unique identifier
     * @param logId The supplement log ID to remove
     */
    @Transactional
    public void unlogSupplement(UUID userId, UUID logId) {
        SupplementLog supplementLogEntry = supplementLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Supplement log not found"));

        if (!supplementLogEntry.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this log");
        }

        supplementLogRepository.delete(supplementLogEntry);
        log.info("Removed supplement log {} for user {}", logId, userId);
    }

    /**
     * Gets supplements logged for a specific date.
     *
     * @param userId The user's unique identifier
     * @param date The date to query
     * @return List of supplement logs for that date
     */
    public List<SupplementLog> getLogsForDate(UUID userId, LocalDate date) {
        User user = userService.getUserById(userId);
        return supplementLogRepository.findByUserAndDate(user, date);
    }

    /**
     * Gets today's supplement logs.
     *
     * @param userId The user's unique identifier
     * @return List of supplements taken today
     */
    public List<SupplementLog> getTodayLogs(UUID userId) {
        return getLogsForDate(userId, LocalDate.now());
    }

    /**
     * Checks if a specific supplement was taken today.
     *
     * @param userId The user's unique identifier
     * @param supplementId The supplement ID to check
     * @return true if taken today
     */
    public boolean isSupplementTakenToday(UUID userId, UUID supplementId) {
        User user = userService.getUserById(userId);
        Supplement supplement = supplementRepository.findById(supplementId)
                .orElseThrow(() -> new RuntimeException("Supplement not found"));

        return supplementLogRepository.findBySupplementAndDate(supplement, LocalDate.now()).isPresent();
    }

    /**
     * Calculates the user's supplement adherence rate over a period.
     *
     * @param userId The user's unique identifier
     * @param days Number of days to look back
     * @return Adherence percentage (0-100)
     */
    public double getAdherenceRate(UUID userId, int days) {
        List<Supplement> supplements = getUserSupplements(userId);
        if (supplements.isEmpty()) {
            return 100.0;
        }

        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        int totalExpected = supplements.size() * days;
        int actualTaken = 0;

        for (Supplement supplement : supplements) {
            for (int i = 0; i < days; i++) {
                LocalDate date = startDate.plusDays(i);
                if (supplementLogRepository.findBySupplementAndDate(supplement, date).isPresent()) {
                    actualTaken++;
                }
            }
        }

        return totalExpected > 0 ? (double) actualTaken / totalExpected * 100 : 100.0;
    }
}