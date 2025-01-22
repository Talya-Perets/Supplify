package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity

@Table(name = "USER")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "first_name", nullable = false, length = 50)
    @NonNull
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    @NonNull
    private String lastName;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    @NonNull
    private String username;

    @Column(name = "password", nullable = false, length = 50)
    @NonNull
    private String password;

    @Column(name = "business_name", nullable = false, unique = false, length = 50)
    @NonNull
    private String businessName;

    @Column(name = "phone", nullable = false, unique = true, length = 50)
    @NonNull
    private String  phone;

    @Column(name = "role", nullable = false, unique = true, length = 50)
    @NonNull
    private String role;
}
