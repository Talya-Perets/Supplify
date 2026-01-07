package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateAgentRequest {
    private String name;
    private String email;
    private String phone;
    private int supplierId;
    private int businessId;

}
