const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { verifyToken } = require('../middleware/auth');

// Create a new assessment
router.post('/', verifyToken, assessmentController.createAssessment);

// Get assessment by ID
router.get('/:id', verifyToken, assessmentController.getAssessmentById);

// Get all assessments for a student
router.get('/student/:studentId', verifyToken, assessmentController.getStudentAssessments);

// Get all assessments for an internship
router.get('/internship/:internshipId', verifyToken, assessmentController.getInternshipAssessments);

// Get assessments by evaluator
router.get('/evaluator/:evaluatorId', verifyToken, assessmentController.getEvaluatorAssessments);

// Get assessments by type
router.get('/type/:type', verifyToken, assessmentController.getAssessmentsByType);

// Get student's average score in an internship
router.get('/average/:studentId/:internshipId', verifyToken, assessmentController.getStudentAverageScore);

// Update assessment
router.put('/:id', verifyToken, assessmentController.updateAssessment);

// Delete assessment
router.delete('/:id', verifyToken, assessmentController.deleteAssessment);

module.exports = router;
