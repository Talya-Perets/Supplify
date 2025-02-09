package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.LoginRequest;
import com.Supplify.Supplify.DTO.RegisterRequest;
import com.Supplify.Supplify.entities.User;
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
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        logger.info("Received user registration request");

        if (request == null) {
            logger.warn("Request body is null");
            return ResponseEntity.badRequest().body(Map.of("error", "Request body cannot be null"));
        }

        try {
            Map<String, String> errors = validateRequest(request);
            if (!errors.isEmpty()) {
                logger.warn("Validation errors: {}", errors);
                return ResponseEntity.badRequest().body(errors);
            }

            User user = new User(
                    request.getFirstName(),
                    request.getLastName(),
                    request.getUsername(),
                    request.getPassword(),
                    request.getBusinessName(),
                    request.getPhone()
            );

            User createdUser = userService.createUser(user);
            logger.info("User registered successfully: {}", createdUser.getUsername());
            return ResponseEntity.status(201).body(createdUser);

        } catch (Exception e) {
            logger.error("Error processing user registration", e);
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Received login request for username: {}", loginRequest.getUsername());

        try {
            boolean isAuthenticated = userService.authenticateUser(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (isAuthenticated) {
                logger.info("User authenticated successfully: {}", loginRequest.getUsername());
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                logger.warn("Authentication failed for username: {}", loginRequest.getUsername());
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            logger.error("Error processing login request", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        logger.info("Fetching user with ID: {}", id);

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
}