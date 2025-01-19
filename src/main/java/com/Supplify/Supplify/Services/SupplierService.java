package com.Supplify.Supplify.Services;

import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.Supplify.Supplify.repositories.BusinessSupplier_Repo;
import com.Supplify.Supplify.repositories.BusinessRepo;
import com.Supplify.Supplify.entities.Supplier;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class SupplierService {
    private final SupplierRepo supplierRepo;
    private final BusinessSupplier_Repo businessSupplierRepo;  // Added this repository

    public void createSupplier(Supplier supplier, Integer businessId) {
        // First save the supplier
        Supplier savedSupplier = supplierRepo.save(supplier);
        // Create and save the business-supplier relationship
        BusinessSupplier businessSupplier = new BusinessSupplier(businessId, savedSupplier.getSupplierId());
        businessSupplierRepo.save(businessSupplier);
    }
}