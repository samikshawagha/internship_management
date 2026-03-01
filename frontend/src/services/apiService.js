import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const apiService = {
  // Internship endpoints
  getInternships: () => axios.get(`${API_BASE}/internships`),
  getAllInternships: () => axios.get(`${API_BASE}/internships/all`),
  getInternshipById: (id) => axios.get(`${API_BASE}/internships/${id}`),
  getCompanyInternships: () => axios.get(`${API_BASE}/internships/company`),
  createInternship: (data) => axios.post(`${API_BASE}/internships`, data),
  createInternshipWithImage: (formData) => {
    return axios.post(`${API_BASE}/internships`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateInternship: (id, data) => axios.put(`${API_BASE}/internships/${id}`, data),
  updateInternshipWithImage: (id, formData) => {
    return axios.put(`${API_BASE}/internships/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteInternship: (id) => axios.delete(`${API_BASE}/internships/${id}`),

  // Application endpoints
  submitApplication: (formData) => {
    // FormData is used for file uploads
    return axios.post(`${API_BASE}/applications`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getStudentApplications: () => axios.get(`${API_BASE}/applications`),
  getInternshipApplications: (internshipId) => axios.get(`${API_BASE}/applications/internship/${internshipId}`),
  updateApplicationStatus: (id, status) => axios.patch(`${API_BASE}/applications/${id}/status`, { status }),
  deleteApplication: (id) => axios.delete(`${API_BASE}/applications/${id}`),

  // Report endpoints
  submitReport: (data) => axios.post(`${API_BASE}/reports`, data),
  getStudentReports: () => axios.get(`${API_BASE}/reports`),
  getInternshipReports: (internshipId) => axios.get(`${API_BASE}/reports/internship/${internshipId}`),
  updateReportStatus: (id, status) => axios.patch(`${API_BASE}/reports/${id}/status`, { status }),

  // Analytics endpoints
  getDashboardStats: () => axios.get(`${API_BASE}/analytics/dashboard`),
  getApplicationStats: () => axios.get(`${API_BASE}/analytics/applications`),

  // Auth endpoints
  getProfile: () => axios.get(`${API_BASE}/auth/profile`),
  updateProfile: (data) => axios.put(`${API_BASE}/auth/profile`, data),
  changePassword: (data) => axios.post(`${API_BASE}/auth/change-password`, data)
};
