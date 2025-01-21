package com.Supplify.Supplify.controllers;
import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.Services.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterUserRequest request) {
        User user = new User(
                request.getFirstName(),
                request.getLastName(),
                request.getUsername(),
                request.getPassword(),
                request.getBusiness_name(),
                request.getPhone()
        );
        return ResponseEntity.ok(userService.createUser(user));
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
    private String business_name;
    private int phone;
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