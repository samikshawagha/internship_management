# Online Internship Management System

A comprehensive web-based system for managing the complete internship lifecycle with support for multiple roles (Admin, Company, Student). Built with React, Node.js, and MySQL.

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

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM 6.20.1** - Client-side routing
- **Axios 1.6.2** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MySQL2 3.6.5** - Database driver
- **bcrypt 5.1.1** - Password hashing
- **JSON Web Token (JWT) 9.1.2** - Authentication
- **CORS 2.8.5** - Cross-origin support
- **Multer 1.4.5-lts.1** - File upload handling
- **dotenv 16.3.1** - Environment variables

### Database
- **MySQL 8.0+** - Relational database

### Development Tools
- **Nodemon 3.0.2** - Auto-restart server during development
- **React Scripts 5.0.1** - Build tools for React

## ✨ Features

### Authentication & Authorization
- User registration and login (Student, Company, Admin)
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)

### Core Modules

#### 1. **Internship Management**
- Post new internship opportunities (Company)
- Browse available internships (Student)
- View internship details
- Close/Open internship positions
- Edit and delete internships (Company)

#### 2. **Application Tracking**
- Students can apply to internships
- Upload resume and cover letter with applications
- Companies can view applications for their internships
- Approve/Reject applications
- Track application status

#### 3. **Report Submission**
- Students submit internship completion reports
- Companies review and approve reports
- Rejection with feedback capability

#### 4. **Dashboard & Analytics**
- Role-based dashboard
- Application statistics
- Internship statistics
- User metrics (Admin)
- Visual representation of data

#### 5. **User Management**
- Profile management
- Update profile information
- View user details

## 📁 Project Structure

```
internship_management/
├── backend/
│   ├── config/
│   │   └── database.js           # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── internshipController.js
│   │   ├── applicationController.js
│   │   ├── reportController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role checking
│   ├── models/
│   │   ├── User.js               # User data model
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
│   │   └── hashPassword.js       # Password utilities
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── public/
    │   └── index.html            # HTML template
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js         # Navigation bar
    │   ├── context/
    │   │   └── AuthContext.js    # Auth state management
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Profile.js
    │   │   ├── InternshipList.js
    │   │   ├── InternshipDetail.js
    │   │   ├── CreateInternship.js
    │   │   ├── MyApplications.js
    │   │   └── Reports.js
    │   ├── services/
    │   │   └── apiService.js     # API calls
    │   ├── styles/
    │   │   └── global.css        # Global styles
    │   ├── App.js                # Main component
    │   └── index.js              # React entry point
    └── package.json

```

## 📦 Installation Guide

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL Server (v8.0+)
- Git

### Step 1: Navigate to Project Directory

```bash
cd d:/internship_management
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Verify .env file settings
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=internship_management
# JWT_SECRET=your_jwt_secret_key_change_in_production
# PORT=5000
# NODE_ENV=development
```

### Step 3: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

### Step 4: Setup MySQL Database

```bash
# Open MySQL Command Line Client or MySQL Workbench

# Create database
CREATE DATABASE IF NOT EXISTS internship_management;

# The backend will automatically create all required tables
# when you run the server for the first time
```

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# Database Configuration
DB_HOST=localhost                         # MySQL host
DB_USER=root                              # MySQL username (change in production)
DB_PASSWORD=root                          # MySQL password (change in production)
DB_NAME=internship_management             # Database name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production  # Keep this secure in production

# Server Configuration
PORT=5000                                 # Server port
NODE_ENV=development                      # Set to 'production' for production deployment
```

> **⚠️ Security Warning**: Never use default credentials (root/root) in production. Always change the database credentials and JWT secret in production environments.

### Frontend Configuration

The frontend is configured to connect to the backend at `http://:localhost5000`. Modify in `src/services/apiService.js` if your backend is on a different address:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# OR for development with auto-reload
npm run dev
```

Backend will run on: `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### Access the Application

Open your browser and navigate to: `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
GET    /api/auth/profile           # Get user profile
PUT    /api/auth/profile           # Update user profile
```

