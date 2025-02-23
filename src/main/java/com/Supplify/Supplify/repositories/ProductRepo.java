package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, String> {

    List<Product> findBySupplier(Supplier supplier);
}

