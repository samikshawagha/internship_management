import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [internships, setInternships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    internshipId: '',
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchStudentReports();
      fetchApprovedInternships();
    } else {
      // non-student users shouldn't see the student reports view
      // stop the loading indicator so the page can render something else or an empty state
      setLoading(false);
    }
  }, [user]);

  const fetchStudentReports = async () => {
    try {
      const response = await apiService.getStudentReports();
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch student reports:', error);
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedInternships = async () => {
    try {
      const response = await apiService.getStudentApplications();
      const approved = response.data.filter(app => app.status === 'approved');
      setInternships(approved);
    } catch (error) {
      console.error('Failed to fetch approved internships:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiService.submitReport(formData);
      setSuccess('Report submitted successfully!');
      setFormData({ internshipId: '', title: '', content: '' });
      setShowForm(false);
      fetchStudentReports();
    } catch (error) {
      console.error('Submit report failed:', error);
      setError(error.response?.data?.error || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  // if not a student, show a simple message instead of the form/table
  if (!loading && user?.role !== 'student') {
    return (
      <div className="container">
        <h1>Internship Reports</h1>
        <p className="text-muted">This section is available for students only.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Internship Reports</h1>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {user?.role === 'student' && (
        <div style={{ marginBottom: '20px' }}>
          <button className="button" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Submit New Report'}
          </button>
        </div>
      )}

      {showForm && user?.role === 'student' && (
        <div className="card">
          <h2>Submit Report</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Internship</label>
              <select
                name="internshipId"
                value={formData.internshipId}
                onChange={handleChange}
                required
              >
                <option value="">Select an internship</option>
                {internships.map((app) => (
                  <option key={app.internshipId} value={app.internshipId}>
                    {app.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Report Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Report Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="button button-success" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      )}

      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Internship</th>
              <th>Status</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>{report.internshipTitle}</td>
                <td><span className={`badge badge-${report.status}`}>{report.status}</span></td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
