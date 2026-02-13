const express = require('express');
const applicationController = require('../controllers/applicationController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create application with resume file upload
router.post('/', verifyToken, checkRole(['student']), upload.single('resume'), applicationController.create);
router.get('/', verifyToken, checkRole(['student']), applicationController.getByStudentId);
router.get('/internship/:internshipId', verifyToken, checkRole(['company', 'admin']), applicationController.getByInternshipId);
router.patch('/:id/status', verifyToken, checkRole(['company', 'admin']), applicationController.updateStatus);
router.delete('/:id', verifyToken, checkRole(['student']), applicationController.delete);

module.exports = router;
