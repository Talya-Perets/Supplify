package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "user_id_fk"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "business_id", nullable = false, foreignKey = @ForeignKey(name = "business_id_fk"))
    private Business business;

    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    @Column(name = "status", nullable = false, length = 45)
    private String status;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "total_paid")
    private Double totalPaid;

    @Column(name = "invoice_image")
    private String invoiceImage;


    @OneToMany(mappedBy = "id.orderId", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderProduct> orderProducts;

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false, foreignKey = @ForeignKey(name = "agent_id_fk"))
    private Agent agent;


}