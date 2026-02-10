const pool = require('../config/database');

const Report = {
  create: async (data) => {
    const { studentId, internshipId, title, content } = data;
    const query = 'INSERT INTO reports (studentId, internshipId, title, content, status) VALUES (?, ?, ?, ?, "pending")';
    const [result] = await pool.query(query, [studentId, internshipId, title, content]);
    return result;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM reports WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  getByStudentId: async (studentId) => {
    const query = 'SELECT r.*, i.title as internshipTitle FROM reports r JOIN internships i ON r.internshipId = i.id WHERE r.studentId = ?';
    const [rows] = await pool.query(query, [studentId]);
    return rows;
  },

  getByInternshipId: async (internshipId) => {
    const query = 'SELECT r.*, u.email, u.fullName FROM reports r JOIN users u ON r.studentId = u.id WHERE r.internshipId = ?';
    const [rows] = await pool.query(query, [internshipId]);
    return rows;
  },

  updateStatus: async (id, status) => {
    const query = 'UPDATE reports SET status = ? WHERE id = ?';
    const [result] = await pool.query(query, [status, id]);
    return result;
  },

  delete: async (id) => {
    const query = 'DELETE FROM reports WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  }
};

module.exports = Report;
