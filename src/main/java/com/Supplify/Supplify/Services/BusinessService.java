package com.Supplify.Supplify.services;

import com.Supplify.Supplify.utils.EmailValidator;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.repositories.BusinessRepo;
import com.Supplify.Supplify.utils.PhoneValidator;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@RequiredArgsConstructor
@Service
public class BusinessService {

    private final Logger logger = LoggerFactory.getLogger(BusinessService.class);
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

}




