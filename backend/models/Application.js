const pool = require('../config/database');

const Application = {
  create: async (data) => {
    const { studentId, internshipId, resume, coverLetter } = data;
    const query = 'INSERT INTO applications (studentId, internshipId, resume, coverLetter, status) VALUES (?, ?, ?, ?, "pending")';
    const [result] = await pool.query(query, [studentId, internshipId, resume, coverLetter]);
    return result;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM applications WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  getByStudentId: async (studentId) => {
    const query = 'SELECT a.*, i.title, c.email as companyEmail FROM applications a JOIN internships i ON a.internshipId = i.id JOIN users c ON i.companyId = c.id WHERE a.studentId = ?';
    const [rows] = await pool.query(query, [studentId]);
    return rows;
  },

  getByInternshipId: async (internshipId) => {
    const query = 'SELECT a.*, u.email, u.fullName, u.phone FROM applications a JOIN users u ON a.studentId = u.id WHERE a.internshipId = ?';
    const [rows] = await pool.query(query, [internshipId]);
    return rows;
  },

  updateStatus: async (id, status) => {
    const query = 'UPDATE applications SET status = ? WHERE id = ?';
    const [result] = await pool.query(query, [status, id]);
    return result;
  },

  delete: async (id) => {
    const query = 'DELETE FROM applications WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  }
};

module.exports = Application;
