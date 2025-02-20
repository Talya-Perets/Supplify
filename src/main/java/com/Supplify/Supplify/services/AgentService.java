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
        // **שלב 1: קבלת או יצירת ספק (`Supplier`)**
        Supplier supplier = supplierRepository.findByCompanyName(request.getCompanyName())
                .orElseGet(() -> {
                    Supplier newSupplier = new Supplier(request.getCompanyName());
                    return supplierRepository.save(newSupplier);
                });

        // **שלב 2: יצירת `Agent` חדש ושמירתו**
        Agent agent = new Agent();
        agent.setSupplier(supplier);
        agent.setName(request.getName());
        agent.setEmail(request.getEmail());
        agent.setPhone(request.getPhone());
        agent = agentRepository.save(agent); // שמירת הסוכן במסד הנתונים

        BusinessSupplier businessSupplier = new BusinessSupplier();
        businessSupplier.setSupplierId(agent.getId()); // עכשיו ה-ID יהיה נכון
        businessSupplier.setBusinessId(request.getBusinessId());
        businessSupplierRepository.save(businessSupplier);

    }



    }
