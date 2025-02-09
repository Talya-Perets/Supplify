package com.Supplify.Supplify.services;

import com.Supplify.Supplify.entities.Agent;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.AgentRepo;
import com.Supplify.Supplify.utils.EmailValidator;
import com.Supplify.Supplify.utils.PhoneValidator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AgentService {

    private final Logger logger = LoggerFactory.getLogger(AgentService.class);
    private final AgentRepo agentRepo;
    private final SupplierService supplierService;

    public Agent createAgent(String id, int supplierId, String name, String email, int phone) {
        logger.info("Creating new Agent");

        try {
            logger.info("Starting validation for agent creation");

            if (!EmailValidator.isValidEmail(email)) {
                logger.error("Invalid email format: {}", email);
                throw new IllegalArgumentException("Email address is not valid.");
            }

            if (!PhoneValidator.isValidLocalIsraeliMobile(String.valueOf(phone))) {
                logger.error("Invalid phone number format: {}", phone);
                throw new IllegalArgumentException("Phone number is not valid.");
            }

            Supplier supplier = supplierService.getSupplierById(supplierId);
            Agent agent = new Agent(id, supplier, name, email, phone);
            agent = agentRepo.saveAndFlush(agent);
            logger.info("Successfully created a new agent with ID: {}", agent.getId());

            return agent;
        } catch (Exception e) {
            logger.error("Failed to create a new agent: {}", e.getMessage(), e);
            throw e;
        }
    }
}
