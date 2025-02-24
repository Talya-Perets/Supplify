package com.Supplify.Supplify.repositories;
import com.Supplify.Supplify.DTO.OrderProductDetails;
import com.Supplify.Supplify.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    @Query("SELECT o FROM Order o JOIN FETCH o.orderProducts WHERE o.business.id = :businessId AND o.id = :orderId")
    Order findByBusinessIdAndOrderId(@Param("businessId") int businessId, @Param("orderId") int orderId);

    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.orderProducts WHERE o.business.id = :businessId")
    List<Order> findByBusinessId(@Param("businessId") int businessId);

    @Query("""
        SELECT new com.Supplify.Supplify.DTO.OrderProductDetails(
            p.productName, op.quantity, op.unitPrice, (op.quantity * op.unitPrice)
        )\s
        FROM OrderProduct op
        JOIN op.product p
        WHERE op.id.orderId = :orderId
   \s""")
    List<OrderProductDetails> findOrderProductDetailsByOrderId(@Param("orderId") int orderId);
}

