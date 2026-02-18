import { dummyInternships, dummyApplications, dummyUsers, dummyReports } from '../utils/dummyData';

// Local state management for CRUD operations
let internships = JSON.parse(JSON.stringify(dummyInternships)); // Deep copy
let applications = JSON.parse(JSON.stringify(dummyApplications)); // Deep copy
let users = {
  students: JSON.parse(JSON.stringify(dummyUsers.students)),
  companies: JSON.parse(JSON.stringify(dummyUsers.companies)),
  admins: JSON.parse(JSON.stringify(dummyUsers.admins))
};
let reports = JSON.parse(JSON.stringify(dummyReports)); // Deep copy
let nextInternshipId = internships.length + 1;
let nextApplicationId = applications.length + 1;
let nextUserId = 1000;
let nextReportId = reports.length + 1;

export const crudService = {
  // ==================== INTERNSHIP CRUD ====================
  
  // READ - Get all internships with optional filters
  getInternships: (filters = {}) => {
    let filtered = [...internships];
    
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    if (filters.company) {
      filtered = filtered.filter(i => i.company.toLowerCase().includes(filters.company.toLowerCase()));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search) ||
        i.company.toLowerCase().includes(search)
      );
    }
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(i => 
        filters.skills.some(skill => i.skills.includes(skill))
      );
    }
    
    return Promise.resolve({ data: filtered });
  },

  // READ - Get single internship by ID
  getInternshipById: (id) => {
    const internship = internships.find(i => i.id === parseInt(id));
    if (!internship) {
      return Promise.reject(new Error('Internship not found'));
    }
    return Promise.resolve({ data: internship });
  },

  // CREATE - Add new internship
  createInternship: (data) => {
    const newInternship = {
      id: nextInternshipId++,
      ...data,
      status: 'open',
      applicants: 0,
      postedDate: new Date().toISOString().split('T')[0]
    };
    internships.push(newInternship);
    return Promise.resolve({ data: newInternship });
  },

  // UPDATE - Edit existing internship
  updateInternship: (id, data) => {
    const index = internships.findIndex(i => i.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Internship not found'));
    }
    internships[index] = { ...internships[index], ...data };
    return Promise.resolve({ data: internships[index] });
  },

  // DELETE - Remove internship
  deleteInternship: (id) => {
    const index = internships.findIndex(i => i.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Internship not found'));
    }
    internships.splice(index, 1);
    return Promise.resolve({ data: { message: 'Internship deleted successfully' } });
  },

  // Search internships
  searchInternships: (query) => {
    return crudService.getInternships({ search: query });
  },

  // Filter internships by company
  getInternshipsByCompany: (companyId) => {
    const filtered = internships.filter(i => i.companyId === parseInt(companyId));
    return Promise.resolve({ data: filtered });
  },

  // ==================== APPLICATION CRUD ====================

  // READ - Get all applications for a student
  getStudentApplications: (studentId) => {
    const userApps = applications.filter(a => a.studentId === parseInt(studentId));
    return Promise.resolve({ data: userApps });
  },

  // READ - Get all applications for a specific internship
  getInternshipApplications: (internshipId) => {
    const internshipApps = applications.filter(a => a.internshipId === parseInt(internshipId));
    return Promise.resolve({ data: internshipApps });
  },

  // CREATE - Submit new application
  createApplication: (data) => {
    // Check if student already applied
    const existing = applications.find(
      a => a.studentId === parseInt(data.studentId) && 
           a.internshipId === parseInt(data.internshipId)
    );
    
    if (existing) {
      return Promise.reject(new Error('You have already applied to this internship'));
    }

    const newApplication = {
      id: nextApplicationId++,
      ...data,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    
    applications.push(newApplication);
    
    // Update internship applicant count
    const internship = internships.find(i => i.id === parseInt(data.internshipId));
    if (internship) {
      internship.applicants = (internship.applicants || 0) + 1;
    }
    
    return Promise.resolve({ data: newApplication });
  },

  // UPDATE - Update application status (for companies/admins)
  updateApplicationStatus: (id, status) => {
    const index = applications.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Application not found'));
    }
    applications[index].status = status;
    applications[index].updatedDate = new Date().toISOString().split('T')[0];
    return Promise.resolve({ data: applications[index] });
  },

  // UPDATE - Update application details (e.g., cover letter) - allowed for students
  updateApplication: (id, data) => {
    const index = applications.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Application not found'));
    }
    applications[index] = { ...applications[index], ...data, updatedDate: new Date().toISOString().split('T')[0] };
    return Promise.resolve({ data: applications[index] });
  },

  // DELETE - Withdraw application
  deleteApplication: (id) => {
    const index = applications.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Application not found'));
    }
    const app = applications[index];
    applications.splice(index, 1);
    
    // Update internship applicant count
    const internship = internships.find(i => i.id === app.internshipId);
    if (internship && internship.applicants > 0) {
      internship.applicants--;
    }
    
    return Promise.resolve({ data: { message: 'Application deleted successfully' } });
  },

  // Get application with full details
  getApplicationById: (id) => {
    const app = applications.find(a => a.id === parseInt(id));
    if (!app) {
      return Promise.reject(new Error('Application not found'));
    }
    return Promise.resolve({ data: app });
  },

  // Get all applications (for admin dashboard)
  getAllApplications: () => {
    return Promise.resolve({ data: applications });
  },

  // ==================== USER MANAGEMENT CRUD ====================

  // READ - Get all users
  getAllUsers: () => {
    const allUsers = [
      ...users.students,
      ...users.companies,
      ...users.admins
    ];
    return Promise.resolve({ data: allUsers });
  },

  // READ - Get users by role
  getUsersByRole: (role) => {
    let filtered = [];
    if (role === 'student') {
      filtered = users.students;
    } else if (role === 'company') {
      filtered = users.companies;
    } else if (role === 'admin') {
      filtered = users.admins;
    }
    return Promise.resolve({ data: filtered });
  },

  // READ - Get single user by ID
  getUserById: (id) => {
    const allUsers = [...users.students, ...users.companies, ...users.admins];
    const user = allUsers.find(u => u.id === parseInt(id));
    if (!user) {
      return Promise.reject(new Error('User not found'));
    }
    return Promise.resolve({ data: user });
  },

  // CREATE - Add new user
  createUser: (data) => {
    const newUser = {
      id: nextUserId++,
      ...data,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (data.role === 'student') {
      users.students.push(newUser);
    } else if (data.role === 'company') {
      users.companies.push(newUser);
    } else if (data.role === 'admin') {
      users.admins.push(newUser);
    } else {
      users.students.push(newUser);
    }

    return Promise.resolve({ data: newUser });
  },

  // UPDATE - Update user information
  updateUser: (id, data) => {
    const allUsers = [...users.students, ...users.companies, ...users.admins];
    const userIndex = allUsers.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
      return Promise.reject(new Error('User not found'));
    }
    const user = allUsers[userIndex];
    const updated = { ...user, ...data };
    
    // Update in appropriate array
    if (user.role === 'student') {
      const studentIndex = users.students.findIndex(u => u.id === parseInt(id));
      users.students[studentIndex] = updated;
    } else if (user.role === 'company') {
      const companyIndex = users.companies.findIndex(u => u.id === parseInt(id));
      users.companies[companyIndex] = updated;
    } else if (user.role === 'admin') {
      const adminIndex = users.admins.findIndex(u => u.id === parseInt(id));
      users.admins[adminIndex] = updated;
    }
    
    return Promise.resolve({ data: updated });
  },

  // DELETE - Remove user
  deleteUser: (id) => {
    const allUsers = [...users.students, ...users.companies, ...users.admins];
    const user = allUsers.find(u => u.id === parseInt(id));
    if (!user) {
      return Promise.reject(new Error('User not found'));
    }

    // Remove from appropriate array
    if (user.role === 'student') {
      const index = users.students.findIndex(u => u.id === parseInt(id));
      users.students.splice(index, 1);
    } else if (user.role === 'company') {
      const index = users.companies.findIndex(u => u.id === parseInt(id));
      users.companies.splice(index, 1);
    } else if (user.role === 'admin') {
      const index = users.admins.findIndex(u => u.id === parseInt(id));
      users.admins.splice(index, 1);
    }

    return Promise.resolve({ data: { message: 'User deleted successfully' } });
  },

  // ==================== REPORTS CRUD ====================

  // READ - Get all reports
  getAllReports: () => {
    return Promise.resolve({ data: reports });
  },

  // READ - Get report by ID
  getReportById: (id) => {
    const report = reports.find(r => r.id === parseInt(id));
    if (!report) {
      return Promise.reject(new Error('Report not found'));
    }
    return Promise.resolve({ data: report });
  },

  // CREATE - Create new report
  createReport: (data) => {
    const newReport = {
      id: nextReportId++,
      ...data,
      createdDate: new Date().toISOString().split('T')[0]
    };
    reports.push(newReport);
    return Promise.resolve({ data: newReport });
  },

  // UPDATE - Update existing report
  updateReport: (id, data) => {
    const index = reports.findIndex(r => r.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Report not found'));
    }
    reports[index] = { ...reports[index], ...data };
    return Promise.resolve({ data: reports[index] });
  },

  // DELETE - Remove report
  deleteReport: (id) => {
    const index = reports.findIndex(r => r.id === parseInt(id));
    if (index === -1) {
      return Promise.reject(new Error('Report not found'));
    }
    reports.splice(index, 1);
    return Promise.resolve({ data: { message: 'Report deleted successfully' } });
  },

  // Search reports
  searchReports: (query) => {
    const filtered = reports.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.company.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase())
    );
    return Promise.resolve({ data: filtered });
  },

  // Get statistics
  getStatistics: () => {
    const stats = {
      totalInternships: internships.length,
      openInternships: internships.filter(i => i.status === 'open').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      acceptedApplications: applications.filter(a => a.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.status === 'rejected').length,
      totalUsers: users.students.length + users.companies.length + users.admins.length,
      totalReports: reports.length
    };
    return Promise.resolve({ data: stats });
  },

  // Get dashboard data for different roles
  getDashboardData: (userId, userRole) => {
    const data = {};
    
    if (userRole === 'student') {
      data.applications = applications.filter(a => a.studentId === userId);
      data.stats = {
        totalApplications: data.applications.length,
        pending: data.applications.filter(a => a.status === 'pending').length,
        accepted: data.applications.filter(a => a.status === 'accepted').length,
        rejected: data.applications.filter(a => a.status === 'rejected').length
      };
    } else if (userRole === 'company') {
      // Find company's internships
      const companyInternships = internships.filter(i => i.companyId === userId);
      const companyApplications = applications.filter(a => 
        companyInternships.some(i => i.id === a.internshipId)
      );
      data.internships = companyInternships;
      data.applications = companyApplications;
      data.stats = {
        totalInternships: companyInternships.length,
        totalApplications: companyApplications.length,
        pending: companyApplications.filter(a => a.status === 'pending').length,
        accepted: companyApplications.filter(a => a.status === 'accepted').length
      };
    } else if (userRole === 'admin') {
      data.internships = internships;
      data.applications = applications;
      data.users = {
        students: users.students.length,
        companies: users.companies.length,
        admins: users.admins.length
      };
      data.stats = {
        totalInternships: internships.length,
        totalApplications: applications.length,
        totalUsers: users.students.length + users.companies.length + users.admins.length,
        totalReports: reports.length,
        openPositions: internships.filter(i => i.status === 'open').length
      };
    }
    
    return Promise.resolve({ data });
  },

  // Reset data to dummy state
  resetData: () => {
    internships = JSON.parse(JSON.stringify(dummyInternships));
    applications = JSON.parse(JSON.stringify(dummyApplications));
    users = {
      students: JSON.parse(JSON.stringify(dummyUsers.students)),
      companies: JSON.parse(JSON.stringify(dummyUsers.companies)),
      admins: JSON.parse(JSON.stringify(dummyUsers.admins))
    };
    reports = JSON.parse(JSON.stringify(dummyReports));
    nextInternshipId = internships.length + 1;
    nextApplicationId = applications.length + 1;
    nextReportId = reports.length + 1;
    return Promise.resolve({ data: { message: 'Data reset to dummy values' } });
  }
};
