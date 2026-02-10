const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', verifyToken, analyticsController.getDashboardStats);
router.get('/applications', verifyToken, analyticsController.getApplicationStats);

module.exports = router;
