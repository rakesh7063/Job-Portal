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
- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Java 17+, Spring Boot 3.x, Spring Security 6 + JWT, Spring Data JPA, Spring AI, Gemini AI
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
# Visual Guide - New Features

## 🎬 Feature Flows

### Feature 1: Resume Upload Flow
```
┌─────────────────┐
│  Candidate      │
│  Logs in        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Profile Page                   │
│  (CandidateProfilePage.jsx)    │
└────────┬────────────────────────┘
         │
         ▼ New Resume Section
    ┌─────────────────┐
    │ 📄 Resume       │
    │ No upload ⬜   │
    │ [Upload Button] │
    └────────┬────────┘
             │
             ▼ Select PDF
        ┌─────────────┐
        │ Uploading.. │
        │ ▓▓▓▓▓░░░░░ │
        └────────┬────┘
                 │
                 ▼
        ┌──────────────┐
        │ ✓ Uploaded   │ ← Success!
        │ ✓ Resume     │
        └──────────────┘
         
Backend Flow:
CandidateProfilePage.jsx
    ↓ uploadResume(file)
CandidateController
    ↓ /api/candidates/profile/resume
CandidateServiceImpl.uploadResume()
    ↓ Save to uploads/resumes/
Database
    ↓ Update resumePath
```

---

### Feature 2: Recruiter View Applicants + Resume Download
```
┌──────────────────┐
│ Recruiter        │
│ Logs in          │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────┐
    │ My Jobs         │
    │ (My Jobs Page)  │
    └────────┬────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Applicants [Button]    │
    │ 🤖 AI Analysis [NEW]   │
    └────────┬───────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ Applicants Page              │
    │ (RecruiterApplicantsPage.jsx)│
    │                              │
    │ Alice Johnson                │
    │ alice@example.com            │
    │ 7 yrs • Java, Spring         │
    │ [📄 Resume] [View Details]   │◄─ NEW Download
    │                              │
    │ Bob Smith                    │
    │ bob@example.com              │
    │ 3 yrs • JavaScript           │
    │ [No resume] [View Details]   │
    └──────────────────────────────┘
             │
             ▼ Click [📄 Resume]
    ┌──────────────────┐
    │ Download Started │
    │ candidate_resume │
    │ .pdf             │
    └──────────────────┘
```

---

### Feature 3: Gemini AI Analysis (Most Powerful!)
```
┌──────────────────────────┐
│ Recruiter on My Jobs     │
│ Sees 🤖 AI Analysis [NEW]│ ◄─ Blue Button
└──────────┬───────────────┘
           │
           ▼
┌────────────────────────────────────┐
│ AI Analysis Page [NEW]              │
│ (RecruiterAiAnalysisPage.jsx)      │
│                                    │
│ Job: Senior Java Developer         │
│ Applicants: 12                     │
│                                    │
│ [🚀 Run AI Analysis]               │◄─ Click Here
│                                    │
│ All Applicants:                    │
│ • Alice Johnson                    │
│ • Bob Smith                        │
│ • Charlie Brown                    │
│ ... (12 total)                     │
└──────────┬─────────────────────────┘
           │
           ▼ Click Button
           │
      [Processing...]
      Analyzing with Gemini AI
      [████████░░]
           │
           ▼ (5-10 seconds)
           │
┌──────────────────────────────────────────┐
│ TOP 5 CANDIDATES RANKED                  │
│ (Powered by Gemini AI)                   │
├──────────────────────────────────────────┤
│                                          │
│ 🥇 #1 Alice Johnson         92% ████████│
│   ✅ Highly Recommended                  │
│   Java • Spring Boot • Docker            │
│   [View Details] [Download Resume]       │
│                                          │
│ 🥈 #2 Charlie Brown         78% ██████░ │
│   ✅ Recommended                         │
│   Java • Spring Boot                     │
│   [View Details] [Download Resume]       │
│                                          │
│ 🥉 #3 Diana White           65% █████░░ │
│   ⚠️ Consider                            │
│   Java (Junior Level)                    │
│   [View Details] [Download Resume]       │
│                                          │
│ #4 Eve Martinez             58% ████░░░ │
│   ⚠️ Consider                            │
│   Frontend Background                    │
│   [View Details] [Download Resume]       │
│                                          │
│ #5 Frank Jones              42% ███░░░░ │
│   ❌ Not Recommended                     │
│   No Relevant Background                 │
│   [View Details] [Download Resume]       │
│                                          │
└──────────────────────────────────────────┘
           │
           ▼ Click "View Details"
           │
┌──────────────────────────────────────────┐
│ Detailed Analysis for Alice Johnson      │
│                                          │
│ Match Score: 92/100                      │
│ Recommendation: Highly Recommended       │
│                                          │
│ ✓ STRENGTHS:                             │
│   • 7 years relevant Java experience     │
│   • Expert-level Spring Boot knowledge   │
│   • Strong Docker/containerization       │
│   • Aligned with team location           │
│                                          │
│ MATCHING SKILLS:                         │
│   Java • Spring Boot • Microservices     │
│                                          │
│ Analysis Summary:                        │
│ "Excellent match for Senior Java role.  │
│  Strong architecture background,         │
│  proven track record with modern         │
│  technologies, located in target area."  │
│                                          │
│ [Download Resume] [Back]                 │
└──────────────────────────────────────────┘

Backend Flow:
RecruiterAiAnalysisPage.jsx
    ↓ analyzeJobApplicants(jobId)
AiAnalysisController
    ↓ POST /api/ai/jobs/{jobId}/analyze
For each applicant:
    ↓ analyzeSingleCandidate(job, app)
GeminiAiService.analyzeCandidateMatch()
    ↓ Send to Google Gemini API
Gemini API
    ↓ AI analyzes candidate
Parse Response
    ↓ Extract match score, recommendation
Sort by matchScore DESC, take top 5
    ↓ Return JobAiAnalysisResponse
```

