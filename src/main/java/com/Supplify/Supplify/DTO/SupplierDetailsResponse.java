package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SupplierDetailsResponse {
    private AgentDTO agent;
    private String companyName;
}
