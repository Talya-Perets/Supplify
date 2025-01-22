package com.Supplify.Supplify.controllers;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.Services.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import static ch.qos.logback.core.util.StringUtil.isNullOrEmpty;


@RestController
@RequestMapping("/api/users")
@AllArgsConstructor

public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest request) {
        Map<String, String> errors = validateRequest(request);
        if (!errors.isEmpty()) {

        }

        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getUsername(),
                request.getPassword(),
                request.getBusinessName(),
                request.getPhone(),
                request.getRole()
        );

        return ResponseEntity.ok(userService.createUser(user));
    }

    private Map<String, String> validateRequest(RegisterUserRequest request) {
        Map<String, String> errors = new HashMap<>();
        if (isNullOrEmpty(request.getFirstName())) errors.put("firstName", "First name is required");
        if (isNullOrEmpty(request.getLastName())) errors.put("lastName", "Last name is required");
        // Add other validations
        return errors;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = userService.authenticateUser(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (isAuthenticated) {
            return ResponseEntity.ok().body(new LoginResponse("Login successful"));
        } else {
            return ResponseEntity.badRequest().body(new LoginResponse("Invalid credentials"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable int id) {
        return ResponseEntity.ok(userService.findUserByID(id));
    }
}

@Data
class RegisterUserRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String businessName;
    private String  phone;
    private String role;
}

@Data
class LoginRequest {
    private String username;
    private String password;
}

@Data
class LoginResponse {
    private String message;

    public LoginResponse(String message) {
        this.message = message;
    }
}