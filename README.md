# 💰 Expense Tracker — Internship Project

A full-stack **Expense Tracking** web application built with **Angular 20** (frontend) and **Spring Boot 3.5** (backend), backed by an **Oracle Database**. Users can register, log in, record expenses by category, and view spending summaries — all secured with **JWT authentication**.

---

## 📸 Features

- **User Registration & Login** — Secure sign-up with email, password, and income details
- **JWT Authentication** — Stateless token-based security with auto-interceptor on the frontend
- **Expense Entry** — Add expenses with amount, category, and date
- **Category Management** — Create and organize spending categories per user
- **Spending Dashboard** — View expenses grouped by category with totals
- **Balance Tracking** — Real-time remaining balance (income minus total expenses)
- **Overspend Protection** — Prevents adding expenses that exceed the remaining balance

---

## 🏗️ Tech Stack

| Layer        | Technology                                       |
|-------------|--------------------------------------------------|
| **Frontend** | Angular 20, TypeScript, RxJS                     |
| **Backend**  | Spring Boot 3.5, Java 21, Spring Security, JPA   |
| **Database** | Oracle Database XE                               |
| **Auth**     | JWT (JSON Web Tokens) via jjwt                   |
| **API Docs** | Swagger / OpenAPI (springdoc)                    |
| **Build**    | Angular CLI, Maven                               |

---

## 📁 Project Structure

```
├── frontend/                    # Angular 20 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── auth/        # Login & Signup forms
│   │   │   │   ├── expense-entry/
│   │   │   │   ├── expense-totals/
│   │   │   │   └── user-panel/
│   │   │   ├── interceptors/    # HTTP auth interceptor
│   │   │   ├── pages/           # Dashboard page
│   │   │   └── services/        # API & auth services
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── server.ts            # SSR entry point
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json          # Dev proxy → backend:9098
│   └── tsconfig.json
│
├── backend/                     # Spring Boot 3.5 application
│   ├── src/main/java/jtag/internship_project/
│   │   ├── controller/          # REST API controllers
│   │   ├── entities/            # JPA entity classes
│   │   ├── repository/          # Spring Data JPA repos
│   │   ├── security/            # JWT filter, util, config
│   │   └── service/             # Business logic layer
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── database/                    # Oracle DDL scripts
│   └── schema.sql
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool             | Version      |
|-----------------|-------------|
| **Node.js**      | 18+          |
| **npm**          | 9+           |
| **Java JDK**     | 21           |
| **Maven**        | 3.9+         |
| **Oracle DB XE** | 21c or later |

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/internship-project.git
cd internship-project
```

### 2. Set Up the Database

1. Start your Oracle XE instance
2. Connect as a DBA user and create the project schema:
   ```sql
   CREATE USER project IDENTIFIED BY your_password;
   GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO project;
   ```
3. Run the DDL script to create tables, sequences, and triggers:
   ```bash
   # Using SQL*Plus or Oracle SQL Developer
   @database/schema.sql
   ```

### 3. Configure the Backend

Edit `backend/src/main/resources/application.properties` and set your database credentials:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
```

### 4. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will start on **http://localhost:9098**

### 5. Run the Frontend

```bash
cd frontend
npm install
npm start
```

The Angular app will start on **http://localhost:4200** and proxy API requests to the backend.

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint               | Auth     | Description              |
|--------|------------------------|----------|--------------------------|
| POST   | `/api/users/register`  | Public   | Register a new user      |
| POST   | `/api/auth/login`      | Public   | Login & receive JWT      |

### Users

| Method | Endpoint           | Auth     | Description          |
|--------|--------------------|----------|----------------------|
| GET    | `/api/users/{id}`  | JWT      | Get user by ID       |

### Transactions

| Method | Endpoint                       | Auth | Description                     |
|--------|--------------------------------|------|---------------------------------|
| GET    | `/api/transactions/user/{id}`  | JWT  | Get all transactions for a user |
| POST   | `/api/transactions/user/{id}`  | JWT  | Create a new transaction        |

### Categories

| Method | Endpoint                      | Auth | Description                    |
|--------|-------------------------------|------|--------------------------------|
| GET    | `/api/categories/user/{id}`   | JWT  | Get all categories for a user  |
| POST   | `/api/categories/user/{id}`   | JWT  | Create a new category          |

> **Note:** After starting the backend, Swagger UI is available at **http://localhost:9098/swagger-ui.html**

---

## 🗄️ Database Schema

The application uses three core tables in Oracle:

| Table      | Description                              |
|-----------|------------------------------------------|
| `USERS`    | Stores user accounts (name, email, hash) |
| `CATEGORY` | Spending categories per user             |
| `TXN`      | Individual income/expense transactions   |

**Relationships:**
- `USERS` → `CATEGORY` (one-to-many)
- `USERS` → `TXN` (one-to-many)
- `CATEGORY` → `TXN` (one-to-many)

Auto-incrementing IDs use Oracle sequences (`SEQ_USERS`, `SEQ_CATEGORY`, `SEQ_TXN`) with before-insert triggers.

---

## 🔐 Authentication Flow

1. User registers via `POST /api/users/register` — password is hashed with **BCrypt**
2. User logs in via `POST /api/auth/login` — receives a **JWT token** (valid for 10 hours)
3. Frontend stores the token in `localStorage`
4. An Angular HTTP interceptor attaches `Authorization: Bearer <token>` to all subsequent requests
5. Backend `JwtFilter` validates the token and sets the security context

---

## 🛠️ Development Notes

- **Proxy Config**: During development, Angular proxies `/api/*` requests to `http://localhost:9098` (configured in `proxy.conf.json`)
- **SSR**: The frontend includes Angular SSR support (server-side rendering) — see `server.ts`
- **Chart.js**: The `chart.js` dependency is included in `package.json` for future charting features

---

## 📜 License

This project was built as part of an internship program.
