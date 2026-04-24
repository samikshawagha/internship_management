import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const flows = [
  {
    role: 'Student',
    color: '#4361ee',
    icon: '🎓',
    steps: [
      { icon: '🎓', label: 'Student', type: 'actor' },
      { icon: '🔍', label: 'Browse Internships', type: 'action' },
      { icon: '📝', label: 'Apply Internship', type: 'action' },
      { icon: '📤', label: 'Submit Resume & Cover Letter', type: 'action' },
      { icon: '⚙️', label: 'System Validates', type: 'system' },
      { icon: '🗄️', label: 'Database', type: 'db' },
      { icon: '📬', label: 'Status: Pending', type: 'result' },
    ],
  },
  {
    role: 'Company',
    color: '#2a9d8f',
    icon: '🏢',
    steps: [
      { icon: '🏢', label: 'Company', type: 'actor' },
      { icon: '➕', label: 'Create Internship Post', type: 'action' },
      { icon: '📋', label: 'Set Details & Requirements', type: 'action' },
      { icon: '⚙️', label: 'System Processes', type: 'system' },
      { icon: '🗄️', label: 'Database', type: 'db' },
      { icon: '👀', label: 'Review Applications', type: 'action' },
      { icon: '✅', label: 'Accept / Reject', type: 'result' },
    ],
  },
  {
    role: 'Admin',
    color: '#e63946',
    icon: '⚙️',
    steps: [
      { icon: '⚙️', label: 'Admin', type: 'actor' },
      { icon: '👥', label: 'Manage Users', type: 'action' },
      { icon: '💼', label: 'Manage Internships', type: 'action' },
      { icon: '📋', label: 'Manage Applications', type: 'action' },
      { icon: '⚙️', label: 'System Executes', type: 'system' },
      { icon: '🗄️', label: 'Database', type: 'db' },
      { icon: '📊', label: 'Reports & Analytics', type: 'result' },
    ],
  },
];

const typeStyles = {
  actor:  { bg: '#1a1a2e', border: '#fff',     text: '#fff' },
  action: { bg: '#f8f9fa', border: '#dee2e6',  text: '#1a1a2e' },
  system: { bg: '#fff3cd', border: '#ffc107',  text: '#856404' },
  db:     { bg: '#d1ecf1', border: '#0dcaf0',  text: '#055160' },
  result: { bg: '#d4edda', border: '#28a745',  text: '#155724' },
};

const FlowStep = ({ step, color, isLast }) => {
  const s = typeStyles[step.type];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div
        style={{
          width: 72, height: 72, borderRadius: step.type === 'db' ? '8px' : '50%',
          background: s.bg, border: `2px solid ${step.type === 'actor' ? color : s.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {step.icon}
      </div>
      <div style={{ marginTop: 8, fontSize: '0.75rem', fontWeight: 600, color: s.text === '#fff' ? '#555' : s.text, textAlign: 'center', maxWidth: 80 }}>
        {step.label}
      </div>
      {!isLast && (
        <div style={{ position: 'absolute', right: -18, top: 24, fontSize: '1.2rem', color: '#aaa', zIndex: 1 }}>→</div>
      )}
    </div>
  );
};

const SystemFlow = () => {
  const [active, setActive] = useState(null);

  return (
    <Container fluid className="py-4 px-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>🔄 System Flow Diagram</h2>
        <p className="text-muted mb-0">How each role interacts with the system and database</p>
      </div>

      {/* Legend */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {Object.entries(typeStyles).map(([type, s]) => (
          <div key={type} className="d-flex align-items-center gap-2">
            <div style={{ width: 14, height: 14, borderRadius: type === 'db' ? 3 : '50%', background: s.bg, border: `2px solid ${s.border}` }} />
            <span style={{ fontSize: '0.78rem', color: '#555', textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column gap-4">
        {flows.map((flow) => (
          <Card
            key={flow.role}
            className="border-0 shadow-sm"
            style={{ borderLeft: `4px solid ${flow.color} !important`, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => { setActive(flow.role); e.currentTarget.style.boxShadow = `0 4px 20px ${flow.color}33`; }}
            onMouseLeave={e => { setActive(null); e.currentTarget.style.boxShadow = ''; }}
          >
            <Card.Body className="py-4 px-4">
              {/* Role Header */}
              <div className="d-flex align-items-center gap-2 mb-4">
                <span style={{ fontSize: '1.4rem' }}>{flow.icon}</span>
                <h5 className="fw-bold mb-0" style={{ color: flow.color }}>{flow.role} Flow</h5>
                <Badge style={{ background: flow.color, marginLeft: 'auto' }}>
                  {flow.steps.length} steps
                </Badge>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
                {flow.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 90 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div
                        style={{
                          width: 64, height: 64,
                          borderRadius: step.type === 'db' ? '10px' : '50%',
                          background: typeStyles[step.type].bg,
                          border: `2px solid ${step.type === 'actor' ? flow.color : typeStyles[step.type].border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem',
                          boxShadow: active === flow.role && step.type === 'actor' ? `0 0 0 4px ${flow.color}44` : '0 2px 6px rgba(0,0,0,0.08)',
                          transition: 'all 0.2s',
                        }}
                      >
                        {step.icon}
                      </div>
                      <div style={{
                        marginTop: 6, fontSize: '0.72rem', fontWeight: 600,
                        color: '#444', textAlign: 'center', maxWidth: 80, lineHeight: 1.3
                      }}>
                        {step.label}
                      </div>
                    </div>
                    {i < flow.steps.length - 1 && (
                      <div style={{ fontSize: '1.3rem', color: flow.color, opacity: 0.6, flexShrink: 0, margin: '0 2px', paddingBottom: 20 }}>
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Summary Table */}
      <Card className="border-0 shadow-sm mt-4">
        <Card.Header className="bg-white border-bottom py-3">
          <h6 className="fw-bold mb-0">📋 Role Summary</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Role</th>
                  <th>Primary Actions</th>
                  <th>DB Operations</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Badge style={{ background: '#4361ee' }}>🎓 Student</Badge></td>
                  <td>Browse, Apply, Track</td>
                  <td>INSERT application, SELECT internships</td>
                  <td>Application status updates</td>
                </tr>
                <tr>
                  <td><Badge style={{ background: '#2a9d8f' }}>🏢 Company</Badge></td>
                  <td>Post, Review, Accept/Reject</td>
                  <td>INSERT internship, UPDATE application status</td>
                  <td>Hired candidates</td>
                </tr>
                <tr>
                  <td><Badge style={{ background: '#e63946' }}>⚙️ Admin</Badge></td>
                  <td>Manage users, internships, applications</td>
                  <td>Full CRUD on all tables</td>
                  <td>Reports & analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SystemFlow;
