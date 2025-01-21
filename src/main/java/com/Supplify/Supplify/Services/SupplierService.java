package com.Supplify.Supplify.Services;
import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.Supplify.Supplify.entities.Supplier;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
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
    public Supplier createSupplier(Supplier supplier, Integer businessId) {
        // Step 1: Save the supplier locally
        Supplier savedSupplier = supplierRepo.save(supplier);

        // Step 2: Link the supplier to the business
        BusinessSupplier businessSupplier = new BusinessSupplier(businessId, savedSupplier.getSupplierId());
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
        List<Integer> supplierIds = businessSupplierRepo.findSupplierIdsByBusinessId(businessId);
        return supplierIds.stream()
                .map(supplierId -> supplierRepo.findById(supplierId)
                        .orElseThrow(() -> new RuntimeException("Supplier not found")))
                .collect(Collectors.toList());
    }

}