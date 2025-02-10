package com.Supplify.Supplify.entities;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "SUPPLIERS")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int supplierId;

    @Column(name = "comapny_name")
    private String companyName;

    public Supplier(String supplierName) {
        this.companyName = supplierName;
    }
}