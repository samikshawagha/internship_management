# User Session & Role-Based Redirect Implementation

## Overview
Implemented comprehensive user session management and role-based redirects after login. Users are now automatically directed to their appropriate dashboard based on their role.

## Changes Made

### 1. **JWT Decoder Utility** (`frontend/src/utils/jwtDecoder.js`)
**New file created** - Provides JWT token manipulation utilities:
- `decodeJWT(token)` - Decodes JWT token and extracts payload
- `getRoleFromToken(token)` - Extracts user role from token
- `getRedirectPathByRole(role)` - Returns appropriate dashboard path based on role

### 2. **Enhanced AuthContext** (`frontend/src/context/AuthContext.js`)
**Updated** with improved session management:
- **Token Storage**: Token saved to `localStorage`
- **Role Storage**: User role saved to `localStorage` for quick access
- **User Data Storage**: Full user data persisted in `localStorage`
- **Login Return Value**: Now returns `{ success, user }` instead of just `{ success }`
- **Logout Enhancement**: Clears token, role, and user data from `localStorage`
- **Profile Fetch**: Stores user role to `localStorage` when fetching profile

### 3. **Role-Based Login Redirect** (`frontend/src/pages/Login.js`)
**Updated** to implement intelligent routing:
- Imports and uses `getRedirectPathByRole` utility
- On successful login, redirects based on user role:
  - **Student** → `/dashboard`
  - **Company** → `/company-dashboard`
  - **Admin** → `/admin-dashboard`

### 4. **New Dashboard Components**

#### Company Dashboard (`frontend/src/pages/CompanyDashboard.js`)
**New file created** - Tailored for company users:
- Company-specific greeting and icons
- Quick action button to create internships
- Company stats display (total internships, applications, etc.)
- Link to manage internships
- Success-themed badge colors

#### Admin Dashboard (`frontend/src/pages/AdminDashboard.js`)
**New file created** - Tailored for admin users:
- Admin-specific greeting and icons
- System-wide statistics overview
- System information display (admin name, email)
- Admin access information
- Danger-themed badge colors

### 5. **Enhanced Routing** (`frontend/src/App.js`)
**Updated** with role-specific route protection:
- Imports and mounts new dashboard components
- Added `/dashboard` route (protected for students)
- Added `/company-dashboard` route (protected for companies)
- Added `/admin-dashboard` route (protected for admins)
- Added `/unauthorized` route for access denied scenarios
- Enhanced `ProtectedRoute` component to redirect to `/unauthorized` instead of `/dashboard`
- Conditional routing ensures only authenticated users see protected routes

### 6. **Enhanced Navbar** (`frontend/src/components/Navbar.js`)
**Updated** with role-aware navigation:
- Displays user role as a color-coded badge
  - Student: Info (Blue)
  - Company: Success (Green)
  - Admin: Danger (Red)
- Dynamic dashboard link based on user role
- Shows user's full name in greeting
- Role-specific navigation options maintained
- Improved visual hierarchy with badge display

## User Flow

### Login Process
```
User Submits Login → Backend Authenticates → JWT Token Created
↓
Token + User Data Returned → Stored in localStorage
↓
Auth Context Updated → User Role Decoded
↓
Login Component Redirects → Role-Based Dashboard
```

### Session Persistence
```
Page Reload → Token Retrieved from localStorage
↓
Auth Context Checks Token Valid
↓
Automatic Profile Fetch & User Role Stored
↓
User Stays Logged In with Role Information
```

### Logout Process
```
User Clicks Logout → Auth Context Logout Called
↓
Token, Role, User Data Removed from localStorage
↓
Navigation Redirects to Login Page
↓
New Session Required
```

## Storage Details

### localStorage Keys Used
- `token` - JWT authentication token (24h expiration on backend)
- `userRole` - User's assigned role (student|company|admin)
- `userData` - Complete user object as JSON string

### Data Preserved
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "student|company|admin",
  "fullName": "User Full Name",
  "phone": "User Phone Number",
  "createdAt": "timestamp"
}
```

## Role Definitions

### Student Role
- Access: `/dashboard` (Student Dashboard)
- Permissions: View internships, apply to positions, view applications
- Dashboard: General statistics and application tracking

### Company Role
- Access: `/company-dashboard` (Company Dashboard)
- Permissions: Create internships, manage listings, view applications
- Dashboard: Company-specific statistics and quick create button

### Admin Role
- Access: `/admin-dashboard` (Admin Dashboard)
- Permissions: System-wide visibility and management
- Dashboard: Overall system statistics and information

## Security Features
1. ✅ Token-based authentication with JWT
2. ✅ Role-based access control (RBAC)
3. ✅ Protected routes requiring valid user and role
4. ✅ Unauthorized access redirects to dedicated page
5. ✅ Automatic cleanup on logout
6. ✅ Token stored securely in localStorage (backend enforces 24h expiration)

## Testing Checklist
- [ ] Login with student account → Redirects to `/dashboard` ✅
- [ ] Login with company account → Redirects to `/company-dashboard` ✅
- [ ] Login with admin account → Redirects to `/admin-dashboard` ✅
- [ ] Navigation bar shows correct role badge
- [ ] Dashboard link in navbar goes to appropriate dashboard
- [ ] Logout clears all session data
- [ ] Page refresh maintains session
- [ ] Accessing wrong dashboard redirects to `/unauthorized`
- [ ] Token stored in localStorage
- [ ] User role stored in localStorage
