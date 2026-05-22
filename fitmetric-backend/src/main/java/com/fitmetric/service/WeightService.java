package com.fitmetric.service;

import com.fitmetric.dto.request.WeightLogRequest;
import com.fitmetric.model.User;
import com.fitmetric.model.WeightLog;
import com.fitmetric.repository.UserRepository;
import com.fitmetric.repository.WeightLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeightService {

    private final WeightLogRepository weightLogRepository;
    private final UserRepository userRepository;  // Use UserRepository directly

    @Transactional
    public WeightLog addWeightLog(UUID userId, WeightLogRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        WeightLog weightLog = WeightLog.builder()
                .user(user)
                .date(request.getDate())
                .weight(request.getWeight())
                .timeOfDay(request.getTimeOfDay())
                .note(request.getNote())
                .build();

        WeightLog saved = weightLogRepository.save(weightLog);
        log.info("Added weight log for user {}: {} kg on {}", userId, request.getWeight(), request.getDate());

        return saved;
    }

    public List<WeightLog> getUserWeightLogs(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return weightLogRepository.findByUserOrderByDateDesc(user);
    }

    public WeightLog getLatestWeightLog(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return weightLogRepository.findTopByUserOrderByDateDesc(user).orElse(null);
    }

    public List<WeightLog> getWeightLogsInDateRange(UUID userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return weightLogRepository.findByUserAndDateRange(user, startDate, endDate);
    }

    @Transactional
    public void deleteWeightLog(UUID userId, UUID logId) {
        WeightLog weightLog = weightLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Weight log not found"));

        if (!weightLog.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this log");
        }

        weightLogRepository.delete(weightLog);
        log.info("Deleted weight log {} for user {}", logId, userId);
    }

    public int calculateStreakDays(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        List<WeightLog> logs = weightLogRepository.findByUserOrderByDateDesc(user);

        if (logs.isEmpty()) {
            return 0;
        }

        int streak = 0;
        LocalDate expectedDate = LocalDate.now();

        for (WeightLog weightLog : logs) {
            if (weightLog.getDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else if (weightLog.getDate().equals(expectedDate.plusDays(1))) {
                // Same date, continue
            } else {
                break;
            }
        }

        return streak;
    }

    public double calculateWeeklyChange(UUID userId) {
        List<WeightLog> logs = getUserWeightLogs(userId);

        if (logs.size() < 2) {
            return 0.0;
        }

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);

        WeightLog oldestEntry = null;
        WeightLog newestEntry = null;

        for (WeightLog entry : logs) {
            if (oldestEntry == null && entry.getDate().isBefore(sevenDaysAgo)) {
                oldestEntry = entry;
            }
            if (newestEntry == null && entry.getDate().isAfter(sevenDaysAgo.minusDays(1))) {
                newestEntry = entry;
            }
        }

        if (oldestEntry == null && !logs.isEmpty()) {
            oldestEntry = logs.get(logs.size() - 1);
        }
        if (newestEntry == null && !logs.isEmpty()) {
            newestEntry = logs.get(0);
        }

        if (oldestEntry != null && newestEntry != null) {
            return newestEntry.getWeight() - oldestEntry.getWeight();
        }

        return 0.0;
    }
}