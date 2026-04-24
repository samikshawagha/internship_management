import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/certificate.css';

const Certificate = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    studentId: '',
    internshipId: '',
    issuanceDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    issueLevel: 'standard'
  });
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    if (user?.role === 'student') {
      setFormData(prev => ({ ...prev, studentId: user.id }));
    }
  }, [user]);

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

  // Fetch certificates
  const fetchCertificates = async () => {
    if (!user?.id) return;
    if (user.role !== 'student') {
      // Only students have personal certificates by default
      setCertificates([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const studentId = user.id;
      const url = `http://localhost:5000/api/certificates/student/${studentId}`;

      const response = await axios.get(url);
      setCertificates(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch certificates');
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

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

    if (internships.length && !internships.find(i => i.id.toString() === formData.internshipId.toString())) {
      setError('Selected internship is not valid');
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
      if (selectedCertificate) {
        await axios.put(
          `http://localhost:5000/api/certificates/${selectedCertificate.id}`,
          formDataWithFile,
          {
            headers: {
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
        await axios.delete(`http://localhost:5000/api/certificates/${id}`);
        alert('Certificate deleted successfully');
        fetchCertificates();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete certificate');
      }
    }
  };

  const handleDownload = async (id, certificateNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/certificates/download/${id}`,
        {
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

  // filter and search
  const filteredCertificates = certificates.filter(c => {
    const statusMatch = filterStatus === 'all' || c.status === filterStatus;
    const searchMatch = searchTerm === '' ||
      c.certificateNumber?.toString().includes(searchTerm) ||
      c.studentId?.toString().includes(searchTerm) ||
      c.internshipId?.toString().includes(searchTerm);
    return statusMatch && searchMatch;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

  return (
    <div className="certificate-container">
      <h1>Certificate Management</h1>

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

        <input
          type="text"
          className="search-input"
          placeholder="Search by certificate, student, internship..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

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
        <>
          <div className="certificate-list">
            {currentCertificates.map(certificate => (
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

export default Certificate;
