import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [internships, setInternships] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchAssessments();
    fetchCertificates();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/student/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setInternships(data.internships);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/assessments/student/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssessments(data.data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/certificates/student/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificates(data.data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/certificates/download/${certificateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificate-${certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download certificate');
      }
    } catch (error) {
      alert('Error downloading certificate');
    }
  };

  const handleSubmitAssessment = async (assessmentId, submissionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/assessments/submit/${assessmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        alert('Assessment submitted successfully');
        fetchAssessments(); // Refresh assessments
      } else {
        alert('Failed to submit assessment');
      }
    } catch (error) {
      alert('Error submitting assessment');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>

      {/* Profile Section */}
      <section className="profile-section">
        <h2>Profile</h2>
        {profile && (
          <div className="profile-card">
            <p><strong>Name:</strong> {profile.fullName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
          </div>
        )}
      </section>

      {/* Internships Section */}
      <section className="internships-section">
        <h2>Enrolled Internships</h2>
        <div className="internships-list">
          {internships.length > 0 ? (
            internships.map(internship => (
              <div key={internship.id} className="internship-card">
                <h3>{internship.title}</h3>
                <p><strong>Company:</strong> {internship.companyName}</p>
                <p><strong>Location:</strong> {internship.location}</p>
                <p><strong>Duration:</strong> {internship.duration}</p>
                <p><strong>Status:</strong> {internship.applicationStatus}</p>
              </div>
            ))
          ) : (
            <p>No enrolled internships yet.</p>
          )}
        </div>
      </section>

      {/* Assessments Section */}
      <section className="assessments-section">
        <h2>Assessments</h2>
        <div className="assessments-list">
          {assessments.length > 0 ? (
            assessments.map(assessment => (
              <div key={assessment.id} className="assessment-card">
                <h3>{assessment.assessmentType}</h3>
                <p><strong>Title:</strong> {assessment.internshipTitle}</p>
                <p><strong>Evaluator:</strong> {assessment.evaluatorName}</p>
                <p><strong>Status:</strong> {assessment.status}</p>
                {assessment.status === 'pending' && (
                  <button onClick={() => handleSubmitAssessment(assessment.id, { comments: 'Submitted' })}>
                    Submit Assessment
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No assessments available.</p>
          )}
        </div>
      </section>

      {/* Certificates Section */}
      <section className="certificates-section">
        <h2>Certificates</h2>
        <div className="certificates-list">
          {certificates.length > 0 ? (
            certificates.map(certificate => (
              <div key={certificate.id} className="certificate-card">
                <h3>Certificate #{certificate.certificateNumber}</h3>
                <p><strong>Internship:</strong> {certificate.internshipTitle}</p>
                <p><strong>Status:</strong> {certificate.status}</p>
                <button onClick={() => handleDownloadCertificate(certificate.id)}>
                  Download Certificate
                </button>
              </div>
            ))
          ) : (
            <p>No certificates available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;