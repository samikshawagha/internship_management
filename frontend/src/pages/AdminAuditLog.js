import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crudService } from '../services/crudService';
import {
  Container, Row, Col, Card, Button, Form, Alert, 
  Table, Badge, Modal, InputGroup, Pagination
} from 'react-bootstrap';
import { FaHistory, FaSearch, FaFilter, FaDownload, FaEye } from 'react-icons/fa';

const AdminAuditLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const logsPerPage = 20;

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, filterAction, filterUser, filterDate]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      
      // Generate mock audit logs based on existing data
      const [usersResponse, internshipsResponse, applicationsResponse] = await Promise.all([
        crudService.getAllUsers(),
        crudService.getInternships(),
        crudService.getAllApplications()
      ]);

      const mockLogs = generateMockAuditLogs(
        usersResponse.data, 
        internshipsResponse.data, 
        applicationsResponse.data
      );
      
      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAuditLogs = (users, internships, applications) => {
    const logs = [];
    let logId = 1;

    // Generate logs for user registrations
    users.forEach(user => {
      logs.push({
        id: logId++,
        timestamp: new Date(user.createdAt).toISOString(),
        action: 'USER_REGISTERED',
        category: 'Authentication',
        user: user.fullName,
        userId: user.id,
        userRole: user.role,
        description: `New ${user.role} account created`,
        ipAddress: generateRandomIP(),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          email: user.email,
          role: user.role,
          registrationMethod: 'web'
        },
        severity: 'info'
      });
    });

    // Generate logs for internship creation
    internships.forEach(internship => {
      const company = users.find(u => u.role === 'company');
      if (company) {
        logs.push({
          id: logId++,
          timestamp: new Date(internship.postedDate).toISOString(),
          action: 'INTERNSHIP_CREATED',
          category: 'Content Management',
          user: company.fullName,
          userId: company.id,
          userRole: 'company',
          description: `New internship "${internship.title}" posted`,
          ipAddress: generateRandomIP(),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: {
            internshipId: internship.id,
            title: internship.title,
            company: internship.company,
            location: internship.location
          },
          severity: 'info'
        });
      }
    });

    // Generate logs for applications
    applications.forEach(application => {
      const student = users.find(u => u.id === application.studentId);
      if (student) {
        logs.push({
          id: logId++,
          timestamp: new Date(application.appliedDate).toISOString(),
          action: 'APPLICATION_SUBMITTED',
          category: 'Application Management',
          user: student.fullName,
          userId: student.id,
          userRole: 'student',
          description: `Application submitted for "${application.internshipTitle}"`,
          ipAddress: generateRandomIP(),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: {
            applicationId: application.id,
            internshipTitle: application.internshipTitle,
            company: application.company,
            status: application.status
          },
          severity: 'info'
        });

        // Add status update logs if not pending
        if (application.status !== 'pending') {
          logs.push({
            id: logId++,
            timestamp: new Date(application.updatedDate).toISOString(),
            action: 'APPLICATION_STATUS_UPDATED',
            category: 'Application Management',
            user: 'System Admin',
            userId: 1,
            userRole: 'admin',
            description: `Application status changed to "${application.status}"`,
            ipAddress: generateRandomIP(),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            details: {
              applicationId: application.id,
              oldStatus: 'pending',
              newStatus: application.status,
              internshipTitle: application.internshipTitle
            },
            severity: application.status === 'accepted' ? 'success' : 'warning'
          });
        }
      }
    });

    // Add some admin actions
    const adminActions = [
      {
        action: 'ADMIN_LOGIN',
        category: 'Authentication',
        description: 'Admin user logged in',
        severity: 'info'
      },
      {
        action: 'SETTINGS_