package jtag.internship_project.repository;

import jtag.internship_project.entities.Transaction;
import jtag.internship_project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
	List<Transaction> findByUser(User user);
}
