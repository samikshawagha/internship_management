const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { verifyToken } = require('../middleware/auth');

// Create performance evaluation (Company/Admin only)
router.post('/performance', verifyToken, performanceController.createEvaluation);

// Get evaluations for a student
router.get('/performance/student/:studentId', verifyToken, performanceController.getEvaluationsByStudent);

// Get evaluations for an internship
router.get('/performance/internship/:internshipId', verifyToken, performanceController.getEvaluationsByInternship);

// Get specific evaluation
router.get('/performance/:evaluationId', verifyToken, performanceController.getEvaluationById);

// Get average score for a student
router.get('/performance/average/:studentId/:internshipId?', verifyToken, performanceController.getAverageScore);

// Update evaluation
router.put('/performance/:evaluationId', verifyToken, performanceController.updateEvaluation);

// Delete evaluation
router.delete('/performance/:evaluationId', verifyToken, performanceController.deleteEvaluation);

module.exports = router;
