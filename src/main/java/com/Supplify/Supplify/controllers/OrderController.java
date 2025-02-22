package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.entities.Order;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.services.OrderService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("orders")
@RequiredArgsConstructor
public class OrderController {
    private final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest orderRequest) {

        try {
            validateOrderRequest(orderRequest);

            Order createdOrder = orderService.createOrder(
                    orderRequest.getUser(),
                    orderRequest.getBusiness(),
                    orderRequest.getTotalAmount(),
                    orderRequest.getStatus()
            );

            return ResponseEntity.status(201).body(createdOrder);

        } catch (ValidationException e) {
            logger.warn("Validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing order creation", e);
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }

    @GetMapping("business/{businessId}")
    public ResponseEntity<List<Order>> getOrdersByBusiness(@PathVariable int businessId) {
        logger.info("Fetching orders for business ID: {}", businessId);
        List<Order> orders = orderService.getOrdersByBusinessId(businessId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable int userId) {
        logger.info("Fetching orders for user ID: {}", userId);
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    private void validateOrderRequest(OrderRequest orderRequest) throws ValidationException {
        if (orderRequest.getUser() == null) {
            throw new ValidationException("User is required");
        }
        if (orderRequest.getBusiness() == null) {
            throw new ValidationException("Business is required");
        }
        if (orderRequest.getTotalAmount() <= 0) {
            throw new ValidationException("Total amount must be greater than zero");
        }
        if (orderRequest.getStatus() == null || orderRequest.getStatus().isEmpty()) {
            throw new ValidationException("Order status is required");
        }
    }

    private static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }

    @Getter
    @Setter
    public static class OrderRequest {
        private User user;
        private Business business;
        private int totalAmount;
        private String status;
    }
}
