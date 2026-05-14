package jtag.internship_project.controller;

import jtag.internship_project.entities.User;
import jtag.internship_project.security.JwtUtil;
import jtag.internship_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        // Basic null checks for email and password
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        return userService.getUserByEmail(user.getEmail()).map(existingUser -> {
            // Check password match
            if (!userService.matchesPassword(user.getPassword(), existingUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }
            // Generate JWT token
            String token = jwtUtil.generateToken(existingUser.getId());
            return ResponseEntity.ok(new AuthResponse(token));
        }).orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password"));
    }

    // Response class for token
    public record AuthResponse(String token) {
    }
}
