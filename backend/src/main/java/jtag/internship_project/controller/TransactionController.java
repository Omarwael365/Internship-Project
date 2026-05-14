package jtag.internship_project.controller;

import jtag.internship_project.entities.Transaction;
import jtag.internship_project.entities.User;
import jtag.internship_project.service.TransactionService;
import jtag.internship_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private UserService userService;

	// Get all transactions for a user
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Transaction>> getTransactionsByUser(@PathVariable Long userId) {
		User user = userService.getUserById(userId);
		List<Transaction> transactions = transactionService.getTransactionsByUser(user);
		return ResponseEntity.ok(transactions);
	}

	// Create a new transaction
	@PostMapping("/user/{userId}")
	public ResponseEntity<Transaction> createTransaction(@PathVariable Long userId,
			@Valid @RequestBody Transaction transaction) {
		User user = userService.getUserById(userId);
		transaction.setUser(user);
		Transaction createdTransaction = transactionService.createTransaction(transaction);
		return ResponseEntity.ok(createdTransaction);
	}
}
