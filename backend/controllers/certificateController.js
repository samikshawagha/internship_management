const Certificate = require('../models/Certificate');
const path = require('path');

// Generate a unique certificate number
const generateCertificateNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `CERT-${timestamp}-${random}`;
};

// Create a new certificate
const createCertificate = async (req, res) => {
  try {
    const {
      studentId,
      internshipId,
      issuanceDate,
      expiryDate,
      issueLevel
    } = req.body;

    if (!studentId || !internshipId) {
      return res.status(400).json({ 
        message: 'Missing required fields: studentId, internshipId' 
      });
    }

    // Check if student can receive certificate
    const canIssue = await Certificate.canIssueCertificate(studentId, internshipId);
    if (!canIssue) {
      return res.status(400).json({ 
        message: 'Student does not meet criteria for certificate issuance (minimum 60% score required)' 
      });
    }

    const certificateNumber = generateCertificateNumber();
    const certificateFile = req.file ? req.file.path : null;

    const result = await Certificate.create({
      studentId,
      internshipId,
      certificateNumber,
      issuanceDate: issuanceDate || new Date(),
      expiryDate: expiryDate || null,
      certificateFile,
      status: 'issued',
      issueLevel: issueLevel || 'standard'
    });

    res.status(201).json({
      message: 'Certificate created successfully',
      data: {
        ...result,
        certificateNumber
      }
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ 
      message: 'Error creating certificate',
      error: error.message 
    });
  }
};

// Get certificate by ID
const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ 
        message: 'Certificate not found' 
      });
    }

    res.status(200).json({
      message: 'Certificate retrieved successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Error retrieving certificate:', error);
    res.status(500).json({ 
      message: 'Error retrieving certificate',
      error: error.message 
    });
  }
};

// Get certificate by certificate number
const getCertificateByNumber = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const certificate = await Certificate.findByCertificateNumber(certificateNumber);

    if (!certificate) {
      return res.status(404).json({ 
        message: 'Certificate not found' 
      });
    }

    res.status(200).json({
      message: 'Certificate retrieved successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Error retrieving certificate:', error);
    res.status(500).json({ 
      message: 'Error retrieving certificate',
      error: error.message 
    });
  }
};

// Get all certificates for a student
const getStudentCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;

    const certificates = await Certificate.getByStudentId(studentId);

    res.status(200).json({
      message: 'Student certificates retrieved successfully',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error retrieving student certificates:', error);
    res.status(500).json({ 
      message: 'Error retrieving student certificates',
      error: error.message 
    });
  }
};

// Get all certificates for an internship
const getInternshipCertificates = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const certificates = await Certificate.getByInternshipId(internshipId);

    res.status(200).json({
      message: 'Internship certificates retrieved successfully',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error retrieving internship certificates:', error);
    res.status(500).json({ 
      message: 'Error retrieving internship certificates',
      error: error.message 
    });
  }
};

// Get certificates by status
const getCertificatesByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ['generated', 'issued', 'expired', 'revoked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Valid statuses are: ${validStatuses.join(', ')}` 
      });
    }

    const certificates = await Certificate.getByStatus(status);

    res.status(200).json({
      message: 'Certificates by status retrieved successfully',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error retrieving certificates by status:', error);
    res.status(500).json({ 
      message: 'Error retrieving certificates by status',
      error: error.message 
    });
  }
};

// Get certificates by issue level
const getCertificatesByLevel = async (req, res) => {
  try {
    const { issueLevel } = req.params;

    const validLevels = ['standard', 'merit', 'distinction'];
    if (!validLevels.includes(issueLevel)) {
      return res.status(400).json({ 
        message: `Valid issue levels are: ${validLevels.join(', ')}` 
      });
    }

    const certificates = await Certificate.getByIssueLevel(issueLevel);

    res.status(200).json({
      message: 'Certificates by level retrieved successfully',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error retrieving certificates by level:', error);
    res.status(500).json({ 
      message: 'Error retrieving certificates by level',
      error: error.message 
    });
  }
};

// Update certificate
const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      certificateNumber,
      issuanceDate,
      expiryDate,
      status,
      issueLevel
    } = req.body;

    const certificateFile = req.file ? req.file.path : undefined;

    const result = await Certificate.update(id, {
      certificateNumber,
      issuanceDate,
      expiryDate,
      certificateFile,
      status,
      issueLevel
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Certificate not found' 
      });
    }

    res.status(200).json({
      message: 'Certificate updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ 
      message: 'Error updating certificate',
      error: error.message 
    });
  }
};

// Delete certificate
const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Certificate.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Certificate not found' 
      });
    }

    res.status(200).json({
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ 
      message: 'Error deleting certificate',
      error: error.message 
    });
  }
};

// Get all active certificates
const getActiveCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.getActiveCertificates();

    res.status(200).json({
      message: 'Active certificates retrieved successfully',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error retrieving active certificates:', error);
    res.status(500).json({ 
      message: 'Error retrieving active certificates',
      error: error.message 
    });
  }
};

// Get all expired certificates
const getExpiredCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.getExpiredCertificates();

    res.status(200).json({
      message: 'Expired certificates retrieved successfully',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error retrieving expired certificates:', error);
    res.status(500).json({ 
      message: 'Error retrieving expired certificates',
      error: error.message 
    });
  }
};

// Download certificate file
const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return res.status(404).json({ 
        message: 'Certificate not found' 
      });
    }

    if (!certificate.certificateFile) {
      return res.status(400).json({ 
        message: 'Certificate file not available' 
      });
    }

    res.download(certificate.certificateFile, `Certificate-${certificate.certificateNumber}.pdf`);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ 
      message: 'Error downloading certificate',
      error: error.message 
    });
  }
};

module.exports = {
  createCertificate,
  getCertificateById,
  getCertificateByNumber,
  getStudentCertificates,
  getInternshipCertificates,
  getCertificatesByStatus,
  getCertificatesByLevel,
  updateCertificate,
  deleteCertificate,
  getActiveCertificates,
  getExpiredCertificates,
  downloadCertificate
};
