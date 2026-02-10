# MySQL Setup Instructions

## Current Status
✅ **Backend Server Running on Port 5000**
- Node.js/Express server is active
- Waiting for MySQL database connection

## Database Setup Steps

### Step 1: Start MySQL Server

**Windows (if using XAMPP):**
```
Start XAMPP Control Panel → Click "Start" next to MySQL
```

**Windows (if using MySQL Installer):**
```
Open Services app → Find MySQL80 → Right-click → Start
```

**Command Line (if installed as service):**
```powershell
net start MySQL80
```

### Step 2: Create Database

**Option A: Using MySQL Command Line**
```powershell
# Open MySQL command line
mysql -u root -p

# At the MySQL prompt, enter:
CREATE DATABASE IF NOT EXISTS internship_management;
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Click your local connection (root)
3. In the Query tab, paste:
```sql
CREATE DATABASE IF NOT EXISTS internship_management;
```
4. Click the Execute button (lightning bolt icon)

### Step 3: Verify .env Configuration

Check `d:\internship_management\backend\.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=internship_management
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

**If your MySQL password is different:**
- Update `DB_PASSWORD` with your actual MySQL password
- Save the file
- The server will auto-restart (nodemon will handle it)

### Step 4: Verify Connection

Once MySQL is running and database is created:
- The backend server will automatically initialize tables
- You should see: "Database initialized successfully" in the console
- The database connection error will disappear

## Common Issues

### Issue: "Access denied for user 'root'@'localhost'"
**Solution:**
1. Check MySQL is running
2. Verify DB_PASSWORD in .env matches your MySQL password
3. Ensure database `internship_management` exists
4. Restart backend after making changes

### Issue: "Can't connect to MySQL server"
**Solution:**
1. Start MySQL service (see Step 1)
2. Verify localhost:3306 is accessible
3. Check firewall isn't blocking port 3306

### Issue: "Unknown database 'internship_management'"
**Solution:**
1. Create the database (see Step 2)
2. Restart backend server

## MySQL Default Credentials
- **Username:** root
- **Password:** root (if using XAMPP default)
- **Host:** localhost
- **Port:** 3306

## Test Database Connection

Once database is configured, test it:

```powershell
# In MySQL command line:
mysql -u root -p -h localhost

# At prompt, type your password, then:
SHOW DATABASES;
USE internship_management;
SHOW TABLES;
```

## Frontend Setup (Separate Terminal)

Once backend is running successfully:

```powershell
# New terminal/command prompt
cd d:\internship_management\frontend
npm install
npm start
```

Frontend will open at: http://localhost:3000

## Full System Check

✅ MySQL running
✅ Database created (internship_management)
✅ .env configured with correct credentials
✅ Backend running (http://localhost:5000)
✅ Backend can connect to MySQL
✅ Frontend running (http://localhost:3000)
✅ Browser showing login page

## Next Steps

1. **Configure MySQL** (follow steps above)
2. **Verify Backend** runs without DB errors
3. **Install Frontend** dependencies
4. **Start Frontend** server
5. **Open** http://localhost:3000
6. **Register** new account
7. **Test** all features

## Support

- Backend logs will show database initialization status
- Check .env file if credentials seem wrong
- Verify MySQL service is running
- Use SHOW TABLES; to confirm database tables created

---

**Backend Status:** ✅ Running on http://localhost:5000
**Database Status:** ⏳ Waiting for MySQL configuration
