package com.Supplify.Supplify.DTO;
import com.Supplify.Supplify.entities.Order;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderResponseDTO {
    private Order order;
    private String SupplierName;
}