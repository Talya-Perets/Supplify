package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.Services.SupplierService;
import com.Supplify.Supplify.entities.Supplier;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@AllArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping("/business/{businessId}")
    public ResponseEntity<?> createSupplier(
            @RequestBody Supplier supplier,
            @PathVariable Integer businessId) {

        // Log the incoming supplier data (for debugging)
        System.out.println("Received supplier: " + supplier);

        try {
            // Manual validation of the supplier object
            if (supplier.getCompanyName() == null || supplier.getCompanyName().isEmpty()) {
                return ResponseEntity.status(400).body("Supplier company name is required");
            }

            if (supplier.getContactPerson() == null || supplier.getContactPerson().isEmpty()) {
                return ResponseEntity.status(400).body("Contact person is required");
            }

            if (supplier.getEmail() == null || supplier.getEmail().isEmpty() || !supplier.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.status(400).body("Valid email is required");
            }

            if (supplier.getPhone() == null || supplier.getPhone().isEmpty()) {
                return ResponseEntity.status(400).body("Phone number is required");
            }

            // Call the service to create the supplier
            Supplier createdSupplier = supplierService.createSupplier(supplier, businessId);

            // Return the created supplier along with the status
            return ResponseEntity.status(201).body(createdSupplier);  // HTTP 201 Created

        } catch (Exception e) {
            // Log the error
            e.printStackTrace();  // Print stack trace for debugging purposes
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}
