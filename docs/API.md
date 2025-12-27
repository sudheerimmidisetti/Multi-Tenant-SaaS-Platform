# Multi-Tenant SaaS Platform — API Documentation

## Authentication & Security
- **Auth Type:** Bearer Token (JWT)  
- **Header Format:**  
  `Authorization: Bearer <your_jwt_token>`
- **Token Expiry:** 24 Hours
- **Base URL (Local):**
  ```
  http://localhost:5000/api
  ```

---

# 1️. System

## Health Check
Checks API server & database connectivity.

| Method | Endpoint |
|--------|----------|
| GET | `/health` |

**Access:** Public  

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

# 2️. Authentication Module

## 2.1 Register Tenant (Signup)
Registers a **Tenant (Organization)** + first **Admin User**.

| Method | Endpoint |
|--------|----------|
| POST | `/auth/register-tenant` |

**Access:** Public  

### Request Body
```json
{
  "tenantName": "Orion Technologies",
  "subdomain": "orion",
  "adminEmail": "owner@oriontech.com",
  "password": "StrongPass@789"
}
```

### Response (201)
```json
{
  "message": "Tenant registered successfully",
  "tenantId": "b12c4e87-93fc-4a41-98a7-2fa7f86b2c51"
}
```

---

## 2.2 Login
Authenticates user → returns JWT.

| Method | Endpoint |
|--------|----------|
| POST | `/auth/login` |

**Access:** Public  

### Request Body
```json
{
  "email": "owner@oriontech.com",
  "password": "StrongPass@789"
}
```

### Response (200)
```json
{
  "token": "eyJhbGciOiJFUzI1NiIsImtp...",
  "user": {
    "id": "f8742c21-ab90-4bde-b02f-92d8824cc199",
    "email": "owner@oriontech.com",
    "role": "tenant_admin",
    "tenantId": "b12c4e87-93fc-4a41-98a7-2fa7f86b2c51"
  }
}
```

---

## 2.3 Get Current User
Returns logged-in user details.

| Method | Endpoint |
|--------|----------|
| GET | `/auth/me` |

**Access:** Protected (All Roles)

### Response (200)
```json
{
  "user": {
    "id": "d2f4a5c7-4a51-4cd7-8b95-9c8fbb2137dd",
    "fullName": "Daniel Carter",
    "email": "daniel@oriontech.com",
    "role": "user"
  }
}
```

---

# 3️. Tenant Management (Super Admin Only)

## 3.1 List All Tenants
| Method | Endpoint |
|--------|----------|
| GET | `/tenants` |

**Access:** Super Admin  

### Response (200)
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "tenants": [
      { "id": "t-101", "name": "Orion Technologies", "subdomain": "orion" },
      { "id": "t-102", "name": "Nova Systems", "subdomain": "nova" }
    ]
  }
}
```

---

## 3.2 Get Tenant Details
| Method | Endpoint |
|--------|----------|
| GET | `/tenants/:id` |

**Access:** Super Admin  

### Response (200)
```json
{
  "id": "b12c4e87-93fc-4a41-98a7-2fa7f86b2c51",
  "name": "Orion Technologies",
  "status": "active"
}
```

---

## 3.3 Update Tenant
| Method | Endpoint |
|--------|----------|
| PUT | `/tenants/:id` |

**Access:** Super Admin  

### Request Body
```json
{
  "name": "Orion Global Solutions",
  "status": "inactive"
}
```

---

# 4️. User Management (Tenant Admin)

## 4.1 List Users
| Method | Endpoint |
|--------|----------|
| GET | `/tenants/:tenantId/users` |

**Access:** Tenant Admin  

### Response (200)
```json
{
  "data": {
    "users": [
      { "id": "u-301", "fullName": "Sophia Miller", "role": "user" }
    ]
  }
}
```

---

## 4.2 Create User
| Method | Endpoint |
|--------|----------|
| POST | `/tenants/:tenantId/users` |

**Access:** Tenant Admin  

### Request Body
```json
{
  "email": "sophia@oriontech.com",
  "password": "UserPass@456",
  "fullName": "Sophia Miller",
  "role": "user"
}
```

---

## 4.3 Update User
| Method | Endpoint |
|--------|----------|
| PUT | `/users/:id` |

**Access:** Tenant Admin  

### Request Body
```json
{
  "fullName": "Sophia Wilson",
  "role": "tenant_admin"
}
```

---

## 4.4 Delete User
| Method | Endpoint |
|--------|----------|
| DELETE | `/users/:id` |

**Access:** Tenant Admin  

---

# 5️. Project Management

## 5.1 List Projects
| Method | Endpoint |
|--------|----------|
| GET | `/projects` |

**Access:** User / Admin  

### Response (200)
```json
{
  "data": {
    "projects": [
      { "id": "pr-501", "title": "Mobile App Launch", "status": "active" }
    ]
  }
}
```

---

## 5.2 Create Project
| Method | Endpoint |
|--------|----------|
| POST | `/projects` |

**Access:** Admin  

### Request Body
```json
{
  "title": "Enterprise Dashboard Revamp",
  "description": "UI/UX overhaul for enterprise clients",
  "status": "active"
}
```

---

## 5.3 Get Project Details
| Method | Endpoint |
|--------|----------|
| GET | `/projects/:id` |

**Access:** User / Admin  

---

## 5.4 Update Project
| Method | Endpoint |
|--------|----------|
| PUT | `/projects/:id` |

**Access:** Admin  

### Request Body
```json
{
  "status": "completed"
}
```

---

# 6️. Task Management

## 6.1 List Tasks
| Method | Endpoint |
|--------|----------|
| GET | `/projects/:projectId/tasks` |

**Access:** User / Admin  

### Response (200)
```json
{
  "data": {
    "tasks": [
      { "id": "ts-801", "title": "Implement Login UI", "status": "TODO" }
    ]
  }
}
```

---

## 6.2 Create Task
| Method | Endpoint |
|--------|----------|
| POST | `/projects/:projectId/tasks` |

**Access:** Admin  

### Request Body
```json
{
  "title": "Fix Navigation Bug",
  "description": "Navbar alignment issue in mobile view",
  "priority": "HIGH",
  "dueDate": "2025-05-30"
}
```

---

## 6.3 Update Task Status
| Method | Endpoint |
|--------|----------|
| PATCH | `/tasks/:id/status` |

**Access:** User / Admin  

### Request Body
```json
{
  "status": "IN_PROGRESS"
}
```

---

## 6.4 Update Task Details
| Method | Endpoint |
|--------|----------|
| PUT | `/tasks/:id` |

**Access:** Admin  

### Request Body
```json
{
  "title": "Fix Navigation Bug (Updated)",
  "priority": "MEDIUM"
}
```

---

## Notes
- All protected routes require JWT
- Tenant isolation enforced automatically
- RBAC rules strictly applied

---
