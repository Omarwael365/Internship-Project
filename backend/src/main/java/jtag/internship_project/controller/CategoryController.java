package jtag.internship_project.controller;

import jtag.internship_project.entities.Category;
import jtag.internship_project.entities.User;
import jtag.internship_project.service.CategoryService;
import jtag.internship_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private UserService userService;

	// Get all categories for a user
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Category>> getCategoriesByUser(@PathVariable Long userId) {
		User user = userService.getUserById(userId);
		List<Category> categories = categoryService.getCategoriesByUser(user);
		return ResponseEntity.ok(categories);
	}

	// Create a new category for a user
	@PostMapping("/user/{userId}")
	public ResponseEntity<Category> createCategory(@PathVariable Long userId, @Valid @RequestBody Category category) {
		User user = userService.getUserById(userId);
		category.setUser(user);
		Category createdCategory = categoryService.createCategory(category);
		return ResponseEntity.ok(createdCategory);
	}
}
