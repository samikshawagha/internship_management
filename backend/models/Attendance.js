const db = require('../config/database');

class Attendance {
  static create(attendanceData) {
    return new Promise((resolve, reject) => {
      const { studentId, internshipId, date, status, remarks } = attendanceData;
      const query = `
        INSERT INTO attendance (student_id, internship_id, date, status, remarks, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      
      db.query(query, [studentId, internshipId, date, status || 'present', remarks || null], (err, result) => {
        if (err) reject(err);
        else resolve({ id: result.insertId, ...attendanceData });
      });
    });
  }

  static findByStudentAndInternship(studentId, internshipId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM attendance 
        WHERE student_id = ? AND internship_id = ?
        ORDER BY date DESC
      `;
      
      db.query(query, [studentId, internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static findByInternship(internshipId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT a.*, u.fullName, u.email
        FROM attendance a
        JOIN users u ON a.student_id = u.id
        WHERE a.internship_id = ?
        ORDER BY a.date DESC
      `;
      
      db.query(query, [internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static findById(attendanceId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM attendance WHERE id = ?';
      
      db.query(query, [attendanceId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static update(attendanceId, attendanceData) {
    return new Promise((resolve, reject) => {
      const { status, remarks } = attendanceData;
      const query = `
        UPDATE attendance 
        SET status = ?, remarks = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(query, [status, remarks || null, attendanceId], (err) => {
        if (err) reject(err);
        else resolve({ id: attendanceId, ...attendanceData });
      });
    });
  }

  static getAttendanceSummary(studentId, internshipId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as totalDays,
          SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presentDays,
          SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absentDays,
          SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as leaveDays,
          SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as lateDays,
          ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as attendancePercentage
        FROM attendance
        WHERE student_id = ? AND internship_id = ?
      `;
      
      db.query(query, [studentId, internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static delete(attendanceId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM attendance WHERE id = ?';
      
      db.query(query, [attendanceId], (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  }
}

module.exports = Attendance;
