# LeaveFlow

Role-based Leave Management System built with Java 21, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, and MySQL.

## Features

- JWT-based stateless authentication
- Role-based access for Admin, Manager, and Employee
- Employee leave request workflows
- Manager review and approval/rejection workflows
- Admin leave type management and organization-wide leave records

## Requirements

- Java 21
- Maven (or the included Maven wrapper)
- MySQL

## Local setup

1. Create a MySQL database, for example `practicedb`.
2. Copy `.env.example` to `.env`.
3. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` to your local MySQL settings.
4. Generate a new Base64 JWT secret containing at least 32 random bytes and set `JWT_SECRET` in `.env`. Do not reuse or commit an old signing secret.
5. Run the application from the project root:

   - Windows: `mvnw.cmd spring-boot:run`
   - macOS/Linux: `./mvnw spring-boot:run`

The application loads `.env` locally through Spring Boot's config import. The `.env` file is ignored by Git. In deployment, set the same variables in your hosting provider's environment-variable settings.

## Environment variables

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_URL` (defaults to `http://localhost:5173`)
- `PORT` (defaults to `8080`)

## Security notes

- Never commit `.env` or real credentials.
- `.env.example` contains placeholders only.
- Use a separate strong JWT secret and database credentials in production.
- Configure `FRONTEND_URL` to your deployed frontend origin.
- Review and use only dummy user data in a public repository.
