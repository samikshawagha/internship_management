import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import { 
  Container, Row, Col, Card, Form, Button, Alert, Badge, 
  ProgressBar, Modal, ListGroup, Tab, Tabs, InputGroup 
} from 'react-bootstrap';
import { FaEdit, FaUpload, FaDownload, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // Form states
  const [personalData, setPersonalData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    linkedIn: '',
    github: '',
    portfolio: ''
  });

  const [academicData, setAcademicData] = useState({
    university: '',
    degree: '',
    major: '',
    gpa: '',
    graduationYear: '',
    coursework: []
  });

  const [skillsData, setSkillsData] = useState({
    technicalSkills: [],
    softSkills: [],
    languages: [],
    certifications: []
  });

  const [experienceData, setExperienceData] = useState({
    workExperience: [],
    projects: [],
    achievements: []
  });

  const [newSkill, setNewSkill] = useState({ category: 'technicalSkills', name: '', level: 'Beginner' });
  const [newEducation, setNewEducation] = useState({ type: 'coursework', name: '', description: '' });
  const [newExperience, setNewExperience] = useState({
    type: 'workExperience',
    title: '',
    company: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = () => {
    setPersonalData({
      fullName: user.fullName || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
      linkedIn: user.linkedIn || '',
      github: user.github || '',
      portfolio: user.portfolio || ''
    });

    setAcademicData({
      university: user.university || '',
      degree: user.degree || '',
      major: user.major || '',
      gpa: user.gpa || '',
      graduationYear: user.graduationYear || '',
      coursework: user.coursework || []
    });

    setSkillsData({
      technicalSkills: user.technicalSkills || [],
      softSkills: user.softSkills || [],
      languages: user.languages || [],
      certifications: user.certifications || []
    });

    setExperienceData({
      workExperience: user.workExperience || [],
      projects: user.projects || [],
      achievements: user.achievements || []
    });
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 0;

    // Personal Info (40%)
    const personalFields = ['fullName', 'phone', 'address', 'city'];
    personalFields.forEach(field => {
      total++;
      if (personalData[field]) completed++;
    });

    // Academic Info (30%)
    const academicFields = ['university', 'degree', 'major', 'graduationYear'];
    academicFields.forEach(field => {
      total++;
      if (academicData[field]) completed++;
    });

    // Skills (20%)
    total++;
    if (skillsData.technicalSkills.length > 0) completed++;

    // Experience (10%)
    total++;
    if (experienceData.projects.length > 0 || experienceData.workExperience.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update user profile via CRUD service
      await crudService.updateUser(user.id, personalData);
      updateUser({ ...user, ...personalData });
      setSuccess('Personal information updated successfully!');
    } catch (err) {
      setError('Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  const handleAcademicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await crudService.updateUser(user.id, academicData);
      updateUser({ ...user, ...academicData });
      setSuccess('Academic information updated successfully!');
    } catch (err) {
      setError('Failed to update academic information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;

    const updatedSkills = {
      ...skillsData,
      [newSkill.category]: [...skillsData[newSkill.category], {
        name: newSkill.name,
        level: newSkill.level,
        id: Date.now()
      }]
    };

    setSkillsData(updatedSkills);
    setNewSkill({ category: 'technicalSkills', name: '', level: 'Beginner' });
    setShowSkillModal(false);
  };

  const handleRemoveSkill = (category, skillId) => {
    const updatedSkills = {
      ...skillsData,
      [category]: skillsData[category].filter(skill => skill.id !== skillId)
    };
    setSkillsData(updatedSkills);
  };

  const handleAddEducation = () => {
    if (!newEducation.name.trim()) return;

    const updatedAcademic = {
      ...academicData,
      coursework: [...academicData.coursework, {
        ...newEducation,
        id: Date.now()
      }]
    };

    setAcademicData(updatedAcademic);
    setNewEducation({ type: 'coursework', name: '', description: '' });
    setShowEducationModal(false);
  };

  const handleAddExperience = () => {
    if (!newExperience.title.trim()) return;

    const updatedExperience = {
      ...experienceData,
      [newExperience.type]: [...experienceData[newExperience.type], {
        ...newExperience,
        id: Date.now()
      }]
    };

    setExperienceData(updatedExperience);
    setNewExperience({
      type: 'workExperience',
      title: '',
      company: '',
      duration: '',
      description: ''
    });
    setShowExperienceModal(false);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <Container fluid className="profile-container py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-2">👤 My Profile</h1>
              <p className="text-muted">Manage your personal information and preferences</p>
            </div>
            <Badge bg="primary" className="fs-6">Student</Badge>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row className="g-4">
        {/* Profile Summary Card */}
        <Col lg={4}>
          <Card className="profile-summary-card shadow-sm border-0 mb-4">
            <Card.Body className="text-center">
              <div className="profile-avatar mb-3">
                {user?.fullName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <h4 className="fw-bold mb-1">{user?.fullName}</h4>
              <p className="text-muted mb-3">{user?.email}</p>
              <Badge bg="success" className="mb-3">Active Student</Badge>
              
              <div className="profile-completion mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Profile Completion</small>
                  <small className="fw-bold">{profileCompletion}%</small>
                </div>
                <ProgressBar 
                  now={profileCompletion} 
                  variant={profileCompletion < 50 ? 'danger' : profileCompletion < 80 ? 'warning' : 'success'}
                  className="profile-progress"
                />
              </div>

              <div className="profile-stats">
                <Row className="text-center">
                  <Col>
                    <div className="stat-number">{skillsData.technicalSkills.length}</div>
                    <div className="stat-label">Skills</div>
                  </Col>
                  <Col>
                    <div className="stat-number">{experienceData.projects.length}</div>
                    <div className="stat-label">Projects</div>
                  </Col>
                  <Col>
                    <div className="stat-number">{skillsData.certifications.length}</div>
                    <div className="stat-label">Certificates</div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm border-0">
            <Card.Header>
              <h6 className="mb-0 fw-bold">⚡ Quick Actions</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="primary" size="sm">
                  <FaDownload className="me-2" />
                  Download Resume
                </Button>
                <Button variant="success" size="sm">
                  <FaEye className="me-2" />
                  Preview Profile
                </Button>
                <Button variant="info" size="sm">
                  <FaUpload className="me-2" />
                  Upload Documents
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="profile-tabs">
                {/* Personal Information Tab */}
                <Tab eventKey="personal" title="👤 Personal Info">
                  <Form onSubmit={handlePersonalSubmit} className="mt-4">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Full Name *</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.fullName}
                            onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={personalData.phone}
                            onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={personalData.dateOfBirth}
                            onChange={(e) => setPersonalData({...personalData, dateOfBirth: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Address</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.address}
                            onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-bold">City</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.city}
                            onChange={(e) => setPersonalData({...personalData, city: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-bold">State</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.state}
                            onChange={(e) => setPersonalData({...personalData, state: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Zip Code</Form.Label>
                          <Form.Control
                            type="text"
                            value={personalData.zipCode}
                            onChange={(e) => setPersonalData({...personalData, zipCode: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">LinkedIn Profile</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>🔗</InputGroup.Text>
                            <Form.Control
                              type="url"
                              value={personalData.linkedIn}
                              onChange={(e) => setPersonalData({...personalData, linkedIn: e.target.value})}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">GitHub Profile</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>💻</InputGroup.Text>
                            <Form.Control
                              type="url"
                              value={personalData.github}
                              onChange={(e) => setPersonalData({...personalData, github: e.target.value})}
                              placeholder="https://github.com/username"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Portfolio Website</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>🌐</InputGroup.Text>
                            <Form.Control
                              type="url"
                              value={personalData.portfolio}
                              onChange={(e) => setPersonalData({...personalData, portfolio: e.target.value})}
                              placeholder="https://yourportfolio.com"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="mt-4">
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Personal Info'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                {/* Academic Information Tab */}
                <Tab eventKey="academic" title="🎓 Academic Info">
                  <Form onSubmit={handleAcademicSubmit} className="mt-4">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">University/College</Form.Label>
                          <Form.Control
                            type="text"
                            value={academicData.university}
                            onChange={(e) => setAcademicData({...academicData, university: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Degree</Form.Label>
                          <Form.Select
                            value={academicData.degree}
                            onChange={(e) => setAcademicData({...academicData, degree: e.target.value})}
                          >
                            <option value="">Select Degree</option>
                            <option value="Bachelor's">Bachelor's</option>
                            <option value="Master's">Master's</option>
                            <option value="PhD">PhD</option>
                            <option value="Associate">Associate</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Major/Field of Study</Form.Label>
                          <Form.Control
                            type="text"
                            value={academicData.major}
                            onChange={(e) => setAcademicData({...academicData, major: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fw-bold">GPA</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={academicData.gpa}
                            onChange={(e) => setAcademicData({...academicData, gpa: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Graduation Year</Form.Label>
                          <Form.Control
                            type="number"
                            min="2020"
                            max="2030"
                            value={academicData.graduationYear}
                            onChange={(e) => setAcademicData({...academicData, graduationYear: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Relevant Coursework */}
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">📚 Relevant Coursework</h6>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowEducationModal(true)}
                        >
                          <FaPlus className="me-1" />
                          Add Course
                        </Button>
                      </div>
                      {academicData.coursework.length > 0 ? (
                        <ListGroup>
                          {academicData.coursework.map((course) => (
                            <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold">{course.name}</div>
                                {course.description && <small className="text-muted">{course.description}</small>}
                              </div>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  const updatedCourses = academicData.coursework.filter(c => c.id !== course.id);
                                  setAcademicData({...academicData, coursework: updatedCourses});
                                }}
                              >
                                <FaTrash />
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p className="text-muted">No coursework added yet.</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Academic Info'}
                      </Button>
                    </div>
                  </Form>
                </Tab>

                {/* Skills Tab */}
                <Tab eventKey="skills" title="🛠️ Skills">
                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold mb-0">💻 Technical Skills</h6>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setNewSkill({...newSkill, category: 'technicalSkills'});
                          setShowSkillModal(true);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Add Skill
                      </Button>
                    </div>
                    <div className="skills-grid mb-4">
                      {skillsData.technicalSkills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          bg="primary" 
                          className="skill-badge"
                        >
                          {skill.name} ({skill.level})
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-white p-0 ms-2"
                            onClick={() => handleRemoveSkill('technicalSkills', skill.id)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold mb-0">🤝 Soft Skills</h6>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => {
                          setNewSkill({...newSkill, category: 'softSkills'});
                          setShowSkillModal(true);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Add Skill
                      </Button>
                    </div>
                    <div className="skills-grid mb-4">
                      {skillsData.softSkills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          bg="success" 
                          className="skill-badge"
                        >
                          {skill.name}
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-white p-0 ms-2"
                            onClick={() => handleRemoveSkill('softSkills', skill.id)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold mb-0">🌍 Languages</h6>
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => {
                          setNewSkill({...newSkill, category: 'languages'});
                          setShowSkillModal(true);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Add Language
                      </Button>
                    </div>
                    <div className="skills-grid">
                      {skillsData.languages.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          bg="info" 
                          className="skill-badge"
                        >
                          {skill.name} ({skill.level})
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-white p-0 ms-2"
                            onClick={() => handleRemoveSkill('languages', skill.id)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Tab>

                {/* Experience Tab */}
                <Tab eventKey="experience" title="💼 Experience">
                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold mb-0">💼 Work Experience</h6>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setNewExperience({...newExperience, type: 'workExperience'});
                          setShowExperienceModal(true);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Add Experience
                      </Button>
                    </div>
                    {experienceData.workExperience.length > 0 ? (
                      <ListGroup className="mb-4">
                        {experienceData.workExperience.map((exp) => (
                          <ListGroup.Item key={exp.id}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="fw-bold mb-1">{exp.title}</h6>
                                <p className="text-primary mb-1">{exp.company}</p>
                                <small className="text-muted">{exp.duration}</small>
                                {exp.description && <p className="mt-2 mb-0">{exp.description}</p>}
                              </div>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  const updated = experienceData.workExperience.filter(e => e.id !== exp.id);
                                  setExperienceData({...experienceData, workExperience: updated});
                                }}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted mb-4">No work experience added yet.</p>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold mb-0">🚀 Projects</h6>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => {
                          setNewExperience({...newExperience, type: 'projects'});
                          setShowExperienceModal(true);
                        }}
                      >
                        <FaPlus className="me-1" />
                        Add Project
                      </Button>
                    </div>
                    {experienceData.projects.length > 0 ? (
                      <ListGroup>
                        {experienceData.projects.map((project) => (
                          <ListGroup.Item key={project.id}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="fw-bold mb-1">{project.title}</h6>
                                <small className="text-muted">{project.duration}</small>
                                {project.description && <p className="mt-2 mb-0">{project.description}</p>}
                              </div>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  const updated = experienceData.projects.filter(p => p.id !== project.id);
                                  setExperienceData({...experienceData, projects: updated});
                                }}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted">No projects added yet.</p>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Skill Modal */}
      <Modal show={showSkillModal} onHide={() => setShowSkillModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
              >
                <option value="technicalSkills">Technical Skills</option>
                <option value="softSkills">Soft Skills</option>
                <option value="languages">Languages</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder="Enter skill name"
              />
            </Form.Group>
            {newSkill.category !== 'softSkills' && (
              <Form.Group className="mb-3">
                <Form.Label>Proficiency Level</Form.Label>
                <Form.Select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSkillModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Education Modal */}
      <Modal show={showEducationModal} onHide={() => setShowEducationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Coursework</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                value={newEducation.name}
                onChange={(e) => setNewEducation({...newEducation, name: e.target.value})}
                placeholder="Enter course name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEducation.description}
                onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
                placeholder="Brief description of the course"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEducationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEducation}>
            Add Course
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Experience Modal */}
      <Modal show={showExperienceModal} onHide={() => setShowExperienceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add {newExperience.type === 'workExperience' ? 'Work Experience' : 'Project'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                {newExperience.type === 'workExperience' ? 'Job Title' : 'Project Title'}
              </Form.Label>
              <Form.Control
                type="text"
                value={newExperience.title}
                onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                placeholder={newExperience.type === 'workExperience' ? 'Enter job title' : 'Enter project title'}
              />
            </Form.Group>
            {newExperience.type === 'workExperience' && (
              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                  placeholder="Enter company name"
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                value={newExperience.duration}
                onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                placeholder="e.g., Jan 2023 - Present"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newExperience.description}
                onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                placeholder="Describe your responsibilities and achievements"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExperienceModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddExperience}>
            Add {newExperience.type === 'workExperience' ? 'Experience' : 'Project'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;