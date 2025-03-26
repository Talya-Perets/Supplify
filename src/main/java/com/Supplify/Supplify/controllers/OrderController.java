package com.Supplify.Supplify.controllers;
import com.Supplify.Supplify.DTO.*;
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
import java.util.stream.Collectors;

import com.Supplify.Supplify.DTO.OrderResponseDTO;


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
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByBusiness(@RequestParam int businessId) {
        List<Order> orders = orderService.get(businessId);

        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList()); // Return an empty list if no orders
        }

        // Convert to DTOs
        List<OrderResponseDTO> orderDTOs = orders.stream()
                .map(order -> new OrderResponseDTO(order, order.getAgent().getSupplier().getCompanyName())) // Assuming `agent` represents the supplier
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/getOrderInfo")
    public List<OrderProductDetails> getOrderProducts(@RequestParam int orderId) {
        return orderService.getOrderProducts(orderId);
    }



    @GetMapping("/getPendingOrders")
    public List<Integer> getPendingOrderProducts(@RequestParam int businessId) {
        logger.info("Fetching all pending orders:");
        return orderService.getPendingOrders(businessId);
    }

    @GetMapping("/getActiveOrders")
    public List<Integer> getPendingActiveOrderProducts(@RequestParam int businessId) {
        logger.info("Fetching all active orders:");
        return orderService.getActiveOrders(businessId);
    }

    @PostMapping("/OrderConfirm")
    public ResponseEntity<?> updateOrderStatus(@RequestParam int orderId) {
        orderService.OrderConfirmation(orderId);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/updateOrderReceived")
    public ResponseEntity<?> updateOrderReceived(
            @RequestBody OrderConfirmationDTO orderConfirmation) {
        try {
            logger.info("Received orderConfirmation: {}", orderConfirmation.toString());

            logger.info("Updating order {} as received with {} products",
                    orderConfirmation.getOrderId(),
                    orderConfirmation.getReceivedProducts().size());

            orderService.updateOrderReceived(orderConfirmation);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error updating order received status: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update order: " + e.getMessage());
        }
    }

}
