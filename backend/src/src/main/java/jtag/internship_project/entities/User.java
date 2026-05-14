package jtag.internship_project.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "USERS")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
	@SequenceGenerator(name = "user_seq", sequenceName = "SEQ_USERS", allocationSize = 1)
	@Column(name = "USER_ID")
	private Long id;

	@NotBlank(message = "Full name is required")
	@Size(max = 120)
	@Column(name = "FULL_NAME", nullable = false, length = 120)
	private String fullName;

	@NotBlank(message = "Email is required")
	@Email(message = "Email should be valid")
	@Size(max = 160)
	@Column(name = "EMAIL", nullable = false, unique = true, length = 160)
	private String email;

	@NotBlank(message = "Password is required")
	@Column(name = "PASSWORD", nullable = false, length = 200)
	private String password;

	@NotNull
	@PositiveOrZero
	@Column(name = "INCOME", nullable = false)
	private Double income;

	@NotNull
	@PositiveOrZero
	@Column(name = "EXPENSES", nullable = false)
	private Double expenses = 0.0;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Category> categories;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Transaction> transactions;

	public User() {
	}

	public User(Long id, String fullName, String email, String password, Double income, Double expenses) {
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.income = income;
		this.expenses = expenses;
	}

	// ================= Getters and Setters =================

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Double getIncome() {
		return income;
	}

	public void setIncome(Double income) {
		this.income = income;
	}

	public Double getExpenses() {
		return expenses;
	}

	public void setExpenses(Double expenses) {
		this.expenses = expenses;
	}

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	// ================= Password Hashing Before Save =================

	@PrePersist
	@PreUpdate
	private void hashPassword() {
		if (this.password != null && !this.password.startsWith("$2a$")) { // avoid double hashing
			this.password = new BCryptPasswordEncoder().encode(this.password);
		}
	}
}