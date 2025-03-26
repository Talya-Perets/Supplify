package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductUpdateDTO {
    private String productId;
    private int orderedQuantity;
    private int actualQuantity;
    private double unitPrice;

    @Override
    public String toString() {
        return "OrderProductUpdateDTO{" +
                "productId='" + productId + '\'' +
                ", orderedQuantity=" + orderedQuantity +
                ", actualQuantity=" + actualQuantity +
                ", unitPrice=" + unitPrice +
                '}';
    }
}
