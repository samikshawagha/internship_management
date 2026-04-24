# System Architecture - Online Internship Management System

## 🏗️ Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:3000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Login      │  │  Register    │  │  Dashboard   │          │
│  │   Page       │  │   Page       │  │   Pages      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │           AuthContext (Global State)                │         │
│  │  - user, token, loading                             │         │
│  │  - login(), logout(), register()                    │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │         ProtectedRoute Component                    │         │
│  │  - Checks authentication                            │         │
│  │  - Validates user role                              │         │
│  │  - Redirects if unauthorized                        │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Admin Routes (Protected)                    │    │
│  │  /admin-dashboard  →  AdminDashboard.js                 │    │
│  │  /admin/users      →  AdminUsers.js                     │    │
│  │  /admin/internships→  AdminInternships.js               │    │
│  │  /admin/applications→ AdminApplications.js              │    │
│  │  /admin/reports    →  AdminReports.js                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │ Authorization: Bearer <JWT>
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│                     http://localhost:5000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │              Middleware Layer                       │         │
│  │  ┌──────────────┐  ┌──────────────┐               │         │
│  │  │ verifyToken  │  │  checkRole   │               │         │
│  │  │ - Decode JWT │  │ - Verify role│               │         │
│  │  │ - Add userId │  │ - Allow/Deny │               │         │
│  │  └──────────────┘  └──────────────┘               │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Routes Layer                          │    │
│  │  /api/auth/*         →  authRoutes.js                   │    │
│  │  /api/internships/*  →  internshipRoutes.js             │    │
│  │  /api/applications/* →  applicationRoutes.js            │    │
│  │  /api/reports/*      →  reportRoutes.js                 │    │
│  │  /api/analytics/*    →  analyticsRoutes.js              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 Controllers Layer                        │    │
│  │  authController.js                                       │    │
│  │  - register()  - login()  - getProfile()                │    │
│  │                                                           │    │
│  │  internshipController.js                                 │    │
│  │  - create()  - getAll()  - update()  - delete()         │    │
│  │                                                           │    │
│  │  applicationController.js                                │    │
│  │  - submit()  - getAll()  - updateStatus()               │    │
│  │                                                           │    │
│  │  reportController.js                                     │    │
│  │  - submit()  - getAll()  - updateStatus()               │    │
│  │                                                           │    │
│  │  analyticsController.js                                  │    │
│  │  - getStatistics()                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Models Layer                           │    │
│  │  User.js                                                 │    │
│  │  - create()  - findByEmail()  - findById()  - update()  │    │
│  │                                                           │    │
│  │  Internship.js                                           │    │
│  │  - create()  - getAll()  - getById()  - update()        │    │
│  │                                                           │    │
│  │  Application.js                                          │    │
│  │  - create()  - getAll()  - updateStatus()               │    │
│  │                                                           │    │
│  │  Report.js                                               │    │
│  │  - create()  - getAll()  - updateStatus()               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      DATABASE (MySQL)                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    users     │  │ internships  │  │ applications │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ id           │  │ id           │  │ id           │          │
│  │ email        │  │ companyId    │  │ studentId    │          │
│  │ password     │  │ title        │  │ internshipId │          │
│  │ role         │  │ description  │  │ resume       │          │
│  │ fullName     │  │ location     │  │ coverLetter  │          │
│  │ phone        │  │ duration     │  │ status       │          │
│  │ logo         │  │ stipend      │  │ createdAt    │          │
│  │ createdAt    │  │ skills       │  └──────────────┘          │
│  └──────────────┘  │ startDate    │                             │
│                    │ logo         │  ┌──────────────┐          │
│                    │ status       │  │   reports    │          │
│                    │ createdAt    │  ├──────────────┤          │
│                    └──────────────┘  │ id           │          │
│                                      │ studentId    │          │
│                                      │ internshipId │          │
│                                      │ title        │          │
│                                      │ content      │          │
│                                      │ status       │          │
│                                      │ createdAt    │          │
│                                      └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │ Server  │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  1. POST /api/auth/login                    │
     │     { email, password }                     │
     ├────────────────────────────────────────────>│
     │                                              │
     │                                         2. Verify
     │                                         credentials
     │                                              │
     │                                         3. Generate
     │                                         JWT token
     │                                              │
     │  4. Return { token, user }                  │
     │<────────────────────────────────────────────┤
     │                                              │
     │  5. Store token in localStorage              │
     │     Set Authorization header                 │
     │                                              │
     │  6. GET /api/admin/users                    │
     │     Authorization: Bearer <token>           │
     ├────────────────────────────────────────────>│
     │                                              │
     │                                         7. Verify
     │                                         token
     │                                              │
     │                                         8. Check
     │                                         role
     │                                              │
     │  9. Return data                             │
     │<────────────────────────────────────────────┤
     │                                              │
```

## 🛡️ Role-Based Access Control

```
┌──────────────────────────────────────────────────────────┐
│                    User Roles                             │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                    ADMIN                         │    │
│  │  ✓ View all users                               │    │
│  │  ✓ Manage internships (CRUD)                    │    │
│  │  ✓ Manage applications (approve/reject)         │    │
│  │  ✓ Manage reports (approve/reject)              │    │
│  │  ✓ View analytics                               │    │
│  │  ✓ Access /admin/* routes                       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                   COMPANY                        │    │
│  │  ✓ Create internships                           │    │
│  │  ✓ Edit own internships                         │    │
│  │  ✓ View applications for own internships        │    │
│  │  ✓ Approve/reject applications                  │    │
│  │  ✓ Access /company-dashboard                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │                   STUDENT                        │    │
│  │  ✓ View internships                             │    │
│  │  ✓ Apply to internships                         │    │
│  │  ✓ View own applications                        │    │
│  │  ✓ Submit reports                               │    │
│  │  ✓ Access /dashboard                            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## 📊 Admin Dashboard Data Flow

```
┌──────────────────────────────────────────────────────────┐
│              AdminDashboard Component                     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ useEffect()
                     │
                     ▼
         ┌───────────────────────┐
         │  fetchDashboardData() │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │   Promise.all([       │
         │     getStatistics(),  │
         │     getAllUsers(),    │
         │     getAllApplications()
         │   ])                  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Process Data:        │
         │  - Filter students    │
         │  - Filter companies   │
         │  - Filter pending     │
         │  - Sort by date       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │  Update State:        │
         │  - setStats()         │
         │  - setPendingApps()   │
         │  - setRecentUsers()   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Render Dashboard    │
         │  - Metrics cards      │
         │  - Pending alert      │
         │  - Tables             │
         │  - Charts             │
         └───────────────────────┘
```

## 🔄 Request/Response Cycle

```
Frontend                 Backend                  Database
   │                        │                        │
   │  1. User Action        │                        │
   │  (Click, Submit)       │                        │
   │                        │                        │
   │  2. API Call           │                        │
   │  (axios.get/post)      │                        │
   ├───────────────────────>│                        │
   │                        │                        │
   │                        │  3. Middleware         │
   │                        │  (verifyToken,         │
   │                        │   checkRole)           │
   │                        │                        │
   │                        │  4. Controller         │
   │                        │  (Business Logic)      │
   │                        │                        │
   │                        │  5. Model              │
   │                        │  (SQL Query)           │
   │                        ├───────────────────────>│
   │                        │                        │
   │                        │  6. Execute Query      │
   │                        │                        │
   │                        │  7. Return Data        │
   │                        │<───────────────────────┤
   │                        │                        │
   │  8. JSON Response      │                        │
   │<───────────────────────┤                        │
   │                        │                        │
   │  9. Update UI          │                        │
   │  (setState, render)    │                        │
   │                        │                        │
```

## 🎯 Key Features Summary

### ✅ Implemented Features

1. **Authentication**
   - JWT-based login/logout
   - Password hashing (bcrypt)
   - Token expiration (24h)
   - Persistent sessions

2. **Authorization**
   - Role-based access control
   - Middleware protection
   - Frontend route guards
   - API endpoint protection

3. **Admin Dashboard**
   - Total Students
   - Total Companies
   - Total Internships
   - Total Applications
   - Pending Approvals

4. **Admin Management**
   - User management
   - Internship CRUD
   - Application approval
   - Report management

5. **Security**
   - Password hashing
   - JWT tokens
   - Role verification
   - Input validation

6. **UI/UX**
   - Responsive design
   - Loading states
   - Error handling
   - Smooth animations

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── internshipController.js
│   │   ├── applicationController.js
│   │   ├── reportController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── imageUpload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Internship.js
│   │   ├── Application.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── internshipRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── reportRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── hashPassword.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   ├── Footer.js
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminUsers.js
    │   │   ├── AdminInternships.js
    │   │   ├── AdminApplications.js
    │   │   ├── AdminReports.js
    │   │   └── Unauthorized.js
    │   ├── services/
    │   │   ├── apiService.js
    │   │   └── crudService.js
    │   ├── utils/
    │   │   └── jwtDecoder.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐         ┌──────────────┐            │
│  │   Frontend   │         │   Backend    │            │
│  │   (React)    │         │  (Node.js)   │            │
│  │              │         │              │            │
│  │  Vercel/     │◄───────►│  Heroku/     │            │
│  │  Netlify     │  HTTPS  │  Railway     │            │
│  └──────────────┘         └──────┬───────┘            │
│                                   │                     │
│                                   │ MySQL               │
│                                   │ Connection          │
│                                   │                     │
│                            ┌──────▼───────┐            │
│                            │   Database   │            │
│                            │   (MySQL)    │            │
│                            │              │            │
│                            │  AWS RDS/    │            │
│                            │  PlanetScale │            │
│                            └──────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📚 Technology Stack

### Frontend
- React 18
- React Router v6
- React Bootstrap
- Axios
- Context API

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- Bcrypt
- MySQL2
- Multer (file uploads)
- CORS
- Dotenv

### Database
- MySQL 8.0

### Development Tools
- Nodemon
- ESLint
- Prettier

## ✨ Summary

Your system has a complete, production-ready admin implementation with:

✅ Full MVC architecture
✅ JWT authentication
✅ Role-based access control
✅ Protected routes (backend & frontend)
✅ Admin dashboard with metrics
✅ Complete CRUD operations
✅ Secure password handling
✅ Modern, responsive UI
✅ Proper error handling
✅ Input validation

**Everything is implemented and working!** 🎉
