package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.BusinessSupplier;
import org.apache.logging.log4j.util.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BusinessSupplierRepo extends JpaRepository<BusinessSupplier, BusinessSupplier.BusinessSupplierId> {
    @Query("SELECT bs.id.supplierId FROM BusinessSupplier bs WHERE bs.id.businessId = :businessId")
    List<Integer> findSupplierIdsByBusinessId(@Param("businessId") Integer businessId);

}