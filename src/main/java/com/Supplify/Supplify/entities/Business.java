package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "business_supplier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String address;
    private String phone;


}