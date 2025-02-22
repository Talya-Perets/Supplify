package com.Supplify.Supplify.repositories;
import com.Supplify.Supplify.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {
   // List<Order> findByBusinessId(int business_id);  // Fetch orders by business ID
    //Order findByBusinessIdAndId(int business_id, int id);  // Fetch orders by business ID
    @Query("SELECT o FROM Order o JOIN FETCH o.orderProducts WHERE o.business.id = :businessId AND o.id = :orderId")
    Order findByBusinessIdAndOrderId(@Param("businessId") int businessId, @Param("orderId") int orderId);

    @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.orderProducts WHERE o.business.id = :businessId")
    List<Order> findByBusinessId(@Param("businessId") int businessId);
}
