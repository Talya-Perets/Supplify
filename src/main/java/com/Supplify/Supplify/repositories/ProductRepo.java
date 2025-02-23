package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, String> {
    //@Query("SELECT DISTINCT p.SupplierID FROM Products p WHERE p.ProductName = :productName")
    //  List<Integer> findSuppliersByProductName(@Param("productName") String productName);

    List<Product> findBySupplier(Supplier supplier);
}

