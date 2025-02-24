package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.*;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.Role;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.services.BusinessService;
import com.Supplify.Supplify.services.RoleService;
import com.Supplify.Supplify.services.UserService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("user")
@AllArgsConstructor
public class UserController {

    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final BusinessService businessService;
    private final RoleService roleService;

    @GetMapping("getUser")
    public ResponseEntity<?> getUser(@PathVariable int id) {

        try {
            User user = userService.findUserByID(id);
            if (user != null) {
                logger.info("User found: {}", user.getUsername());
                return ResponseEntity.ok(user);
            } else {
                logger.warn("User not found with ID: {}", id);
                return ResponseEntity.status(404).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error fetching user with ID: {}", id, e);
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @PostMapping("createUser")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) throws Exception {
        logger.info("Creating new user request received");

        Business business = businessService.getBusinessById(request.getBusinessId());
        if (business == null) {
            throw new Exception("Business not found");
        }

        Role role = roleService.getRoleByName(request.getRole());
        if (role == null) {
            throw new Exception("Role not found");
        }

        try {
            userService.createUser(
                    request.getFirstName(),
                    request.getLastName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPhone(),
                    business, role);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error creating new user: {}", e.getMessage());
            throw new Exception(e);
        }
    }

    private Map<String, String> validateRequest(RegisterRequest request) {
        Map<String, String> errors = new HashMap<>();
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            errors.put("firstName", "First name is required");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            errors.put("lastName", "Last name is required");
        }
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            errors.put("username", "Username is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            errors.put("password", "Password is required");
        }
        if (request.getBusinessName() == null || request.getBusinessName().trim().isEmpty()) {
            errors.put("businessName", "Business name is required");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            errors.put("phone", "Phone is required");
        }
        return errors;
    }

    @PostMapping("resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        logger.info("Received password reset request for email: {}", resetPasswordRequest.getEmail());

        try {
            boolean isPasswordUpdated = userService.resetPassword(
                    resetPasswordRequest.getEmail(),
                    resetPasswordRequest.getNewPassword()
            );

            if (isPasswordUpdated) {
                return new ResponseEntity<>("Password reset successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid email or password update failed", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            logger.error("Error during password reset", e);
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}