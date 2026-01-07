package com.Supplify.Supplify.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeManagementDTO {
    private int userId;
    private String name;
    private String email;
    private String role;
}