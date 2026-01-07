package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SupplierRepo extends JpaRepository<Supplier, Integer> {
    Optional<Supplier> findByCompanyName(String companyName);
}
