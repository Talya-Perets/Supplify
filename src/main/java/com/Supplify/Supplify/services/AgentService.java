package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.DTO.CreateAgentRequest;
import com.Supplify.Supplify.entities.Agent;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.AgentRepo;
import com.Supplify.Supplify.repositories.BusinessRepo;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AgentService {

    private final SupplierRepo supplierRepo;
    private final AgentRepo agentRepository;
    private final BusinessRepo businessRepo;
    private final BusinessSupplierRepo businessSupplierRepository;

    @Transactional
    public void createAgent(CreateAgentRequest request) throws Exception {
        Supplier supplier = supplierRepo.findById(request.getSupplierId()).orElse(null);
        if (supplier == null) {
            throw new Exception("Supplier not found");
        }
        Agent newAgent = new Agent();
        newAgent.setSupplier(supplier);
        newAgent.setName(request.getName());
        newAgent.setEmail(request.getEmail());
        newAgent.setPhone(request.getPhone());
        Agent agent = agentRepository.saveAndFlush(newAgent);

        Business business = businessRepo.findById(request.getBusinessId()).orElse(null);
        if (business == null) {
            throw new Exception("Business not found");
        }

        business.getAgents().add(agent);
        businessRepo.saveAndFlush(business);
    }
}
