package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class GetOrderInfo {
    private int orderId;
    private int businessId;
}
