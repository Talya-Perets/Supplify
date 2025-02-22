package com.Supplify.Supplify.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AgentDTO {
    private int id;
    private String name;
    private String phone;
    private String email;
}
