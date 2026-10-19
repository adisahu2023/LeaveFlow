# LeaveFlow – Role-Based Leave Management System

LeaveFlow is a full-stack, role-based leave management system that simplifies the process of managing employee leave requests. Employees can submit and track their leave requests, managers can review and approve or reject requests, and administrators can manage users and monitor leave records.

The application uses **React** for the frontend and **Spring Boot REST APIs** for the backend, with JWT-based authentication and role-based authorization to secure access to different modules.

## Features

### Authentication and Authorization
- User registration and login
- JWT-based authentication
- Role-based access control for employees, managers, and administrators
- Protected frontend routes and backend APIs
- Default employee role for newly registered users

### Employee Module
- View employee profile
- Create and update leave requests
- Track leave request status
- View personal leave request records

### Manager Module
- View manager dashboard
- View team leave requests
- Review leave requests
- Approve or reject leave requests
- View leave history
- Manage personal profile

### Admin Module
- View administrator profile
- Manage users
- Assign managers to employees
- Activate or deactivate user accounts
- View system-wide leave records

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Styling | Tailwind CSS |
| Backend | Java 21, Spring Boot |
| Security | Spring Security, JWT |
| ORM | Spring Data JPA, Hibernate |
| Database | MySQL |
| Build Tool | Maven |
| API Testing | Postman |
| Version Control | Git and GitHub |

## Project Structure

```text
LeaveFlow/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── .env.example
│   ├── .gitignore
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── .gitignore
└── README.md
```

*Note: The structure above is representative. Adjust it to match your actual project files.*

## Prerequisites

Install the following software before running the application:

- Java Development Kit (JDK) 21
- MySQL Server
- Node.js and npm
- Git
- A code editor such as Eclipse or VS Code

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd LeaveFlow
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual GitHub repository URL.

### 2. Configure the Database

Start MySQL and create a database:

```sql
CREATE DATABASE leaveflow;
```

### 3. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file using `.env.example` as a reference, and configure your database credentials and JWT secret.

Example configuration:

```properties
DB_URL=jdbc:mysql://localhost:3306/leaveflow
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_base64_encoded_secret
FRONTEND_URL=http://localhost:5173
PORT=8080
```

Replace the example values with your local configuration. Generate a secure, random Base64-encoded JWT secret containing at least 32 random bytes.

**Important:** Never commit your `.env` file, database passwords, or JWT secrets to GitHub.

Run the backend using the Maven wrapper.

**Windows:**

```powershell
.\mvnw.cmd spring-boot:run
```

**macOS/Linux:**

```bash
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### 4. Configure the Frontend

Open a new terminal and navigate to the frontend directory from the project root:

```bash
cd frontend
npm install
```

If your backend runs at the default address, no additional API URL configuration is required. Otherwise, create a `frontend/.env` file:

```properties
VITE_API_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite. The default address is `http://localhost:5173`.

## Authentication and Role-Based Access

LeaveFlow uses JWT authentication to secure communication between the frontend and backend.

1. A user registers through the signup page.
2. The backend assigns the default employee role to new registrations.
3. The user signs in with valid credentials.
4. The backend validates the credentials and returns a JWT.
5. The frontend uses the authenticated user's role to navigate to the appropriate dashboard.
6. Protected API requests include the JWT in the `Authorization` header.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Supported Roles

| Role | Access |
|---|---|
| `ROLE_EMPLOYEE` | Personal profile and leave requests |
| `ROLE_MANAGER` | Team leave reviews and personal profile |
| `ROLE_ADMIN` | User management and system-wide leave records |

The backend must enforce authorization independently of frontend routing to prevent unauthorized access.

## API Overview

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new account |
| POST | `/auth/login` | Authenticate a user and receive a JWT |
| Various | `/employee/**` | Employee profile and leave operations |
| Various | `/manager/**` | Manager profile and leave review operations |
| Various | `/admin/**` | Admin profile, user management, and leave records |

The exact HTTP methods and endpoints for employee, manager, and admin operations depend on the implemented controllers.

## Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | MySQL JDBC connection URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Base64-encoded JWT signing secret |
| `FRONTEND_URL` | Allowed frontend origin |
| `PORT` | Backend server port |
| `VITE_API_URL` | Backend API base URL used by the frontend |

Keep environment-specific values out of version control.

## Current Limitations and Notes

- The signup form currently includes an account activation selection, but the backend registration DTO does not yet accept or persist that field.
- Hibernate schema updates are configured for local development. Production deployments should use a controlled database migration strategy.
- Configure secure secret management, HTTPS, CORS, and appropriate database permissions before production deployment.
- Use test accounts and sample data when publishing demonstrations.

## Future Enhancements

- Email notifications for leave request status changes
- Leave balance tracking
- Leave calendar and reporting
- Pagination, sorting, and advanced filtering
- Automated backend and frontend tests
- Database migrations using Flyway or Liquibase

## Learning Outcomes

This project demonstrates practical implementation of:

- Full-stack application development using React and Spring Boot
- REST API development and integration
- JWT authentication and role-based authorization
- Database persistence using Spring Data JPA and Hibernate
- Frontend routing, form handling, and API communication using Axios
- Role-specific dashboards and CRUD operations

## Author

**Aditya Sahu**

GitHub: [Your GitHub Profile](https://github.com/adisahu2023)

LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/aditya-sahu-78185b287)

---

If you find this project useful, feel free to explore the repository and share your feedback.
