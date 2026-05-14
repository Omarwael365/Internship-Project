package jtag.internship_project.service;

import jtag.internship_project.entities.Transaction;
import jtag.internship_project.entities.User;
import jtag.internship_project.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

	@Autowired
	private TransactionRepository transactionRepository;

	public Transaction createTransaction(Transaction transaction) {
		if (transaction.getAmount() <= 0) {
			throw new IllegalArgumentException("Amount must be positive");
		}
		if (transaction.getType() == null) {
			throw new IllegalArgumentException("Transaction type is required");
		}
		return transactionRepository.save(transaction);
	}

	public List<Transaction> getTransactionsByUser(User user) {
		return transactionRepository.findByUser(user);
	}

	public Transaction getTransactionById(Long id) {
		return transactionRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
	}
}
