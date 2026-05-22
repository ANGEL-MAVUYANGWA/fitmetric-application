package com.fitmetric.controller;

import com.fitmetric.dto.request.SupplementRequest;
import com.fitmetric.model.Supplement;
import com.fitmetric.model.SupplementLog;
import com.fitmetric.service.SupplementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for supplement and medication tracking operations.
 * Handles managing supplement stacks and logging daily adherence.
 */
@RestController
@RequestMapping("/api/supplements")
@RequiredArgsConstructor
public class SupplementController {

    private final SupplementService supplementService;

    /**
     * Adds a new supplement to the user's stack.
     *
     * @param userId The user ID from header
     * @param request Supplement data (name, dosage, type, etc.)
     * @return Created supplement
     */
    @PostMapping
    public ResponseEntity<Supplement> addSupplement(@RequestHeader("X-User-Id") String userId,
                                                    @Valid @RequestBody SupplementRequest request) {
        Supplement supplement = supplementService.addSupplement(UUID.fromString(userId), request);
        return ResponseEntity.ok(supplement);
    }

    /**
     * Retrieves all supplements in the user's stack.
     *
     * @param userId The user ID from header
     * @return List of supplements
     */
    @GetMapping
    public ResponseEntity<List<Supplement>> getSupplements(@RequestHeader("X-User-Id") String userId) {
        List<Supplement> supplements = supplementService.getUserSupplements(UUID.fromString(userId));
        return ResponseEntity.ok(supplements);
    }

    /**
     * Deletes a supplement from the user's stack.
     *
     * @param userId The user ID from header
     * @param supplementId The supplement ID to delete
     * @return Success response
     */
    @DeleteMapping("/{supplementId}")
    public ResponseEntity<Map<String, Object>> deleteSupplement(@RequestHeader("X-User-Id") String userId,
                                                                @PathVariable String supplementId) {
        supplementService.deleteSupplement(UUID.fromString(userId), UUID.fromString(supplementId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    /**
     * Logs that a supplement was taken on a specific date.
     *
     * @param userId The user ID from header
     * @param supplementId The supplement ID
     * @param date The date taken (YYYY-MM-DD)
     * @return Created supplement log
     */
    @PostMapping("/{supplementId}/log")
    public ResponseEntity<SupplementLog> logSupplement(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String supplementId,
            @RequestParam String date) {
        SupplementLog log = supplementService.logSupplement(
                UUID.fromString(userId),
                UUID.fromString(supplementId),
                LocalDate.parse(date));
        return ResponseEntity.ok(log);
    }

    /**
     * Removes a supplement log (undoes taken status).
     *
     * @param userId The user ID from header
     * @param logId The log ID to remove
     * @return Success response
     */
    @DeleteMapping("/log/{logId}")
    public ResponseEntity<Map<String, Object>> unlogSupplement(@RequestHeader("X-User-Id") String userId,
                                                               @PathVariable String logId) {
        supplementService.unlogSupplement(UUID.fromString(userId), UUID.fromString(logId));

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    /**
     * Gets supplements logged for a specific date.
     *
     * @param userId The user ID from header
     * @param date The date to query (YYYY-MM-DD)
     * @return List of supplement logs
     */
    @GetMapping("/logs")
    public ResponseEntity<List<SupplementLog>> getLogsForDate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String date) {
        List<SupplementLog> logs = supplementService.getLogsForDate(
                UUID.fromString(userId),
                LocalDate.parse(date));
        return ResponseEntity.ok(logs);
    }

    /**
     * Gets today's supplement logs.
     *
     * @param userId The user ID from header
     * @return List of supplements taken today
     */
    @GetMapping("/today")
    public ResponseEntity<List<SupplementLog>> getTodayLogs(@RequestHeader("X-User-Id") String userId) {
        List<SupplementLog> logs = supplementService.getTodayLogs(UUID.fromString(userId));
        return ResponseEntity.ok(logs);
    }

    /**
     * Gets the user's supplement adherence rate.
     *
     * @param userId The user ID from header
     * @param days Number of days to look back
     * @return Adherence percentage
     */
    @GetMapping("/adherence")
    public ResponseEntity<Map<String, Object>> getAdherenceRate(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "30") int days) {
        double rate = supplementService.getAdherenceRate(UUID.fromString(userId), days);

        Map<String, Object> response = new HashMap<>();
        response.put("adherenceRate", rate);
        response.put("daysAnalyzed", days);
        return ResponseEntity.ok(response);
    }
}