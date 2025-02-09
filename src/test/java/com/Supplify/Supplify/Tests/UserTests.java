package com.Supplify.Supplify.Tests;

import com.Supplify.Supplify.services.UserService;

import com.Supplify.Supplify.controllers.UserController;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.repositories.UserRepo;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserTests {

//    @Test
//    public void testUserGettersAndSetters() {
//        // Setting up the conditions
//        User user = new User();
//        user.setFirstName("Jane");
//        user.setLastName("Smith");
//        user.setUsername("jane_smith");
//        user.setPassword("securePass!456");
//        user.setBusinessName("Smith's Fuel Co.");
//        user.setPhone("987-654-3210");
//        user.setRole("EMPLOYEE");
//
//        // Assertions to verify getters and setters
//        assertEquals("Jane", user.getFirstName());
//        assertEquals("Smith", user.getLastName());
//        assertEquals("jane_smith", user.getUsername());
//        assertEquals("securePass!456", user.getPassword());
//        assertEquals("Smith's Fuel Co.", user.getBusinessName());
//        assertEquals("987-654-3210", user.getPhone());
//        assertEquals("EMPLOYEE", user.getRole());
//    }
//
//    @Test
//    public void testDuplicateUsernameNotAllowed() {
//        // Setting up the mock object
//        UserRepo mockRepo = Mockito.mock(UserRepo.class);
//        when(mockRepo.existsByUsername("duplicate_user")).thenReturn(true);
//
//        // Create the UserService with the mocked repository
//        UserService userService = new UserService(mockRepo, null); // PasswordEncoder is not needed for this test
//
//        // Create a new User object with the same username
//        User user = new User();
//        user.setFirstName("Duplicate");
//        user.setLastName("User");
//        user.setUsername("duplicate_user");
//        user.setPassword("password123"); // No need to encode password for this test
//        user.setBusinessName("Duplicate Inc.");
//        user.setPhone("123-123-1234");
//        user.setRole("EMPLOYEE");
//
//        // Attempt to create a user with a duplicate username
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            userService.createUser(user);
//        });
//
//        // Assertions to verify the expected exception
//        assertEquals("Username already exists", exception.getMessage());
//        verify(mockRepo, times(1)).existsByUsername("duplicate_user");
//    }
//    @Test
//    public void testPhoneNumberLengthValidation() {
//        // Setting up the mock object
//        UserRepo mockRepo = Mockito.mock(UserRepo.class);
//        when(mockRepo.existsByUsername("valid_user")).thenReturn(false);  // No duplicate username for this test
//
//        // Create the UserService with the mocked repository
//        UserService userService = new UserService(mockRepo, null); // PasswordEncoder is not needed for this test
//
//        // Create a User object with an invalid phone number (length is not 10)
//        User user = new User();
//        user.setFirstName("John");
//        user.setLastName("Doe");
//        user.setUsername("valid_user");
//        user.setPassword("password123");
//        user.setBusinessName("John's Business");
//        user.setPhone("12345");  // Invalid phone number (length 5)
//        user.setRole("EMPLOYEE");
//
//        // Attempt to create a user with an invalid phone number
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            userService.createUser(user);
//        });
//
//        // Assertions to verify the expected exception
//        assertEquals("Phone number must be 10 digits long", exception.getMessage());
//        verify(mockRepo, times(0)).save(user);  // Ensure save is not called
//    }
    /*
    @Test
    public void testUserLoginSuccess() {
        // Mock the UserService
        UserService mockUserService = Mockito.mock(UserService.class);
        Mockito.when(mockUserService.authenticateUser("testuser", "password123")).thenReturn(true);

        // Create an instance of the controller with the mocked service
        UserController userController = new UserController(mockUserService);

        // Create and set up the login request (using nested class)
        UserController.LoginRequest loginRequest = new UserController.LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        // Call the login method
        ResponseEntity<?> response = userController.login(loginRequest);

        // Assert that the login was successful
        assertEquals(200, response.getStatusCodeValue());  // Check for successful response
        assertEquals("Login successful", ((UserController.LoginResponse) response.getBody()).getMessage());
    }

    @Test
    public void testUserLoginFailure() {
        // Mock the UserService
        UserService mockUserService = Mockito.mock(UserService.class);
        Mockito.when(mockUserService.authenticateUser("testuser", "wrongpassword")).thenReturn(false);

        // Create an instance of the controller with the mocked service
        UserController userController = new UserController(mockUserService);

        // Create and set up the login request (using nested class)
        UserController.LoginRequest loginRequest = new UserController.LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        // Call the login method
        ResponseEntity<?> response = userController.login(loginRequest);

        // Assert that the login failed
        assertEquals(400, response.getStatusCodeValue());  // Check for failed response
        assertEquals("Invalid credentials", ((UserController.LoginResponse) response.getBody()).getMessage());
    }

     */
}