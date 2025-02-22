package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.AgentDTO;
import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.utils.EmailValidator;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.repositories.BusinessRepo;
import com.Supplify.Supplify.utils.PhoneValidator;
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
}




