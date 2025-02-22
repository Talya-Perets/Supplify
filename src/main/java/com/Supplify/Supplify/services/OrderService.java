package com.Supplify.Supplify.services;
import com.Supplify.Supplify.DTO.CreateOrderRequest;
import com.Supplify.Supplify.DTO.OrderProductRequest;
import com.Supplify.Supplify.entities.*;
import com.Supplify.Supplify.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderService {
    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final BusinessRepo businessRepo;
    private final BusinessProductRepo businessproductRepo;
    private final UserRepo userRepo;

    @Transactional

    public Order createOrder(CreateOrderRequest request) {
        // Extract data from the request
        int userId = request.getUserId();
        int businessId = request.getBusinessId();
        double totalAmount = request.getTotalAmount();
        String status = request.getStatus();
        LocalDateTime orderDate = request.getOrderDate();

        // Get the list of order items from the request
        List<OrderProductRequest> orderItems = request.getOrderItems();

        // Fetch the User and Business entities
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // Create the new Order entity
        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setBusiness(business);
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus(status);
        newOrder.setOrderDate(orderDate);

        // Process each order item
        List<OrderProduct> orderProductList = orderItems.stream().map(item -> {
            // Validate product ID
            if (item.getProductId() == null) {
                throw new IllegalArgumentException("Product ID must not be null");
            }

            // Fetch the Product entity
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            // Fetch the unit price for the product in the given business
            Double unitPrice = businessproductRepo.findPriceByBusinessAndProduct(request.getBusinessId(), item.getProductId());
            if (unitPrice == null) {
                // Handle the null case (e.g., set a default value or throw an exception)
                unitPrice = 0.0; // Or you can decide on a fallback value
                // Alternatively, throw a custom exception if this is critical
                //throw new IllegalArgumentException("Price not found for the given business and product");
            }

            // Create the OrderProduct entity
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setId(new OrderProduct.OrderProductId(newOrder.getId(), item.getProductId())); // Set composite key
            orderProduct.setOrder(newOrder); // Set the order (required for the composite key)
            orderProduct.setProduct(product); // Set the product
            orderProduct.setQuantity(item.getQuantity());
            orderProduct.setUnitPrice(unitPrice);

            return orderProduct;
        }).toList();

        // Set the list of OrderProduct entities in the Order
        newOrder.setOrderProducts(orderProductList);

        // Save the Order (cascading will save the OrderProduct entities)
        return orderRepo.save(newOrder);
    }

    public List<Order> getOrders() {
        return orderRepo.findAll();
    }

    public Order getOrdersByBusinessIdAndOrderId(int businessId, int orderId) {
        return orderRepo.findByBusinessIdAndOrderId(businessId,orderId);
    }

    public List<Order> get(int businessId) {
        return orderRepo.findByBusinessId(businessId);
    }
}
