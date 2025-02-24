package com.Supplify.Supplify.services;

import com.Supplify.Supplify.DTO.UserContextResponse;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.Role;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.repositories.UserRepo;
import com.Supplify.Supplify.utils.EmailValidator;
import com.Supplify.Supplify.utils.PhoneValidator;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService {
    private final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepo userRepo;

    public User createUser(String firstName, String lastName, String username, String password, String phone, Business business, Role role) {

        logger.info("Creating new user");

        if (!EmailValidator.isValidEmail(username)) {
            logger.error("Invalid email format: {}", username);
            throw new IllegalArgumentException("Email address is not valid.");
        }

        if (isEmailAlreadyUsed(username)) {
            logger.error("Email already in use: {}", username);
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (phone != null && !phone.isEmpty()) {
            if (!PhoneValidator.isValidLocalIsraeliMobile(phone)) {
                logger.error("Invalid phone number format: {}", phone);
                throw new IllegalArgumentException("Phone number is not valid.");
            }
        }

        return userRepo.saveAndFlush(new User(
                firstName,
                lastName,
                username,
                password,
                phone,
                business,
                role
        ));
    }

    public User findUserByUsername(String username) {
        return userRepo.findUserByUsername(username);
    }

    public boolean isEmailAlreadyUsed(String email) {
        return findUserByUsername(email) != null;
    }

    public User findUserByID(int id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " not found"));
    }

    public boolean authenticateUser(String username, String password) {
        User user = findUserByUsername(username);
        if (user == null) return false;

        return user.getPassword() == null || password.equals(user.getPassword());
    }

    public UserContextResponse getUserContext(String username) {
        UserContextResponse userLoginContext;
        User user = findUserByUsername(username);

        userLoginContext = new UserContextResponse();
        userLoginContext.setUserId(user.getId());
        userLoginContext.setBusinessId(user.getBusiness().getId());
        userLoginContext.setRole(user.getRole().getName());

        return userLoginContext;
    }

    public boolean resetPassword(String email, String newPassword) {
        User user = userRepo.findUserByUsername(email);

        if (user == null) {
            logger.error("User not found with email: {}", email);
            return false;
        }
        user.setPassword(newPassword);
        userRepo.save(user);

        logger.info("Password updated successfully for email: {}", email);
        return true;
    }

    public void updateDeviceToken(int userId, String deviceToken) {
        userRepo.updateDeviceToken(userId, deviceToken);
    }

}
