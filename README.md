# Multi-Tenant SaaS Platform

A **production-ready B2B SaaS application** demonstrating **Multi-Tenancy**, **Strict Data Isolation**, and **Role-Based Access Control (RBAC)**.  
Each organization (Tenant) receives an **isolated workspace** where they can manage users, projects, and tasks, while a global **Super Admin** oversees the system.

---

## Key Features
- **Multi-Tenancy:** Complete tenant isolation using unique Tenant IDs
- **Secure Authentication:** JWT-based login with encrypted passwords
- **RBAC:** Super Admin, Tenant Admin, and Standard User roles
- **Project Management:** Create, update, and track tenant-specific projects
- **Task Management:** Assign tasks with priority and deadlines
- **Team Management:** Tenant Admins manage users and roles
- **Super Admin Dashboard:** Monitor all registered tenants system-wide
- **Responsive UI:** Clean and modern React dashboard

---

## Technology Stack

### **Frontend**
- React 18
- React Router v6
- Context API
- Axios
- CSS3 (Responsive Layout)

### **Backend**
- Node.js 18
- Express.js
- Prisma ORM
- JWT, Bcrypt, CORS
- Express Validator

### **Database & DevOps**
- PostgreSQL 15
- Docker & Docker Compose
- Linux (Alpine) Containers

---

## Architecture Overview
This platform follows a **client-server** model:

1️. React Frontend communicates with backend using REST APIs  
2️. Express/Node Backend processes business logic  
3️. Backend interacts with PostgreSQL using Prisma ORM  

Every database query is scoped by **tenant_id**, ensuring **strict data isolation**.

---

## ⚙️ Installation & Setup

### Prerequisites
- Docker & Docker Compose (Recommended)
- OR Node.js 18+ and PostgreSQL (Manual Setup)

---

# Method 1 — Run with Docker (Recommended)

### 1️. Clone Repository
```bash
git clone <your-repo-url>
cd Multi-Tenant-SaaS-Platform
```

### 2️. Configure Environment
Create `.env` in root:
```properties
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=saas_db
```

### 3️. Start Application
```bash
docker-compose up -d --build
```

### 4️. Access Platform
- Frontend → http://localhost:3000
- Backend Health → http://localhost:5000/api/health

> Prisma migrations & seed data auto-run 🎉

---

# Method 2 — Local Development Setup (Manual)

<details>
<summary><strong>Click to Expand</strong></summary>

### 1️. Database
Ensure PostgreSQL is running on port **5432**

---

### 2️. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update database credentials
npx prisma migrate dev --name init
npm run seed
npm start
```

---

### 3️. Frontend Setup
```bash
cd frontend
npm install
npm start
```

</details>

---

## Environment Variables
Backend requires:

| Variable | Description | Default |
|--------|-------------|--------|
| PORT | Backend Port | 5000 |
| DATABASE_URL | PostgreSQL Connection | database:5432/saas_db |
| JWT_SECRET | Token Secret Key | set your own |
| FRONTEND_URL | CORS Origin | http://localhost:3000 |

Refer to `backend/.env.example`.

---

## API Overview

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register-tenant` | Register new organization |
| POST | `/api/auth/login` | Login user |

---

### Projects & Tasks
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/projects` | Get tenant projects |
| POST | `/api/projects` | Create project |
| POST | `/api/projects/:id/tasks` | Create task |
| PATCH | `/api/tasks/:id/status` | Update task status |

---

### Management
| Method | Endpoint | Role |
|--------|---------|------|
| GET | `/api/tenants` | Super Admin |
| GET | `/api/tenants/:id/users` | Tenant Admin |
| POST | `/api/tenants/:id/users` | Tenant Admin |

---

## Seed Accounts (Demo Access)

### Super Admin
```
Email: superadmin@system.com
Password: Admin@123
```

### Tenant Admin
```
Email: admin@demo.com
Password: Demo@123
Subdomain: demo
```

---

## Notes
- Full tenant isolation enforced
- JWT protects secure routes
- Prisma ensures safe DB communication

---

## Future Enhancements
- Multi-Region Deployment
- Audit Logs
- Email Invitations
- Billing Integration

---
