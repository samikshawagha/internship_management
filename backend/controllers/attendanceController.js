const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// ===== ATTENDANCE ENDPOINTS =====

exports.createAttendance = async (req, res) => {
  try {
    const { studentId, internshipId, date, status, remarks } = req.body;

    if (!studentId || !internshipId || !date) {
      return res.status(400).json({ message: 'Student ID, Internship ID, and Date are required' });
    }

    if (!['present', 'absent', 'leave', 'late'].includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const attendance = await Attendance.create({
      studentId,
      internshipId,
      date,
      status,
      remarks
    });

    res.status(201).json({
      message: 'Attendance record created successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating attendance record', error: error.message });
  }
};

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId, internshipId } = req.params;

    const attendance = await Attendance.findByStudentAndInternship(studentId, internshipId);

    res.status(200).json({
      message: 'Attendance records retrieved successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendance records', error: error.message });
  }
};

exports.getAttendanceByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const attendance = await Attendance.findByInternship(internshipId);

    res.status(200).json({
      message: 'Attendance records retrieved successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendance records', error: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, remarks } = req.body;

    if (!['present', 'absent', 'leave', 'late'].includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const attendance = await Attendance.update(attendanceId, { status, remarks });

    res.status(200).json({
      message: 'Attendance record updated successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance record', error: error.message });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { studentId, internshipId } = req.params;

    const summary = await Attendance.getAttendanceSummary(studentId, internshipId);

    res.status(200).json({
      message: 'Attendance summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendance summary', error: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    await Attendance.delete(attendanceId);

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attendance record', error: error.message });
  }
};

// ===== LEAVE ENDPOINTS =====

exports.requestLeave = async (req, res) => {
  try {
    const { studentId, internshipId, startDate, endDate, reason, leaveType } = req.body;

    if (!studentId || !internshipId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Student ID, Internship ID, Start Date, and End Date are required' });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const leave = await Leave.create({
      studentId,
      internshipId,
      startDate,
      endDate,
      reason,
      leaveType
    });

    res.status(201).json({
      message: 'Leave request submitted successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting leave request', error: error.message });
  }
};

exports.getLeavesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const leaves = await Leave.findByStudent(studentId);

    res.status(200).json({
      message: 'Leave records retrieved successfully',
      data: leaves
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leave records', error: error.message });
  }
};

exports.getLeavesByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const leaves = await Leave.findByInternship(internshipId);

    res.status(200).json({
      message: 'Leave records retrieved successfully',
      data: leaves
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leave records', error: error.message });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { approverComments } = req.body;

    const leave = await Leave.updateStatus(leaveId, 'approved', approverComments);

    res.status(200).json({
      message: 'Leave request approved successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving leave request', error: error.message });
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { approverComments } = req.body;

    const leave = await Leave.updateStatus(leaveId, 'rejected', approverComments);

    res.status(200).json({
      message: 'Leave request rejected successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting leave request', error: error.message });
  }
};

exports.getPendingLeaves = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const leaves = await Leave.getPendingLeaves(internshipId);

    res.status(200).json({
      message: 'Pending leave requests retrieved successfully',
      data: leaves
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pending leaves', error: error.message });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { startDate, endDate, reason, leaveType } = req.body;

    const leave = await Leave.update(leaveId, {
      startDate,
      endDate,
      reason,
      leaveType
    });

    res.status(200).json({
      message: 'Leave request updated successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave request', error: error.message });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    await Leave.delete(leaveId);

    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting leave request', error: error.message });
  }
};
