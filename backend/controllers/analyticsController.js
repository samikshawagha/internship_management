const pool = require('../config/database');

const analyticsController = {
  getDashboardStats: async (req, res) => {
    try {
      const userId = req.userId;
      const userRole = req.userRole;

      let stats = {};

      if (userRole === 'admin') {
        // Admin dashboard stats
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [internships] = await pool.query('SELECT COUNT(*) as count FROM internships');
        const [applications] = await pool.query('SELECT COUNT(*) as count FROM applications');
        const [reports] = await pool.query('SELECT COUNT(*) as count FROM reports');

        stats = {
          totalUsers: users[0].count,
          totalInternships: internships[0].count,
          totalApplications: applications[0].count,
          totalReports: reports[0].count
        };
      } else if (userRole === 'company') {
        // Company dashboard stats
        const [internships] = await pool.query('SELECT COUNT(*) as count FROM internships WHERE companyId = ?', [userId]);
        const [applications] = await pool.query(
          'SELECT COUNT(*) as count FROM applications a JOIN internships i ON a.internshipId = i.id WHERE i.companyId = ?',
          [userId]
        );
        const [approved] = await pool.query(
          'SELECT COUNT(*) as count FROM applications a JOIN internships i ON a.internshipId = i.id WHERE i.companyId = ? AND a.status = "approved"',
          [userId]
        );

        stats = {
          totalInternships: internships[0].count,
          totalApplications: applications[0].count,
          approvedApplications: approved[0].count
        };
      } else if (userRole === 'student') {
        // Student dashboard stats
        const [applications] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE studentId = ?', [userId]);
        const [approved] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE studentId = ? AND status = "approved"', [userId]);
        const [reports] = await pool.query('SELECT COUNT(*) as count FROM reports WHERE studentId = ?', [userId]);

        stats = {
          totalApplications: applications[0].count,
          approvedApplications: approved[0].count,
          submittedReports: reports[0].count
        };
      }

      res.json(stats);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  },

  getApplicationStats: async (req, res) => {
    try {
      const userId = req.userId;
      const userRole = req.userRole;

      let query, params;

      if (userRole === 'company') {
        query = `
          SELECT a.status, COUNT(*) as count 
          FROM applications a 
          JOIN internships i ON a.internshipId = i.id 
          WHERE i.companyId = ? 
          GROUP BY a.status
        `;
        params = [userId];
      } else if (userRole === 'student') {
        query = `
          SELECT status, COUNT(*) as count 
          FROM applications 
          WHERE studentId = ? 
          GROUP BY status
        `;
        params = [userId];
      }

      const [stats] = await pool.query(query, params);
      res.json(stats);
    } catch (error) {
      console.error('Application stats error:', error);
      res.status(500).json({ error: 'Failed to fetch application stats' });
    }
  }
};

module.exports = analyticsController;
