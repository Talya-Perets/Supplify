package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.DTO.CreateAgentRequest;
import com.Supplify.Supplify.entities.Agent;
import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.AgentRepo;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AgentService {

    private final SupplierRepo supplierRepository;
    private final AgentRepo agentRepository;
    private final BusinessSupplierRepo businessSupplierRepository;

    public AgentService(SupplierRepo supplierRepository, AgentRepo agentRepository, BusinessSupplierRepo businessSupplierRepository) {
        this.supplierRepository = supplierRepository;
        this.agentRepository = agentRepository;
        this.businessSupplierRepository = businessSupplierRepository;
    }

    @Transactional
    public void createAgent(CreateAgentRequest request) {
        // **Step 1: Retrieve or create a new Supplier**
        Supplier supplier = supplierRepository.findByCompanyName(request.getCompanyName())
                .orElseGet(() -> {
                    Supplier newSupplier = new Supplier(request.getCompanyName());
                    return supplierRepository.save(newSupplier);
                });

        // **Step 2: Create and save a new Agent**
        Agent agent = new Agent();
        agent.setSupplier(supplier);
        agent.setName(request.getName());
        agent.setEmail(request.getEmail());
        agent.setPhone(request.getPhone());
        agent = agentRepository.save(agent); // Save the agent in the database

        // **Step 3: Create and save a BusinessSupplier entry**
        BusinessSupplier businessSupplier = new BusinessSupplier();
        businessSupplier.setSupplierId(agent.getId()); // Associate the agent ID
        businessSupplier.setBusinessId(request.getBusinessId());
        businessSupplierRepository.save(businessSupplier);
    }

    public List<SupplierDetailsResponse> getAgentsByBusinessId(int businessId) {
        // Retrieve all agent IDs associated with the given business
        List<Integer> agentIds = businessSupplierRepository.findByBusinessId(businessId)
                .stream()
                .map(BusinessSupplier::getSupplierId) // This refers to the Agent ID
                .toList();

        List<SupplierDetailsResponse> responseList = new ArrayList<>();

        // Iterate through agent IDs and fetch agent details
        for (Integer id : agentIds) {
            agentRepository.findById(id).ifPresent(agent -> {
                int supplierId = agent.getSupplier().getSupplierId(); // Retrieve supplier ID from Agent

                // Fetch the company name from the Supplier table
                String companyName = supplierRepository.findById(supplierId)
                        .map(Supplier::getCompanyName)
                        .orElse("Unknown"); // Default to "Unknown" if not found

                // Create response object with agent details
                SupplierDetailsResponse response = new SupplierDetailsResponse(
                        agent.getName(),
                        agent.getEmail(),
                        agent.getPhone(),
                        companyName
                );
                responseList.add(response);
            });
        }

        return responseList;
    }
}
