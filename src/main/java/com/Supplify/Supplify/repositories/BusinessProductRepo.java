package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.BusinessProduct;
import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

import java.util.Optional;

@Repository
public interface BusinessProductRepo extends JpaRepository<BusinessProduct, BusinessProduct.BusinessProductId> {

    @Query("SELECT bp.price FROM BusinessProduct bp WHERE bp.id.businessId = :businessId AND bp.id.productId = :productId")
    Double findPriceByBusinessAndProduct(@Param("businessId") int businessId, @Param("productId") String productId);

    void deleteByBusinessIdAndProductIn(int business_id, List<Product> product);

    List<BusinessProduct> findByBusinessId(int businessId);

}

