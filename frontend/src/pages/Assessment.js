import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/assessment.css';

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const [formData, setFormData] = useState({
    studentId: '',
    internshipId: '',
    evaluatorId: '',
    assessmentType: 'performance',
    competencies: {},
    overallScore: 0,
    comments: ''
  });

  // Fetch assessments
  const fetchAssessments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const studentId = localStorage.getItem('userId');

      const response = await axios.get(
        `http://localhost:5000/api/assessments/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAssessments(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assessments');
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'overallScore' ? parseInt(value) : value
    }));
  };

  const handleCompetencyChange = (competency, value) => {
    setFormData(prev => ({
      ...prev,
      competencies: {
        ...prev.competencies,
        [competency]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId || !formData.internshipId || !formData.evaluatorId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      if (selectedAssessment) {
        await axios.put(
          `http://localhost:5000/api/assessments/${selectedAssessment.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setError('');
        alert('Assessment updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/assessments',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setError('');
        alert('Assessment created successfully');
      }

      setShowForm(false);
      setFormData({
        studentId: '',
        internshipId: '',
        evaluatorId: '',
        assessmentType: 'performance',
        competencies: {},
        overallScore: 0,
        comments: ''
      });

      fetchAssessments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save assessment');
      console.error('Error saving assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(
          `http://localhost:5000/api/assessments/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Assessment deleted successfully');
        fetchAssessments();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete assessment');
      }
    }
  };

  const filteredAssessments = filterType === 'all'
    ? assessments
    : assessments.filter(a => a.assessmentType === filterType);

  return (
    <div className="assessment-container">
      <h1>Assessments & Evaluations</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="assessment-header">
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setSelectedAssessment(null);
          }}
        >
          {showForm ? 'Cancel' : 'New Assessment'}
        </button>

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="performance">Performance</option>
          <option value="competency">Competency</option>
          <option value="project">Project</option>
        </select>
      </div>

      {showForm && (
        <div className="assessment-form-container">
          <form onSubmit={handleSubmit} className="assessment-form">
            <div className="form-group">
              <label>Student ID *</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Internship ID *</label>
              <input
                type="text"
                name="internshipId"
                value={formData.internshipId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Evaluator ID *</label>
              <input
                type="text"
                name="evaluatorId"
                value={formData.evaluatorId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Assessment Type</label>
              <select
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleInputChange}
              >
                <option value="performance">Performance</option>
                <option value="competency">Competency</option>
                <option value="project">Project</option>
              </select>
            </div>

            <div className="form-group">
              <label>Overall Score (0-100)</label>
              <input
                type="number"
                name="overallScore"
                value={formData.overallScore}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {selectedAssessment ? 'Update' : 'Create'} Assessment
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading assessments...</p>
      ) : filteredAssessments.length === 0 ? (
        <p className="no-data">No assessments found</p>
      ) : (
        <div className="assessment-list">
          {filteredAssessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header-card">
                <h3>{assessment.internshipTitle}</h3>
                <span className={`assessment-badge ${assessment.assessmentType}`}>
                  {assessment.assessmentType}
                </span>
              </div>

              <div className="assessment-content">
                <p><strong>Evaluator:</strong> {assessment.evaluatorName}</p>
                <p><strong>Score:</strong> <span className="score">{assessment.overallScore}%</span></p>
                <p><strong>Status:</strong> {assessment.status}</p>
                <p><strong>Date:</strong> {new Date(assessment.createdAt).toLocaleDateString()}</p>
              </div>

              {assessment.comments && (
                <div className="assessment-comments">
                  <strong>Comments:</strong>
                  <p>{assessment.comments}</p>
                </div>
              )}

              <div className="assessment-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedAssessment(assessment);
                    setFormData({
                      studentId: assessment.studentId,
                      internshipId: assessment.internshipId,
                      evaluatorId: assessment.evaluatorId,
                      assessmentType: assessment.assessmentType,
                      competencies: assessment.competencies || {},
                      overallScore: assessment.overallScore,
                      comments: assessment.comments
                    });
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(assessment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessment;
