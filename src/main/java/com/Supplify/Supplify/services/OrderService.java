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
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import com.Supplify.Supplify.DTO.OrderProductDetails;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@RequiredArgsConstructor
@Service
public class OrderService {
    private final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final BusinessRepo businessRepo;
    private final BusinessProductRepo businessproductRepo;
    private final UserRepo userRepo;
    private final AgentRepo agentRepo;

    @Transactional

    public Order createOrder(CreateOrderRequest request) {
        // Extract data from the request
        int userId = request.getUserId();
        int businessId = request.getBusinessId();
        int supplierId = request.getSupplierId();
        String status = request.getStatus();
        LocalDateTime orderDate = request.getOrderDate();

        // Get the list of order items from the request
        List<OrderProductRequest> orderItems = request.getOrderItems();

        // Fetch the User and Business entities
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepo.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // Initialize total amount
        AtomicReference<Double> totalAmount = new AtomicReference<>(0.0);

        // Create the new Order entity
        Order newOrder = new Order();
        newOrder.setUser(user);
        newOrder.setBusiness(business);
        newOrder.setStatus(status);
        newOrder.setOrderDate(orderDate);

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

            // Accumulate the total order amount
                totalAmount.updateAndGet(v -> v + itemTotal);
            // Create the OrderProduct entity
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setId(new OrderProduct.OrderProductId(newOrder.getId(), item.getProductId())); // Set composite key
            orderProduct.setProduct(product);
            orderProduct.setQuantity(item.getQuantity());
            orderProduct.setUnitPrice(unitPrice);
            return orderProduct;
        }).toList();
        // Set the calculated total amount in the Order
        newOrder.setTotalAmount(totalAmount.get());
        // Set the list of OrderProduct entities in the Order
        newOrder.setOrderProducts(orderProductList);
        // Save the Order (cascading will save the OrderProduct entities)
        return orderRepo.saveAndFlush(newOrder);
    }


    public void OrderConfirmation(int orderId) {
        // Find the order by its ID
        Order order = orderRepo.findById(orderId).orElse(null);
        if (order != null) {
            // Set the order status to 'active'
            order.setStatus("active");
            // Save the updated order to the database
            orderRepo.save(order);
            System.out.println("Order status updated to active for order ID: " + orderId);
        } else {
            System.out.println("Order not found for ID: " + orderId);
        }
    }


    public void sendWhatsAppMessage(String phoneNumber, String message) {
        /*
                Agent agent = agentRepo.findAgentById(supplierId);
        if (agent == null) {
            throw new RuntimeException("Agent not found for the given supplier ID");
        }
        String agentPhone = agent.getPhone(); // Agent's phone number

          // Send WhatsApp message to the manager after order creation
        StringBuilder message = new StringBuilder();
                message.append("הזמנה חדשה:")
                        .append("\n");
        // Loop through each item in the order and add product name and quantity to the message
        orderItems.forEach(item -> {
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            message.append("מוצר: ").append(product.getProductName())
                    .append(", כמות: ").append(item.getQuantity())
                    .append("\n");
        });
        //sendWhatsAppMessage(agentPhone,  message.toString());
         */


        String apiEndpoint = "https://api.whatsapp.com/send";
        String apiToken = "YOUR_API_TOKEN"; // Replace with your API token

        // Prepare the message payload
        String payload = "to=" + phoneNumber + "&message=" + message;

        // Make an API call to send the message
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(apiEndpoint, HttpMethod.POST, null, String.class, payload);

        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("WhatsApp message sent successfully!");
        } else {
            System.out.println("Failed to send WhatsApp message");
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
        List<Integer> pending_id= pendingOrders.stream()
                .map(Order::getId)
                .toList();
        System.out.println("Pending Order IDs: " + pending_id);
       return pending_id;
    }
}
