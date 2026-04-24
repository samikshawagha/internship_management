import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRedirectPathByRole } from '../utils/jwtDecoder';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      // Get redirect path based on user role
      const redirectPath = getRedirectPathByRole(result.user.role);
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const demoCredentials = [
    { role: 'Student', email: 'student@example.com', password: 'password123' },
    { role: 'Company', email: 'company@example.com', password: 'password123' },
    { role: 'Admin', email: 'admin@example.com', password: 'password123' }
  ];

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={5} md={6} sm={8} xs={12}>
              {/* Demo Credentials Section */}
              <Card className="mb-4 border-info shadow-sm">
                <Card.Body className="p-3 bg-light">
                  <h6 className="mb-3 text-info fw-bold">
                    🧪 Demo Credentials
                  </h6>
                  <small className="d-block text-muted mb-3">Click to auto-fill credentials:</small>
                  <div className="d-flex flex-column gap-2">
                    {demoCredentials.map((cred, idx) => (
                      <Button
                        key={idx}
                        variant="outline-info"
                        size="sm"
                        onClick={() => fillDemoCredentials(cred.email, cred.password)}
                        className="text-start small"
                      >
                        <strong>{cred.role}:</strong> {cred.email.split('@')[0]}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                    className="p-0 mt-2"
                  >
                    {showDemoCredentials ? '🔒 Hide' : '👁️ Show'} Credentials
                  </Button>
                  {showDemoCredentials && (
                    <div className="mt-2 p-2 bg-warning bg-opacity-10 rounded small">
                      {demoCredentials.map((cred, idx) => (
                        <div key={idx} className="mb-2">
                          <strong>{cred.role}:</strong> Email: <code>{cred.email}</code> | Password: <code>{cred.password}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Login Card */}
              <Card className="shadow-lg border-0 login-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary mb-2">🔐 Welcome Back</h2>
                    <p className="text-muted small">Sign in to your InternHub account</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="alert-dismissible fade show" role="alert">
                      <strong>Login Failed!</strong> {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">📧 Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        required
                        className="login-input"
                      />
                      <Form.Text className="text-muted small d-block mt-1">
                        Use demo credentials above to test quickly
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">🔑 Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="login-input"
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 mb-3 fw-bold py-2" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Logging in...
                        </>
                      ) : (
                        '🚀 Login'
                      )}
                    </Button>
                  </Form>

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="text-muted mb-2">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-decoration-none fw-bold text-primary">
                        Register here
                      </Link>
                    </p>
                    <p className="text-muted small">
                      <Link to="/" className="text-decoration-none text-muted">
                        ← Back to Home
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Info Section */}
              <Card className="mt-4 border-0 bg-light">
                <Card.Body className="p-3">
                  <h6 className="fw-bold mb-3">ℹ️ Quick Info</h6>
                  <ul className="small text-muted mb-0">
                    <li>✅ Full CRUD operations for managing internships</li>
                    <li>✅ Apply, track, and manage applications</li>
                    <li>✅ Submit progress reports</li>
                    <li>✅ Role-based dashboards for all users</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
