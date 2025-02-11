package com.Supplify.Supplify.Tests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.Supplify.Supplify.DTO.GoogleRequest;
import com.Supplify.Supplify.DTO.LoginRequest;
import com.Supplify.Supplify.controllers.AuthController;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.enums.UserRoleEnum;
import com.Supplify.Supplify.services.BusinessService;
import com.Supplify.Supplify.services.RoleService;
import com.Supplify.Supplify.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class AuthControllerTest {

    @Test
    public void testUserLoginSuccess() {
        // Mock dependencies
        UserService mockUserService = Mockito.mock(UserService.class);
        BusinessService mockBusinessService = Mockito.mock(BusinessService.class);
        RoleService mockRoleService = Mockito.mock(RoleService.class);

        when(mockUserService.authenticateUser("testuser", "password123")).thenReturn(true);

        // Create AuthController with mocked services
        AuthController authController = new AuthController(mockBusinessService, mockUserService, mockRoleService);

        // Create and set up the login request
        LoginRequest loginRequest = new LoginRequest("testuser", "password123");

        // Call the login method
        ResponseEntity<?> response = authController.login(loginRequest);

        // Assertions
        assertEquals(200, response.getStatusCodeValue()); // OK
    }

    @Test
    public void testUserLoginFailure() {
        // Mock dependencies
        UserService mockUserService = Mockito.mock(UserService.class);
        BusinessService mockBusinessService = Mockito.mock(BusinessService.class);
        RoleService mockRoleService = Mockito.mock(RoleService.class);

        when(mockUserService.authenticateUser("testuser", "wrongpassword")).thenReturn(false);

        // Create AuthController with mocked services
        AuthController authController = new AuthController(mockBusinessService, mockUserService, mockRoleService);

        // Create and set up the login request
        LoginRequest loginRequest = new LoginRequest("testuser", "wrongpassword");

        // Call the login method
        ResponseEntity<?> response = authController.login(loginRequest);

        // Assertions
        assertEquals(401, response.getStatusCodeValue()); // UNAUTHORIZED
    }
    @Test
    public void testGoogleLoginSuccess() {
        // Mock dependencies
        UserService mockUserService = Mockito.mock(UserService.class);
        BusinessService mockBusinessService = Mockito.mock(BusinessService.class);
        RoleService mockRoleService = Mockito.mock(RoleService.class);

        when(mockUserService.isEmailAlreadyUsed("googleuser@example.com")).thenReturn(true);

        // Create AuthController with mocked services
        AuthController authController = new AuthController(mockBusinessService, mockUserService, mockRoleService);

        // Create Google request
        GoogleRequest googleRequest = new GoogleRequest("googleuser@example.com");

        // Call the Google login method
        ResponseEntity<?> response = authController.google(googleRequest);

        // Assertions
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Existing user should return OK
    }

    @Test
    public void testGoogleNewUserRegistration() {
        // Mock dependencies
        UserService mockUserService = Mockito.mock(UserService.class);
        BusinessService mockBusinessService = Mockito.mock(BusinessService.class);
        RoleService mockRoleService = Mockito.mock(RoleService.class);

        when(mockUserService.isEmailAlreadyUsed("newgoogleuser@example.com")).thenReturn(false);

        // Mock business creation
        Business mockBusiness = Mockito.mock(Business.class);
        when(mockBusinessService.createBusiness(null, "newgoogleuser@example.com", null, null))
                .thenReturn(mockBusiness);

        // Mock user creation
        User mockUser = new User();
        mockUser.setUsername("newgoogleuser@example.com");

        when(mockUserService.createUser(
                null,
                null,
                "newgoogleuser@example.com",
                null,
                null,
                mockBusiness,
                mockRoleService.getRoleById(UserRoleEnum.MANAGER)
        )).thenReturn(mockUser);

        // Create AuthController with mocked services
        AuthController authController = new AuthController(mockBusinessService, mockUserService, mockRoleService);

        // Create Google request
        GoogleRequest googleRequest = new GoogleRequest("newgoogleuser@example.com");

        // Call the Google login method
        ResponseEntity<?> response = authController.google(googleRequest);

        // Assertions
        assertEquals(HttpStatus.CREATED, response.getStatusCode()); // New user should return CREATED
        assertTrue(response.getBody().toString().contains("newgoogleuser@example.com")); // Ensure response includes the username
    }
}
