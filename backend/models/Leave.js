const db = require('../config/database');

class Leave {
  static create(leaveData) {
    return new Promise((resolve, reject) => {
      const { studentId, internshipId, startDate, endDate, reason, leaveType } = leaveData;
      const query = `
        INSERT INTO leaves (student_id, internship_id, start_date, end_date, reason, leave_type, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
      `;
      
      db.query(query, [studentId, internshipId, startDate, endDate, reason, leaveType || 'casual'], (err, result) => {
        if (err) reject(err);
        else resolve({ id: result.insertId, ...leaveData, status: 'pending' });
      });
    });
  }

  static findByStudent(studentId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.fullName 
        FROM leaves l
        JOIN users u ON l.student_id = u.id
        WHERE l.student_id = ?
        ORDER BY l.created_at DESC
      `;
      
      db.query(query, [studentId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static findByInternship(internshipId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.fullName, u.email, i.title as internshipTitle
        FROM leaves l
        JOIN users u ON l.student_id = u.id
        JOIN internships i ON l.internship_id = i.id
        WHERE l.internship_id = ?
        ORDER BY l.created_at DESC
      `;
      
      db.query(query, [internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static findById(leaveId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.fullName
        FROM leaves l
        JOIN users u ON l.student_id = u.id
        WHERE l.id = ?
      `;
      
      db.query(query, [leaveId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static updateStatus(leaveId, status, approverComments = null) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE leaves 
        SET status = ?, approver_comments = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(query, [status, approverComments, leaveId], (err) => {
        if (err) reject(err);
        else resolve({ id: leaveId, status });
      });
    });
  }

  static update(leaveId, leaveData) {
    return new Promise((resolve, reject) => {
      const { startDate, endDate, reason, leaveType } = leaveData;
      const query = `
        UPDATE leaves 
        SET start_date = ?, end_date = ?, reason = ?, leave_type = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(query, [startDate, endDate, reason, leaveType, leaveId], (err) => {
        if (err) reject(err);
        else resolve({ id: leaveId, ...leaveData });
      });
    });
  }

  static getPendingLeaves(internshipId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT l.*, u.fullName, u.email
        FROM leaves l
        JOIN users u ON l.student_id = u.id
        WHERE l.internship_id = ? AND l.status = 'pending'
        ORDER BY l.created_at ASC
      `;
      
      db.query(query, [internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static delete(leaveId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM leaves WHERE id = ?';
      
      db.query(query, [leaveId], (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  }
}

module.exports = Leave;
