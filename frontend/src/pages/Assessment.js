import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/assessment.css';

const Assessment = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    studentId: '',
    internshipId: '',
    evaluatorId: '',
    assessmentType: 'performance',
    competencies: {},
    overallScore: 0,
    comments: ''
  });
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    if (user?.role === 'student') {
      setFormData(prev => ({ ...prev, studentId: user.id }));
    }
  }, [user]);

  // load internships list for dropdown
  useEffect(() => {
    const loadInternships = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/internships');
        setInternships(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error loading internships:', err);
      }
    };
    loadInternships();
  }, []);

  // Fetch assessments
  const fetchAssessments = async () => {
    if (!user?.id) return; // nothing to fetch if no authenticated user

    setLoading(true);
    setError('');
    try {
      // axios.defaults.headers.common['Authorization'] is set in AuthContext
      const studentId = user.role === 'student' ? user.id : '';
      const url = studentId
        ? `http://localhost:5000/api/assessments/student/${studentId}`
        : `http://localhost:5000/api/assessments`;

      const response = await axios.get(url);
      setAssessments(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assessments');
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user]);

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

    // ensure internship is valid
    if (internships.length && !internships.find(i => i.id.toString() === formData.internshipId.toString())) {
      setError('Selected internship is not valid');
      return;
    }

    setLoading(true);
    try {
      // authorization header already applied globally
      if (selectedAssessment) {
        await axios.put(
          `http://localhost:5000/api/assessments/${selectedAssessment.id}`,
          formData
        );
        setError('');
        alert('Assessment updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/assessments',
          formData
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
        await axios.delete(`http://localhost:5000/api/assessments/${id}`);
        alert('Assessment deleted successfully');
        fetchAssessments();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete assessment');
      }
    }
  };

  // apply filter and search
  const filteredAssessments = assessments.filter(a => {
    const typeMatch = filterType === 'all' || a.assessmentType === filterType;
    const searchMatch = searchTerm === '' ||
      a.studentId.toString().includes(searchTerm) ||
      a.internshipId.toString().includes(searchTerm) ||
      a.evaluatorId.toString().includes(searchTerm);
    return typeMatch && searchMatch;
  });

  // pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAssessments = filteredAssessments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  return (
    <div className="assessment-container">
      <h1>Assessment Management</h1>

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

        <input
          type="text"
          className="search-input"
          placeholder="Search by student, internship, evaluator..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

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
            {user?.role !== 'student' && (
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
            )}
            {user?.role === 'student' && (
              <input type="hidden" name="studentId" value={formData.studentId} />
            )}

            <div className="form-group">
              <label>Internship *</label>
              <select
                name="internshipId"
                value={formData.internshipId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- select --</option>
                {internships.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.title || i.id}
                  </option>
                ))}
              </select>
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
        <>
          <div className="assessment-list">
            {currentAssessments.map(assessment => (
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

          {/* pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className={`page-btn ${num === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Assessment;
