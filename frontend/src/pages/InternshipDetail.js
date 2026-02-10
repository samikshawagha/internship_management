import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const InternshipDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({ resume: '', coverLetter: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInternshipDetail();
    if (user?.role === 'company') {
      fetchApplications();
    }
  }, [id, user]);

  const fetchInternshipDetail = async () => {
    try {
      const response = await apiService.getInternshipById(id);
      setInternship(response.data);
    } catch (error) {
      setError('Failed to fetch internship details');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await apiService.getInternshipApplications(id);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await apiService.submitApplication({
        internshipId: id,
        ...formData
      });
      setSuccess('Application submitted successfully!');
      setFormData({ resume: '', coverLetter: '' });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await apiService.updateApplicationStatus(applicationId, status);
      fetchApplications();
    } catch (error) {
      setError('Failed to update application status');
    }
  };

  if (loading) return <div className="loading">Loading internship details...</div>;
  if (error && !internship) return <div className="error">{error}</div>;

  return (
    <div className="container">
      {internship && (
        <>
          <div className="card">
            <h1>{internship.title}</h1>
            <p><strong>Location:</strong> {internship.location}</p>
            <p><strong>Duration:</strong> {internship.duration}</p>
            <p><strong>Stipend:</strong> ${internship.stipend}</p>
            <p><strong>Skills Required:</strong> {internship.skills}</p>
            <p><strong>Start Date:</strong> {internship.startDate}</p>
            <p><strong>Status:</strong> <span className={`badge badge-${internship.status === 'open' ? 'success' : 'danger'}`}>{internship.status}</span></p>
            <h3>Description</h3>
            <p>{internship.description}</p>
          </div>

          {user?.role === 'student' && internship.status === 'open' && (
            <div className="card">
              <h2>Apply for this Internship</h2>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label>Resume</label>
                  <textarea
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                    placeholder="Paste your resume or summary"
                  />
                </div>

                <div className="form-group">
                  <label>Cover Letter</label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    placeholder="Write your cover letter"
                  />
                </div>

                <button type="submit" className="button button-success" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          )}

          {user?.role === 'company' && (
            <div className="card">
              <h2>Applications</h2>
              {applications.length === 0 ? (
                <p>No applications yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>{app.fullName}</td>
                        <td>{app.email}</td>
                        <td>{app.phone}</td>
                        <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                        <td>
                          {app.status === 'pending' && (
                            <>
                              <button className="button button-success" onClick={() => handleApplicationStatus(app.id, 'approved')}>
                                Approve
                              </button>
                              <button className="button button-danger" onClick={() => handleApplicationStatus(app.id, 'rejected')}>
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InternshipDetail;
