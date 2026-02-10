# Backend Running - Next Steps

## ✅ Current Status

**Backend Server:** Running on `http://localhost:5000`
- Node.js/Express active
- Nodemon auto-reload enabled
- Ready to serve API requests

**Status:** Waiting for MySQL database connection

---

## 🔧 Configure MySQL (Choose Your Method)

### Method 1: Using XAMPP (Easiest)

1. **Start XAMPP Control Panel**
2. Click "Start" next to "MySQL"
3. Open Terminal and run:
```bash
mysql -u root -p
# Press Enter when prompted for password (default: blank or "root")

CREATE DATABASE IF NOT EXISTS internship_management;
EXIT;
```

### Method 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Click your local connection
3. Click "+" to create new query tab
4. Paste and execute:
```sql
CREATE DATABASE IF NOT EXISTS internship_management;
```

### Method 3: Using Command Line Only

```powershell
# If MySQL is in your PATH:
mysql -u root -p

# Enter password (default: root or blank)
# Then type:
CREATE DATABASE IF NOT EXISTS internship_management;
EXIT;
```

### Method 4: If Password is Different

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=internship_management
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

Then save and the backend will auto-restart (nodemon watches for changes).

---

## 📋 Verification Checklist

- [ ] MySQL service started
- [ ] Database `internship_management` created
- [ ] `.env` file has correct MySQL credentials
- [ ] Backend shows "Database initialized successfully"
- [ ] Backend running on http://localhost:5000

---

## 🚀 Start Frontend (New Terminal/PowerShell)

Once backend is connected to MySQL:

```powershell
cd d:\internship_management\frontend
npm install
npm start
```

This opens http://localhost:3000 in your browser.

---

## ✨ Quick Test

1. **Check Backend API:**
   - Open: http://localhost:5000/api/health
   - Should show: `{"status":"Backend is running"}`

2. **Check Frontend:**
   - Open: http://localhost:3000
   - Should show: Login page

3. **Test Registration:**
   - Email: test@example.com
   - Password: password123
   - Role: Student

---

## 🆘 Troubleshooting

### "Access denied for user 'root'@'localhost'"
- [ ] Is MySQL running?
- [ ] Is database created?
- [ ] Is .env password correct?

### "Can't connect to MySQL server"
- [ ] Check MySQL is running (netstat -an | findstr 3306)
- [ ] Default port is 3306
- [ ] Try `mysql -u root -p` to test connection

### "Unknown database 'internship_management'"
- [ ] Run: `CREATE DATABASE internship_management;`
- [ ] Restart backend (Ctrl+C and npm run dev)

---

## 📚 Documentation Files

- `MYSQL_SETUP.md` - Detailed MySQL setup
- `README.md` - Complete project documentation
- `QUICKSTART.md` - 5-minute quick start
- `SETUP.md` - Environment setup for all OS

---

## 💡 Tips

- **Nodemon** auto-restarts on file changes
- **No page refresh needed** - just save files
- **Check console** for error messages
- **Database tables** auto-created on first connection
- **JWT tokens** expire after 24 hours

---

## 🎯 Final Goal

```
✅ Backend running (http://localhost:5000)
✅ MySQL configured and connected
✅ Frontend running (http://localhost:3000)
✅ Database tables created
✅ User registration working
✅ Login functionality working
✅ Full system operational
```

---

**Last Updated:** February 10, 2026
**Backend:** Active
**Ready for:** MySQL Configuration
