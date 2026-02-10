# Quick Start Guide

## Prerequisites
- Node.js (v14+) installed
- MySQL Server running
- Command terminal/PowerShell

## 5-Minute Setup

### 1. Create Database
```sql
CREATE DATABASE IF NOT EXISTS internship_management;
```

### 2. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 3. Install Frontend Dependencies (in new terminal)
```powershell
cd frontend
npm install
```

### 4. Start Backend Server (Terminal 1)
```powershell
cd backend
npm run dev
```
✅ Backend runs on: http://localhost:5000

### 5. Start Frontend (Terminal 2)
```powershell
cd frontend
npm start
```
✅ Frontend opens at: http://localhost:3000

## Default Credentials

### Test as Student
- Email: student@test.com
- Password: pass123

### Test as Company
- Email: company@test.com
- Password: pass123

## Key Features to Try

### 1. Authentication
- Register with different roles (Student/Company)
- Login with credentials
- View profile

### 2. Internship (Company)
- Post new internship
- View applications
- Approve/Reject students

### 3. Application (Student)
- Browse internships
- Apply to position
- Track application status

### 4. Reports (Student)
- Submit completion reports
- View report status

### 5. Dashboard
- View statistics
- See application trends
- Monitor progress

## API Base URL
http://localhost:5000/api

## File Locations
- Backend: `backend/`
- Frontend: `frontend/`
- Database Config: `backend/.env`
- API Services: `frontend/src/services/apiService.js`

## Common Issues

**MySQL Connection Failed**
- Check MySQL is running
- Verify credentials in `backend/.env`

**Port 5000 Already in Use**
- Change PORT in `backend/.env`

**npm: command not found**
- Install Node.js from nodejs.org

**CORS Errors**
- Ensure backend is running
- Check API URL in frontend config

## Architecture

### Frontend
- React 18 with Hooks
- Context API for auth state
- Axios for API calls
- Client-side routing

### Backend
- Express.js REST API
- JWT authentication
- MySQL2 with connection pooling
- Middleware for auth & validation

### Database
- Users (admin, company, student)
- Internships (company posts)
- Applications (student applies)
- Reports (student submits)

## Next Steps
1. Customize styling in `frontend/src/styles/global.css`
2. Add more features (notifications, payments, etc.)
3. Deploy to production
4. Set up CI/CD pipeline

## Support
Refer to README.md for detailed documentation.
