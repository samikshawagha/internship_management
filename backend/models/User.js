const pool = require('../config/database');

const User = {
  create: async (userData) => {
    const { email, password, role, fullName, phone } = userData;
    const query = 'INSERT INTO users (email, password, role, fullName, phone) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [email, password, role, fullName, phone]);
    return result;
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  },

  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  update: async (id, userData) => {
    const { fullName, phone, logo } = userData;
    let query = 'UPDATE users SET fullName = ?, phone = ?';
    const params = [fullName, phone];
    
    if (logo) {
      query += ', logo = ?';
      params.push(logo);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result;
  },

  updateLogo: async (id, logoPath) => {
    const query = 'UPDATE users SET logo = ? WHERE id = ?';
    const [result] = await pool.query(query, [logoPath, id]);
    return result;
  },

  getAll: async () => {
    const query = 'SELECT id, email, role, fullName, phone, logo, createdAt FROM users';
    const [rows] = await pool.query(query);
    return rows;
  },

  updatePassword: async (id, hashedPassword) => {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await pool.query(query, [hashedPassword, id]);
    return result;
  }
};

module.exports = User;
