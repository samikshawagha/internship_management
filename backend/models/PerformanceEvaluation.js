const db = require('../config/database');

class PerformanceEvaluation {
  static create(evaluationData) {
    return new Promise((resolve, reject) => {
      const { 
        studentId, 
        internshipId, 
        evaluatorId, 
        technicalSkills, 
        communication, 
        teamwork, 
        punctuality, 
        proactiveness, 
        comments 
      } = evaluationData;

      const query = `
        INSERT INTO performance_evaluations 
        (student_id, internship_id, evaluator_id, technical_skills, communication, teamwork, punctuality, proactiveness, comments, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      db.query(
        query,
        [studentId, internshipId, evaluatorId, technicalSkills, communication, teamwork, punctuality, proactiveness, comments],
        (err, result) => {
          if (err) reject(err);
          else resolve({ id: result.insertId, ...evaluationData });
        }
      );
    });
  }

  static findByStudent(studentId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.fullName as studentName, c.fullName as evaluatorName, i.title as internshipTitle
        FROM performance_evaluations p
        JOIN users u ON p.student_id = u.id
        JOIN users c ON p.evaluator_id = c.id
        JOIN internships i ON p.internship_id = i.id
        WHERE p.student_id = ?
        ORDER BY p.created_at DESC
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
        SELECT p.*, u.fullName as studentName, c.fullName as evaluatorName
        FROM performance_evaluations p
        JOIN users u ON p.student_id = u.id
        JOIN users c ON p.evaluator_id = c.id
        WHERE p.internship_id = ?
        ORDER BY p.created_at DESC
      `;
      
      db.query(query, [internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static findById(evaluationId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.fullName as studentName, c.fullName as evaluatorName, i.title as internshipTitle
        FROM performance_evaluations p
        JOIN users u ON p.student_id = u.id
        JOIN users c ON p.evaluator_id = c.id
        JOIN internships i ON p.internship_id = i.id
        WHERE p.id = ?
      `;
      
      db.query(query, [evaluationId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static findByStudentAndInternship(studentId, internshipId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.fullName as studentName, c.fullName as evaluatorName
        FROM performance_evaluations p
        JOIN users u ON p.student_id = u.id
        JOIN users c ON p.evaluator_id = c.id
        WHERE p.student_id = ? AND p.internship_id = ?
      `;
      
      db.query(query, [studentId, internshipId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0] || null);
      });
    });
  }

  static update(evaluationId, evaluationData) {
    return new Promise((resolve, reject) => {
      const { 
        technicalSkills, 
        communication, 
        teamwork, 
        punctuality, 
        proactiveness, 
        comments 
      } = evaluationData;

      const query = `
        UPDATE performance_evaluations 
        SET technical_skills = ?, communication = ?, teamwork = ?, punctuality = ?, proactiveness = ?, comments = ?, updated_at = NOW()
        WHERE id = ?
      `;
      
      db.query(
        query,
        [technicalSkills, communication, teamwork, punctuality, proactiveness, comments, evaluationId],
        (err) => {
          if (err) reject(err);
          else resolve({ id: evaluationId, ...evaluationData });
        }
      );
    });
  }

  static getAverageScore(studentId, internshipId = null) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT 
          ROUND(AVG(technical_skills), 2) as avgTechnicalSkills,
          ROUND(AVG(communication), 2) as avgCommunication,
          ROUND(AVG(teamwork), 2) as avgTeamwork,
          ROUND(AVG(punctuality), 2) as avgPunctuality,
          ROUND(AVG(proactiveness), 2) as avgProactiveness,
          ROUND((AVG(technical_skills) + AVG(communication) + AVG(teamwork) + AVG(punctuality) + AVG(proactiveness)) / 5, 2) as overallScore
        FROM performance_evaluations
        WHERE student_id = ?
      `;
      
      const params = [studentId];
      
      if (internshipId) {
        query += ' AND internship_id = ?';
        params.push(internshipId);
      }
      
      db.query(query, params, (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static delete(evaluationId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM performance_evaluations WHERE id = ?';
      
      db.query(query, [evaluationId], (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  }
}

module.exports = PerformanceEvaluation;
