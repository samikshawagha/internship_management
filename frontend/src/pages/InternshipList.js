import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await apiService.getInternships();
      setInternships(response.data);
    } catch (error) {
      setError('Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading internships...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1>Available Internships</h1>

      {internships.length === 0 ? (
        <p>No internships available at the moment.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {internships.map((internship) => (
            <div key={internship.id} className="card">
              <h3>{internship.title}</h3>
              <p><strong>Company ID:</strong> {internship.companyId}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p><strong>Stipend:</strong> ${internship.stipend}</p>
              <p><strong>Skills:</strong> {internship.skills}</p>
              <p><strong>Description:</strong> {internship.description}</p>
              <p><strong>Status:</strong> <span className={`badge badge-${internship.status === 'open' ? 'success' : 'danger'}`}>{internship.status}</span></p>
              <a href={`/internships/${internship.id}`} className="button">View Details</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipList;
