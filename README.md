# Online Internship Management System

A full-featured internship management platform for Admins, Companies, and Students.
This repository contains a React frontend and a Node.js/Express backend powered by MySQL.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [User Roles & Permissions](#user-roles--permissions)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Tech Stack

### Frontend
- React 18.2.0
- React Router DOM 6.20.1
- Axios 1.6.2
- React Bootstrap 2.10.10
- Bootstrap 5.3.8

### Backend
- Node.js
- Express 4.18.2
- MySQL2 3.6.5
- bcrypt 5.1.1
- jsonwebtoken 9.0.2
- cors 2.8.5
- multer 1.4.5-lts.1
- dotenv 16.3.1
- pdfkit 0.18.0

### Database
- MySQL 8.0+

### Dev Tools
- Nodemon 3.0.2
- React Scripts 5.0.1

## ✨ Features

- Role-based authentication: Student, Company, Admin
- Secure JWT login and registration
- Internship posting, editing, deletion, and status control
- Student application submission with resume upload
- Application approval and rejection flows
- Internship report submission and review
- Assessment and performance evaluation tracking
- Certificate management and download
- Attendance and leave request tracking
- Dashboard analytics and role-based statistics
- Profile editing and password management

## 📁 Project Structure

```text
internship_management/
├── backend/
│   ├── config/                # Database connection configuration
│   ├── controllers/           # Backend business logic
│   ├── middleware/            # Auth and file upload middleware
│   ├── models/                # Data model definitions
│   ├── routes/                # API route handlers
│   ├── uploads/               # Uploaded files and images
│   ├── package.json
│   └── server.js              # Express application entry point
├── frontend/
│   ├── public/                # Static assets and HTML template
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── context/           # Authentication context
│   │   ├── pages/             # Feature pages
│   │   ├── services/          # API service functions
│   │   ├── styles/            # CSS and styling
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── internship_php/            # Optional legacy PHP implementation
└── README.md
```

## 📦 Installation Guide

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL Server (v8.0+)
- Git

### 1. Clone the repository

```bash
cd d:/internship_management
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Create the database

Open MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS internship_management;
```

The backend will automatically create the required tables when it starts.

## ⚙️ Configuration

### Backend `.env`

Create a `.env` file inside `backend/` with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=internship_management
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

### Frontend API base

The frontend uses `http://localhost:5000/api` by default.
If your backend is running elsewhere, update `frontend/src/services/apiService.js`.

## 🚀 Running the Application

### Start the backend

```bash
cd backend
npm start
```

For live reload during development:

```bash
npm run dev
```

### Start the frontend

In a second terminal:

```bash
cd frontend
npm start
```

### Open the app

Visit `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/change-password`
- `GET /api/auth/student/dashboard`

### Internships
- `POST /api/internships`
- `GET /api/internships`
- `GET /api/internships/all` (Admin)
- `GET /api/internships/company`
- `GET /api/internships/:id`
- `PUT /api/internships/:id`
- `DELETE /api/internships/:id`
- `PATCH /api/internships/:id/status`

### Applications
- `POST /api/applications`
- `GET /api/applications`
- `GET /api/applications/internship/:internshipId`
- `PATCH /api/applications/:id/status`
- `DELETE /api/applications/:id`

### Reports
- `POST /api/reports`
- `GET /api/reports`
- `GET /api/reports/internship/:internshipId`
- `PATCH /api/reports/:id/status`
- `DELETE /api/reports/:id`

### Analytics
- `GET /api/analytics/dashboard`
- `GET /api/analytics/applications`

### Attendance & Leave
- `POST /api/attendance/attendance`
- `GET /api/attendance/attendance/student/:studentId/internship/:internshipId`
- `GET /api/attendance/attendance/internship/:internshipId`
- `GET /api/attendance/attendance/summary/:studentId/:internshipId`
- `PUT /api/attendance/attendance/:attendanceId`
- `DELETE /api/attendance/attendance/:attendanceId`
- `POST /api/attendance/leaves`
- `GET /api/attendance/leaves/student/:studentId`
- `GET /api/attendance/leaves/internship/:internshipId`
- `GET /api/attendance/leaves/pending/:internshipId`
- `PUT /api/attendance/leaves/:leaveId/approve`
- `PUT /api/attendance/leaves/:leaveId/reject`
- `PUT /api/attendance/leaves/:leaveId`
- `DELETE /api/attendance/leaves/:leaveId`

### Assessments
- `POST /api/assessments`
- `GET /api/assessments`
- `GET /api/assessments/:id`
- `GET /api/assessments/student/:studentId`
- `GET /api/assessments/internship/:internshipId`
- `GET /api/assessments/evaluator/:evaluatorId`
- `GET /api/assessments/type/:type`
- `GET /api/assessments/average/:studentId/:internshipId`
- `PUT /api/assessments/:id`
- `POST /api/assessments/submit/:id`
- `DELETE /api/assessments/:id`

### Certificates
- `POST /api/certificates`
- `GET /api/certificates/:id`
- `GET /api/certificates/number/:certificateNumber`
- `GET /api/certificates/student/:studentId`
- `GET /api/certificates/internship/:internshipId`
- `GET /api/certificates/status/:status`
- `GET /api/certificates/level/:issueLevel`
- `GET /api/certificates/active/list`
- `GET /api/certificates/expired/list`
- `GET /api/certificates/download/:id`
- `PUT /api/certificates/:id`
- `DELETE /api/certificates/:id`

## 🗄️ Database Schema

The backend creates the required tables automatically on startup, including:
- `users`
- `internships`
- `applications`
- `reports`
- `assessments`
- `certificates`
- `attendance`
- `performance_evaluations`
- `leave_requests`

## 👥 User Roles & Permissions

### Student
- Register and login
- Browse internships
- Apply for internships
- View own applications and reports
- Submit completion reports

### Company
- Register and login
- Post internships
- Manage own internships
- Review applications
- Approve/reject students
- Review reports

### Admin
- Manage users, internships, and reports
- View system-wide analytics
- Access all application data

## 📝 Usage Guide

### Student flow
1. Register as a Student
2. Browse internships
3. Submit applications
4. Track status
5. Upload completion reports

### Company flow
1. Register as a Company
2. Post internship listings
3. Manage applications
4. Review student reports

### Admin flow
1. Login as Admin
2. View dashboards and analytics
3. Manage the platform

## 🐛 Troubleshooting

### Database connection issues
- Ensure MySQL is running
- Check backend `.env` credentials
- Confirm the database exists: `CREATE DATABASE internship_management;`

### Port conflicts
- Change `PORT` in `backend/.env`
- Free the port used by other processes

### Dependency problems
- Run `npm install` in both `backend/` and `frontend/`

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Open a pull request

## 📄 License

This project is available for educational use.

## 📌 Notes

The `internship_php/` directory contains a separate PHP-based implementation and is not required for the Node/React version.
