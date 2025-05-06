package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "business")
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name", length = 45)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 45)
    private String email;

    @Column(name = "address", length = 45)
    private String address;

    @Column(name = "phone", length = 45)
    private String phone;

    @ManyToMany
    @JoinTable(
            name = "business_agent",
            joinColumns = @JoinColumn(name = "business_id"),
            inverseJoinColumns = @JoinColumn(name = "agent_id")
    )
    private List<Agent> agents;

    public Business(String name, String email, String address, String phone) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone = phone;
    }
}