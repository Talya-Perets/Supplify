package com.Supplify.Supplify.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateProductRequest {
    private String id;
    private int supplierId;
    private String productName;
    private String productDescription;
    private int stock;
}
