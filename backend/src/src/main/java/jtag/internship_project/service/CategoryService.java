package jtag.internship_project.service;

import jtag.internship_project.entities.Category;
import jtag.internship_project.entities.User;
import jtag.internship_project.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository categoryRepository;

	public Category createCategory(Category category) {
		categoryRepository.findByUserAndName(category.getUser(), category.getName()).ifPresent(c -> {
			throw new IllegalArgumentException("Category already exists");
		});
		return categoryRepository.save(category);
	}

	public List<Category> getCategoriesByUser(User user) {
		return categoryRepository.findByUser(user);
	}

	public Category getCategoryById(Long id) {
		return categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found"));
	}
}
