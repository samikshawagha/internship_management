import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/certificate.css';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    studentId: '',
    internshipId: '',
    issuanceDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    issueLevel: 'standard'
  });

  // Fetch certificates
  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const studentId = localStorage.getItem('userId');

      const response = await axios.get(
        `http://localhost:5000/api/certificates/student/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCertificates(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch certificates');
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId || !formData.internshipId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const formDataWithFile = new FormData();
    formDataWithFile.append('studentId', formData.studentId);
    formDataWithFile.append('internshipId', formData.internshipId);
    formDataWithFile.append('issuanceDate', formData.issuanceDate);
    formDataWithFile.append('expiryDate', formData.expiryDate);
    formDataWithFile.append('issueLevel', formData.issueLevel);

    try {
      const token = localStorage.getItem('authToken');

      if (selectedCertificate) {
        await axios.put(
          `http://localhost:5000/api/certificates/${selectedCertificate.id}`,
          formDataWithFile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Certificate updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/certificates',
          formDataWithFile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert('Certificate created successfully');
      }

      setError('');
      setShowForm(false);
      setFormData({
        studentId: '',
        internshipId: '',
        issuanceDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        issueLevel: 'standard'
      });
      setSelectedCertificate(null);
      fetchCertificates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save certificate');
      console.error('Error saving certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(
          `http://localhost:5000/api/certificates/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Certificate deleted successfully');
        fetchCertificates();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete certificate');
      }
    }
  };

  const handleDownload = async (id, certificateNumber) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `http://localhost:5000/api/certificates/download/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certificateNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Failed to download certificate');
      console.error('Error downloading certificate:', err);
    }
  };

  const filteredCertificates = filterStatus === 'all'
    ? certificates
    : certificates.filter(c => c.status === filterStatus);

  return (
    <div className="certificate-container">
      <h1>Certificates & Documentation</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="certificate-header">
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setSelectedCertificate(null);
          }}
        >
          {showForm ? 'Cancel' : 'Issue Certificate'}
        </button>

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="generated">Generated</option>
          <option value="issued">Issued</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      {showForm && (
        <div className="certificate-form-container">
          <form onSubmit={handleSubmit} className="certificate-form">
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

            <div className="form-row">
              <div className="form-group">
                <label>Issuance Date</label>
                <input
                  type="date"
                  name="issuanceDate"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Issue Level</label>
              <select
                name="issueLevel"
                value={formData.issueLevel}
                onChange={handleInputChange}
              >
                <option value="standard">Standard</option>
                <option value="merit">Merit</option>
                <option value="distinction">Distinction</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {selectedCertificate ? 'Update' : 'Issue'} Certificate
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading certificates...</p>
      ) : filteredCertificates.length === 0 ? (
        <p className="no-data">No certificates found</p>
      ) : (
        <div className="certificate-list">
          {filteredCertificates.map(certificate => (
            <div key={certificate.id} className="certificate-card">
              <div className="certificate-header-card">
                <h3>{certificate.internshipTitle}</h3>
                <div className="certificate-badges">
                  <span className={`badge ${certificate.status}`}>
                    {certificate.status}
                  </span>
                  <span className={`badge level-${certificate.issueLevel}`}>
                    {certificate.issueLevel}
                  </span>
                </div>
              </div>

              <div className="certificate-content">
                <p><strong>Certificate #:</strong> {certificate.certificateNumber}</p>
                <p><strong>Issued:</strong> {new Date(certificate.issuanceDate).toLocaleDateString()}</p>
                {certificate.expiryDate && (
                  <p><strong>Expires:</strong> {new Date(certificate.expiryDate).toLocaleDateString()}</p>
                )}
                <p><strong>Status:</strong> {certificate.status}</p>
              </div>

              <div className="certificate-actions">
                {certificate.certificateFile && (
                  <button
                    className="btn-success"
                    onClick={() => handleDownload(certificate.id, certificate.certificateNumber)}
                  >
                    Download
                  </button>
                )}
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedCertificate(certificate);
                    setFormData({
                      studentId: certificate.studentId,
                      internshipId: certificate.internshipId,
                      issuanceDate: certificate.issuanceDate?.split('T')[0] || '',
                      expiryDate: certificate.expiryDate?.split('T')[0] || '',
                      issueLevel: certificate.issueLevel
                    });
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(certificate.id)}
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

export default Certificate;
