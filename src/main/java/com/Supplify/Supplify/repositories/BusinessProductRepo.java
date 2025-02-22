package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.BusinessProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessProductRepo extends JpaRepository<BusinessProduct, BusinessProduct.BusinessProductId> {
    @Query("SELECT bp.price FROM BusinessProduct bp WHERE bp.business.id = :businessId AND bp.product.id = :productId")
    Double findPriceByBusinessAndProduct(@Param("businessId") int businessId, @Param("productId") int productId);
}