---

## 🎨 UI Layout

### Candidate Profile - Resume Section
```
┌─────────────────────────────────────┐
│ Your Profile                        │
├─────────────────────────────────────┤
│                                     │
│ [Profile Form Fields...]            │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Resume                              │
│ ┌──────────────────────┐            │
│ │ ✓ Resume uploaded    │◄─ NEW      │
│ └──────────────────────┘            │
│                                     │
│ [Upload Resume (PDF)]    ◄─ NEW     │
│                                     │
└─────────────────────────────────────┘
```

### Recruiter - Applicants Page
```
┌─────────────────────────────────────┐
│ ← Back | Job Details | 🤖 AI Analysis│◄─ NEW Button
├─────────────────────────────────────┤
│ Applicants                          │
│ "Review all candidates..."          │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Alice Johnson                   │ │
│ │ alice@example.com               │ │
│ │ 7y exp • Java, Spring • NYC     │ │
│ │ Applied: 2 hours ago            │ │
│ │                         📄 Resume│◄─ NEW Download
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Bob Smith                       │ │
│ │ bob@example.com                 │ │
│ │ 3y exp • JavaScript • Austin    │ │
│ │ Applied: 5 hours ago            │ │
│ │                    No resume ⚠️  │◄─ NEW Status
│ └─────────────────────────────────┘ │
│                                     │
│ [Load More...]                      │
│                                     │
└─────────────────────────────────────┘
```

