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
        int userId = request.getUserId();
        int businessId = request.getBusinessId();
        double totalAmount = request.getTotalAmount();
        String status = request.getStatus();
        LocalDateTime orderDate = request.getOrderDate();

        List<OrderProductRequest> orderItems = request.getOrderItems(); // ✅ Get items

        Order newOrder = new Order();
        newOrder.setUser(userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        newOrder.setBusiness(businessRepo.findById(businessId).orElseThrow(() -> new RuntimeException("Business not found")));
        newOrder.setTotalAmount(totalAmount);
        newOrder.setStatus(status);
        newOrder.setOrderDate(orderDate);

        // ✅ Convert orderItems DTOs to OrderProduct entities
        List<OrderProduct> orderProductList = orderItems.stream().map(item -> {
            Product product = productRepo.findById(Integer.valueOf(item.getProductId())).orElseThrow(() -> new RuntimeException("Product not found"));

            // ✅ Fetch unit price from business_products table
            double unitPrice = businessproductRepo.findPriceByBusinessAndProduct(businessId, Integer.parseInt(item.getProductId()));
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setProduct(product);
            orderProduct.setQuantity(item.getQuantity());
            orderProduct.setUnitPrice(unitPrice);
            orderProduct.setSubtotal(unitPrice * item.getQuantity());
            return orderProduct;
        }).toList();

        newOrder.setOrderProducts(orderProductList); // ✅ Attach items to order

        return orderRepo.save(newOrder);
    }




    public List<Order> getOrdersByBusinessId(int businessId) {
        log.info("Fetching orders for business ID: {}", businessId);
        return orderRepo.findByBusinessId(businessId);
    }

    public List<Order> getOrders() {
        return orderRepo.findAll();
    }

    public Order getOrdersByBusinessIdAndOrderId(int businessId, int orderId) {
        return orderRepo.findByBusinessIdAndId(businessId,orderId);
    }

}
