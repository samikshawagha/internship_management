import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { Container, Row, Col, Card, Table, Form, InputGroup, Button, Badge, Spinner, Alert } from 'react-bootstrap';

const CompanyApplications = () => {
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialStatus = params.get('status') || 'all';

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [filterInternship, setFilterInternship] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const internRes = await apiService.getCompanyInternships();
      setInternships(internRes.data || []);

      // Aggregate applications for each internship
      const apps = [];
      for (const it of internRes.data || []) {
        try {
          const r = await apiService.getInternshipApplications(it.id);
          (r.data || []).forEach(a => apps.push({ ...a, internshipTitle: it.title, internshipId: it.id }));
        } catch (e) {
          console.error('Failed to load applications for', it.id, e);
        }
      }

      setApplications(apps);
    } catch (e) {
      console.error(e);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiService.updateApplicationStatus(id, status);
      await loadData();
    } catch (e) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await apiService.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      setError('Failed to delete application');
    }
  };

  const filtered = applications.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || a.fullName.toLowerCase().includes(term) || a.email.toLowerCase().includes(term) || (a.internshipTitle || '').toLowerCase().includes(term);
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesIntern = filterInternship === 'all' || a.internshipId === filterInternship;
    return matchesSearch && matchesStatus && matchesIntern;
  });

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
    </Container>
  );

  return (
    <Container fluid className="py-5">
      <Container>
        <Row className="mb-4 align-items-center">
          <Col md={6}>
            <h2 className="fw-bold">📋 Company Applications</h2>
            <p className="text-muted mb-0">Manage all applications to your internships</p>
          </Col>
          <Col md={6} className="text-end">
            <Badge bg="primary">{filtered.length} Results</Badge>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-3">
          <Col md={5} className="mb-2">
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control placeholder="Search by name, email, internship..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </InputGroup>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Col>
          <Col md={4} className="mb-2">
            <Form.Select value={filterInternship} onChange={e => setFilterInternship(e.target.value)}>
              <option value="all">All Internships</option>
              {internships.map(it => (
                <option key={it.id} value={it.id}>{it.title}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Applicant</th>
                        <th>Email</th>
                        <th>Internship</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(app => (
                        <tr key={app.id}>
                          <td className="fw-bold">{app.fullName}</td>
                          <td>{app.email}</td>
                          <td>{app.internshipTitle}</td>
                          <td>
                            <Badge bg={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              {app.status === 'pending' && (
                                <>
                                  <Button size="sm" variant="success" onClick={() => handleUpdateStatus(app.id, 'accepted')}>Accept</Button>
                                  <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(app.id, 'rejected')}>Reject</Button>
                                </>
                              )}
                              <Button size="sm" variant="outline-danger" onClick={() => handleDelete(app.id)}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default CompanyApplications;
