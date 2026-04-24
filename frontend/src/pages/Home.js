import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner, Alert } from 'react-bootstrap';
import '../styles/home.css';

// ─── Guest Landing ────────────────────────────────────────────────────────────
const GuestHome = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    { icon: '👨‍🎓', title: 'For Students', items: ['Browse curated internships', 'Easy application process', 'Track status in real-time', 'Build your profile'] },
    { icon: '🏢', title: 'For Companies', items: ['Post positions easily', 'Review candidates', 'Manage applications', 'Track hiring progress'] },
    { icon: '📈', title: 'Analytics', items: ['Application insights', 'Performance metrics', 'Hiring trends', 'Comprehensive reports'] },
  ];

  return (
    <Container className="py-5">
      {/* Hero */}
      <Row className="align-items-center mb-5 py-4 hero-section">
        <Col lg={6}>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#1a1a2e' }}>
            Find Your Perfect <span style={{ color: '#4361ee' }}>Internship</span>
          </h1>
          <p className="lead mb-4" style={{ color: '#555' }}>
            Connect students with top companies. Build your career with real-world experience.
          </p>
          <div className="d-flex gap-3">
            <Button variant="primary" size="lg" className="px-5" onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="outline-primary" size="lg" className="px-5" onClick={() => navigate('/register')}>Register</Button>
          </div>
        </Col>
        <Col lg={6} className="text-center">
          <div style={{ fontSize: '8rem' }}>📚</div>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="my-5 py-4 stats-section">
        {[['10K+', 'Students'], ['500+', 'Companies'], ['2K+', 'Internships'], ['95%', 'Success Rate']].map(([num, label], i) => (
          <Col md={3} className="text-center stat-item" key={i}>
            <div className="stat-number">{num}</div>
            <div className="stat-label">{label}</div>
          </Col>
        ))}
      </Row>

      {/* Features */}
      <Row className="my-5 py-4">
        <Col xs={12}><h2 className="text-center mb-5 fw-bold" style={{ color: '#1a1a2e' }}>✨ Why Choose Us?</h2></Col>
        {features.map((f, i) => (
          <Col md={4} className="mb-4" key={i}>
            <Card
              className="h-100 border-0 shadow-sm"
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ transform: hoveredCard === i ? 'translateY(-10px)' : 'none', transition: 'all 0.3s ease' }}
            >
              <Card.Body className="text-center p-4">
                <div style={{ fontSize: '2.5rem' }}>{f.icon}</div>
                <h4 className="my-3 fw-bold">{f.title}</h4>
                <ul className="text-start" style={{ fontSize: '0.95rem', color: '#555' }}>
                  {f.items.map((item, j) => <li key={j}>✓ {item}</li>)}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA */}
      <Row className="my-5 py-5 rounded-4 cta-section">
        <Col className="text-center">
          <h3 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>🚀 Ready to Get Started?</h3>
          <p className="mb-4" style={{ color: '#555' }}>Join thousands of students and companies already using our platform</p>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="primary" size="lg" className="px-5" onClick={() => navigate('/register')}>Create Account</Button>
            <Button variant="outline-primary" size="lg" className="px-5" onClick={() => navigate('/login')}>Already a Member?</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

// ─── Admin Home ───────────────────────────────────────────────────────────────
const AdminHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes, appsRes] = await Promise.all([
          crudService.getStatistics(),
          crudService.getAllUsers(),
          crudService.getAllApplications(),
        ]);
        const allUsers = usersRes.data;
        const allApps = appsRes.data;
        setStats({
          ...statsRes.data,
          totalStudents: allUsers.filter(u => u.role === 'student').length,
          totalCompanies: allUsers.filter(u => u.role === 'company').length,
          pendingApps: allApps.filter(a => a.status === 'pending').length,
          acceptedApps: allApps.filter(a => a.status === 'accepted').length,
        });
        setRecentApps([...allApps].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5));
        setRecentUsers([...allUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch { setError('Failed to load data'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}><Spinner animation="border" variant="danger" /></div>;

  const statCards = [
    { label: 'Students', value: stats?.totalStudents ?? 0, icon: '🎓', color: '#4361ee', path: '/admin/users' },
    { label: 'Companies', value: stats?.totalCompanies ?? 0, icon: '🏢', color: '#2a9d8f', path: '/admin/users' },
    { label: 'Internships', value: stats?.totalInternships ?? 0, icon: '💼', color: '#e76f51', path: '/admin/internships' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: '📋', color: '#8338ec', path: '/admin/applications' },
    { label: 'Pending', value: stats?.pendingApps ?? 0, icon: '⏳', color: '#f4a261', path: '/admin/applications' },
    { label: 'Accepted', value: stats?.acceptedApps ?? 0, icon: '✅', color: '#06d6a0', path: '/admin/applications' },
  ];

  return (
    <Container fluid className="py-4 px-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>⚙️ Welcome back, {user?.fullName}</h2>
        <p className="text-muted mb-0">Here's what's happening across the platform today.</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-3 mb-4">
        {statCards.map((s, i) => (
          <Col xs={6} md={4} xl={2} key={i}>
            <Card className="border-0 h-100 shadow-sm" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(s.path)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Body className="text-center py-3">
                <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                <div className="fw-bold fs-4 mt-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">📋 Recent Applications</h6>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/admin/applications')}>View All</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentApps.length === 0 ? <p className="text-muted text-center py-4">No applications yet</p> : (
                <div className="table-responsive">
                  <Table hover className="mb-0" size="sm">
                    <thead className="table-light">
                      <tr><th>Student</th><th>Position</th><th>Company</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {recentApps.map(app => (
                        <tr key={app.id}>
                          <td className="fw-medium">{app.studentName}</td>
                          <td>{app.internshipTitle}</td>
                          <td>{app.company}</td>
                          <td><Badge bg={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>{app.status}</Badge></td>
                          <td className="text-muted small">{app.appliedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">👥 Recent Users</h6>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/admin/users')}>View All</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentUsers.map(u => (
                <div key={u.id} className="d-flex align-items-center gap-3 px-3 py-2 border-bottom">
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: u.role === 'admin' ? '#e63946' : u.role === 'company' ? '#2a9d8f' : '#4361ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {u.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-medium text-truncate" style={{ fontSize: '0.88rem' }}>{u.fullName}</div>
                    <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                  </div>
                  <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'company' ? 'success' : 'primary'} style={{ fontSize: '0.7rem' }}>{u.role}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3"><h6 className="fw-bold mb-0">⚡ Quick Actions</h6></Card.Header>
        <Card.Body>
          <Row className="g-3">
            {[
              { label: 'Manage Users', icon: '👥', path: '/admin/users', color: '#4361ee' },
              { label: 'Internships', icon: '💼', path: '/admin/internships', color: '#2a9d8f' },
              { label: 'Applications', icon: '📋', path: '/admin/applications', color: '#8338ec' },
              { label: 'Reports', icon: '📊', path: '/admin/reports', color: '#e63946' },
            ].map((a, i) => (
              <Col xs={6} md={3} key={i}>
                <Button variant="light" className="w-100 py-3 border" style={{ transition: 'all 0.2s' }} onClick={() => navigate(a.path)}
                  onMouseEnter={e => { e.currentTarget.style.background = a.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = a.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
                  <div className="mt-1 fw-medium small">{a.label}</div>
                </Button>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

// ─── Company Home ─────────────────────────────────────────────────────────────
const CompanyHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [internRes, statsRes] = await Promise.all([
          apiService.getCompanyInternships(),
          apiService.getDashboardStats(),
        ]);
        setInternships(internRes.data || []);
        setStats(statsRes.data || {});
      } catch { setError('Failed to load data'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}><Spinner animation="border" variant="success" /></div>;

  const statCards = [
    { label: 'Total Internships', value: stats?.totalInternships ?? internships.length, icon: '💼', color: '#2a9d8f' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: '📋', color: '#4361ee' },
    { label: 'Accepted', value: stats?.acceptedApplications ?? 0, icon: '✅', color: '#06d6a0' },
    { label: 'Pending', value: stats?.pendingApplications ?? 0, icon: '⏳', color: '#f4a261' },
  ];

  return (
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>🏢 Welcome back, {user?.fullName}</h2>
          <p className="text-muted mb-0">Manage your internship postings and track applicants.</p>
        </div>
        <Button variant="success" onClick={() => navigate('/internships/create')}>➕ Post New Internship</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-3 mb-4">
        {statCards.map((s, i) => (
          <Col xs={6} md={3} key={i}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center py-3">
                <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                <div className="fw-bold fs-3 mt-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">💼 Your Internships</h6>
              <Button variant="outline-success" size="sm" onClick={() => navigate('/internships/create')}>+ Post New</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {internships.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '2.5rem' }}>📭</div>
                  <p className="text-muted mt-2 mb-3">No internships posted yet</p>
                  <Button variant="success" onClick={() => navigate('/internships/create')}>Post Your First Internship</Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0" size="sm">
                    <thead className="table-light">
                      <tr><th>Title</th><th>Location</th><th>Stipend</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {internships.map(i => (
                        <tr key={i.id}>
                          <td className="fw-medium">{i.title}</td>
                          <td className="text-muted small">📍 {i.location}</td>
                          <td className="text-success fw-medium">{i.stipend}</td>
                          <td><Badge bg={i.status === 'open' ? 'success' : 'secondary'}>{i.status}</Badge></td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-info" size="sm" onClick={() => navigate(`/internships/${i.id}`)}>View</Button>
                              <Button variant="outline-primary" size="sm" onClick={() => navigate(`/internships/${i.id}/edit`)}>Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header className="bg-white border-bottom py-3"><h6 className="fw-bold mb-0">📊 Overview</h6></Card.Header>
            <Card.Body>
              {[
                ['Open Positions', internships.filter(i => i.status === 'open').length, 'success'],
                ['Closed Positions', internships.filter(i => i.status !== 'open').length, 'secondary'],
                ['Total Posted', internships.length, 'primary'],
              ].map(([label, val, bg], i) => (
                <div key={i} className={`d-flex justify-content-between align-items-center py-2 ${i < 2 ? 'border-bottom' : ''}`}>
                  <span className="text-muted small">{label}</span>
                  <Badge bg={bg}>{val}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom py-3"><h6 className="fw-bold mb-0">⚡ Quick Actions</h6></Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <Button variant="success" className="w-100" onClick={() => navigate('/internships/create')}>➕ Post Internship</Button>
              <Button variant="outline-primary" className="w-100" onClick={() => navigate('/internships')}>🔍 Browse All</Button>
              <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/reports')}>📊 View Reports</Button>
              <Button variant="outline-dark" className="w-100" onClick={() => navigate('/profile')}>👤 Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// ─── Student Home ─────────────────────────────────────────────────────────────
const StudentDashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await crudService.getStudentApplications(user?.id);
        const apps = res.data || [];
        setStats({
          total: apps.length,
          pending: apps.filter(a => a.status === 'pending').length,
          accepted: apps.filter(a => a.status === 'accepted').length,
        });
        setRecentApps(apps.slice(0, 5));
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, [user?.id]);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}><Spinner animation="border" variant="primary" /></div>;

  return (
    <Container fluid className="py-4 px-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>👋 Welcome back, {user?.fullName}</h2>
        <p className="text-muted mb-0">Track your applications and discover new opportunities.</p>
      </div>

      <Row className="g-3 mb-4">
        {[
          { label: 'Total Applied', value: stats.total, icon: '📝', color: '#4361ee', path: '/my-applications' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: '#f4a261', path: '/my-applications' },
          { label: 'Accepted', value: stats.accepted, icon: '✅', color: '#06d6a0', path: '/my-applications' },
        ].map((s, i) => (
          <Col xs={4} key={i}>
            <Card className="border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(s.path)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Body className="text-center py-3">
                <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
                <div className="fw-bold fs-3 mt-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
              <h6 className="fw-bold mb-0">📋 Recent Applications</h6>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/my-applications')}>View All</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {recentApps.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '2.5rem' }}>📭</div>
                  <p className="text-muted mt-2 mb-3">No applications yet</p>
                  <Button variant="primary" onClick={() => navigate('/internships')}>Browse Internships</Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0" size="sm">
                    <thead className="table-light">
                      <tr><th>Position</th><th>Company</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {recentApps.map(app => (
                        <tr key={app.id}>
                          <td className="fw-medium">{app.internshipTitle}</td>
                          <td>{app.company}</td>
                          <td><Badge bg={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>{app.status}</Badge></td>
                          <td className="text-muted small">{app.appliedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom py-3"><h6 className="fw-bold mb-0">⚡ Quick Actions</h6></Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <Button variant="primary" className="w-100" onClick={() => navigate('/internships')}>🔍 Browse Internships</Button>
              <Button variant="outline-primary" className="w-100" onClick={() => navigate('/my-applications')}>📋 My Applications</Button>
              <Button variant="outline-success" className="w-100" onClick={() => navigate('/student-hub')}>🎓 Student Hub</Button>
              <Button variant="outline-secondary" className="w-100" onClick={() => navigate('/profile')}>👤 Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// ─── Main Home (role router) ──────────────────────────────────────────────────
const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (user?.role === 'admin') return <AdminHome />;
  if (user?.role === 'company') return <CompanyHome />;
  if (user?.role === 'student') return <StudentDashboardHome />;
  return <GuestHome />;
};

export default Home;
