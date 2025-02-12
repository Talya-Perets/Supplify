package com.Supplify.Supplify.Tests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.Role;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.repositories.UserRepo;
import com.Supplify.Supplify.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

public class UserTests {

    private UserRepo mockUserRepo;
    private PasswordEncoder mockPasswordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        mockUserRepo = Mockito.mock(UserRepo.class);
        mockPasswordEncoder = Mockito.mock(PasswordEncoder.class);
        userService = new UserService(mockUserRepo, mockPasswordEncoder);
    }

    @Test
    public void testCreateUserSuccess() {
        // Mock user data
        User user = new User("John", "Doe", "john.doe@example.com", "securepassword", "1234567890", new Business(), new Role());

        when(mockUserRepo.saveAndFlush(any(User.class))).thenReturn(user);

        // Call createUser
        User createdUser = userService.createUser(
                "John", "Doe", "john.doe@example.com", "securepassword", "1234567890", new Business(), new Role()
        );

        // Assertions
        assertNotNull(createdUser);
        assertEquals("john.doe@example.com", createdUser.getUsername());
        verify(mockUserRepo, times(1)).saveAndFlush(any(User.class));
    }

    @Test
    public void testFindUserByUsername() {
        // Mock user
        User user = new User("Alice", "Smith", "alice.smith@example.com", "password123", "9876543210", new Business(), new Role());

        when(mockUserRepo.findUserByUsername("alice.smith@example.com")).thenReturn(user);

        // Call service method
        User foundUser = userService.findUserByUsername("alice.smith@example.com");

        // Assertions
        assertNotNull(foundUser);
        assertEquals("Alice", foundUser.getFirstName());
        assertEquals("alice.smith@example.com", foundUser.getUsername());
    }

    @Test
    public void testFindUserByIDSuccess() {
        // Mock user
        User user = new User("Bob", "Brown", "bob.brown@example.com", "pass1234", "5555555555", new Business(), new Role());

        when(mockUserRepo.findById(1)).thenReturn(Optional.of(user));

        // Call service method
        User foundUser = userService.findUserByID(1);

        // Assertions
        assertNotNull(foundUser);
        assertEquals("Bob", foundUser.getFirstName());
    }

    @Test
    public void testFindUserByIDNotFound() {
        // Mock repository returning empty
        when(mockUserRepo.findById(99)).thenReturn(Optional.empty());

        // Expect an exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.findUserByID(99);
        });

        assertTrue(exception.getMessage().contains("User with ID 99 not found"));
    }

    @Test
    public void testIsEmailAlreadyUsedTrue() {
        // Mock user existing
        when(mockUserRepo.findUserByUsername("existing@example.com")).thenReturn(new User());

        assertTrue(userService.isEmailAlreadyUsed("existing@example.com"));
    }

    @Test
    public void testIsEmailAlreadyUsedFalse() {
        // Mock user not found
        when(mockUserRepo.findUserByUsername("newuser@example.com")).thenReturn(null);

        assertFalse(userService.isEmailAlreadyUsed("newuser@example.com"));
    }

    @Test
    public void testAuthenticateUserSuccess() {
        // Mock user
        User user = new User("Tom", "Hanks", "tom.hanks@example.com", "hashedpassword", "1231231234", new Business(), new Role());

        when(mockUserRepo.findUserByUsername("tom.hanks@example.com")).thenReturn(user);
        when(mockPasswordEncoder.matches("correctpassword", "hashedpassword")).thenReturn(true);

        assertTrue(userService.authenticateUser("tom.hanks@example.com", "hashedpassword"));
    }

    @Test
    public void testAuthenticateUserWrongPassword() {
        // Mock user
        User user = new User("Emma", "Stone", "emma.stone@example.com", "hashedpassword", "3213213210", new Business(), new Role());
        when(mockUserRepo.findUserByUsername("emma.stone@example.com")).thenReturn(user);
        when(mockPasswordEncoder.matches("wrongpassword", "hashedpassword")).thenReturn(false);

        assertFalse(userService.authenticateUser("emma.stone@example.com", "wrongpassword"));
    }

    @Test
    public void testAuthenticateUserUserNotFound() {
        when(mockUserRepo.findUserByUsername("nonexistent@example.com")).thenReturn(null);

        assertFalse(userService.authenticateUser("nonexistent@example.com", "password"));
    }
}
