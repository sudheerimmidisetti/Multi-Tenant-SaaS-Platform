# Technical Specification

**Project:** Multi-Tenant SaaS Project Management System  
**Version:** 1.0  
**Author:** Lead Developer  
**Date Updated:** October 26, 2025  

---

## 1️. System Organization Overview

This project is structured as a **monorepo**, meaning both the **backend API** and **frontend application** live together in a single repository. Everything is containerized and orchestrated using **Docker Compose**, so running the full system is simple and predictable across any machine.

---

## 1.1 Root Project Layout

Below is a high-level view of how the platform is organized:

```text
/Multi-Tenant-SaaS-Platform
├── docker-compose.yml       # Spins up DB, Backend, Frontend together
├── submission.json          # Credentials for evaluation
├── README.md                # Main documentation hub
├── .gitignore               # Version control exclusions
├── docs/                    # PRD, Architecture, Research docs
├── backend/                 # Node.js / Express API
└── frontend/                # React Application
```

This structure keeps things clean, modular, and professional.

---

## 1.2 Backend Architecture (`/backend`)

The backend is built using **Node.js**, **Express**, and **Prisma ORM**.  
It follows a clean modular design, making it easy to scale and maintain.

```text
backend/
├── .env.example             # Backend environment variable blueprint
├── Dockerfile               # Backend container config
├── package.json             # Dependencies
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
├── seeds/
│   └── seed.js              # Initial database data
└── src/
    ├── controllers/         # Core business logic
    ├── middleware/          # Auth, validation, error handling
    ├── routes/              # API endpoint routing
    └── utils/               # Helper utilities (JWT, hashing…)
```

---

## 1.3 Frontend Architecture (`/frontend`)

The frontend uses **React + Vite**, providing fast builds and a great development experience.

```text
frontend/
├── Dockerfile               # Frontend container config
├── package.json             # Dependencies
├── public/                  # Static files
└── src/
    ├── context/             # Global auth state
    ├── pages/               # UI pages (Login, Register, Dashboard…)
    ├── App.js               # Router + main UI shell
    └── index.js             # Application entry point
```

---

# 2️. Development Environment & Setup

This section explains what developers need and how to get the system running smoothly.

---

## 2.1 Prerequisite Software

Make sure the following tools are installed before working on the project:

- **Docker Desktop 4.0+** → Required for full system runtime  
- **Node.js 18+** → Helpful for local editing and IntelliSense  
- **Git 2.0+** → For repository operations

---

## 2.2 Environment Variables

Inside the `backend/` folder, create a `.env` file.  
If running via Docker only, defaults from `docker-compose.yml` will already work.

Example required configuration:

```ini
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@database:5432/saas_db?schema=public"

JWT_SECRET="your_secure_random_secret_key_minimum_32_chars"
JWT_EXPIRES_IN="24h"

FRONTEND_URL="http://localhost:3000"
```

This file controls API behavior, database connection, security, and CORS.

---

## 2.3 Installation & Setup

### Clone the Repository

```bash
git clone <repository_url>
cd saas-platform
```

### Optional Local Install (without Docker)

If you want code completion or locally run pieces individually:

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

## 2.4 Running the Application (Recommended — Docker)

This project is designed to run seamlessly using Docker Compose.

### Start Everything
From the **project root**, run:

```bash
docker-compose up -d --build
```

### Check Container Status
```bash
docker-compose ps
```

You should see:
- database
- backend
- frontend

all running successfully.

### Automatic Startup Behavior

When backend starts, it automatically:
- applies Prisma migrations  
- seeds important default data  

Give it ~30 to 60 seconds to fully initialize.

---

## Access Points

- **Frontend UI:** http://localhost:3000  
- **Backend API:** http://localhost:5000  
- **Health Check:** http://localhost:5000/api/health  

If these load successfully → your system is running 🎉

---

# 2.5 Testing & Verification

Since runtime happens inside Docker, testing is mainly done by interacting with live services.

---

## Manual Testing (Postman or Curl)

Use credentials from `submission.json` to verify authentication.

### Health Check Example
```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Inspecting the Database

If you want to explore real tenant, project, or user data:

```bash
docker exec -it database psql -U postgres -d saas_db
```

Then run queries such as:

```sql
SELECT * FROM tenants;
```

Great for debugging and validating seeded records.

---

# Final Notes

This technical specification ensures that:
- Developers clearly understand system structure
- Onboarding new contributors is easy
- Running the platform is predictable
- Debugging remains straightforward

The system is intentionally designed to feel professional but developer-friendly.

---
