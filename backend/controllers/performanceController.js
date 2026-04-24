const PerformanceEvaluation = require('../models/PerformanceEvaluation');

exports.createEvaluation = async (req, res) => {
  try {
    const {
      studentId,
      internshipId,
      evaluatorId,
      technicalSkills,
      communication,
      teamwork,
      punctuality,
      proactiveness,
      comments
    } = req.body;

    if (!studentId || !internshipId || !evaluatorId) {
      return res.status(400).json({ message: 'Student ID, Internship ID, and Evaluator ID are required' });
    }

    // Validate scores (should be between 1-5)
    const scores = [technicalSkills, communication, teamwork, punctuality, proactiveness];
    if (scores.some(score => score < 1 || score > 5)) {
      return res.status(400).json({ message: 'All scores must be between 1 and 5' });
    }

    const evaluation = await PerformanceEvaluation.create({
      studentId,
      internshipId,
      evaluatorId,
      technicalSkills,
      communication,
      teamwork,
      punctuality,
      proactiveness,
      comments
    });

    res.status(201).json({
      message: 'Performance evaluation created successfully',
      data: evaluation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating performance evaluation', error: error.message });
  }
};

exports.getEvaluationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const evaluations = await PerformanceEvaluation.findByStudent(studentId);

    res.status(200).json({
      message: 'Performance evaluations retrieved successfully',
      data: evaluations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving performance evaluations', error: error.message });
  }
};

exports.getEvaluationsByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const evaluations = await PerformanceEvaluation.findByInternship(internshipId);

    res.status(200).json({
      message: 'Performance evaluations retrieved successfully',
      data: evaluations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving performance evaluations', error: error.message });
  }
};

exports.getEvaluationById = async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const evaluation = await PerformanceEvaluation.findById(evaluationId);

    if (!evaluation) {
      return res.status(404).json({ message: 'Performance evaluation not found' });
    }

    res.status(200).json({
      message: 'Performance evaluation retrieved successfully',
      data: evaluation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving performance evaluation', error: error.message });
  }
};

exports.updateEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const {
      technicalSkills,
      communication,
      teamwork,
      punctuality,
      proactiveness,
      comments
    } = req.body;

    // Validate scores (should be between 1-5)
    const scores = [technicalSkills, communication, teamwork, punctuality, proactiveness];
    if (scores.some(score => score < 1 || score > 5)) {
      return res.status(400).json({ message: 'All scores must be between 1 and 5' });
    }

    const evaluation = await PerformanceEvaluation.update(evaluationId, {
      technicalSkills,
      communication,
      teamwork,
      punctuality,
      proactiveness,
      comments
    });

    res.status(200).json({
      message: 'Performance evaluation updated successfully',
      data: evaluation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating performance evaluation', error: error.message });
  }
};

exports.getAverageScore = async (req, res) => {
  try {
    const { studentId, internshipId } = req.params;

    const averageScore = await PerformanceEvaluation.getAverageScore(
      studentId,
      internshipId || null
    );

    res.status(200).json({
      message: 'Average performance score retrieved successfully',
      data: averageScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving average score', error: error.message });
  }
};

exports.deleteEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;

    await PerformanceEvaluation.delete(evaluationId);

    res.status(200).json({ message: 'Performance evaluation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting performance evaluation', error: error.message });
  }
};
