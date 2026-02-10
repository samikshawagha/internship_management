const pool = require('../config/database');

const Internship = {
  create: async (data) => {
    const { companyId, title, description, location, duration, stipend, skills, startDate } = data;
    const query = 'INSERT INTO internships (companyId, title, description, location, duration, stipend, skills, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [companyId, title, description, location, duration, stipend, skills, startDate]);
    return result;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM internships WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  getAll: async () => {
    const query = 'SELECT * FROM internships WHERE status = "open"';
    const [rows] = await pool.query(query);
    return rows;
  },

  getByCompanyId: async (companyId) => {
    const query = 'SELECT * FROM internships WHERE companyId = ?';
    const [rows] = await pool.query(query, [companyId]);
    return rows;
  },

  update: async (id, data) => {
    const { title, description, location, duration, stipend, skills } = data;
    const query = 'UPDATE internships SET title = ?, description = ?, location = ?, duration = ?, stipend = ?, skills = ? WHERE id = ?';
    const [result] = await pool.query(query, [title, description, location, duration, stipend, skills, id]);
    return result;
  },

  delete: async (id) => {
    const query = 'DELETE FROM internships WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  },

  updateStatus: async (id, status) => {
    const query = 'UPDATE internships SET status = ? WHERE id = ?';
    const [result] = await pool.query(query, [status, id]);
    return result;
  }
};

module.exports = Internship;
