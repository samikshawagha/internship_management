const pool = require('../config/database');

const Certificate = {
  // Create a new certificate
  create: async (data) => {
    const { 
      studentId, 
      internshipId, 
      certificateNumber, 
      issuanceDate, 
      expiryDate, 
      certificateFile,
      status,
      issueLevel
    } = data;
    
    const query = `
      INSERT INTO certificates 
      (studentId, internshipId, certificateNumber, issuanceDate, expiryDate, certificateFile, status, issueLevel, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await pool.query(query, [
      studentId,
      internshipId,
      certificateNumber,
      issuanceDate,
      expiryDate,
      certificateFile,
      status || 'generated',
      issueLevel || 'standard'
    ]);
    
    return result;
  },

  // Get certificate by ID
  findById: async (id) => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             i.title as internshipTitle,
             co.fullName as companyAdmin
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      JOIN internships i ON c.internshipId = i.id
      JOIN users co ON i.companyId = co.id
      WHERE c.id = ?
    `;
    
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },

  // Get certificate by number
  findByCertificateNumber: async (certificateNumber) => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             i.title as internshipTitle
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      JOIN internships i ON c.internshipId = i.id
      WHERE c.certificateNumber = ?
    `;
    
    const [rows] = await pool.query(query, [certificateNumber]);
    return rows[0];
  },

  // Get all certificates for a student
  getByStudentId: async (studentId) => {
    const query = `
      SELECT c.*, 
             i.title as internshipTitle,
             i.duration as internshipDuration
      FROM certificates c
      JOIN internships i ON c.internshipId = i.id
      WHERE c.studentId = ?
      ORDER BY c.issuanceDate DESC
    `;
    
    const [rows] = await pool.query(query, [studentId]);
    return rows;
  },

  // Get all certificates for an internship
  getByInternshipId: async (internshipId) => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             u.email as studentEmail
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      WHERE c.internshipId = ?
      ORDER BY c.issuanceDate DESC
    `;
    
    const [rows] = await pool.query(query, [internshipId]);
    return rows;
  },

  // Get certificates by status
  getByStatus: async (status) => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             i.title as internshipTitle
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      JOIN internships i ON c.internshipId = i.id
      WHERE c.status = ?
      ORDER BY c.createdAt DESC
    `;
    
    const [rows] = await pool.query(query, [status]);
    return rows;
  },

  // Get certificates by issue level
  getByIssueLevel: async (issueLevel) => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             i.title as internshipTitle
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      JOIN internships i ON c.internshipId = i.id
      WHERE c.issueLevel = ?
      ORDER BY c.issuanceDate DESC
    `;
    
    const [rows] = await pool.query(query, [issueLevel]);
    return rows;
  },

  // Update certificate
  update: async (id, data) => {
    const { 
      certificateNumber, 
      issuanceDate, 
      expiryDate, 
      certificateFile, 
      status,
      issueLevel 
    } = data;
    
    let query = 'UPDATE certificates SET ';
    const params = [];
    const updates = [];
    
    if (certificateNumber !== undefined) {
      updates.push('certificateNumber = ?');
      params.push(certificateNumber);
    }
    if (issuanceDate !== undefined) {
      updates.push('issuanceDate = ?');
      params.push(issuanceDate);
    }
    if (expiryDate !== undefined) {
      updates.push('expiryDate = ?');
      params.push(expiryDate);
    }
    if (certificateFile !== undefined) {
      updates.push('certificateFile = ?');
      params.push(certificateFile);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (issueLevel !== undefined) {
      updates.push('issueLevel = ?');
      params.push(issueLevel);
    }
    
    updates.push('updatedAt = NOW()');
    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result;
  },

  // Delete certificate
  delete: async (id) => {
    const query = 'DELETE FROM certificates WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result;
  },

  // Get all active certificates (not expired)
  getActiveCertificates: async () => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             i.title as internshipTitle
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      JOIN internships i ON c.internshipId = i.id
      WHERE c.status = 'issued' AND (c.expiryDate IS NULL OR c.expiryDate > NOW())
      ORDER BY c.issuanceDate DESC
    `;
    
    const [rows] = await pool.query(query);
    return rows;
  },

  // Get expired certificates
  getExpiredCertificates: async () => {
    const query = `
      SELECT c.*, 
             u.fullName as studentName,
             i.title as internshipTitle
      FROM certificates c
      JOIN users u ON c.studentId = u.id
      JOIN internships i ON c.internshipId = i.id
      WHERE c.expiryDate IS NOT NULL AND c.expiryDate < NOW()
      ORDER BY c.expiryDate DESC
    `;
    
    const [rows] = await pool.query(query);
    return rows;
  },

  // Check if student has completed internship and can get certificate
  canIssueCertificate: async (studentId, internshipId) => {
    const query = `
      SELECT COUNT(*) as count
      FROM assessments
      WHERE studentId = ? AND internshipId = ? AND overallScore >= 60
    `;
    
    const [rows] = await pool.query(query, [studentId, internshipId]);
    return rows[0].count > 0;
  }
};

module.exports = Certificate;
