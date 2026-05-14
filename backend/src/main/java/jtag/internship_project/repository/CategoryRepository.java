package jtag.internship_project.repository;

import jtag.internship_project.entities.Category;
import jtag.internship_project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	List<Category> findByUser(User user);

	Optional<Category> findByUserAndName(User user, String name);
}
