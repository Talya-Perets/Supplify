package com.Supplify.Supplify.Services;

import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.Supplify.Supplify.entities.Supplier;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@AllArgsConstructor
public class SupplierService {

    private final SupplierRepo supplierRepo;
    private final BusinessSupplierRepo businessSupplierRepo;
    private final RestTemplate restTemplate; // Inject RestTemplate for API calls

    @Transactional
    public Supplier createSupplier(Supplier supplier, Integer businessId) {

        // Step 1: Save the supplier locally
        Supplier savedSupplier = supplierRepo.save(supplier);

        // Step 2: Link the supplier to the business
        BusinessSupplier businessSupplier = new BusinessSupplier(businessId, savedSupplier.getSupplierId());
        businessSupplierRepo.save(businessSupplier);

        // Step 3: Send supplier details to the external API
        String externalApiUrl = "https://api.example.com/suppliers"; // Replace with your API endpoint
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer YOUR_TOKEN"); // Add your token if needed
        headers.set("Content-Type", "application/json");

        HttpEntity<Supplier> requestEntity = new HttpEntity<>(supplier, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    externalApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Optional: Log or process the response
            System.out.println("External API Response: " + response.getBody());
        } catch (Exception e) {
            // Handle errors from the external API
            System.err.println("Failed to send supplier to external API: " + e.getMessage());
        }

        return savedSupplier;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepo.findAll();
    }

    public Supplier getSupplierById(Integer id) {
        return supplierRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
}
