package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserContextResponse {
    private int businessId;
    private int userId;
    private String role;
    private String message;
}
