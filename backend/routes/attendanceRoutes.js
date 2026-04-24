const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/auth');

// ===== ATTENDANCE ROUTES =====

// Create attendance record (Company/Admin only)
router.post('/attendance', verifyToken, attendanceController.createAttendance);

// Get attendance records for a student in an internship
router.get('/attendance/student/:studentId/internship/:internshipId', verifyToken, attendanceController.getAttendanceByStudent);

// Get all attendance records for an internship
router.get('/attendance/internship/:internshipId', verifyToken, attendanceController.getAttendanceByInternship);

// Get attendance summary
router.get('/attendance/summary/:studentId/:internshipId', verifyToken, attendanceController.getAttendanceSummary);

// Update attendance record
router.put('/attendance/:attendanceId', verifyToken, attendanceController.updateAttendance);

// Delete attendance record
router.delete('/attendance/:attendanceId', verifyToken, attendanceController.deleteAttendance);

// ===== LEAVE ROUTES =====

// Request leave
router.post('/leaves', verifyToken, attendanceController.requestLeave);

// Get leaves for a student
router.get('/leaves/student/:studentId', verifyToken, attendanceController.getLeavesByStudent);

// Get leaves for an internship
router.get('/leaves/internship/:internshipId', verifyToken, attendanceController.getLeavesByInternship);

// Get pending leaves for an internship
router.get('/leaves/pending/:internshipId', verifyToken, attendanceController.getPendingLeaves);

// Approve leave
router.put('/leaves/:leaveId/approve', verifyToken, attendanceController.approveLeave);

// Reject leave
router.put('/leaves/:leaveId/reject', verifyToken, attendanceController.rejectLeave);

// Update leave request
router.put('/leaves/:leaveId', verifyToken, attendanceController.updateLeave);

// Delete leave request
router.delete('/leaves/:leaveId', verifyToken, attendanceController.deleteLeave);

module.exports = router;
