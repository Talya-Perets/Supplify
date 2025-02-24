package com.Supplify.Supplify.DTO;

import com.Supplify.Supplify.entities.Product;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProductDTO {
    private Product product;
    private double price;
    private int stock;
    private String imageUrl;
}
