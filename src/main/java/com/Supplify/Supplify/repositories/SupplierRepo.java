package com.Supplify.Supplify.repositories;
import com.Supplify.Supplify.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface SupplierRepo  extends JpaRepository<Supplier, Integer> {


}
