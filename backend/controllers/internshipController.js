const Internship = require('../models/Internship');

const internshipController = {
  create: async (req, res) => {
    try {
      const { title, description, location, duration, stipend, skills, startDate } = req.body;

      if (!title || !description || !location || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get logo path if image was uploaded
      const logo = req.file ? req.file.path : null;

      const result = await Internship.create({
        companyId: req.userId,
        title,
        description,
        location,
        duration,
        stipend,
        skills,
        startDate,
        logo
      });

      res.status(201).json({
        message: 'Internship posted successfully',
        internshipId: result.insertId
      });
    } catch (error) {
      console.error('Create internship error:', error);
      res.status(500).json({ error: 'Failed to create internship' });
    }
  },

  getAll: async (req, res) => {
    try {
      const internships = await Internship.getAll();
      res.json(internships);
    } catch (error) {
      console.error('Get internships error:', error);
      res.status(500).json({ error: 'Failed to fetch internships' });
    }
  },

  // Admin: get all internships regardless of status
  getAllAdmin: async (req, res) => {
    try {
      const internships = await Internship.getAllAll();
      res.json(internships);
    } catch (error) {
      console.error('Get all internships error:', error);
      res.status(500).json({ error: 'Failed to fetch internships' });
    }
  },

  getById: async (req, res) => {
    try {
      const internship = await Internship.findById(req.params.id);
      if (!internship) {
        return res.status(404).json({ error: 'Internship not found' });
      }
      res.json(internship);
    } catch (error) {
      console.error('Get internship error:', error);
      res.status(500).json({ error: 'Failed to fetch internship' });
    }
  },

  getByCompanyId: async (req, res) => {
    try {
      const internships = await Internship.getByCompanyId(req.userId);
      res.json(internships);
    } catch (error) {
      console.error('Get company internships error:', error);
      res.status(500).json({ error: 'Failed to fetch internships' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, location, duration, stipend, skills, status } = req.body;

      // Get logo path if new image was uploaded
      const logo = req.file ? req.file.path : undefined;

      await Internship.update(id, {
        title,
        description,
        location,
        duration,
        stipend,
        skills,
        ...(logo && { logo })
      });

      res.json({ message: 'Internship updated successfully' });
    } catch (error) {
      console.error('Update internship error:', error);
      res.status(500).json({ error: 'Failed to update internship' });
    }
  },

  delete: async (req, res) => {
    try {
      await Internship.delete(req.params.id);
      res.json({ message: 'Internship deleted successfully' });
    } catch (error) {
      console.error('Delete internship error:', error);
      res.status(500).json({ error: 'Failed to delete internship' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await Internship.updateStatus(id, status);
      res.json({ message: 'Status updated successfully' });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
};

module.exports = internshipController;
