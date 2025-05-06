package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.AgentDTO;
import com.Supplify.Supplify.DTO.BusinessProductDTO;
import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.entities.Agent;
import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.AgentRepo;
import com.Supplify.Supplify.repositories.BusinessProductRepo;
import com.Supplify.Supplify.repositories.ProductRepo;
import com.Supplify.Supplify.utils.EmailValidator;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.repositories.BusinessRepo;
import com.Supplify.Supplify.utils.PhoneValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BusinessService {

    private final Logger logger = LogManager.getLogger(BusinessService.class);
    private final BusinessRepo businessRepo;
    private final UserService userService;
    private final AgentRepo agentRepo;
    private final ProductRepo productRepo;
    final BusinessProductRepo businessProductRepo;

    public Business getBusinessById(int id) {
        return businessRepo.findById(id).orElse(null);
    }

    public Business createBusiness(String name, String email, String address, String phone) {
        logger.info("Creating new Business");

        try {
            logger.info("Starting validation for business creation");

            if (!EmailValidator.isValidEmail(email)) {
                logger.error("Invalid email format: {}", email);
                throw new IllegalArgumentException("Email address is not valid.");
            }

            if (userService.isEmailAlreadyUsed(email)) {
                logger.error("Email already in use: {}", email);
                throw new IllegalArgumentException("Email is already registered.");
            }

            if (phone != null && !phone.isEmpty()) {
                if (!PhoneValidator.isValidLocalIsraeliMobile(phone)) {
                    logger.error("Invalid phone number format: {}", phone);
                    throw new IllegalArgumentException("Phone number is not valid.");
                }
            }

            Business business = businessRepo.saveAndFlush(new Business(name, email, address, phone));
            logger.info("Successfully created a new business with ID: {}", business.getId());
            return business;
        } catch (Exception e) {
            logger.error("Failed to create a new business: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<SupplierDetailsResponse> getBusinessSuppliersDetails(int businessId) throws Exception {

        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new Exception("Business not found"));

        return business.getAgents().stream()
                .map(agent -> new SupplierDetailsResponse(
                        new AgentDTO(agent.getId(), agent.getName(), agent.getPhone(), agent.getEmail()),
                        agent.getSupplier().getCompanyName()))
                .collect(Collectors.toList());
    }

    public List<Supplier> getBusinessSuppliers(int businessId) throws Exception {
        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new Exception("Business not found"));

        return business.getAgents().stream().map(Agent::getSupplier).collect(Collectors.toList());
    }

    @Transactional
    public void removeAgentAndRelatedProducts(int businessId, int agentId) throws Exception {
        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new Exception("Business not found"));

        Agent agent = agentRepo.findById(agentId)
                .orElseThrow(() -> new Exception("Agent not found"));

        if (!business.getAgents().contains(agent)) {
            throw new Exception("Agent is not associated with this business");
        }

        business.getAgents().remove(agent);
        businessRepo.saveAndFlush(business);

        // Delete all business products where the product belongs to the agent's supplier
        List<Product> productsFromSupplier = productRepo.findBySupplier(agent.getSupplier());
        businessProductRepo.deleteByBusinessIdAndProductIn(businessId, productsFromSupplier);
    }

    public void updateAgent(int businessId, Agent updatedAgent) throws Exception {
        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new Exception("Business not found"));

        logger.info("Updating agent with ID: {}", updatedAgent.getId());
        List<Agent> updatedAgents = business.getAgents().stream()
                .map(agent -> {
                    if (agent.getId() == (updatedAgent.getId())) {
                        agent.setName(updatedAgent.getName());
                        agent.setPhone(updatedAgent.getPhone());
                        agent.setEmail(updatedAgent.getEmail());
                    }
                    return agent;
                })
                .collect(Collectors.toList());

        business.setAgents(updatedAgents);
        businessRepo.saveAndFlush(business);
    }

    public List<BusinessProductDTO> getBusinessProducts(int businessId) throws Exception {
        Business business = getBusinessById(businessId);
        if (business == null) {
            throw new Exception("Business not found");
        }

        return businessProductRepo.findByBusinessId(businessId).stream().map(bp -> new BusinessProductDTO(
                bp.getProduct(),
                bp.getPrice(),
                bp.getStock(),
                bp.getImageUrl()
        )).collect(Collectors.toList());
    }
}




