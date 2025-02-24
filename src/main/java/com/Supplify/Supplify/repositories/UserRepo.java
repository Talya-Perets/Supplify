package com.Supplify.Supplify.repositories;

import com.Supplify.Supplify.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    User findUserByUsername(String username);
    List<User> findByRoleId(int roleId);
}
