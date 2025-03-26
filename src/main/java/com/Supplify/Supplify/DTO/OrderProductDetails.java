package com.Supplify.Supplify.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
@AllArgsConstructor
@Getter

public class OrderProductDetails {
    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;
    private double subtotal;
    private String status;
    private String userName;
    private String supplierName;

}

