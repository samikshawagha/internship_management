import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiService.getStudentApplications();
      setApplications(response.data);
    } catch (error) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await apiService.deleteApplication(applicationId);
      setApplications(applications.filter(app => app.id !== applicationId));
    } catch (error) {
      setError('Failed to withdraw application');
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  return (
    <div className="container">
      <h1>My Applications</h1>
      {error && <div className="error">{error}</div>}

      {applications.length === 0 ? (
        <p>You haven't applied to any internships yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Internship</th>
              <th>Company</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.title}</td>
                <td>{app.companyEmail}</td>
                <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  {app.status === 'pending' && (
                    <button
                      className="button button-danger"
                      onClick={() => handleWithdraw(app.id)}
                    >
                      Withdraw
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;
