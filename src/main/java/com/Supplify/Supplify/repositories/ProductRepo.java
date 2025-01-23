package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
    //@Query("SELECT DISTINCT p.SupplierID FROM Products p WHERE p.ProductName = :productName")
  //  List<Integer> findSuppliersByProductName(@Param("productName") String productName);
   }

