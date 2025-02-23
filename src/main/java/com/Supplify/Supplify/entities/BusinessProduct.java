package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "business_products")
public class BusinessProduct {

    @EmbeddedId
    private BusinessProductId id;

    @ManyToOne
    @MapsId("businessId")
    @JoinColumn(name = "business_id", foreignKey = @ForeignKey(name = "business_fk"))
    private Business business;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "product_fk"))
    private Product product;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "stock", nullable = false)
    private int stock;

    @Embeddable
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class BusinessProductId implements Serializable {
        private int businessId;
        private String productId;
    }
}
