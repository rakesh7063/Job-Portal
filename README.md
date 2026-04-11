# Job Portal Backend (Spring Boot 3 + JWT + Docker)

Secure REST API where **recruiters post jobs** and **candidates apply**.

## Tech
- Java 17, Spring Boot 3.x
- Spring Security 6 + JWT (roles: `ROLE_CANDIDATE`, `ROLE_RECRUITER`)
- MySQL 8 + Spring Data JPA
- Optional email via Spring Mail (SMTP)
- OpenAPI/Swagger UI at `/swagger-ui.html`

## Run with Docker

From the `Backend` directory:

```bash
docker compose up --build
```

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- MySQL is started as a service; the API waits for MySQL to be healthy before accepting traffic.

### Email notifications optional

When a candidate applies to a job, the API can email the recruiter and the candidate.

- **Local (`spring-boot:run`)**: mail is **on** by default (`MAIL_ENABLED` defaults to true), but nothing is sent until you set `MAIL_USERNAME` and `MAIL_PASSWORD` (or `spring.mail.username` / `spring.mail.password`) via environment variables or Run Configuration. On startup the log line states whether SMTP is enabled.
- **Docker (`application-docker`)**: mail defaults **off** so the stack runs without SMTP; set `MAIL_ENABLED=true` and credentials to send from a container.

| Variable | Description |
|----------|-------------|
| `MAIL_ENABLED` | `true` / `false` (Docker defaults false; local defaults true) |
| `MAIL_HOST` | Default `smtp.gmail.com` (this project is set up for Gmail) |
| `MAIL_PORT` | SMTP port (default `587`) |
| `MAIL_USERNAME` | Default sender Gmail address (override if you use another mailbox) |
| `MAIL_PASSWORD` | **Google App Password** for that Gmail account (requires 2-Step Verification). Not your normal Gmail login password. Never commit. |
| `MAIL_FROM` | Usually the same as `MAIL_USERNAME` |

Create an App Password: Google Account → **Security** → **2-Step Verification** (turn on if needed) → **App passwords** → generate one for “Mail” and set it as `MAIL_PASSWORD`.

Do not commit passwords in `application.properties`; use env vars or a local, gitignored file.

**If you see `535 Authentication credentials invalid`:** confirm `MAIL_HOST=smtp.gmail.com`, username is the full `@gmail.com` address, and the App Password was copied correctly (spaces are stripped automatically). Revoke and create a new App Password if it was ever leaked.

## Run locally (without Docker)

1) Ensure MySQL is running and a DB exists:
- DB: `job_portal`
- user/pass (default): `root` / `root`

2) Start API (from `Backend`):

```bash
./mvnw spring-boot:run
```

Set `MAIL_USERNAME` and `MAIL_PASSWORD` in the environment for SMTP (see table above). To turn mail off locally, set `MAIL_ENABLED=false`.

## Sample flow (curl)

### 1) Register a recruiter

```bash
curl -X POST http://localhost:8080/api/auth/register/recruiter ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Rec 1\",\"company\":\"ACME\",\"email\":\"recruiter@test.com\",\"password\":\"Pass@123\"}"
```

### 2) Login (get JWT)

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"recruiter@test.com\",\"password\":\"Pass@123\"}"
```

Copy `token` from response.

### 3) Post a job (recruiter)

```bash
curl -X POST http://localhost:8080/api/jobs ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <TOKEN>" ^
  -d "{\"title\":\"Java Dev\",\"description\":\"Spring Boot work\",\"requiredSkills\":\"Java,Spring\",\"experienceRequired\":2,\"location\":\"Kolkata\"}"
```

### 4) Register a candidate

```bash
curl -X POST http://localhost:8080/api/auth/register/candidate ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Cand 1\",\"email\":\"candidate@test.com\",\"password\":\"Pass@123\",\"experience\":3,\"skills\":\"Java,Spring\",\"location\":\"Kolkata\"}"
```

### 5) Candidate applies to a job

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"candidate@test.com\",\"password\":\"Pass@123\"}"
```

```bash
curl -X POST http://localhost:8080/api/jobs/1/apply ^
  -H "Authorization: Bearer <TOKEN>"
```

## API summary (as per assignment)
- `POST /api/auth/register/candidate`
- `POST /api/auth/register/recruiter`
- `POST /api/auth/login`
- `GET /api/candidates/profile` (candidate only)
- `PUT /api/candidates/profile` (candidate only)
- `GET /api/jobs/search?skill=Java&location=Kolkata` (public)
- **Bonus**: `GET /api/jobs?page=0&size=10` (public pagination)
- **Bonus**: `GET /api/jobs/search?skills=Java,Spring&location=Kolkata&page=0&size=10` (multi-skill + pagination)
- `POST /api/jobs/{id}/apply` (candidate only)
- `POST /api/jobs` (recruiter only)
- `GET /api/jobs/mine` (recruiter only)
- `GET /api/applications/{jobId}` (recruiter only, only for own jobs)
- `GET /api/jobs` (public)
- `GET /api/jobs/{id}` (public)

## Bonus notes
- Job listing/search endpoints are cached in-memory via Spring Cache (good for demos; replace with Redis for production).
- After a successful job application (transaction commit), optional SMTP emails notify the recruiter and confirm to the candidate when `MAIL_ENABLED=true` and SMTP credentials are configured. Failures to send mail are logged and do not roll back the application.

