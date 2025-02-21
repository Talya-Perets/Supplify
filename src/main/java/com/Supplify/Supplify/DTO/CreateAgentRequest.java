package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CreateAgentRequest {
    private String name;
    private String email;
    private String phone;
    private String companyName;
    private int businessId;

}
