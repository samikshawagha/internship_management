import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Badge, Button, Table, Modal, Form } from 'react-bootstrap';
import '../styles/companyadmin.css';

const CompanyAttendance = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Mock data
  const [attendanceData] = useState([
    { id: 1, studentName: 'Alice Johnson', date: '2026-02-19', status: 'present', internship: 'Frontend Dev' },
    { id: 2, studentName: 'Bob Smith', date: '2026-02-19', status: 'absent', internship: 'Data Science' },
    { id: 3, studentName: 'Carol Davis', date: '2026-02-19', status: 'late', internship: 'Frontend Dev' },
    { id: 4, studentName: 'David Wilson', date: '2026-02-19', status: 'present', internship: 'Backend Dev' },
  ]);

  const [leaveRequests] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      startDate: '2026-02-20',
      endDate: '2026-02-22',
      type: 'casual',
      reason: 'Personal work',
      status: 'pending',
      internship: 'Frontend Dev'
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      startDate: '2026-02-25',
      endDate: '2026-02-27',
      type: 'sick',
      reason: 'Medical appointment',
      status: 'pending',
      internship: 'Data Science'
    },
  ]);

  const [attendanceSummary] = useState([
    { name: 'Alice Johnson', presentDays: 40, absentDays: 2, lateDays: 1, percentage: 88.89 },
    { name: 'Bob Smith', presentDays: 38, absentDays: 4, lateDays: 0, percentage: 84.44 },
    { name: 'Carol Davis', presentDays: 42, absentDays: 1, lateDays: 2, percentage: 93.33 },
    { name: 'David Wilson', presentDays: 41, absentDays: 1, lateDays: 3, percentage: 91.11 },
  ]);

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

  return (
    <Container fluid className="company-admin-page py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Row className="mb-5">
        <Col>
          <h1 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>
            👥 Attendance & Leave Management
          </h1>
          <p className="text-muted">Manage your interns' attendance and approve/reject leave requests</p>
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
          📅 Daily Attendance
        </Button>
        <Button
          variant={activeTab === 'summary' ? 'primary' : 'light'}
          onClick={() => setActiveTab('summary')}
          className="fw-bold"
          style={{ borderRadius: '8px' }}
        >
          📊 Attendance Summary
        </Button>
        <Button
          variant={activeTab === 'leaves' ? 'primary' : 'light'}
          onClick={() => setActiveTab('leaves')}
          className="fw-bold"
          style={{ borderRadius: '8px' }}
        >
          📝 Leave Requests
        </Button>
      </div>

      {/* Daily Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <Card.Header className="bg-light border-bottom py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Today's Attendance (Feb 19, 2026)</h5>
            <Button 
              variant="success" 
              size="sm"
              onClick={() => setShowAttendanceModal(true)}
              className="fw-bold"
            >
              ➕ Mark Attendance
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Internship</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Time</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="border-bottom align-middle">
                    <td className="py-3">
                      <strong>{record.studentName}</strong>
                    </td>
                    <td className="py-3">
                      <small className="text-muted">{record.internship}</small>
                    </td>
                    <td className="py-3">
                      <Badge bg={getStatusBadge(record.status)}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <small className="text-muted">
                        {record.status === 'late' ? '09:15 AM' : record.status === 'present' ? '09:00 AM' : '-'}
                      </small>
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="light" className="me-2">Edit</Button>
                      <Button size="sm" variant="light" className="text-danger">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Attendance Summary Tab */}
      {activeTab === 'summary' && (
        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <Card.Header className="bg-light border-bottom py-3">
            <h5 className="mb-0 fw-bold">Overall Attendance Summary</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Present</th>
                  <th className="py-3">Absent</th>
                  <th className="py-3">Late</th>
                  <th className="py-3">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceSummary.map((summary, index) => (
                  <tr key={index} className="border-bottom align-middle">
                    <td className="py-3">
                      <strong>{summary.name}</strong>
                    </td>
                    <td className="py-3">
                      <Badge bg="success">{summary.presentDays}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge bg="danger">{summary.absentDays}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge bg="warning">{summary.lateDays}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <div style={{ width: '100px' }} className="me-2">
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${summary.percentage}%`,
                                backgroundColor: summary.percentage >= 85 ? '#28a745' : '#ffc107'
                              }}
                            />
                          </div>
                        </div>
                        <small className="fw-bold">{summary.percentage}%</small>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Leave Requests Tab */}
      {activeTab === 'leaves' && (
        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <Card.Header className="bg-light border-bottom py-3">
            <h5 className="mb-0 fw-bold">
              Pending Leave Requests
              <Badge bg="danger" className="ms-2">{leaveRequests.filter(l => l.status === 'pending').length}</Badge>
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {leaveRequests.length > 0 ? (
              <Table responsive className="mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="py-3">Student</th>
                    <th className="py-3">Internship</th>
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
                        <strong>{leave.studentName}</strong>
                      </td>
                      <td className="py-3">
                        <small className="text-muted">{leave.internship}</small>
                      </td>
                      <td className="py-3">
                        <small className="fw-bold">{leave.startDate} to {leave.endDate}</small>
                      </td>
                      <td className="py-3">
                        <Badge bg="info">{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}</Badge>
                      </td>
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
                            <Button 
                              size="sm" 
                              variant="success" 
                              className="me-2 fw-bold"
                              onClick={() => {
                                setSelectedLeave(leave);
                                setShowLeaveModal(true);
                              }}
                            >
                              ✓ Approve
                            </Button>
                            <Button size="sm" variant="danger" className="fw-bold">
                              ✗ Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="p-4 text-center text-muted">
                <p>No pending leave requests</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Attendance Modal */}
      <Modal show={showAttendanceModal} onHide={() => setShowAttendanceModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📅 Mark Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Student</Form.Label>
              <Form.Select>
                <option>Select student...</option>
                <option>Alice Johnson</option>
                <option>Bob Smith</option>
                <option>Carol Davis</option>
                <option>David Wilson</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Date</Form.Label>
              <Form.Control type="date" defaultValue="2026-02-19" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Status</Form.Label>
              <Form.Select>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="leave">Leave</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Remarks (Optional)</Form.Label>
              <Form.Control as="textarea" rows={2} placeholder="Add any remarks..." />
            </Form.Group>

            <Button variant="primary" className="w-100 fw-bold" onClick={() => {
              alert('Attendance marked successfully!');
              setShowAttendanceModal(false);
            }} style={{ borderRadius: '8px' }}>
              Save Attendance
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Leave Approval Modal */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📝 Approve Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <p><strong>Student:</strong> {selectedLeave.studentName}</p>
              <p><strong>Period:</strong> {selectedLeave.startDate} to {selectedLeave.endDate}</p>
              <p><strong>Type:</strong> {selectedLeave.type}</p>
              <p><strong>Reason:</strong> {selectedLeave.reason}</p>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Approval Comments (Optional)</Form.Label>
                  <Form.Control as="textarea" rows={2} placeholder="Add any comments..." />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="success" className="flex-grow-1 fw-bold" onClick={() => {
                    alert('Leave request approved!');
                    setShowLeaveModal(false);
                  }}>
                    ✓ Approve
                  </Button>
                  <Button variant="danger" className="flex-grow-1 fw-bold" onClick={() => {
                    alert('Leave request rejected!');
                    setShowLeaveModal(false);
                  }}>
                    ✗ Reject
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CompanyAttendance;
