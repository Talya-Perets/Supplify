package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateSupplierRequest {
    private String supplierName;
    private int businessId;
}
