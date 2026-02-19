import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanyHome from './pages/CompanyHome';
import CompanyProfile from './pages/CompanyProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminInternships from './pages/AdminInternships';
import AdminApplications from './pages/AdminApplications';
import AdminReports from './pages/AdminReports';
import InternshipList from './pages/InternshipList';
import InternshipDetail from './pages/InternshipDetail';
import CreateInternship from './pages/CreateInternship';
import EditInternship from './pages/EditInternship';
import MyApplications from './pages/MyApplications';
import Reports from './pages/Reports';
import Attendance from './pages/Attendance';
import MyPerformance from './pages/MyPerformance';
import CompanyAttendance from './pages/CompanyAttendance';
import PerformanceEvaluation from './pages/PerformanceEvaluation';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Home Route - Available to All */}
            <Route path="/" element={<Home />} />
        
        {/* Public Routes */}
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            {/* Student Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole={['student']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Company Home */}
            <Route
              path="/company-home"
              element={
                <ProtectedRoute requiredRole={['company']}>
                  <CompanyHome />
                </ProtectedRoute>
              }
            />

            {/* Company Profile */}
            <Route
              path="/company-profile"
              element={
                <ProtectedRoute requiredRole={['company']}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Management Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/internships"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AdminInternships />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            {/* Internship Routes - Order matters! Create before :id */}
            <Route
              path="/internships/create"
              element={
                <ProtectedRoute requiredRole={['company', 'admin']}>
                  <CreateInternship />
                </ProtectedRoute>
              }
            />

            <Route
              path="/internships/:id/edit"
              element={
                <ProtectedRoute requiredRole={['company', 'admin']}>
                  <EditInternship />
                </ProtectedRoute>
              }
            />

            <Route
              path="/internships/:id"
              element={
                <ProtectedRoute>
                  <InternshipDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/internships"
              element={
                <ProtectedRoute>
                  <InternshipList />
                </ProtectedRoute>
              }
            />

            {/* My Applications - Student Only */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute requiredRole={['student']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* Reports - Student & Company */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole={['student', 'company']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Attendance & Leave - Student Only */}
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredRole={['student']}>
                  <Attendance />
                </ProtectedRoute>
              }
            />

            {/* Performance - Student View */}
            <Route
              path="/my-performance"
              element={
                <ProtectedRoute requiredRole={['student']}>
                  <MyPerformance />
                </ProtectedRoute>
              }
            />

            {/* Company Attendance Management */}
            <Route
              path="/company-attendance"
              element={
                <ProtectedRoute requiredRole={['company']}>
                  <CompanyAttendance />
                </ProtectedRoute>
              }
            />

            {/* Company Performance Evaluation */}
            <Route
              path="/company-performance"
              element={
                <ProtectedRoute requiredRole={['company']}>
                  <PerformanceEvaluation />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
