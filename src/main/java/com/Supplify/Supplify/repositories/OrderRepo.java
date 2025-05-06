package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.DTO.OrderProductDetails;
import com.Supplify.Supplify.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {

    List<Order> findByStatus(String pending);

    @Query("SELECT DISTINCT o FROM Order o WHERE o.business.id = :businessId")
    List<Order> findByBusinessId(@Param("businessId") int businessId);
    @Query("""
        SELECT new com.Supplify.Supplify.DTO.OrderProductDetails(
           p.id,
           p.productName,
           op.quantity,
           op.unitPrice,
           (op.quantity * op.unitPrice),
           o.status,
           o.user.firstName,
           o.agent.supplier.companyName,
           op.returnRequested
        )
        FROM OrderProduct op
        JOIN op.product p
        JOIN Order o ON op.id.orderId = o.id
        WHERE op.id.orderId = :orderId
       """)
    List<OrderProductDetails> findOrderProductDetailsByOrderId(@Param("orderId") int orderId);


    @Query("SELECT o FROM Order o WHERE o.status = 'pending' AND o.business.id = :businessId")
    List<Order> findByStatusAndBusinessIdPending(@Param("businessId") Integer businessId);

    @Query("SELECT o FROM Order o WHERE o.status = 'active' AND o.business.id = :businessId")
    List<Order> findByStatusAndBusinessIdActive(@Param("businessId") Integer businessId);



}

