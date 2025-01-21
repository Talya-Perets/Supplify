package com.Supplify.Supplify.Services;

import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.repositories.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public User  createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return user;
    }
    public User findUserByusername(String username) {
        return userRepo.findByusername(username);
    }

    public User findUserByID(int id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " not found"));
    }

    public List<User> findUserByFirstNameAndLastName(String firstName, String lastName) {
        return userRepo.findUsersByFirstNameAndLastName(firstName, lastName);
    }
    public boolean authenticateUser(String username, String password) {
        User user = findUserByusername(username);
        return passwordEncoder.matches(password, user.getPassword());
}
}
