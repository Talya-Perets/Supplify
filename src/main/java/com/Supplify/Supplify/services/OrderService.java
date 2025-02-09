package com.Supplify.Supplify.services;
import com.Supplify.Supplify.entities.Order;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.repositories.BusinessRepo;
import com.Supplify.Supplify.repositories.OrderRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderService {
    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepo orderRepo;
    private final BusinessRepo businessRepo;

    public Order createOrder(User user, Business business, int totalAmount, String status) {
        log.info("Creating a new order for user: {}", user.getId());

        try {
            // Validate inputs
            if (totalAmount <= 0) {
                log.error("Invalid total amount: {}", totalAmount);
                throw new IllegalArgumentException("Total amount must be greater than zero.");
            }

            if (status == null || status.isEmpty()) {
                log.error("Invalid order status: {}", status);
                throw new IllegalArgumentException("Order status cannot be empty.");
            }

            // Create and save the order
            Order order = new Order();
            order.setUser(user);
            order.setBusiness(business);
            order.setTotalAmount(totalAmount);
            order.setStatus(status);
            order.setOrderDate(LocalDateTime.now()); // Assuming order date is the current timestamp
            order = orderRepo.saveAndFlush(order);
            log.info("Order successfully created with ID: {}", order.getId());

            return order;
        } catch (Exception e) {
            log.error("Failed to create order: {}", e.getMessage(), e);
            throw e;
        }
    }
    public List<Order> getOrdersByBusinessId(int businessId) {
        log.info("Fetching orders for business ID: {}", businessId);
        return orderRepo.findByBusinessId(businessId);
    }

    public List<Order> getOrdersByUserId(int userId) {
        log.info("Fetching orders for user ID: {}", userId);
        return orderRepo.findByUserId(userId);
    }

}
