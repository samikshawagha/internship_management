const pool = require('../config/database');

const Assessment = {
  // Create a new assessment
  create: async (data) => {
    const { 
      studentId, 
      internshipId, 
      evaluatorId, 
      assessmentType, 
      competencies, 
      overallScore, 
      comments, 
      status 
    } = data;
    
    const query = `
      INSERT INTO assessments 
      (studentId, internshipId, evaluatorId, assessmentType, competencies, overallScore, comments, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await pool.query(query, [
      studentId,
      internshipId,
      evaluatorId,
      assessmentType,
      JSON.stringify(competencies),
      overallScore,
      comments,
      status || 'completed'
    ]);
    
    return result;
  },

  // Get assessment by ID
  findById: async (id) => {
    const query = `
      SELECT a.*, 
             u1.fullName as studentName, 
             u2.fullName as evaluatorName,
             i.title as internshipTitle
      FROM assessments a
      JOIN users u1 ON a.studentId = u1.id
      JOIN users u2 ON a.evaluatorId = u2.id
      JOIN internships i ON a.internshipId = i.id
      WHERE a.id = ?
    `;
    
    const [rows] = await pool.query(query, [id]);
    if (rows[0]) {
      rows[0].competencies = JSON.parse(rows[0].competencies);
    }
    return rows[0];
  },

  // Get all assessments for a student
  getByStudentId: async (studentId) => {
    const query = `
      SELECT a.*, 
             u.fullName as evaluatorName,
             i.title as internshipTitle
      FROM assessments a
      JOIN users u ON a.evaluatorId = u.id
      JOIN internships i ON a.internshipId = i.id
      WHERE a.studentId = ?
      ORDER BY a.createdAt DESC
    `;
    
    const [rows] = await pool.query(query, [studentId]);
    return rows.map(row => ({
      ...row,
      competencies: JSON.parse(row.competencies)
    }));
  },

  // Get all assessments for an internship
  getByInternshipId: async (internshipId) => {
    const query = `
      SELECT a.*, 
             u1.fullName as studentName,
             u2.fullName as evaluatorName
      FROM assessments a
      JOIN users u1 ON a.studentId = u1.id
      JOIN users u2 ON a.evaluatorId = u2.id
      WHERE a.internshipId = ?
      ORDER BY a.createdAt DESC
    `;
    
    const [rows] = await pool.query(query, [internshipId]);
    return rows.map(row => ({
      ...row,
      competencies: JSON.parse(row.competencies)
    }));
  },

  // Get assessments by evaluator (supervisor)
  getByEvaluatorId: async (evaluatorId) => {
    const query = `
      SELECT a.*, 
             u.fullName as studentName,
             i.title as internshipTitle
      FROM assessments a
      JOIN users u ON a.studentId = u.id
      JOIN internships i ON a.internshipId = i.id
      WHERE a.evaluatorId = ?
      ORDER BY a.createdAt DESC
    `;
    
    const [rows] = await pool.query(query, [evaluatorId]);
    return rows.map(row => ({
      ...row,
      competencies: JSON.parse(row.competencies)
    }));
  },

  // Get assessments by type (performance, competency, project)
  getByType: async (assessmentType) => {
    const query = `
      SELECT a.*, 
             u1.fullName as studentName,
             u2.fullName as evaluatorName,
             i.title as internshipTitle
      FROM assessments a
      JOIN users u1 ON a.studentId = u1.id
      JOIN users u2 ON a.evaluatorId = u2.id
      JOIN internships i ON a.internshipId = i.id
      WHERE a.assessmentType = ?
      ORDER BY a.createdAt DESC
    `;
    
    const [rows] = await pool.query(query, [assessmentType]);
    return rows.map(row => ({
      ...row,
      competencies: JSON.parse(row.competencies)
    }));
  },

  // Update assessment
  update: async (id, data) => {
    const { competencies, overallScore, comments, status } = data;
    
    let query = 'UPDATE assessments SET ';
    const params = [];
    const updates = [];
    
    if (competencies !== undefined) {
      updates.push('competencies = ?');
      params.push(JSON.stringify(competencies));
    }
    if (overallScore !== undefined) {
      updates.push('overallScore = ?');
      params.push(overallScore);
    }
    if (comments !== undefined) {
      updates.push('comments = ?');
      params.push(comments);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    
    updates.push('updatedAt = NOW()');
    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result;
  },

  // Delete assessment
  delete: async (id) => {
    const query = 'DELETE FROM assessments WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  },

  // Get average score for a student in an internship
  getStudentAverageScore: async (studentId, internshipId) => {
    const query = `
      SELECT AVG(overallScore) as averageScore, COUNT(*) as assessmentCount
      FROM assessments
      WHERE studentId = ? AND internshipId = ?
    `;
    
    const [rows] = await pool.query(query, [studentId, internshipId]);
    return rows[0];
  }
};

module.exports = Assessment;
