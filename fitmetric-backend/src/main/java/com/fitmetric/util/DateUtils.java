package com.fitmetric.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Utility class for date and time operations.
 *
 * Provides helper methods for common date manipulations
 * used throughout the application.
 */
public class DateUtils {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Private constructor to prevent instantiation.
     * This is a utility class with only static methods.
     */
    private DateUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Formats a LocalDate to a string in yyyy-MM-dd format.
     *
     * @param date The date to format
     * @return Formatted date string
     */
    public static String formatDate(LocalDate date) {
        return date.format(DATE_FORMATTER);
    }

    /**
     * Formats a LocalDateTime to a string in yyyy-MM-dd HH:mm:ss format.
     *
     * @param dateTime The datetime to format
     * @return Formatted datetime string
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DATETIME_FORMATTER);
    }

    /**
     * Parses a string to a LocalDate.
     *
     * @param dateString The date string in yyyy-MM-dd format
     * @return Parsed LocalDate
     */
    public static LocalDate parseDate(String dateString) {
        return LocalDate.parse(dateString, DATE_FORMATTER);
    }

    /**
     * Gets the start of the day (00:00) for a given date.
     *
     * @param date The date
     * @return LocalDateTime at the start of the day
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        return date.atStartOfDay();
    }

    /**
     * Gets the end of the day (23:59:59.999999999) for a given date.
     *
     * @param date The date
     * @return LocalDateTime at the end of the day
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        return date.atTime(23, 59, 59);
    }

    /**
     * Calculates the difference in days between two dates.
     *
     * @param startDate The start date
     * @param endDate The end date
     * @return Number of days between the dates
     */
    public static long daysBetween(LocalDate startDate, LocalDate endDate) {
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    /**
     * Generates a list of dates between two dates (inclusive).
     *
     * @param startDate The start date
     * @param endDate The end date
     * @return List of dates in the range
     */
    public static List<LocalDate> getDateRange(LocalDate startDate, LocalDate endDate) {
        long numDays = daysBetween(startDate, endDate);
        return Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(numDays + 1)
                .collect(Collectors.toList());
    }

    /**
     * Checks if a date is within a range.
     *
     * @param date The date to check
     * @param startDate The start of the range (inclusive)
     * @param endDate The end of the range (inclusive)
     * @return true if the date is within the range
     */
    public static boolean isWithinRange(LocalDate date, LocalDate startDate, LocalDate endDate) {
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }

    /**
     * Gets the current date as a string.
     *
     * @return Current date in yyyy-MM-dd format
     */
    public static String getCurrentDateString() {
        return formatDate(LocalDate.now());
    }

    /**
     * Gets the current date and time as a string.
     *
     * @return Current datetime in yyyy-MM-dd HH:mm:ss format
     */
    public static String getCurrentDateTimeString() {
        return formatDateTime(LocalDateTime.now());
    }
}