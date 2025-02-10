package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.GoogleRequest;
import com.Supplify.Supplify.DTO.LoginRequest;
import com.Supplify.Supplify.DTO.RegisterRequest;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.enums.UserRoleEnum;
import com.Supplify.Supplify.services.BusinessService;
import com.Supplify.Supplify.services.RoleService;
import com.Supplify.Supplify.services.UserService;
import com.Supplify.Supplify.utils.EmailValidator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final BusinessService businessService;
    private final UserService userService;
    private final RoleService roleService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        logger.info("Registering new business");
        Business business = null;

        try {
            business = businessService.createBusiness(
                    registerRequest.getBusinessName(),
                    registerRequest.getUsername(),
                    registerRequest.getAddress(),
                    registerRequest.getPhone()
            );

        } catch (Exception e) {
            logger.error(e.getMessage());
        }

        User user = userService.createUser(
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getPhone(),
                business,
                roleService.getRoleById(UserRoleEnum.MANAGER)
        );

        logger.info("Registered new business successfully");

        return new ResponseEntity<>("""
                New business created successfully.
                Your login details are:
                Username: %s
                Password: %s
                """.formatted(user.getUsername(), user.getPassword()), HttpStatus.CREATED);
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

    @PostMapping("/google")
    public ResponseEntity<?> google(@RequestBody GoogleRequest googleRequest) {
        logger.info("Received google request for username: {}", googleRequest.getUsername());


        if (userService.isEmailAlreadyUsed(googleRequest.getUsername())) {
            logger.info("User authenticated successfully: {}", googleRequest.getUsername());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        logger.info("Registering new business from google sign in");

        Business business = businessService.createBusiness(null, googleRequest.getUsername(), null, null);

        User user = userService.createUser(
                null,
                null,
                googleRequest.getUsername(),
                null,
                null,
                business,
                roleService.getRoleById(UserRoleEnum.MANAGER)
        );

        logger.info("Registered new business through google sign in successfully");

        return new ResponseEntity<>("""
                New business created successfully.
                Your details are:
                Username: %s
                """.formatted(user.getUsername()), HttpStatus.CREATED);

    }
}
