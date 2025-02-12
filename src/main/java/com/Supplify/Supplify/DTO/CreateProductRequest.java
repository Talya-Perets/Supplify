package com.Supplify.Supplify.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateProductRequest {
    String id;
    int supplierId;
    String productName;
    String productDescription;
    int stock;
}
