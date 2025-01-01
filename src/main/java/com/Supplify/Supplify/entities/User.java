package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private int id;

    @Column(name = "first_name", nullable = false, length = 50) // Maps to first_name column
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50) // Maps to last_name column
    private String lastName;
}
