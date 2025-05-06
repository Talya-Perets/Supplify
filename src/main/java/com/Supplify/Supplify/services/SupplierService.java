package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.CreateAgentRequest;
import com.Supplify.Supplify.DTO.CreateSupplierRequest;
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
    private final AgentService agentService;

    @Transactional
    public void createSupplier(CreateSupplierRequest request) throws Exception {
        Supplier newSupplier = new Supplier(request.getCompanyName());
        supplierRepo.saveAndFlush(newSupplier);

        CreateAgentRequest agentRequest = new CreateAgentRequest();
        agentRequest.setSupplierId(newSupplier.getSupplierId());
        agentRequest.setBusinessId(request.getBusinessId());
        agentRequest.setName(request.getName());
        agentRequest.setEmail(request.getEmail());
        agentRequest.setPhone(request.getPhone());

        agentService.createAgent(agentRequest);

    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepo.findAll();
    }


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