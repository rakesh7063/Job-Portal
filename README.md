# Job Portal Backend (Spring Boot 3 + JWT + Docker)

Secure REST API where **recruiters post jobs** and **candidates apply**.

## Tech
- Java 17, Spring Boot 3.x
- Spring Security 6 + JWT (roles: `ROLE_CANDIDATE`, `ROLE_RECRUITER`)
- MySQL 8 + Spring Data JPA
- OpenAPI/Swagger UI at `/swagger-ui.html`

## Run with Docker

```bash
docker compose up --build
```

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Run locally (without Docker)

1) Ensure MySQL is running and a DB exists:
- DB: `job_portal`
- user/pass (default): `root` / `root`

2) Start API:

```bash
./mvnw spring-boot:run
```

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

