package com.Supplify.Supplify.DTO;

import com.Supplify.Supplify.entities.OrderProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateOrderRequest {
    private int userId;
    private int businessId;
    private double totalAmount;
    private String status;
    private LocalDateTime orderDate;
    private List<OrderProductRequest> orderItems;
}
