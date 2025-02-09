package com.Supplify.Supplify.entities;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(name = "id", nullable = false, length = 45)
    private String id;

    @Column(name = "supplier_id", nullable = false)
    private int supplierId;

    @Column(name = "product_name", nullable = false, length = 45)
    private String productName;

    @Column(name = "description", nullable = false, length = 45)
    private String description;

}
