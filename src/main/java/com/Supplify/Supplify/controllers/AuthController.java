package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.*;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.enums.UserRoleEnum;
import com.Supplify.Supplify.services.BusinessService;
import com.Supplify.Supplify.services.RoleService;
import com.Supplify.Supplify.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RequiredArgsConstructor
@RestController
@RequestMapping("auth")
public class AuthController {

    private final Logger logger = LogManager.getLogger(AuthController.class);
    private final BusinessService businessService;
    private final UserService userService;
    private final RoleService roleService;

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) throws Exception {
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
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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

        String message = """
                New business created successfully.
                Your login details are:
                Username: %s
                Password: %s
                """.formatted(user.getUsername(), user.getPassword());

        UserContextResponse userContextResponse = userService.getUserContext(user.getUsername());
        userContextResponse.setMessage(message);

        return new ResponseEntity<>(userContextResponse, HttpStatus.CREATED);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Received login request for username: {}", loginRequest.getUsername());

        try {
            boolean isAuthenticated = userService.authenticateUser(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (isAuthenticated) {
                logger.info("User authenticated successfully: {}", loginRequest.getUsername());

                UserContextResponse userLoginContext = userService.getUserContext(loginRequest.getUsername());
                return new ResponseEntity<>(userLoginContext, HttpStatus.OK);
            } else {
                logger.error("Authentication failed for username: {}", loginRequest.getUsername());
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            logger.error("Error processing login request", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        logger.info("Received forgotPassword request for email: {}", forgotPasswordRequest.getEmail());

        try {
            boolean isEmailRegistered = userService.isEmailAlreadyUsed(forgotPasswordRequest.getEmail());

            if (isEmailRegistered) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Email not found
            }
        } catch (Exception e) {
            logger.error("Error processing forgotPassword request", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("google")
    public ResponseEntity<?> google(@RequestBody GoogleRequest googleRequest) {
        logger.info("Received google request for username: {}", googleRequest.getUsername());


        if (userService.isEmailAlreadyUsed(googleRequest.getUsername())) {
            logger.info("User authenticated successfully: {}", googleRequest.getUsername());

            UserContextResponse userContextResponse = userService.getUserContext(googleRequest.getUsername());
            return new ResponseEntity<>(userContextResponse, HttpStatus.OK);
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

        UserContextResponse userContextResponse = userService.getUserContext(user.getUsername());
        userContextResponse.setMessage("""
                New business created successfully.
                Your details are:
                Username: %s
                """.formatted(user.getUsername()));

        return new ResponseEntity<>(userContextResponse, HttpStatus.CREATED);
    }
    @PostMapping("/updateDeviceToken")
    public ResponseEntity<?> updateDeviceToken(@RequestBody DeviceTokenRequest request) {
        try {
            userService.updateDeviceToken(request.getUserId(), request.getDeviceToken());
            return ResponseEntity.ok(Collections.singletonMap("message", "Device token updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Failed to update token"));
        }
    }
}
