const pool = require('../config/database');

const Internship = {
  create: async (data) => {
    const { companyId, title, description, location, duration, stipend, skills, startDate, logo, status, minStudents } = data;
    // Ensure new internships have a status (default to 'open') so getAll() returns them
    const insertStatus = status || 'open';
    const skillsStr = Array.isArray(skills) ? skills.join(',') : (skills || null);
    const minStu = minStudents ? parseInt(minStudents) : null;
    const query = 'INSERT INTO internships (companyId, title, description, location, duration, stipend, skills, startDate, logo, status, minStudents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [companyId, title, description, location, duration, stipend, skillsStr, startDate, logo || null, insertStatus, minStu]);
    return result;
  },

  findById: async (id) => {
    const query = 'SELECT i.*, u.fullName AS company FROM internships i LEFT JOIN users u ON i.companyId = u.id WHERE i.id = ?';
    const [rows] = await pool.query(query, [id]);
    const row = rows[0];
    if (!row) return null;
    // Normalize skills to array
    if (row.skills && typeof row.skills === 'string') {
      row.skills = row.skills.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      row.skills = [];
    }
    // Provide postedDate for frontend compatibility
    row.postedDate = row.createdAt ? new Date(row.createdAt).toISOString().split('T')[0] : null;
    return row;
  },

  getAll: async () => {
    const query = 'SELECT i.*, u.fullName AS company FROM internships i LEFT JOIN users u ON i.companyId = u.id WHERE i.status = "open"';
    const [rows] = await pool.query(query);
    return rows.map(r => ({
      ...r,
      skills: r.skills && typeof r.skills === 'string' ? r.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      postedDate: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : null
    }));
  },

  // ADMIN - Get all internships regardless of status
  getAllAll: async () => {
    const query = 'SELECT i.*, u.fullName AS company FROM internships i LEFT JOIN users u ON i.companyId = u.id';
    const [rows] = await pool.query(query);
    return rows.map(r => ({
      ...r,
      skills: r.skills && typeof r.skills === 'string' ? r.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      postedDate: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : null
    }));
  },

  getByCompanyId: async (companyId) => {
    const query = 'SELECT i.*, u.fullName AS company FROM internships i LEFT JOIN users u ON i.companyId = u.id WHERE i.companyId = ?';
    const [rows] = await pool.query(query, [companyId]);
    return rows.map(r => ({
      ...r,
      skills: r.skills && typeof r.skills === 'string' ? r.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      postedDate: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : null
    }));
  },

  update: async (id, data) => {
    const { title, description, location, duration, stipend, skills, logo, minStudents } = data;
    const skillsStr = Array.isArray(skills) ? skills.join(',') : skills;
    const minStu = minStudents ? parseInt(minStudents) : null;
    let query = 'UPDATE internships SET title = ?, description = ?, location = ?, duration = ?, stipend = ?, skills = ?, minStudents = ?';
    const params = [title, description, location, duration, stipend, skillsStr, minStu];
    
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
    const query = 'UPDATE internships SET logo = ? WHERE id = ?';
    const [result] = await pool.query(query, [logoPath, id]);
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
  },

  // Count applications and auto-close if minStudents reached
  checkAndAutoClose: async (internshipId) => {
    const [rows] = await pool.query(
      'SELECT i.minStudents, i.status, COUNT(a.id) as appCount FROM internships i LEFT JOIN applications a ON a.internshipId = i.id WHERE i.id = ? GROUP BY i.id',
      [internshipId]
    );
    const row = rows[0];
    if (!row || !row.minStudents || row.status === 'closed') return false;
    if (row.appCount >= row.minStudents) {
      await pool.query('UPDATE internships SET status = "closed" WHERE id = ?', [internshipId]);
      return true;
    }
    return false;
  }
};

module.exports = Internship;
