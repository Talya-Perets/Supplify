package com.Supplify.Supplify.entities;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "agents")
public class Agent {
    @Id
    @Column(name = "id", nullable = false, length = 45)
    private String id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false, foreignKey = @ForeignKey(name = "fk_agents_supplier"))
    private Supplier supplier;

    @Column(name = "name", nullable = false, length = 45)
    private String name;

    @Column(name = "email", nullable = false, length = 45)
    private String description;

    @Column(name = "phone", nullable = false, length = 45)
    private int phone;

}
