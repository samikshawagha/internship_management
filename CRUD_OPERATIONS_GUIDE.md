# CRUD Operations Reference Guide

## Quick Summary

This document provides quick reference for all CRUD (Create, Read, Update, Delete) operations available in the application.

---

## 🔍 INTERNSHIP CRUD OPERATIONS

### CREATE - Add New Internship
**Who**: Company, Admin
**Button**: "➕ Post Internship" (InternshipList page)
**Code**:
```javascript
await crudService.createInternship({
  title: 'Frontend Developer',
  description: 'Build UIs with React',
  company: 'Tech Corp',
  companyId: 101,
  location: 'San Francisco, CA',
  duration: '3 months',
  stipend: '$4,000/month',
  skills: ['React', 'JavaScript'],
  startDate: '2025-06-01',
  endDate: '2025-08-31'
});
```

### READ - Get Internships
**Who**: Everyone
**Locations**: InternshipList, Dashboard, Home

**Get All**:
```javascript
const response = await crudService.getInternships();
// Returns: array of all internships
```

**Get by ID**:
```javascript
const response = await crudService.getInternshipById(1);
// Returns: single internship object
```

**Search**:
```javascript
const response = await crudService.searchInternships('React');
// Returns: internships matching 'React'
```

**Filter Options**:
```javascript
const response = await crudService.getInternships({
  status: 'open',           // or 'closed'
  company: 'Tech Corp',
  skills: ['React', 'Node.js']
});
```

### UPDATE - Edit Internship
**Who**: Company (own), Admin (all)
**Button**: "Edit" (InternshipList page)
**Code**:
```javascript
await crudService.updateInternship(1, {
  title: 'Senior Frontend Developer',
  stipend: '$5,000/month',
  status: 'closed'
});
```

### DELETE - Remove Internship
**Who**: Company (own), Admin (all)
**Button**: "Delete" (InternshipList page)
**Code**:
```javascript
await crudService.deleteInternship(1);
// Shows confirmation modal before deletion
```

---

## 📝 APPLICATION CRUD OPERATIONS

### CREATE - Submit Application
**Who**: Student
**Button**: "Apply" (InternshipDetail page)
**Code**:
```javascript
await crudService.createApplication({
  studentId: 1,
  studentName: 'Alice Johnson',
  internshipId: 1,
  internshipTitle: 'Frontend Developer',
  company: 'Tech Corp',
  coverLetter: 'I am very interested...'
});
```

### READ - Get Applications
**Student - Own Applications**:
```javascript
const response = await crudService.getStudentApplications(userId);
// Returns: array of student's applications
```

**Company - Applications to Their Postings**:
```javascript
const response = await crudService.getInternshipApplications(internshipId);
// Returns: array of applications to specific internship
```

**Admin - All Applications**:
```javascript
const response = await crudService.getAllApplications();
// Returns: array of all applications
```

**Get Single Application**:
```javascript
const response = await crudService.getApplicationById(1);
// Returns: single application object
```

### UPDATE - Change Application Status
**Who**: Company (on their internships), Admin (all)
**Button**: Dialog/Modal on applications page
**Code**:
```javascript
await crudService.updateApplicationStatus(1, 'accepted');
// Status options: 'pending', 'accepted', 'rejected'
```

### DELETE - Withdraw Application
**Who**: Student (own pending), Admin (all)
**Button**: "Withdraw" (MyApplications page)
**Code**:
```javascript
await crudService.deleteApplication(1);
// Shows confirmation modal before deletion
// Only works on 'pending' applications
```

---

## 📊 UTILITY OPERATIONS

### Get Dashboard Statistics
```javascript
const response = await crudService.getStatistics();
// Returns:
// {
//   totalInternships: 5,
//   openInternships: 4,
//   totalApplications: 6,
//   pendingApplications: 2,
//   acceptedApplications: 3,
//   rejectedApplications: 1
// }
```

### Get Role-Specific Dashboard Data
```javascript
// For Student
const response = await crudService.getDashboardData(userId, 'student');
// Returns: applications + stats

// For Company
const response = await crudService.getDashboardData(userId, 'company');
// Returns: internships + applications + stats

// For Admin
const response = await crudService.getDashboardData(userId, 'admin');
// Returns: all internships + all applications + stats
```

### Reset to Dummy Data
```javascript
await crudService.resetData();
// Useful for testing - resets all data to original dummy values
```

---

## ⚙️ ERROR HANDLING

All CRUD operations return Promises with success/error handling:

```javascript
try {
  const response = await crudService.createInternship(data);
  console.log('Success:', response.data);
} catch (error) {
  console.error('Error:', error.message);
  // Display error to user
}
```

**Common Error Messages**:
- "Internship not found"
- "Application not found"
- "You have already applied to this internship"
- "Failed to withdraw application"

---

## 🎯 CRUD Matrix by Role

| Operation | Student | Company | Admin |
|-----------|---------|---------|-------|
| **Internship Create** | ❌ | ✅ (own) | ✅ |
| **Internship Read** | ✅ | ✅ | ✅ |
| **Internship Update** | ❌ | ✅ (own) | ✅ |
| **Internship Delete** | ❌ | ✅ (own) | ✅ |
| **Application Create** | ✅ | ❌ | ❌ |
| **Application Read** | ✅ (own) | ✅ (incoming) | ✅ |
| **Application Update** | ❌ | ✅ (to own) | ✅ |
| **Application Delete** | ✅ (own pending) | ❌ | ✅ |

---

## 🔗 Data Loss Prevention

**Confirmation Modals for Destructive Operations**:
- Delete Internship: Requires confirmation
- Withdraw Application: Requires confirmation with details
- Update Status to Rejected: Confirmation (optional to implement)

---

## 📱 Component Examples

### Using CRUD in Component
```javascript
import { crudService } from '../services/crudService';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await crudService.getInternships();
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Create/Update
  const handleSave = async (formData) => {
    try {
      const response = await crudService.createInternship(formData);
      setData([...data, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await crudService.deleteInternship(id);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // JSX here
  );
};
```

---

## 🚀 Best Practices

1. **Always use try-catch** for async operations
2. **Show loading indicators** during operations
3. **Display success/error messages** to users
4. **Validate data** before sending to CRUD service
5. **Update local state** after successful operations
6. **Confirm destructive operations** before execution
7. **Handle edge cases** like duplicate applications
8. **Refresh data** after create/update/delete operations

---

## 📞 Common Issues & Solutions

### Issue: Application shows but not in list after creation
**Solution**: Call `loadApplications()` to refresh the list after creation

### Issue: Delete succeeds but component not updated
**Solution**: Remove from local state after successful API call
```javascript
setApplications(apps.filter(a => a.id !== deletedId));
```

### Issue: Multiple CRUD calls failing silently
**Solution**: Always add error handlers and console logs
```javascript
catch (err) {
  console.error('Full error:', err);
  setError(err.message);
}
```

---

**Version**: 1.0
**Last Updated**: February 16, 2026
