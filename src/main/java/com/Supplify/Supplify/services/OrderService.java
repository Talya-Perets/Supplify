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
import com.Supplify.Supplify.repositories.OrderProductRepo;
import com.Supplify.Supplify.repositories.OrderRepo;
import com.Supplify.Supplify.DTO.OrderProductUpdateDTO;
import com.Supplify.Supplify.DTO.OrderConfirmationDTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import com.Supplify.Supplify.DTO.OrderProductDetails;


@RequiredArgsConstructor
@Service
public class OrderService {
    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepo orderRepo;
    private final OrderProductRepo orderProductRepo;

    private final ProductRepo productRepo;
    private final BusinessRepo businessRepo;
    private final BusinessProductRepo businessproductRepo;
    private final UserRepo userRepo;
    private final WhatsAppService whatsAppService;
    private final FirebaseService firebaseService;

    @Transactional

    public Order createOrder(CreateOrderRequest request) {
        firebaseService.initializeFirebase();
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
        List<User> managers = userRepo.findByRoleId(1); // Fetch all managers (assuming roleId 1 is for managers)
        // Send notifications to all managers

        for (User manager : managers) {
            String deviceToken = manager.getDeviceToken();
            if (deviceToken != null && !deviceToken.isEmpty()) {
                System.out.println("📢 Notify Manager.");
                // Send notification to each manager using Firebase service instance
                firebaseService.sendNotification(deviceToken, "New Order", "You have a new order waiting for approval.");
            }
        }

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

            StringBuilder AgentSMS = new StringBuilder(); // Initialize StringBuilder
            AgentSMS.append("הזמנה חדשה:");
            AgentSMS.append("\n");
            for (OrderProduct item : order.getOrderProducts()) {
                Product product = productRepo.findById(item.getProduct().getId()).orElseThrow(() -> new RuntimeException("Product not found"));
                AgentSMS.append(product.getProductName());
                AgentSMS.append("כמות: ")
                        .append(item.getQuantity())
                        .append("\n");
            }
            whatsAppService.sendWhatsAppMessage(agentPhone, AgentSMS.toString());
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

    public List<Integer> getPendingOrders(Integer businessId) {
        // Fetch all orders with status "PENDING" and businessId
        List<Order> pendingOrders = orderRepo.findByStatusAndBusinessIdPending(businessId);
        List<Integer> pendingIds = pendingOrders.stream()
                .map(Order::getId)
                .collect(Collectors.toList());
        System.out.println("Pending Order IDs for businessId " + businessId + ": " + pendingIds);
        return pendingIds;
    }
    public List<Integer> getActiveOrders(Integer businessId) {
        // Fetch all orders with status "PENDING" and businessId
        List<Order> pendingOrders = orderRepo.findByStatusAndBusinessIdActive(businessId);
        List<Integer> pendingIds = pendingOrders.stream()
                .map(Order::getId)
                .collect(Collectors.toList());
        System.out.println("Pending Order IDs for businessId " + businessId + ": " + pendingIds);
        return pendingIds;
    }

    @Transactional
    public void updateOrderReceived(OrderConfirmationDTO orderConfirmation) {

        Order order = orderRepo.findById(orderConfirmation.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderConfirmation.getOrderId()));

        // עדכון סטטוס ההזמנה להושלמה
        order.setStatus("COMPLETED");

        // עדכון הסכום ששולם בפועל
        order.setTotalPaid(orderConfirmation.getTotalPaid());

        // שמירת תמונת החשבונית
        order.setInvoiceImage(orderConfirmation.getInvoiceImage());

        orderRepo.save(order);

        // עדכון הכמויות שהתקבלו בפועל וסה"כ מחיר לכל מוצר
        for (OrderProductUpdateDTO product : orderConfirmation.getReceivedProducts()) {
            OrderProduct orderProduct = orderProductRepo
                    .findByIdOrderIdAndIdProductId(order.getId(), product.getProductId())
                    .orElseThrow(() -> new RuntimeException("Order product not found for order " +
                            order.getId() + " and product " + product.getProductId()));

            // עדכון כמות בפועל
            orderProduct.setActualQuantity(product.getActualQuantity());

            // חישוב ועדכון סה"כ תשלום עבור המוצר
            double totalProductPrice = product.getActualQuantity() * product.getUnitPrice();
            orderProduct.setTotalProductPrice(totalProductPrice);

            orderProductRepo.save(orderProduct);
        }
    }

}
