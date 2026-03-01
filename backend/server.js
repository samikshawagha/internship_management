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
const attendanceRoutes = require('./routes/attendanceRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

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

    // Create assessments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId INT NOT NULL,
        internshipId INT NOT NULL,
        evaluatorId INT NOT NULL,
        assessmentType ENUM('performance', 'competency', 'project') NOT NULL,
        competencies JSON,
        overallScore INT CHECK (overallScore >= 0 AND overallScore <= 100),
        comments TEXT,
        status ENUM('pending', 'completed', 'reviewed') DEFAULT 'completed',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (internshipId) REFERENCES internships(id),
        FOREIGN KEY (evaluatorId) REFERENCES users(id)
      )
    `);

    // Create certificates table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId INT NOT NULL,
        internshipId INT NOT NULL,
        certificateNumber VARCHAR(255) UNIQUE NOT NULL,
        issuanceDate DATE,
        expiryDate DATE,
        certificateFile VARCHAR(255),
        status ENUM('generated', 'issued', 'expired', 'revoked') DEFAULT 'generated',
        issueLevel ENUM('standard', 'merit', 'distinction') DEFAULT 'standard',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (internshipId) REFERENCES internships(id)
      )
    `);

    // Create attendance table if it doesn't exist
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INT AUTO_INCREMENT PRIMARY KEY,
          studentId INT NOT NULL,
          internshipId INT NOT NULL,
          date DATE NOT NULL,
          status ENUM('present', 'absent', 'leave') DEFAULT 'present',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (studentId) REFERENCES users(id),
          FOREIGN KEY (internshipId) REFERENCES internships(id)
        )
      `);
    } catch (error) {
      console.log('Attendance table may already exist:', error.message);
    }

    // Create performance_evaluations table if it doesn't exist
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS performance_evaluations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          internship_id INT NOT NULL,
          evaluator_id INT NOT NULL,
          technical_skills INT,
          communication INT,
          teamwork INT,
          punctuality INT,
          proactiveness INT,
          comments TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES users(id),
          FOREIGN KEY (internship_id) REFERENCES internships(id),
          FOREIGN KEY (evaluator_id) REFERENCES users(id)
        )
      `);
    } catch (error) {
      console.log('Performance evaluations table may already exist:', error.message);
    }

    // Create leave requests table if it doesn't exist
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS leave_requests (
          id INT AUTO_INCREMENT PRIMARY KEY,
          studentId INT NOT NULL,
          internshipId INT NOT NULL,
          startDate DATE NOT NULL,
          endDate DATE NOT NULL,
          reason TEXT,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (studentId) REFERENCES users(id),
          FOREIGN KEY (internshipId) REFERENCES internships(id)
        )
      `);
    } catch (error) {
      console.log('Leave requests table may already exist:', error.message);
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
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/certificates', certificateRoutes);

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
