const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const pool = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database initialization
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'company', 'student') NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create internships table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        companyId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        stipend DECIMAL(10, 2),
        skills TEXT,
        startDate DATE,
        logo VARCHAR(255),
        status ENUM('open', 'closed') DEFAULT 'open',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (companyId) REFERENCES users(id)
      )
    `);

    // Create applications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId INT NOT NULL,
        internshipId INT NOT NULL,
        resume TEXT,
        coverLetter TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (internshipId) REFERENCES internships(id)
      )
    `);

    // Create reports table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId INT NOT NULL,
        internshipId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (internshipId) REFERENCES internships(id)
      )
    `);

    // Add logo column to internships table if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE internships ADD COLUMN logo VARCHAR(255) AFTER startDate
      `);
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.log('Logo column may already exist or other error:', error.message);
      }
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Start server
const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please free the port and restart the server.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
