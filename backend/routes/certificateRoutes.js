const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create a new certificate
router.post('/', verifyToken, upload.single('certificateFile'), certificateController.createCertificate);

// Get certificate by ID
router.get('/:id', verifyToken, certificateController.getCertificateById);

// Get certificate by certificate number
router.get('/number/:certificateNumber', verifyToken, certificateController.getCertificateByNumber);

// Get all certificates for a student
router.get('/student/:studentId', verifyToken, certificateController.getStudentCertificates);

// Get all certificates for an internship
router.get('/internship/:internshipId', verifyToken, certificateController.getInternshipCertificates);

// Get certificates by status
router.get('/status/:status', verifyToken, certificateController.getCertificatesByStatus);

// Get certificates by level
router.get('/level/:issueLevel', verifyToken, certificateController.getCertificatesByLevel);

// Get all active certificates
router.get('/active/list', verifyToken, certificateController.getActiveCertificates);

// Get all expired certificates
router.get('/expired/list', verifyToken, certificateController.getExpiredCertificates);

// Download certificate file
router.get('/download/:id', verifyToken, certificateController.downloadCertificate);

// Update certificate
router.put('/:id', verifyToken, upload.single('certificateFile'), certificateController.updateCertificate);

// Delete certificate
router.delete('/:id', verifyToken, certificateController.deleteCertificate);

module.exports = router;
