const Application = require('../models/Application');

const applicationController = {
  create: async (req, res) => {
    try {
      const { internshipId, coverLetter } = req.body;

      if (!internshipId) {
        return res.status(400).json({ error: 'Internship ID required' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Resume file is required' });
      }

      // Store the resume file path
      const resumePath = req.file.path;

      const result = await Application.create({
        studentId: req.userId,
        internshipId,
        resume: resumePath,
        coverLetter: coverLetter || ''
      });

      res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: result.insertId
      });
    } catch (error) {
      console.error('Create application error:', error);
      res.status(500).json({ error: 'Failed to submit application' });
    }
  },

  getByStudentId: async (req, res) => {
    try {
      const applications = await Application.getByStudentId(req.userId);
      res.json(applications);
    } catch (error) {
      console.error('Get student applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  },

  getByInternshipId: async (req, res) => {
    try {
      const { internshipId } = req.params;
      const applications = await Application.getByInternshipId(internshipId);
      res.json(applications);
    } catch (error) {
      console.error('Get internship applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      await Application.updateStatus(id, status);
      res.json({ message: 'Application status updated successfully' });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  },

  delete: async (req, res) => {
    try {
      await Application.delete(req.params.id);
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error('Delete application error:', error);
      res.status(500).json({ error: 'Failed to delete application' });
    }
  }
};

module.exports = applicationController;
