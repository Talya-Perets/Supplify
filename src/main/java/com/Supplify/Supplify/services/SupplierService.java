package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.CreateAgentRequest;
import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.Supplify.Supplify.entities.Supplier;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;


import java.util.List;

@Service
@AllArgsConstructor
public class SupplierService {

    private final SupplierRepo supplierRepo;
    private final BusinessSupplierRepo businessSupplierRepo;

    @Transactional
    public Supplier createSupplier(CreateAgentRequest request) {
        // Step 1: Save the supplier locally
        Supplier savedSupplier = supplierRepo.saveAndFlush(new Supplier(request.getCompanyName()));

        // Step 2: Link the supplier to the business
        BusinessSupplier businessSupplier = new BusinessSupplier(request.getBusinessId(), savedSupplier.getSupplierId());
        businessSupplierRepo.save(businessSupplier);
        return savedSupplier;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepo.findAll();
    }

    //public List<Supplier> getAllSuppliersbyBusinessId(Integer businessId) {
    // }

    public Supplier getSupplierById(Integer id) {
        return supplierRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    public List<Supplier> getSuppliersByBusinessId(Integer businessId) {
        List<BusinessSupplier> businessSuppliers = businessSupplierRepo.findByBusinessId(businessId);

        return businessSuppliers.stream()
                .map(bs -> supplierRepo.findById(bs.getSupplierId())
                        .orElseThrow(() -> new RuntimeException("Supplier not found")))
                .collect(Collectors.toList());
    }

    public void deleteSupplier(int id) {
        if (supplierRepo.existsById(id)) {
            supplierRepo.deleteById(id);
            System.out.println("Deleted supplier with ID: " + id); // Replace with logger if needed
        } else {
            throw new EntityNotFoundException("Supplier not found with ID: " + id);
        }
    }
}