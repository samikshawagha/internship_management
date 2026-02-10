const Report = require('../models/Report');

const reportController = {
  create: async (req, res) => {
    try {
      const { internshipId, title, content } = req.body;

      if (!internshipId || !title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await Report.create({
        studentId: req.userId,
        internshipId,
        title,
        content
      });

      res.status(201).json({
        message: 'Report submitted successfully',
        reportId: result.insertId
      });
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({ error: 'Failed to create report' });
    }
  },

  getByStudentId: async (req, res) => {
    try {
      const reports = await Report.getByStudentId(req.userId);
      res.json(reports);
    } catch (error) {
      console.error('Get student reports error:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  },

  getByInternshipId: async (req, res) => {
    try {
      const { internshipId } = req.params;
      const reports = await Report.getByInternshipId(internshipId);
      res.json(reports);
    } catch (error) {
      console.error('Get internship reports error:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      await Report.updateStatus(id, status);
      res.json({ message: 'Report status updated successfully' });
    } catch (error) {
      console.error('Update report status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  },

  delete: async (req, res) => {
    try {
      await Report.delete(req.params.id);
      res.json({ message: 'Report deleted successfully' });
    } catch (error) {
      console.error('Delete report error:', error);
      res.status(500).json({ error: 'Failed to delete report' });
    }
  }
};

module.exports = reportController;
