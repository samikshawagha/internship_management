import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const apiService = {
  // Internship endpoints
  getInternships: () => axios.get(`${API_BASE}/internships`),
  getInternshipById: (id) => axios.get(`${API_BASE}/internships/${id}`),
  getCompanyInternships: () => axios.get(`${API_BASE}/internships/company`),
  createInternship: (data) => axios.post(`${API_BASE}/internships`, data),
  updateInternship: (id, data) => axios.put(`${API_BASE}/internships/${id}`, data),
  deleteInternship: (id) => axios.delete(`${API_BASE}/internships/${id}`),

  // Application endpoints
  submitApplication: (data) => axios.post(`${API_BASE}/applications`, data),
  getStudentApplications: () => axios.get(`${API_BASE}/applications`),
  getInternshipApplications: (internshipId) => axios.get(`${API_BASE}/applications/internship/${internshipId}`),
  updateApplicationStatus: (id, status) => axios.patch(`${API_BASE}/applications/${id}/status`, { status }),

  // Report endpoints
  submitReport: (data) => axios.post(`${API_BASE}/reports`, data),
  getStudentReports: () => axios.get(`${API_BASE}/reports`),
  getInternshipReports: (internshipId) => axios.get(`${API_BASE}/reports/internship/${internshipId}`),
  updateReportStatus: (id, status) => axios.patch(`${API_BASE}/reports/${id}/status`, { status }),

  // Analytics endpoints
  getDashboardStats: () => axios.get(`${API_BASE}/analytics/dashboard`),
  getApplicationStats: () => axios.get(`${API_BASE}/analytics/applications`)
};
