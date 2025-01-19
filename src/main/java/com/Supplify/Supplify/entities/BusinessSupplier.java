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
public class BusinessSupplier {

    @EmbeddedId
    private BusinessSupplierId id;

    // Additional fields if necessary
    @ManyToOne
    @JoinColumn(name = "business_id", insertable = false, updatable = false)
    private Business business;

    @ManyToOne
    @JoinColumn(name = "supplier_id", insertable = false, updatable = false)
    private Supplier supplier;

    // Composite key class
    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    public static class BusinessSupplierId implements Serializable {
        public BusinessSupplierId(int businessId, int supplierId) {
            this.businessId = businessId;
            this.supplierId = supplierId;
        }

        @Column(name = "business_id")
        private int businessId;

        @Column(name = "supplier_id")
        private int supplierId;
    }

    // Constructor for convenience
    public BusinessSupplier(int businessId, int supplierId) {
        this.id = new BusinessSupplierId(businessId, supplierId);
    }
}