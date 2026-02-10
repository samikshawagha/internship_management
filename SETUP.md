# Environment Setup Guide

## Windows Setup Instructions

### Step 1: Install Node.js
1. Download from https://nodejs.org/ (LTS version)
2. Run installer and follow prompts
3. Verify installation:
```powershell
node --version
npm --version
```

### Step 2: Install MySQL Server
1. Download from https://dev.mysql.com/downloads/mysql/
2. Run installer
3. Configure MySQL Server as Windows Service
4. Set root password (default: root)
5. Verify connection:
```powershell
mysql -u root -p
```

### Step 3: Project Setup

#### Create Database
```sql
CREATE DATABASE IF NOT EXISTS internship_management;
```

#### Backend Setup
```powershell
cd backend
npm install
# Edit .env file with your credentials
```

#### Frontend Setup
```powershell
cd ../frontend
npm install
```

### Step 4: Running Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

## macOS Setup Instructions

### Step 1: Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Node.js
```bash
brew install node
node --version
npm --version
```

### Step 3: Install MySQL
```bash
brew install mysql
brew services start mysql
mysql -u root
```

### Step 4: Project Setup
Same as Windows (use Terminal instead of PowerShell)

## Linux Setup Instructions

### Step 1: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install MySQL
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

### Step 3: Project Setup
Same as Windows (use Terminal)

## Database Setup

### Create Database
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS internship_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;
exit;
```

### Automatic Table Creation
Tables are automatically created when backend server starts. Check server logs:
```
Database initialized successfully
```

## Environment Variables

### Backend .env
Located in `backend/.env`

```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=internship_management

# JWT Secret (change in production)
JWT_SECRET=your_very_secure_secret_key_here_change_this

# Server
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
Located in `frontend/src/services/apiService.js`

```javascript
const API_BASE = 'http://localhost:5000/api';
```

Change if backend is on different address.

## Verification Checklist

- [ ] Node.js installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] MySQL running (`mysql -u root -p`)
- [ ] Database created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env file configured
- [ ] Backend starts without errors
- [ ] Frontend accessible on http://localhost:3000

## Port Configuration

If ports are in use, change in relevant files:

**Backend Port (default 5000)**
- Edit: `backend/.env`
- Change: `PORT=5001`

**Frontend Port (default 3000)**
- Edit: `frontend/package.json`
- Add to scripts or use: `PORT=3001 npm start`

## Database Connection Issues

### Connection Refused
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list          # macOS
# Check Windows Services    # Windows
```

### Authentication Failed
```bash
# Reset MySQL root password
# Windows: Use MySQL Workbench
# Linux/macOS: Follow MySQL docs

# Verify credentials
mysql -h localhost -u root -p
```

### Database Not Found
```sql
-- Verify database exists
SHOW DATABASES;

-- Create if missing
CREATE DATABASE IF NOT EXISTS internship_management;
```

## Troubleshooting

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Port already in use
```powershell
# Find process on port 5000
Get-Process | Where-Object {$_.Port -eq 5000}

# Kill process
Stop-Process -Id <PID> -Force
```

### Clear Cache
```bash
# Frontend
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install

# Backend
rm -rf backend/node_modules backend/package-lock.json
cd backend && npm install
```

## Production Deployment

### Security
1. Change `JWT_SECRET` to strong value
2. Set `NODE_ENV=production`
3. Use environment-specific .env files
4. Enable HTTPS/SSL

### Database
1. Use strong password for MySQL
2. Create separate database user
3. Implement backups
4. Monitor connections

### Frontend Build
```bash
cd frontend
npm run build
# Deploy 'build' folder to web server
```

## Getting Help

1. Check README.md for full documentation
2. Review API endpoints in README.md
3. Check backend console logs
4. Verify all prerequisites installed
5. Test database connection separately

## Next Steps

1. Create test accounts
2. Test all features
3. Review code structure
4. Customize styling
5. Add more features
6. Deploy to production
