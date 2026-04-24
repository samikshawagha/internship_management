import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { 
  Container, Row, Col, Card, Button, Badge, Table, 
  Form, Alert, Spinner, Modal, ProgressBar 
} from 'react-bootstrap';
import { FaDownload, FaEye, FaCalendarAlt, FaTrophy, FaChartLine } from 'react-icons/fa';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReportsData();
  }, [user?.id, selectedPeriod]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      
      // Load student applications
      const appsResponse = await crudService.getStudentApplications(user?.id);
      let apps = appsResponse.data;

      // Filter by period
      if (selectedPeriod !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (selectedPeriod) {
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            filterDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        apps = apps.filter(app => new Date(app.appliedDate) >= filterDate);
      }

      setApplications(apps);

      // Load all internships for comparison
      const internshipsResponse = await crudService.getInternships();
      setInternships(internshipsResponse.data);

      // Calculate analytics
      calculateAnalytics(apps, internshipsResponse.data);
      
    } catch (error) {
      console.error('Failed to load reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (apps, allInternships) => {
    const totalApplications = apps.length;
    const pendingApps = apps.filter(app => app.status === 'pending').length;
    const acceptedApps = apps.filter(app => app.status === 'accepted').length;
    const rejectedApps = apps.filter(app => app.status === 'rejected').length;

    const successRate = totalApplications > 0 ? ((acceptedApps / totalApplications) * 100).toFixed(1) : 0;
    const responseRate = totalApplications > 0 ? (((acceptedApps + rejectedApps) / totalApplications) * 100).toFixed(1) : 0;

    // Company analysis
    const companiesApplied = [...new Set(apps.map(app => app.company))];
    const companyStats = companiesApplied.map(company => {
      const companyApps = apps.filter(app => app.company === company);
      return {
        company,
        applications: companyApps.length,
        accepted: companyApps.filter(app => app.status === 'accepted').length,
        pending: companyApps.filter(app => app.status === 'pending').length,
        rejected: companyApps.filter(app => app.status === 'rejected').length
      };
    });

    // Skills analysis
    const appliedInternships = allInternships.filter(internship => 
      apps.some(app => app.internshipId === internship.id)
    );
    
    const skillsInDemand = {};
    appliedInternships.forEach(internship => {
      if (internship.skills) {
        internship.skills.forEach(skill => {
          skillsInDemand[skill] = (skillsInDemand[skill] || 0) + 1;
        });
      }
    });

    const topSkills = Object.entries(skillsInDemand)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));

    // Monthly trend
    const monthlyTrend = {};
    apps.forEach(app => {
      const month = new Date(app.appliedDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
    });

    setAnalytics({
      totalApplications,
      pendingApps,
      acceptedApps,
      rejectedApps,
      successRate,
      responseRate,
      companiesApplied: companiesApplied.length,
      companyStats,
      topSkills,
      monthlyTrend
    });
  };

  const generateReport = (type) => {
    const reportData = {
      type,
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      student: user?.fullName,
      analytics,
      applications: applications.map(app => ({
        internshipTitle: app.internshipTitle,
        company: app.company,
        status: app.status,
        appliedDate: app.appliedDate,
        updatedDate: app.updatedDate
      }))
    };

    setSelectedReport(reportData);
    setShowDetailModal(true);
  };

  const downloadReport = (format) => {
    if (!selectedReport) return;

    let content = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify(selectedReport, null, 2);
      filename = `internship-report-${selectedReport.period}-${Date.now()}.json`;
    } else if (format === 'csv') {
      const headers = ['Internship Title', 'Company', 'Status', 'Applied Date', 'Updated Date'];
      const rows = selectedReport.applications.map(app => [
        app.internshipTitle,
        app.company,
        app.status,
        app.appliedDate,
        app.updatedDate
      ]);
      
      content = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = `internship-report-${selectedReport.period}-${Date.now()}.csv`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading reports...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col md={8}>
          <h1 className="fw-bold mb-2">📊 My Reports & Analytics</h1>
          <p className="text-muted">Track your internship application progress and performance</p>
        </Col>
        <Col md={4} className="text-end">
          <Form.Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-auto d-inline-block"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <div className="display-6 fw-bold">{analytics.totalApplications || 0}</div>
              <div>Total Applications</div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <div className="display-6 fw-bold">{analytics.successRate || 0}%</div>
              <div>Success Rate</div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <div className="display-6 fw-bold">{analytics.responseRate || 0}%</div>
              <div>Response Rate</div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <div className="display-6 fw-bold">{analytics.companiesApplied || 0}</div>
              <div>Companies Applied</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Application Status Breakdown */}
      <Row className="mb-4 g-4">
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0 fw-bold">📈 Application Status Breakdown</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Pending</span>
                  <Badge bg="warning">{analytics.pendingApps || 0}</Badge>
                </div>
                <ProgressBar 
                  now={analytics.totalApplications ? (analytics.pendingApps / analytics.totalApplications * 100) : 0} 
                  variant="warning"
                  className="mb-3"
                />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Accepted</span>
                  <Badge bg="success">{analytics.acceptedApps || 0}</Badge>
                </div>
                <ProgressBar 
                  now={analytics.totalApplications ? (analytics.acceptedApps / analytics.totalApplications * 100) : 0} 
                  variant="success"
                  className="mb-3"
                />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Rejected</span>
                  <Badge bg="danger">{analytics.rejectedApps || 0}</Badge>
                </div>
                <ProgressBar 
                  now={analytics.totalApplications ? (analytics.rejectedApps / analytics.totalApplications * 100) : 0} 
                  variant="danger"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0 fw-bold">🎯 Top Skills in Demand</h5>
            </Card.Header>
            <Card.Body>
              {analytics.topSkills && analytics.topSkills.length > 0 ? (
                analytics.topSkills.map((skillData, index) => (
                  <div key={skillData.skill} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">
                        <Badge bg="light" text="dark" className="me-2">{index + 1}</Badge>
                        {skillData.skill}
                      </span>
                      <Badge bg="primary">{skillData.count}</Badge>
                    </div>
                    <ProgressBar 
                      now={(skillData.count / Math.max(...analytics.topSkills.map(s => s.count))) * 100} 
                      variant="primary"
                      style={{ height: '8px' }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted text-center py-4">No skills data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Company Performance */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0 fw-bold">🏢 Company Application Performance</h5>
            </Card.Header>
            <Card.Body>
              {analytics.companyStats && analytics.companyStats.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Total Applications</th>
                        <th>Accepted</th>
                        <th>Pending</th>
                        <th>Rejected</th>
                        <th>Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.companyStats.map((company) => (
                        <tr key={company.company}>
                          <td className="fw-bold">{company.company}</td>
                          <td>{company.applications}</td>
                          <td>
                            <Badge bg="success">{company.accepted}</Badge>
                          </td>
                          <td>
                            <Badge bg="warning">{company.pending}</Badge>
                          </td>
                          <td>
                            <Badge bg="danger">{company.rejected}</Badge>
                          </td>
                          <td>
                            <Badge bg={company.accepted > 0 ? 'success' : 'secondary'}>
                              {company.applications > 0 ? 
                                ((company.accepted / company.applications) * 100).toFixed(1) : 0}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted text-center py-4">No company data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Applications */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0 fw-bold">📋 Recent Applications</h5>
            </Card.Header>
            <Card.Body>
              {applications.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Days Since Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 10).map((app) => {
                        const daysSince = Math.floor(
                          (new Date() - new Date(app.appliedDate)) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <tr key={app.id}>
                            <td className="fw-bold">{app.internshipTitle}</td>
                            <td>{app.company}</td>
                            <td>{app.appliedDate}</td>
                            <td>
                              <Badge bg={
                                app.status === 'accepted' ? 'success' :
                                app.status === 'rejected' ? 'danger' : 'warning'
                              }>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              <span className={daysSince > 30 ? 'text-warning' : 'text-muted'}>
                                {daysSince} days
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  <h6>No applications found</h6>
                  <p className="mb-0">Start applying to internships to see your reports here!</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Generation */}
      <Row>
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0 fw-bold">📄 Generate Reports</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-4">
                Generate detailed reports of your internship application activity for the selected time period.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => generateReport('summary')}
                  className="d-flex align-items-center gap-2"
                >
                  <FaEye />
                  View Summary Report
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => generateReport('detailed')}
                  className="d-flex align-items-center gap-2"
                >
                  <FaChartLine />
                  View Detailed Analytics
                </Button>
                <Button 
                  variant="info" 
                  onClick={() => generateReport('performance')}
                  className="d-flex align-items-center gap-2"
                >
                  <FaTrophy />
                  Performance Report
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Report Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            📊 {selectedReport?.type.charAt(0).toUpperCase() + selectedReport?.type.slice(1)} Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <div className="mb-4">
                <h6 className="fw-bold">Report Information</h6>
                <p><strong>Student:</strong> {selectedReport.student}</p>
                <p><strong>Period:</strong> {selectedReport.period}</p>
                <p><strong>Generated:</strong> {new Date(selectedReport.generatedAt).toLocaleString()}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold">Summary Statistics</h6>
                <Row className="g-3">
                  <Col md={3}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 fw-bold text-primary">{selectedReport.analytics.totalApplications}</div>
                      <small>Total Applications</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 fw-bold text-success">{selectedReport.analytics.acceptedApps}</div>
                      <small>Accepted</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 fw-bold text-warning">{selectedReport.analytics.pendingApps}</div>
                      <small>Pending</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="h4 fw-bold text-danger">{selectedReport.analytics.rejectedApps}</div>
                      <small>Rejected</small>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold">Performance Metrics</h6>
                <p><strong>Success Rate:</strong> {selectedReport.analytics.successRate}%</p>
                <p><strong>Response Rate:</strong> {selectedReport.analytics.responseRate}%</p>
                <p><strong>Companies Applied To:</strong> {selectedReport.analytics.companiesApplied}</p>
              </div>

              {selectedReport.type === 'detailed' && (
                <div className="mb-4">
                  <h6 className="fw-bold">Application Details</h6>
                  <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Position</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Applied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.applications.map((app, index) => (
                          <tr key={index}>
                            <td>{app.internshipTitle}</td>
                            <td>{app.company}</td>
                            <td>
                              <Badge bg={
                                app.status === 'accepted' ? 'success' :
                                app.status === 'rejected' ? 'danger' : 'warning'
                              }>
                                {app.status}
                              </Badge>
                            </td>
                            <td>{app.appliedDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
          <Button 
            variant="success" 
            onClick={() => downloadReport('csv')}
            className="d-flex align-items-center gap-2"
          >
            <FaDownload />
            Download CSV
          </Button>
          <Button 
            variant="primary" 
            onClick={() => downloadReport('json')}
            className="d-flex align-items-center gap-2"
          >
            <FaDownload />
            Download JSON
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Reports;