### Recruiter - AI Analysis Page
```
┌──────────────────────────────────────┐
│ 🤖 AI Candidate Analysis             │
│ "Top 5 ranked by match score"        │◄─ NEW Page
├──────────────────────────────────────┤
│                                      │
│ Applicants (12)  [🚀 Run AI Analysis]│◄─ NEW Button
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ #1 Alice 92% ████████ ✅         │ │
│ │ ▶ View Details                   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ #2 Charlie 78% ██████░ ✅        │ │
│ │ ▶ View Details                   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ #3 Diana 65% █████░░ ⚠️          │ │
│ │ ▶ View Details                   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ #4 Eve 58% ████░░░░ ⚠️           │ │
│ │ ▶ View Details                   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ #5 Frank 42% ███░░░░░ ❌         │ │
│ │ ▶ View Details                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ All Applicants                       │
│ • Alice Johnson                      │
│ • Bob Smith                          │
│ • Charlie Brown                      │
│ ...                                  │
│                                      │
└──────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
CANDIDATE SIDE
    │
    ├─► Upload Resume
    │   ├─► Select PDF
    │   ├─► Validate (PDF only)
    │   ├─► Upload to /api/candidates/profile/resume
    │   ├─► Save to uploads/resumes/candidate-{id}-{ts}.pdf
    │   └─► Update Candidate.resumePath
    │
    └─► Profile Shows ✓ Resume uploaded


RECRUITER SIDE - TRADITIONAL
    │
    ├─► View My Jobs
    │   │
    │   └─► Click "Applicants"
    │       ├─► Fetch /api/applications/{jobId}
    │       ├─► Display Candidate list
    │       ├─► Show resume status
    │       │
    │       └─► [📄 Resume] Button
    │           ├─► GET /api/applications/resume/{appId}
    │           ├─► Check authorization (recruiter == job poster)
    │           ├─► Check resume exists
    │           └─► Download PDF


RECRUITER SIDE - AI ANALYSIS (NEW!)
    │
    ├─► View My Jobs
    │   │
    │   └─► Click "🤖 AI Analysis" (NEW)
    │       │
    │       ├─► Go to RecruiterAiAnalysisPage
    │       │
    │       ├─► Fetch /api/ai/jobs/{jobId}/applicants
    │       │   └─► Display all applicants
    │       │
    │       └─► [🚀 Run AI Analysis]
    │           │
    │           ├─► POST /api/ai/jobs/{jobId}/analyze
    │           │
    │           ├─► For each applicant:
    │           │   │
    │           │   ├─► Fetch from DB (name, skills, exp, location)
    │           │   ├─► Extract resume path
    │           │   │
    │           │   └─► Call GeminiAiService.analyzeCandidateMatch()
    │           │       ├─► Build prompt with job desc + candidate info
    │           │       ├─► POST to Gemini API
    │           │       ├─► Parse response (JSON)
    │           │       ├─► Extract matchScore, recommendation
    │           │       └─► Return CandidateAnalysisResult
    │           │
    │           ├─► Sort by matchScore DESC
    │           ├─► Take top 5
    │           └─► Return JobAiAnalysisResponse
    │               │
    │               └─► Display as ranked list
    │                   │
    │                   └─► [View Details]
    │                       └─► Show full analysis
    │                           ├─► Match score with color
    │                           ├─► Recommendation level
    │                           ├─► Matching skills
    │                           ├─► Strengths
    │                           └─► Concerns
```

---

## 🔄 State Management

### Frontend State (React)
```
RecruiterAiAnalysisPage State:
├─ jobId (from URL param)
├─ loading (fetching applicants)
├─ analyzing (running AI analysis)
├─ applicants (array of applicants)
├─ analysis (JobAiAnalysisResponse)
├─ err (error message)
└─ expandedCandidateId (for details view)

CandidateProfilePage State:
├─ profile (current profile data)
├─ form (form fields)
├─ loading (fetching profile)
├─ saving (updating profile)
├─ resumeUploading (uploading resume)
├─ err (error message)
└─ ok (success message)
```

---

## 🎯 Color Coding System

```
Match Score Range → Color → Meaning
─────────────────────────────────────
80-100           → 🟢 Green   → Highly Recommended
60-79            → 🟠 Orange  → Recommended
40-59            → 🟡 Yellow  → Consider
0-39             → 🔴 Red     → Not Recommended

Visual Implementation:
┌──────────────────────┐
│ Alice 92/100 ████████│ ← Green bar
│ ✅ Highly Recommended│
└──────────────────────┘

┌──────────────────────┐
│ Bob 65/100 █████░░░░ │ ← Orange bar
│ ✅ Recommended       │
└──────────────────────┘

┌──────────────────────┐
│ Charlie 42/100 ███░░ │ ← Red bar
│ ⚠️ Consider          │
└──────────────────────┘
```

---

## 🔐 Authorization Checks

```
Resume Upload:
✓ User must be authenticated (ROLE_CANDIDATE)
✓ Can only upload for own profile
✓ File must be PDF

Resume Download:
✓ User must be authenticated (ROLE_RECRUITER)
✓ Recruiter must have posted the job
✓ Application must exist
✓ Resume must exist at path

AI Analysis - Full Job:
✓ User must be authenticated (ROLE_RECRUITER)
✓ Recruiter must have posted the job

AI Analysis - Single Candidate:
✓ User must be authenticated (ROLE_RECRUITER)
✓ Recruiter must have posted the job
✓ Application must exist
✓ Candidate must have applied to job
```

---

**Visual Guide Complete!** 📊
---

## Screenshots

<img width="1886" height="875" alt="image" src="https://github.com/user-attachments/assets/1ef83949-d69a-445a-ba72-b33490d2602d" />

<img width="1898" height="869" alt="image" src="https://github.com/user-attachments/assets/27a22e05-9783-4446-b372-7c45ca68cf3d" />
