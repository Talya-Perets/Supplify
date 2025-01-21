package com.Supplify.Supplify.repositories;
import com.Supplify.Supplify.entities.Business;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessRepo  extends JpaRepository<Business, Integer> {
    List<Business> findBusinessById(Integer BusinessId);
}