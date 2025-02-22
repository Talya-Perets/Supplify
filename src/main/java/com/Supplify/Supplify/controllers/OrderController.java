package com.Supplify.Supplify.controllers;
import com.Supplify.Supplify.DTO.CreateOrderRequest;
import com.Supplify.Supplify.DTO.GetOrderInfo;
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
@RequestMapping("/orders")
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
        List<Order> orders = orderService.getOrdersByBusinessId(businessId);
        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList()); // Return an empty list if no orders
        }
        return ResponseEntity.ok(orders); // Return the orders if found
    }

    @GetMapping("/getOrderInfo")
    public ResponseEntity<Order> getOrderByBusinessAndOrderID(@RequestParam("businessId") int businessId,
                                                              @RequestParam("orderId") int orderId) {
        logger.info("Fetching orders for business ID: {}", businessId);
        Order order = orderService.getOrdersByBusinessIdAndOrderId(businessId, orderId);
        return ResponseEntity.ok(order);
    }



    private static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }

}
