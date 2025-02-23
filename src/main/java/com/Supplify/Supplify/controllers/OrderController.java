package com.Supplify.Supplify.controllers;
import com.Supplify.Supplify.DTO.CreateOrderRequest;
import com.Supplify.Supplify.DTO.GetOrderInfo;
import com.Supplify.Supplify.DTO.OrderProductDetails;
import com.Supplify.Supplify.entities.Order;
import com.Supplify.Supplify.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("orders")
@RequiredArgsConstructor
public class OrderController {
    private final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;


    @PostMapping("/CreateOrder")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        Order newOrder = orderService.createOrder(request);
        return ResponseEntity.ok(newOrder);
    }

    @GetMapping("/getOrders")
    public ResponseEntity<List<Order>> getOrdersByBusiness(@RequestParam int businessId) {
        List<Order> orders = orderService.get(businessId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList()); // Return an empty list if no orders
        }
        return ResponseEntity.ok(orders); // Return the orders if found
    }

    @GetMapping("/getOrderInfo")
    public List<OrderProductDetails> getOrderProducts(@RequestParam int orderId) {
        logger.info("Fetching order details for order ID: {}",orderId);
        return orderService.getOrderProducts(orderId);
    }

    @GetMapping("/getPendingOrders")
    public List<Integer> getPendingOrderProducts() {
        logger.info("Fetching all pending orders:");
        return orderService.getPendingOrders();
    }

    @PostMapping("/OrderConfirm")
    public ResponseEntity<?> updateOrderStatus(@RequestParam int orderId) {
        orderService.OrderConfirmation(orderId);
        return ResponseEntity.ok().build();
    }

    private static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }

}
