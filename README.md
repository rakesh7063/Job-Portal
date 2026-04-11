# Job Portal Backend (Spring Boot 3 + JWT + Docker)

Secure REST API where **recruiters post jobs** and **candidates apply**. This repo aligns with the **Job Portal Backend Assignment (Secure + Dockerized)** deliverables: JWT security, Docker, README, tests, and **sample credentials** for manual testing.

## Tech
- Java 17+, Spring Boot 3.x
- Spring Security 6 + JWT (`ROLE_CANDIDATE`, `ROLE_RECRUITER`)
- MySQL 8 + Spring Data JPA (H2 in-memory for automated tests)
- email via Spring Mail (SMTP)
- OpenAPI / Swagger UI: `/swagger-ui.html` (also `/swagger-ui/index.html`)

---

## Sample credentials (assignment deliverable)

On startup (default or `docker` profile, **not** in tests), the API seeds **two demo accounts** if those emails are not already registered. Password is the same for both:

| Role | Email | Password |
|------|--------|----------|
| Candidate | `candidate@test.com` | `Pass@123` |
| Recruiter | `recruiter@test.com` | `Pass@123` |

Implementation: `DataLoader` in `com.jobportal.security` (BCrypt-hashed passwords in the database).

Use these to **login** immediately after the app starts. Do **not** register the same emails again (registration will return “email already registered”).

---

## Run with Docker

From the `Backend` directory:

```bash
docker compose up --build
```

- **API:** `http://localhost:8080`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **MySQL:** The `mysql` service sets `MYSQL_DATABASE=job_portal`, so the schema is created on first run when the data volume is new. The API waits until MySQL passes its healthcheck before starting.
- **JDBC:** The app uses `createDatabaseIfNotExist=true` in the default URLs so, if your MySQL user is allowed to create schemas, connecting can create `job_portal` when missing (useful for local MySQL without manual `CREATE DATABASE`).

### Email notifications (optional)

When a candidate applies, the API can email the recruiter and the candidate if SMTP is enabled.

| Variable | Description |
|----------|-------------|
| `MAIL_ENABLED` | `true` / `false` (Docker profile defaults to `false`) |
| `MAIL_HOST` | Default `smtp.gmail.com` |
| `MAIL_PORT` | Default `587` |
| `MAIL_USERNAME` | SMTP user |
| `MAIL_PASSWORD` | App password (e.g. Google App Password) — never commit |
| `MAIL_FROM` | From address |

See inline comments in `application.properties` / `application-docker.properties` for Gmail setup notes.

---

## Run locally (without Docker)

1. **MySQL:** Ensure MySQL is running. Default connection: `jdbc:mysql://localhost:3306/job_portal?createDatabaseIfNotExist=true` with user `root` / `root` (override with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).
2. **Start the API** (from `Backend`):

```bash
./mvnw spring-boot:run
```

---

## Tests

```bash
./mvnw test
```

The **`test`** profile uses **H2 in-memory** (see `src/test/resources/application-test.properties`), so you do **not** need Docker or MySQL to run unit tests and `BackendApplicationTests`. Sample user seeding (`DataLoader`) is **disabled** under the `test` profile.

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

### Post a job (recruiter JWT)

```bash
curl -X POST http://localhost:8080/api/jobs ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <TOKEN>" ^
  -d "{\"title\":\"Java Dev\",\"description\":\"Spring Boot work\",\"requiredSkills\":\"Java,Spring\",\"experienceRequired\":2,\"location\":\"Kolkata\"}"
```

### Apply to a job (candidate JWT)

```bash
curl -X POST http://localhost:8080/api/jobs/1/apply ^
  -H "Authorization: Bearer <TOKEN>"
```

---

## Full manual flow (register new users)

If you prefer not to use seeded emails, register **different** addresses than `candidate@test.com` / `recruiter@test.com`.

### Register a recruiter

```bash
curl -X POST http://localhost:8080/api/auth/register/recruiter ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Rec 1\",\"company\":\"ACME\",\"email\":\"recruiter2@test.com\",\"password\":\"Pass@123\"}"
```

### Register a candidate

```bash
curl -X POST http://localhost:8080/api/auth/register/candidate ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Cand 1\",\"email\":\"candidate2@test.com\",\"password\":\"Pass@123\",\"experience\":3,\"skills\":\"Java,Spring\",\"location\":\"Kolkata\"}"
```

---

## API summary (assignment + bonuses)

**Core (assignment):**
- `POST /api/auth/register/candidate`
- `POST /api/auth/register/recruiter`
- `POST /api/auth/login`
- `GET /api/candidates/profile` (candidate)
- `PUT /api/candidates/profile` (candidate)
- `GET /api/jobs/search?skill=Java&location=Kolkata`
- `POST /api/jobs/{id}/apply` (candidate)
- `POST /api/jobs` (recruiter)
- `GET /api/jobs/mine` (recruiter)
- `GET /api/applications/{jobId}` (recruiter, own jobs)
- `GET /api/jobs` (public)
- `GET /api/jobs/{id}` (public)

**Bonuses implemented (see code / Swagger):**
- Pagination on job listing/search
- Multi-skill search
- Email notifications on application (optional SMTP)
- Swagger / OpenAPI UI
- Spring Boot test context with H2; service-layer unit tests (JUnit + Mockito)
- Spring Cache on read-heavy job endpoints (replace with Redis in production if needed)

---

## Assignment checklist (from spec)

| Requirement | Status |
|-------------|--------|
| Entities: Candidate, Recruiter, Job, JobApplication | Implemented |
| Auth + role APIs | Implemented |
| Spring Security 6+, JWT, BCrypt, role-based access | Implemented |
| Docker + Compose with DB | `Dockerfile`, `docker-compose.yml` |
| Java 17+, Boot 3, JPA, MySQL (H2 for tests) | Implemented |
| Swagger (optional) | Implemented |
| JUnit + Mockito (service tests) | Implemented |
| README + sample credentials | This file + `DataLoader` |

Optional Postman collection is not bundled; you can import OpenAPI from `/v3/api-docs` into Postman.