### Internship Endpoints
```
POST   /api/internships            # Create internship (Company/Admin)
GET    /api/internships            # Get all internships
GET    /api/internships/company    # Get company's internships
GET    /api/internships/:id        # Get internship details
PUT    /api/internships/:id        # Update internship (Company/Admin)
DELETE /api/internships/:id        # Delete internship (Company/Admin)
PATCH  /api/internships/:id/status # Update internship status
```

### Application Endpoints
```
POST   /api/applications                        # Submit application (Student)
GET    /api/applications                        # Get student applications
GET    /api/applications/internship/:internshipId  # Get applications for internship
PATCH  /api/applications/:id/status             # Update application status (Company/Admin)
DELETE /api/applications/:id                    # Withdraw application (Student)
```

### Report Endpoints
```
POST   /api/reports                        # Submit report (Student)
GET    /api/reports                        # Get student reports
GET    /api/reports/internship/:internshipId # Get internship reports
PATCH  /api/reports/:id/status             # Update report status (Company/Admin)
DELETE /api/reports/:id                    # Delete report (Student)
```

### Analytics Endpoints
```
GET    /api/analytics/dashboard      # Get dashboard statistics
GET    /api/analytics/applications   # Get application statistics
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'company', 'student') NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Internships Table
```sql
CREATE TABLE internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  companyId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  stipend DECIMAL(10, 2),
  skills TEXT,
  startDate DATE,
  status ENUM('open', 'closed') DEFAULT 'open',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (companyId) REFERENCES users(id)
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  internshipId INT NOT NULL,
  resume TEXT,
  coverLetter TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (internshipId) REFERENCES internships(id)
);
```

### Reports Table
```sql
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT NOT NULL,
  internshipId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES users(id),
  FOREIGN KEY (internshipId) REFERENCES internships(id)
);
```

## 👥 User Roles & Permissions

### Student
- Register and login
- Browse available internships
- Apply to internships
- View own applications
- Submit completion reports
- View own reports
- View dashboard with personal statistics

### Company
- Register and login
- Post internship opportunities
- Edit/Delete own internships
- View applications for own internships
- Approve/Reject applications
- View reports from students
- Approve/Reject reports
- View company dashboard with statistics

### Admin
- Full system access
- View all users
- View all internships, applications, and reports
- Manage system-wide statistics
- User management capabilities

## 📚 Usage Guide

### For Students

1. **Register**: Create an account as a Student
2. **Browse**: View available internships on the Browse page
3. **Apply**: Click on an internship and submit your application with resume and cover letter
4. **Track**: View your applications and their status in "My Applications"
5. **Report**: After completing internship, submit a completion report
6. **Dashboard**: Monitor your progress in the dashboard

### For Companies

1. **Register**: Create an account as a Company
2. **Post**: Post new internship opportunities
3. **Manage**: Edit or close internship positions
4. **Review**: View applications received for your internships
5. **Approve**: Accept or reject applications
6. **Evaluate**: Review completion reports from students
7. **Dashboard**: Track internship statistics

### For Admins

1. **Login**: Use admin credentials
2. **Monitor**: View system-wide statistics
3. **Manage**: Handle user management and reporting

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- SQL injection prevention (parameterized queries)
- CORS protection
- Environment variable management for sensitive data

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check DB credentials in .env file
- Verify database exists: `CREATE DATABASE internship_management;`

### Port Already in Use
- Change PORT in .env file
- Or kill process using the port

### Module Not Found
- Run `npm install` in both frontend and backend folders
- Clear node_modules and package-lock.json, then reinstall

### CORS Errors
- Ensure backend is running on correct port
- Update API_BASE URL in frontend if needed

## 📝 Sample Test Credentials

### Create Test Users:

**Student Account:**
- Email: student@example.com
- Password: password123
- Role: Student

**Company Account:**
- Email: company@example.com
- Password: password123
- Role: Company

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

This project is open source and available for educational purposes.

## 📞 Support

For issues, questions, or feedback, please open an issue in the repository.

---

**Happy Coding! 🚀**