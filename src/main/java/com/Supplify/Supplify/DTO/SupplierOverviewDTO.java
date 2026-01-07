package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupplierOverviewDTO {
    private int supplierId;
    private String companyName;
    private int totalOrderQuantity;
    private double totalOrderAmount;
    private int returnedQuantity;
    private double returnedAmount;
}