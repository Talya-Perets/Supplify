package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.CreateSupplierRequest;
import com.Supplify.Supplify.services.SupplierService;
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

import java.util.List;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final Logger logger = LoggerFactory.getLogger(SupplierController.class);
    private final SupplierService supplierService;
    private final RestTemplate restTemplate;

    @Value("${external.api.url}")
    private String externalApiUrl;

    @Value("${external.api.token}")
    private String apiToken;

    @PostMapping("/createSupplier")
    public ResponseEntity<?> createSupplier(@RequestBody CreateSupplierRequest request) {
        logger.info("Received supplier creation request for business ID: {}", request.getBusinessId());

        try {
            Supplier createdSupplier = supplierService.createSupplier(request);
            return ResponseEntity.status(201).body(createdSupplier);
        } catch (Exception e) {
            logger.error("Error processing supplier creation", e);
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        logger.info("Fetching all suppliers");

        try {
            List<Supplier> suppliers = supplierService.getAllSuppliers();
            return ResponseEntity.ok(suppliers);
        } catch (Exception e) {
            logger.error("Error fetching suppliers", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierById(@PathVariable int id) {
        logger.info("Fetching supplier with ID: {}", id);

        try {
            Supplier supplier = supplierService.getSupplierById(id);
            return supplier != null ? ResponseEntity.ok(supplier) : ResponseEntity.status(404).body("Supplier not found");
        } catch (Exception e) {
            logger.error("Error fetching supplier", e);
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable int id) {
        logger.info("Deleting supplier with ID: {}", id);

        try {
            supplierService.deleteSupplier(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting supplier", e);
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @GetMapping("/external")
    public ResponseEntity<String> fetchFromExternalApi() {
        logger.info("Fetching data from external API");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(externalApiUrl, HttpMethod.GET, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            logger.error("Error fetching data from external API", e);
            return ResponseEntity.status(500).body("Failed to fetch external data");
        }
    }
}
