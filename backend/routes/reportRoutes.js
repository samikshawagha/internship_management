const express = require('express');
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, checkRole(['student']), reportController.create);
router.get('/', verifyToken, checkRole(['student']), reportController.getByStudentId);
router.get('/internship/:internshipId', verifyToken, checkRole(['company', 'admin']), reportController.getByInternshipId);
router.patch('/:id/status', verifyToken, checkRole(['company', 'admin']), reportController.updateStatus);
router.delete('/:id', verifyToken, checkRole(['student']), reportController.delete);

module.exports = router;
