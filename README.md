# Rojgar — Job Portal (Full-Stack)

**Rojgar** is a job portal where **recruiters post jobs** and **candidates search & apply**.

This repository contains:
- `frontend/`: React + Vite web app
- `Backend/`: Spring Boot 3 REST API (JWT-secured) + MySQL + Swagger

## Features
- **Candidate**
  - Register/login
  - View and search jobs (skill/location, pagination)
  - Apply to jobs
  - Manage profile
- **Recruiter**
  - Register/login
  - Post jobs
  - View jobs posted by you
  - View applications for your jobs
- **Platform**
  - JWT auth with roles (`ROLE_CANDIDATE`, `ROLE_RECRUITER`)
  - Swagger / OpenAPI docs
  - Optional email notifications on application (SMTP)
  - Dockerized backend + DB

## Tech stack
- **Frontend**: React + Vite
- **Backend**: Java 17+, Spring Boot 3.x, Spring Security 6 + JWT, Spring Data JPA
- **Database**: MySQL 8 (H2 in-memory for tests)
- **API Docs**: Swagger UI (`/swagger-ui.html` and `/swagger-ui/index.html`)

---

## Quick start (local dev)

### 1) Backend (API)

From the `Backend` directory:

```bash
./mvnw spring-boot:run
```

- **API**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`

**MySQL**: default JDBC is `jdbc:mysql://localhost:3306/job_portal?createDatabaseIfNotExist=true` with user `root` / `root`.
You can override with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

### 2) Frontend (Web)

From the `frontend` directory:

```bash
npm install
npm run dev
```

The dev server will print the local URL (commonly `http://localhost:5173`).

---

## Run backend with Docker

From the `Backend` directory:

```bash
docker compose up --build
```

- **API:** `http://localhost:8080`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **MySQL:** the `mysql` service sets `MYSQL_DATABASE=job_portal` (created on first run when the volume is new). The API waits for MySQL healthcheck before starting.

---

## Sample credentials (seeded users)

On startup (default or `docker` profile, **not** in tests), the API seeds **two demo accounts** if those emails are not already registered. Password is the same for both:

| Role | Email | Password |
|------|--------|----------|
| Candidate | `candidate@test.com` | `Pass@123` |
| Recruiter | `recruiter@test.com` | `Pass@123` |

Implementation: `DataLoader` in `com.jobportal.security`.

---

## Quick API try (seeded accounts)

### Login (candidate)

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"candidate@test.com\",\"password\":\"Pass@123\"}"
```

### Login (recruiter)

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"recruiter@test.com\",\"password\":\"Pass@123\"}"
```

Copy `token` from the response and pass `Authorization: Bearer <TOKEN>` on secured routes.

---

## API endpoints (summary)

- **Auth**
  - `POST /api/auth/register/candidate`
  - `POST /api/auth/register/recruiter`
  - `POST /api/auth/login`
- **Candidate**
  - `GET /api/candidates/profile`
  - `PUT /api/candidates/profile`
- **Jobs**
  - `GET /api/jobs` (public)
  - `GET /api/jobs/{id}` (public)
  - `GET /api/jobs/search?skill=Java&location=Kolkata`
  - `POST /api/jobs/{id}/apply` (candidate)
- **Recruiter**
  - `POST /api/jobs`
  - `GET /api/jobs/mine`
  - `GET /api/applications/{jobId}`

For the full, always-up-to-date list, use Swagger UI or `/v3/api-docs`.

---

## Email notifications (optional)

When a candidate applies, the API can email the recruiter and the candidate if SMTP is enabled.

| Variable | Description |
|----------|-------------|
| `MAIL_ENABLED` | `true` / `false` (Docker profile defaults to `false`) |
| `MAIL_HOST` | Default `smtp.gmail.com` |
| `MAIL_PORT` | Default `587` |
| `MAIL_USERNAME` | SMTP user |
| `MAIL_PASSWORD` | App password (e.g. Google App Password) — never commit |
| `MAIL_FROM` | From address |

See inline notes in `application.properties` / `application-docker.properties`.

---

## Tests (backend)

From the `Backend` directory:

```bash
./mvnw test
```

The **`test`** profile uses **H2 in-memory** (`src/test/resources/application-test.properties`), so you do **not** need Docker or MySQL. Seeded users (`DataLoader`) are **disabled** in tests.

---

## Screenshots

<img width="1886" height="875" alt="image" src="https://github.com/user-attachments/assets/1ef83949-d69a-445a-ba72-b33490d2602d" />

<img width="1898" height="869" alt="image" src="https://github.com/user-attachments/assets/27a22e05-9783-4446-b372-7c45ca68cf3d" />
