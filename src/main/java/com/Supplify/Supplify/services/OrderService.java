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
import java.util.concurrent.atomic.AtomicReference;

import com.Supplify.Supplify.DTO.OrderProductDetails;


@RequiredArgsConstructor
@Service
public class OrderService {
    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final BusinessRepo businessRepo;
    private final BusinessProductRepo businessproductRepo;
    private final UserRepo userRepo;
    private final WhatsAppService whatsAppService;

    @Transactional

    public Order createOrder(CreateOrderRequest request) {
        // Extract data from the request
        int userId = request.getUserId();
        int businessId = request.getBusinessId();
        int supplier_id = request.getSupplierId();
        String status = request.getStatus();
        LocalDateTime orderDate = request.getOrderDate();

        // Get the list of order items from the request
        List<OrderProductRequest> orderItems = request.getOrderItems();

        // Fetch the User and Business entities
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        Agent orderAgent = business.getAgents().stream()
                .filter(agent -> agent.getSupplier().getSupplierId() == supplier_id)
                .findAny()
                .orElse(null);

        // Initialize total amount
        AtomicReference<Double> totalAmount = new AtomicReference<>(0.0);

        // Create the new Order entity
        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setBusiness(business);
        newOrder.setStatus(status);
        newOrder.setOrderDate(orderDate);
        newOrder.setAgent(orderAgent);

        Order preProcessedOrder = orderRepo.saveAndFlush(newOrder);

        // Process each order item and calculate total amount
        List<OrderProduct> orderProductList = orderItems.stream().map(item -> {
            // Validate product ID
            if (item.getProductId() == null) {
                throw new IllegalArgumentException("Product ID must not be null");
            }

            // Fetch the Product entity
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));

            // Fetch the unit price for the product in the given business
            Double unitPrice = businessproductRepo.findPriceByBusinessAndProduct(businessId, item.getProductId());
            if (unitPrice == null) {
                throw new IllegalArgumentException("Price not found for the given business and product");
            }

            // Calculate total price for this item
            double itemTotal = unitPrice * item.getQuantity();

            totalAmount.updateAndGet(v -> v + itemTotal);
            // Create the OrderProduct entity
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setId(new OrderProduct.OrderProductId(preProcessedOrder.getId(), item.getProductId())); // Set composite key
            orderProduct.setProduct(product);
            orderProduct.setQuantity(item.getQuantity());
            orderProduct.setUnitPrice(unitPrice);
            return orderProduct;
        }).toList();
        preProcessedOrder.setTotalAmount(totalAmount.get());

        // Set the list of OrderProduct entities in the Order
        preProcessedOrder.setOrderProducts(new ArrayList<>(orderProductList));
        // Save the Order (cascading will save the OrderProduct entities)
        return orderRepo.saveAndFlush(preProcessedOrder);
    }


    public void OrderConfirmation(int orderId) {

        // Find the order by its ID
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            // Set the order status to 'active'
            order.setStatus("active");
            // Save the updated order to the database
            orderRepo.save(order);
            String agentPhone;
            try {
                agentPhone = order.getAgent().getPhone();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            System.out.println("Order status updated to active for order ID: " + orderId);
            String managerSMS = "New order #" + orderId + " requires your confirmation. Please log in to confirm the order.";
            whatsAppService.sendWhatsAppMessage(agentPhone, managerSMS);
        } else {
            System.out.println("Order not found for ID: " + orderId);
        }
    }


    public List<OrderProductDetails> getOrderProducts(int orderId) {
        return orderRepo.findOrderProductDetailsByOrderId(orderId);
    }

    public List<Order> get(int businessId) {
        return orderRepo.findByBusinessId(businessId);
    }

    public List<Integer> getPendingOrders() {
        // Fetch all orders with status "PENDING"
        List<Order> pendingOrders = orderRepo.findByStatus("pending");
        List<Integer> pending_id = pendingOrders.stream()
                .map(Order::getId)
                .toList();
        System.out.println("Pending Order IDs: " + pending_id);
        return pending_id;
    }
}
