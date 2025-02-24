package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findUserByUsername(String username);
    List<User> findByRoleId(int roleId);

    @Modifying
    @Transactional
    @Query
            ("UPDATE User u SET u.deviceToken = :deviceToken WHERE u.id = :userId")
    void updateDeviceToken(@Param("userId") int userId, @Param("deviceToken") String deviceToken);
}
