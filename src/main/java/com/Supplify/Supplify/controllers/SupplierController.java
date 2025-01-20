package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.Services.SupplierService;
import com.Supplify.Supplify.entities.Supplier;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private static final Logger logger = LoggerFactory.getLogger(SupplierController.class);

    private final SupplierService supplierService;
    private final RestTemplate restTemplate;

    @Value("${external.api.url}")
    private String externalApiUrl;

    @Value("${external.api.token}")
    private String apiToken;

    @PostMapping("/business/{businessId}")
    public ResponseEntity<?> createSupplier(
            @RequestBody Supplier supplier,
            @PathVariable Integer businessId) {

        logger.info("Received supplier creation request for business ID: {}", businessId);

        try {
            validateSupplier(supplier);
            Supplier createdSupplier = supplierService.createSupplier(supplier, businessId);

            // Only attempt to send to external API if URL is configured
            if (externalApiUrl != null && !externalApiUrl.isEmpty()) {
                sendToExternalApi(createdSupplier);
            } else {
                logger.warn("External API URL not configured. Skipping external API sync.");
            }

            return ResponseEntity.status(201).body(createdSupplier);

        } catch (ValidationException e) {
            logger.warn("Validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing supplier creation", e);
            return ResponseEntity.status(500)
                    .body("Internal Server Error: " + e.getMessage());
        }
    }

    private void validateSupplier(Supplier supplier) throws ValidationException {
        if (supplier.getCompanyName() == null || supplier.getCompanyName().isEmpty()) {
            throw new ValidationException("Supplier company name is required");
        }
        if (supplier.getContactPerson() == null || supplier.getContactPerson().isEmpty()) {
            throw new ValidationException("Contact person is required");
        }
        if (supplier.getEmail() == null || supplier.getEmail().isEmpty()
                || !supplier.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new ValidationException("Valid email is required");
        }
        if (supplier.getPhone() == null || supplier.getPhone().isEmpty()) {
            throw new ValidationException("Phone number is required");
        }
    }

    private void sendToExternalApi(Supplier supplier) {
        // Skip if URL is still the placeholder
        if (externalApiUrl.contains("your-real-api-endpoint")) {
            logger.info("Skipping external API call - placeholder URL detected");
            return;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiToken);
        headers.set("Content-Type", "application/json");

        HttpEntity<Supplier> requestEntity = new HttpEntity<>(supplier, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    externalApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
            logger.info("Supplier sent to external API. Response status: {}",
                    response.getStatusCode());
        } catch (Exception e) {
            logger.error("Failed to send supplier to external API: {}", e.getMessage(), e);
        }
    }
    private static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }
}