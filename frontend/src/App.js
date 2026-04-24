import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
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
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import StudentPage from './pages/StudentPage';
import Unauthorized from './pages/Unauthorized';
import SystemFlow from './pages/SystemFlow';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if role is required and if user has the required role
  if (requiredRole && requiredRole.length > 0) {
    // Ensure user.role exists and is in the requiredRole array
    if (!user.role || !requiredRole.includes(user.role)) {
      console.log('Access denied - User role:', user.role, 'Required roles:', requiredRole);
      return <Navigate to="/unauthorized" />;
    }
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
        <div style={{ display: 'flex', flex: 1 }}>
          {user && <div className="sidebar-sticky-wrapper"><Sidebar /></div>}
          <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
            <Routes>
              {/* Home Route - Available to All */}
              <Route path="/" element={<Home />} />
              <Route path="/internships" element={<InternshipList />} />
          
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

              {/* Student Hub - Enhanced Student Page */}
              <Route
                path="/student-hub"
                element={
                  <ProtectedRoute requiredRole={['student']}>
                    <StudentPage />
                  </ProtectedRoute>
                }
              />

              {/* Student Reports */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requiredRole={['student', 'admin', 'company']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Profile - Enhanced for all users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
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

              {/* Company Home */}
              <Route
                path="/company-home"
                element={
                  <ProtectedRoute requiredRole={['company']}>
                    <Home />
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

              {/* Admin Home */}
              <Route
                path="/admin-home"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <Home />
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
                element={<InternshipList />}
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
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* System Flow - Admin Only */}
              <Route
                path="/system-flow"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <SystemFlow />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route
                path="*"
                element={<Navigate to="/" />}
              />
            </>
          )}
            </Routes>
          </main>
        </div>
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
