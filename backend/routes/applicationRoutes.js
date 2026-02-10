const express = require('express');
const applicationController = require('../controllers/applicationController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, checkRole(['student']), applicationController.create);
router.get('/', verifyToken, checkRole(['student']), applicationController.getByStudentId);
router.get('/internship/:internshipId', verifyToken, checkRole(['company', 'admin']), applicationController.getByInternshipId);
router.patch('/:id/status', verifyToken, checkRole(['company', 'admin']), applicationController.updateStatus);
router.delete('/:id', verifyToken, checkRole(['student']), applicationController.delete);

module.exports = router;
