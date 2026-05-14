package jtag.internship_project.controller;

import jtag.internship_project.entities.User;
import jtag.internship_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

	@Autowired
	private UserService userService;

	// Register a new user
	@PostMapping("/register")
	public ResponseEntity<User> registerUser(@Valid @RequestBody User user) {
		User createdUser = userService.registerUser(user);
		return ResponseEntity.ok(createdUser);
	}

	// Get user by ID
	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		User user = userService.getUserById(id);
		return ResponseEntity.ok(user);
	}
}
