import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Table, Modal, Spinner } from 'react-bootstrap';
import { apiService } from '../services/apiService';
import '../styles/attendance.css';

const Attendance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'casual'
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Real data states
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    leaveDays: 0,
    lateDays: 0,
    attendancePercentage: 0
  });
  const [currentInternship, setCurrentInternship] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get student's internships
      const dashboardResponse = await apiService.getStudentInternships();
      const internships = dashboardResponse.data.internships;

      if (internships && internships.length > 0) {
        // Use the first internship (or could add logic to select active one)
        const internship = internships[0];
        setCurrentInternship(internship);

        // Fetch attendance data
        await Promise.all([
          fetchAttendanceRecords(user.id, internship.id),
          fetchAttendanceSummary(user.id, internship.id),
          fetchLeaveRequests(user.id)
        ]);
      } else {
        setError('No active internships found. Please apply for an internship first.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response.status === 403) {
          setError('Access denied. You may not have permission to view this data.');
        } else {
          setError(`Failed to load attendance data: ${err.response.data?.message || err.message}`);
        }
      } else {
        setError('Failed to load attendance data. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async (studentId, internshipId) => {
    try {
      const response = await apiService.getAttendanceByStudent(studentId, internshipId);
      const records = response.data.data || [];
      
      // Format records for display
      const formattedRecords = records.map(record => ({
        date: record.date,
        status: record.status,
        title: new Date(record.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        icon: getStatusIcon(record.status),
        remarks: record.remarks
      }));
      
      setAttendanceRecords(formattedRecords);
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      // Set empty array on error
      setAttendanceRecords([]);
    }
  };

  const fetchAttendanceSummary = async (studentId, internshipId) => {
    try {
      const response = await apiService.getAttendanceSummary(studentId, internshipId);
      const summary = response.data.data || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        leaveDays: 0,
        lateDays: 0,
        attendancePercentage: 0
      };
      setAttendanceSummary(summary);
    } catch (err) {
      console.error('Error fetching attendance summary:', err);
      // Keep default values on error
    }
  };

  const fetchLeaveRequests = async (studentId) => {
    try {
      const response = await apiService.getLeavesByStudent(studentId);
      const leaves = response.data.data || [];
      setLeaveRequests(leaves);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      // Set empty array on error
      setLeaveRequests([]);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'present': '✓',
      'absent': '✗',
      'late': '⏱',
      'leave': '📝'
    };
    return icons[status] || '?';
  };

  const getStatusBadge = (status) => {
    const variants = {
      'present': 'success',
      'absent': 'danger',
      'late': 'warning',
      'leave': 'info'
    };
    return variants[status] || 'secondary';
  };

  const getLeaveStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason || !currentInternship) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const leaveData = {
        studentId: user.id,
        internshipId: currentInternship.id,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason,
        leaveType: leaveForm.leaveType
      };

      await apiService.requestLeave(leaveData);
      
      alert('✓ Leave request submitted successfully!');
      setLeaveForm({ startDate: '', endDate: '', reason: '', leaveType: 'casual' });
      setShowModal(false);
      
      // Refresh leave requests
      await fetchLeaveRequests(user.id);
    } catch (err) {
      console.error('Error submitting leave request:', err);
      alert('Failed to submit leave request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveChange = (field, value) => {
    setLeaveForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container fluid className="attendance-page py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Row className="mb-5">
        <Col md={8}>
          <h1 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>
            📋 Attendance & Leave Management
          </h1>
          <p className="text-muted">Track your attendance and manage leave requests</p>
          {currentInternship && (
            <p className="text-muted small">Internship: {currentInternship.title}</p>
          )}
        </Col>
        <Col md={4} className="text-end">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowModal(true)}
            className="fw-bold"
            style={{ borderRadius: '8px' }}
            disabled={!currentInternship}
          >
            📝 Request Leave
          </Button>
        </Col>
      </Row>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading attendance data...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {!loading && !error && currentInternship ? (
        <>
          {/* Summary Cards */}
          <Row className="mb-5 g-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <p className="text-muted small mb-2">Total Days</p>
              <h3 className="fw-bold mb-0">{attendanceSummary.totalDays}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#28a745' }}>✓</div>
              <p className="text-muted small mb-2">Present</p>
              <h3 className="fw-bold mb-0 text-success">{attendanceSummary.presentDays}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#dc3545' }}>✗</div>
              <p className="text-muted small mb-2">Absent</p>
              <h3 className="fw-bold mb-0 text-danger">{attendanceSummary.absentDays}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center" style={{ borderRadius: '12px' }}>
            <Card.Body className="py-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ffc107' }}>📈</div>
              <p className="text-muted small mb-2">Attendance %</p>
              <h3 className="fw-bold mb-0" style={{ color: '#667eea' }}>{attendanceSummary.attendancePercentage}%</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="mb-4 d-flex gap-2">
        <Button
          variant={activeTab === 'attendance' ? 'primary' : 'light'}
          onClick={() => setActiveTab('attendance')}
          className="fw-bold"
          style={{ borderRadius: '8px' }}
        >
          📅 Attendance History
        </Button>
        <Button
          variant={activeTab === 'leaves' ? 'primary' : 'light'}
          onClick={() => setActiveTab('leaves')}
          className="fw-bold"
          style={{ borderRadius: '8px' }}
        >
          📝 My Leave Requests
        </Button>
      </div>

      {/* Attendance History Tab */}
      {activeTab === 'attendance' && (
        <Row className="g-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Header className="bg-light border-bottom py-3">
                <h5 className="mb-0 fw-bold">Last 30 Days Attendance</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="py-3">Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.length > 0 ? (
                      attendanceRecords.map((record, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="py-3">{record.title}</td>
                          <td className="py-3">
                            <Badge bg={getStatusBadge(record.status)}>
                              {record.icon} {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted small">
                            {record.remarks || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-muted">
                          No attendance records found for this internship.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Header className="bg-light border-bottom py-3">
                <h5 className="mb-0 fw-bold">Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="fw-bold">Attendance</small>
                    <small className="text-muted">{attendanceSummary.attendancePercentage}%</small>
                  </div>
                  <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${attendanceSummary.attendancePercentage}%`, backgroundColor: '#28a745' }}
                    />
                  </div>
                </div>
                <hr />
                <div className="small mb-2">
                  <p className="mb-1">✓ Present Days: <strong>{attendanceSummary.presentDays}</strong></p>
                  <p className="mb-1">⏱ Late Days: <strong>{attendanceSummary.lateDays}</strong></p>
                  <p className="mb-1">📝 Leave Days: <strong>{attendanceSummary.leaveDays}</strong></p>
                  <p className="mb-1">✗ Absent Days: <strong>{attendanceSummary.absentDays}</strong></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Leave Requests Tab */}
      {activeTab === 'leaves' && (
        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <Card.Header className="bg-light border-bottom py-3">
            <h5 className="mb-0 fw-bold">My Leave Requests</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {leaveRequests.length > 0 ? (
              <Table responsive className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="py-3">Period</th>
                    <th className="py-3">Type</th>
                    <th className="py-3">Reason</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave) => (
                    <tr key={leave.id} className="border-bottom align-middle">
                      <td className="py-3">
                        <small className="fw-bold">{leave.startDate} to {leave.endDate}</small>
                      </td>
                      <td className="py-3">{leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1) : 'Casual'}</td>
                      <td className="py-3">
                        <small className="text-muted">{leave.reason}</small>
                      </td>
                      <td className="py-3">
                        <Badge bg={getLeaveStatusBadge(leave.status)}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {leave.status === 'pending' && (
                          <>
                            <Button size="sm" variant="light" className="me-2">Edit</Button>
                            <Button size="sm" variant="danger">Cancel</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="p-4 text-center text-muted">
                <p>No leave requests yet</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Leave Request Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📝 Request Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLeaveSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Leave Type</Form.Label>
              <Form.Select
                value={leaveForm.leaveType}
                onChange={(e) => handleLeaveChange('leaveType', e.target.value)}
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="emergency">Emergency Leave</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Start Date</Form.Label>
              <Form.Control
                type="date"
                value={leaveForm.startDate}
                onChange={(e) => handleLeaveChange('startDate', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">End Date</Form.Label>
              <Form.Control
                type="date"
                value={leaveForm.endDate}
                onChange={(e) => handleLeaveChange('endDate', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Reason for Leave</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Please provide reason for your leave request..."
                value={leaveForm.reason}
                onChange={(e) => handleLeaveChange('reason', e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 fw-bold" 
              style={{ borderRadius: '8px' }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Leave Request'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
        </>
      ) : null}
    </Container>
  );
};

export default Attendance;
