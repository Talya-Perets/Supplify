// יצירת OrderProductRepository.java
package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.OrderProduct;
import com.Supplify.Supplify.entities.OrderProduct.OrderProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderProductRepo extends JpaRepository<OrderProduct, OrderProductId> {
    List<OrderProduct> findByIdOrderId(int orderId);
    Optional<OrderProduct> findByIdOrderIdAndIdProductId(int orderId, String productId);
}