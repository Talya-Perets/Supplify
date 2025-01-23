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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "supplier_id", nullable = false)
    private int supplierId;

    @Column(name = "barcode", nullable = false, length = 50)
    private String barcode;

    @Column(name = "product_name", nullable = false, length = 50)
    private String productName;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "cost", nullable = false)
    private int basePrice;

    @Column(name = "selling_price", nullable = false)
    private int selling_price;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;
}
