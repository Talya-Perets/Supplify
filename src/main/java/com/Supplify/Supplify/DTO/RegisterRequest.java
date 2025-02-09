package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String businessName;
    private String phone;
    private String address;
}
