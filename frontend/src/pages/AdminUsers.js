import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  Form,
  Tabs,
  Tab,
  InputGroup,
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'student',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await crudService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = [...users];
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(u => u.role === activeTab);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'student':
        return 'info';
      case 'company':
        return 'primary';
      case 'admin':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'student':
        return '👤';
      case 'company':
        return '🏢';
      case 'admin':
        return '🔐';
      default:
        return '👥';
    }
  };

  const handleEdit = (selectedUser) => {
    setEditingUser(selectedUser);
    setFormData({
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phone: selectedUser.phone || '',
      role: selectedUser.role || 'student',
    });
    setShowModal(true);
    setValidationError('');
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await crudService.deleteUser(userId);
        loadUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setValidationError('Please fill in required fields');
      return;
    }

    try {
      if (editingUser) {
        await crudService.updateUser(editingUser.id, formData);
      } else {
        await crudService.createUser(formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: 'student',
      });
      loadUsers();
    } catch (err) {
      setValidationError(err.message || 'Failed to save user');
    }
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      {/* Header */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={8}>
            <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', color: '#1a1a2e' }}>
              👥 Manage Users
            </h1>
            <p className="text-muted fs-5 mb-0">
              View, edit, and manage all system users
            </p>
          </Col>
          <Col md={4} className="text-end d-none d-md-block">
            <div className="d-flex justify-content-end gap-2">
              <Button variant="success" onClick={() => { setEditingUser(null); setFormData({ fullName: '', email: '', phone: '', role: 'student' }); setShowModal(true); }}>
                <FaPlus className="me-1"/> Add User
              </Button>
              <Button variant="primary" onClick={() => navigate('/admin-dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search and Filter */}
      <Card className="mb-4 border-0">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Badge bg="info">{filteredUsers.length} Users</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Card className="border-0">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="nav-tabs card-header"
        >
          <Tab eventKey="students" title={`👤 Students (${users.filter(u => u.role === 'student').length})`}>
            <UserTable
              users={filteredUsers.filter(u => u.role === 'student')}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Tab>
          <Tab eventKey="companies" title={`🏢 Companies (${users.filter(u => u.role === 'company').length})`}>
            <UserTable
              users={filteredUsers.filter(u => u.role === 'company')}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Tab>
          <Tab eventKey="admins" title={`🔐 Admins (${users.filter(u => u.role === 'admin').length})`}>
            <UserTable
              users={filteredUsers.filter(u => u.role === 'admin')}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Tab>
        </Tabs>
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? '✏️ Edit User' : '➕ Add User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert variant="danger">{validationError}</Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// User Table Component
const UserTable = ({ users, onEdit, onDelete }) => {
  if (users.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted mb-0">No users found</p>
      </div>
    );
  }

  return (
    <div className="table-responsive p-4">
      <Table hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="fw-bold">{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone || '-'}</td>
              <td>
                <Badge bg={user.role === 'student' ? 'info' : user.role === 'company' ? 'primary' : 'danger'}>
                  {user.role === 'student' ? '👤 Student' : user.role === 'company' ? '🏢 Company' : '🔐 Admin'}
                </Badge>
              </td>
              <td>{user.createdAt}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(user)}
                  title="Edit User"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                  title="Delete User"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsers;
