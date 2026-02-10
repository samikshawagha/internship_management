const express = require('express');
const internshipController = require('../controllers/internshipController');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, checkRole(['company', 'admin']), internshipController.create);
router.get('/', internshipController.getAll);
router.get('/company', verifyToken, checkRole(['company', 'admin']), internshipController.getByCompanyId);
router.get('/:id', internshipController.getById);
router.put('/:id', verifyToken, checkRole(['company', 'admin']), internshipController.update);
router.delete('/:id', verifyToken, checkRole(['company', 'admin']), internshipController.delete);
router.patch('/:id/status', verifyToken, checkRole(['company', 'admin']), internshipController.updateStatus);

module.exports = router;
