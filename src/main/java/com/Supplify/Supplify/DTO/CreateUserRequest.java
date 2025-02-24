package com.Supplify.Supplify.DTO;

import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CreateUserRequest
{
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private int businessId;
    private String role;
}
