const express = require('express');
const internshipController = require('../controllers/internshipController');
const { verifyToken, checkRole } = require('../middleware/auth');
const imageUpload = require('../middleware/imageUpload');

const router = express.Router();

// Create internship with optional logo image
router.post('/', verifyToken, checkRole(['company', 'admin']), imageUpload.single('logo'), internshipController.create);
router.get('/', internshipController.getAll);
router.get('/company', verifyToken, checkRole(['company', 'admin']), internshipController.getByCompanyId);
router.get('/:id', internshipController.getById);
// Update internship with optional logo image
router.put('/:id', verifyToken, checkRole(['company', 'admin']), imageUpload.single('logo'), internshipController.update);
router.delete('/:id', verifyToken, checkRole(['company', 'admin']), internshipController.delete);
router.patch('/:id/status', verifyToken, checkRole(['company', 'admin']), internshipController.updateStatus);

module.exports = router;
