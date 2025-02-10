package com.Supplify.Supplify.entities;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@Entity

@Table(name = "products")
public class Product {

    @Id
    @Column(name = "id", nullable = false, length = 45)
    private String id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false, foreignKey = @ForeignKey(name = "supplierid"))
    private Supplier supplier;

    @Column(name = "product_name", nullable = false, length = 45)
    private String productName;

    @Column(name = "description", nullable = false, length = 45)
    private String description;

    @Column(name = "stock", nullable = false, length = 45)
    private int stock;

    public Product(String id,Supplier supplier, String productName, String description, int stock) {
        this.id = id;
        this.supplier = supplier;
        this.productName = productName;
        this.description = description;
        this.stock = stock;
    }
}
