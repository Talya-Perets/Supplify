package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.RegisterRequest;
import com.Supplify.Supplify.services.BusinessService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        logger.info("Registering new business");

        try {
            businessService.createBusiness(
                    registerRequest.getBusinessName(),
                    registerRequest.getUsername(),
                    registerRequest.getAddress(),
                    registerRequest.getPhone()
            );

        } catch (Exception e) {
            logger.error(e.getMessage());
        }



    }
}
