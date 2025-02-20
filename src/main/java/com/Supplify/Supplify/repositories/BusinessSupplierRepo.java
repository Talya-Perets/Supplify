package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.BusinessSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessSupplierRepo extends JpaRepository<BusinessSupplier, BusinessSupplier> {

    List<BusinessSupplier> findByBusinessId(int businessId);

    List<BusinessSupplier> findBySupplierId(int supplierId);
}
