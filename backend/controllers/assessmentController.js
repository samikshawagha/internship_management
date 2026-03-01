const Assessment = require('../models/Assessment');

// Create a new assessment
const createAssessment = async (req, res) => {
  try {
    const {
      studentId,
      internshipId,
      evaluatorId,
      assessmentType,
      competencies,
      overallScore,
      comments
    } = req.body;

    if (!studentId || !internshipId || !evaluatorId || !assessmentType) {
      return res.status(400).json({ 
        message: 'Missing required fields: studentId, internshipId, evaluatorId, assessmentType' 
      });
    }

    if (overallScore < 0 || overallScore > 100) {
      return res.status(400).json({ 
        message: 'Score must be between 0 and 100' 
      });
    }

    const result = await Assessment.create({
      studentId,
      internshipId,
      evaluatorId,
      assessmentType,
      competencies: competencies || {},
      overallScore,
      comments: comments || '',
      status: 'completed'
    });

    res.status(201).json({
      message: 'Assessment created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ 
      message: 'Error creating assessment',
      error: error.message 
    });
  }
};

// Get assessment by ID
const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return res.status(404).json({ 
        message: 'Assessment not found' 
      });
    }

    res.status(200).json({
      message: 'Assessment retrieved successfully',
      data: assessment
    });
  } catch (error) {
    console.error('Error retrieving assessment:', error);
    res.status(500).json({ 
      message: 'Error retrieving assessment',
      error: error.message 
    });
  }
};

// Get all assessments for a student
const getStudentAssessments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const assessments = await Assessment.getByStudentId(studentId);

    res.status(200).json({
      message: 'Student assessments retrieved successfully',
      data: assessments,
      count: assessments.length
    });
  } catch (error) {
    console.error('Error retrieving student assessments:', error);
    res.status(500).json({ 
      message: 'Error retrieving student assessments',
      error: error.message 
    });
  }
};

// Get all assessments for an internship
const getInternshipAssessments = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const assessments = await Assessment.getByInternshipId(internshipId);

    res.status(200).json({
      message: 'Internship assessments retrieved successfully',
      data: assessments,
      count: assessments.length
    });
  } catch (error) {
    console.error('Error retrieving internship assessments:', error);
    res.status(500).json({ 
      message: 'Error retrieving internship assessments',
      error: error.message 
    });
  }
};

// Get assessments by evaluator (supervisor)
const getEvaluatorAssessments = async (req, res) => {
  try {
    const { evaluatorId } = req.params;

    const assessments = await Assessment.getByEvaluatorId(evaluatorId);

    res.status(200).json({
      message: 'Evaluator assessments retrieved successfully',
      data: assessments,
      count: assessments.length
    });
  } catch (error) {
    console.error('Error retrieving evaluator assessments:', error);
    res.status(500).json({ 
      message: 'Error retrieving evaluator assessments',
      error: error.message 
    });
  }
};

// Get assessments by type
const getAssessmentsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const validTypes = ['performance', 'competency', 'project'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        message: `Valid assessment types are: ${validTypes.join(', ')}` 
      });
    }

    const assessments = await Assessment.getByType(type);

    res.status(200).json({
      message: 'Assessments by type retrieved successfully',
      data: assessments,
      count: assessments.length
    });
  } catch (error) {
    console.error('Error retrieving assessments by type:', error);
    res.status(500).json({ 
      message: 'Error retrieving assessments by type',
      error: error.message 
    });
  }
};

// Update assessment
const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { competencies, overallScore, comments, status } = req.body;

    if (overallScore !== undefined && (overallScore < 0 || overallScore > 100)) {
      return res.status(400).json({ 
        message: 'Score must be between 0 and 100' 
      });
    }

    const result = await Assessment.update(id, {
      competencies,
      overallScore,
      comments,
      status
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Assessment not found' 
      });
    }

    res.status(200).json({
      message: 'Assessment updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ 
      message: 'Error updating assessment',
      error: error.message 
    });
  }
};

// Delete assessment
const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Assessment.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Assessment not found' 
      });
    }

    res.status(200).json({
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ 
      message: 'Error deleting assessment',
      error: error.message 
    });
  }
};

// Get student's average score in an internship
const getStudentAverageScore = async (req, res) => {
  try {
    const { studentId, internshipId } = req.params;

    const result = await Assessment.getStudentAverageScore(studentId, internshipId);

    res.status(200).json({
      message: 'Student average score retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error retrieving student average score:', error);
    res.status(500).json({ 
      message: 'Error retrieving student average score',
      error: error.message 
    });
  }
};

module.exports = {
  createAssessment,
  getAssessmentById,
  getStudentAssessments,
  getInternshipAssessments,
  getEvaluatorAssessments,
  getAssessmentsByType,
  updateAssessment,
  deleteAssessment,
  getStudentAverageScore
};
