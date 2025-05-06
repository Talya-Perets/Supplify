package com.Supplify.Supplify.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateProductRequest {
    private String id;
    private String productName;
    private String productDescription;
    private int supplierId;
    private int stock;
    private double price;
    private int businessId;
}