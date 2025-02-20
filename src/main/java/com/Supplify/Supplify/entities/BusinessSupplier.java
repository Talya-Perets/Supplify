package com.Supplify.Supplify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "business_supplier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(BusinessSupplier.BusinessSupplierId.class)
public class BusinessSupplier {

    @Id
    @Column(name = "business_id")
    private int businessId;

    @Id
    @Column(name = "supplier_id")
    private int supplierId;

    @ManyToOne
    @JoinColumn(name = "business_id", insertable = false, updatable = false)
    private Business business;

    @ManyToOne
    @JoinColumn(name = "supplier_id", insertable = false, updatable = false)
    private Supplier supplier;


    public BusinessSupplier(int businessId, int supplierId) {
        this.businessId = businessId;
        this.supplierId = supplierId;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class BusinessSupplierId implements Serializable {
        private int businessId;
        private int supplierId;
    }
}
