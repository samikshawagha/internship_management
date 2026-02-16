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
import CompanyDashboard from './pages/CompanyDashboard';
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
    return <Navigate to="/unauthorized" />;
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

            {/* Company Dashboard */}
            <Route
              path="/company-dashboard"
              element={
                <ProtectedRoute requiredRole={['company']}>
                  <CompanyDashboard />
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

            {/* Unauthorized Route */}
            <Route
              path="/unauthorized"
              element={
                <div className="container mt-5 text-center">
                  <h1 className="text-danger">Access Denied</h1>
                  <p className="text-muted">You don't have permission to access this page.</p>
                  <a href="/" className="btn btn-primary">
                    Go Home
                  </a>
                </div>
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
