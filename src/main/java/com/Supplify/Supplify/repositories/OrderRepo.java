package com.Supplify.Supplify.repositories;
import com.Supplify.Supplify.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Integer> {
    List<Order> findByBusinessId(int business_id);  // Fetch orders by business ID
    Order findByBusinessIdAndId(int business_id, int id);  // Fetch orders by business ID
    List<Order> findByUserId(int userId);  // Fetch orders by user ID
}
