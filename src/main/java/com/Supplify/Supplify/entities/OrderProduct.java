package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class OrderProduct {

    @EmbeddedId
    private OrderProductId id;  // Composite key

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "product_id_fk"))
    private Product product;

    @ManyToOne
    @MapsId("orderId")  // This will map to the orderId from the composite key
    @JoinColumn(name = "order_id", nullable = false, foreignKey = @ForeignKey(name = "order_id_fk"))
    private Order order;  // Reference to Order entity

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private double unitPrice;

    @Column(name = "subtotal", nullable = false)
    private double subtotal;

    @Embeddable
    public static class OrderProductId implements Serializable {
        private int orderId;
        private int productId;
    }
}
