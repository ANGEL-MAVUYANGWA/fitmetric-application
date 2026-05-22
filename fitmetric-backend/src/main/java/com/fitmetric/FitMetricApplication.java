package com.fitmetric;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main application class for FitMetric Pro Backend.
 *
 * This class serves as the entry point for the Spring Boot application.
 * It bootstraps the application with all necessary configurations including:
 * - Transaction management for database operations
 * - Asynchronous processing for improved performance
 * - Scheduled tasks for background jobs
 * - Caching for frequently accessed data
 *
 * @author FitMetric Team
 * @version 1.0.0
 */
@SpringBootApplication(
        scanBasePackages = "com.fitmetric"  // Explicitly define component scan base package
)
@EnableTransactionManagement      // Enables Spring's annotation-driven transaction management
@EnableAsync                      // Enables asynchronous method execution
@EnableScheduling                 // Enables scheduled task execution
@EnableCaching                    // Enables Spring's cache abstraction
public class FitMetricApplication {

    /**
     * Entry point for the FitMetric Pro backend application.
     *
     * This method starts the embedded Tomcat server and initializes
     * all Spring beans, configurations, and dependencies.
     *
     * @param args Command line arguments passed to the application
     */
    public static void main(String[] args) {
        // Launch the Spring Boot application
        SpringApplication.run(FitMetricApplication.class, args);

        // Display startup banner in the console
        printStartupBanner();
    }

    /**
     * Prints a formatted startup banner to the console.
     * This helps developers confirm that the application started successfully
     * and shows the server URL for easy access.
     */
    private static void printStartupBanner() {
        String border = "=========================================";
        String line1 = "  FitMetric Pro Backend Started!";
        String line2 = "  Server: http://localhost:5000";
        String line3 = "  API Docs: http://localhost:5000/swagger-ui.html";

        System.out.println(border);
        System.out.println(line1);
        System.out.println(line2);
        System.out.println(line3);
        System.out.println(border);
    }
}