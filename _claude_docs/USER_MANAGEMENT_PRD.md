# User Management PRD

## Overview

This document outlines the requirements for implementing admin user management functionality in the Recap application. The feature will allow existing admin users to create and manage other admin users through a dedicated interface on the admin dashboard.

## Background

Currently, the Recap application has:
- Admin users identified by the `isAdmin` boolean field in the Person table
- Admin authentication through cookie-based session management
- An existing admin dashboard at `/admin` with gallery management capabilities
- Basic admin API endpoints for viewing admin users

The missing functionality is the ability for admins to easily create new admin users directly from the admin interface.

## User Stories

### As an admin user
1. I want to view a list of all admin users in the system
2. I want to add new admin users by providing their name, email, and optional phone number
3. I want to see when each admin user was added to the system
4. I want confirmation when a new admin is successfully created
5. I want clear error messages if admin creation fails

## Functional Requirements

### Admin User List
1. **Display Requirements**
   - Show admin users in a table format matching the gallery table design
   - Include columns: Name, Email, Phone, Date Added, Status
   - Sort by most recently added first
   - Show total count of admin users

2. **Data Fields**
   - Name (from person.name)
   - Email (from person.email)
   - Phone (from person.phone) - display "Not provided" if null
   - Date Added (from person.created)
   - Status - "Active" badge for all admins (future: last login activity)

### Create Admin Modal
1. **Modal Trigger**
   - "Add Admin" button in the admin section header
   - Button should use the `faUserPlus` icon
   - Positioned similarly to "Create New Gallery" button

2. **Form Fields**
   - Name (required, text input)
   - Email (required, email input with validation)
   - Phone (optional, tel input with basic formatting)

3. **Form Behavior**
   - All fields start empty
   - Email validation on blur and submit
   - Prevent duplicate email addresses
   - Show loading state during submission
   - Clear form on successful submission

4. **Success Flow**
   - Create person record with isAdmin: true
   - Close modal
   - Refresh admin list
   - Show success toast notification
   - No email verification required for admin-created users

5. **Error Handling**
   - Display inline errors for validation failures
   - Show toast for server errors
   - Keep modal open on error
   - Specific error for duplicate email

## Non-Functional Requirements

### Security
1. Only authenticated admin users can access user management
2. Admin creation requests must use existing `requireAdmin()` middleware
3. No self-demotion allowed (admins cannot remove their own admin status)
4. Admin actions should be logged using existing `logAdminAction()` function

### Performance
1. Admin list should load within 1 second
2. Modal should open instantly
3. Admin creation should complete within 2 seconds
4. List should update without full page reload

### User Experience
1. Consistent with existing admin page design patterns
2. Modal design matches CreateGalleryModal styling
3. Toast notifications for all user feedback
4. Keyboard navigation support (Esc to close modal)
5. Mobile-responsive design

## Technical Requirements

### Database
- No schema changes required
- Use existing Person table with isAdmin field
- Leverage existing personService functions where possible

### API Endpoints
1. **GET /api/admin/admins** (exists)
   - Returns list of admin users
   - Already includes proper filtering and sorting

2. **POST /api/admin/admins** (needs modification)
   - Currently expects personId to promote existing user
   - Should accept: { name, email, phone? }
   - Create new person with isAdmin: true
   - Return created admin user
   - Log action with `logAdminAction()`

### Frontend Components
1. **AdminUsersTable** (new component)
   - Displays admin users in table format
   - Reuses existing table styles from gallery table
   - Shows appropriate status badges

2. **CreateAdminModal** (new component)
   - Modal wrapper similar to CreateGalleryModal
   - Form with name, email, phone inputs
   - Submit and cancel buttons
   - Error display capability

3. **Integration with admin/page.tsx**
   - Add new section below galleries section
   - Include state management for admin list
   - Handle modal open/close state
   - Integrate with existing toast system

## Implementation Phases

### Phase 1: Backend API Enhancement
1. Modify POST /api/admin/admins to accept new user data
2. Add email duplicate checking
3. Implement proper error responses
4. Add admin action logging

### Phase 2: Frontend Components
1. Create CreateAdminModal component
2. Create AdminUsersTable component
3. Add necessary styles

### Phase 3: Integration
1. Update admin page to include user management section
2. Wire up modal and table components
3. Add state management and data fetching
4. Integrate toast notifications

### Phase 4: Testing & Polish
1. Test email validation and duplicate prevention
2. Verify admin permissions
3. Test responsive design
4. Add loading states

## Future Considerations

1. **Admin Roles & Permissions** (Not in scope)
   - Different admin levels (super admin, limited admin)
   - Granular permissions for different actions
   - Role-based access control

2. **Admin Activity Tracking** (Not in scope)
   - Last login tracking
   - Admin action audit log UI
   - Activity analytics

3. **Bulk Operations** (Not in scope)
   - Remove admin access from multiple users
   - Bulk invite admins via CSV
   - Admin access expiration

4. **Enhanced Security** (Not in scope)
   - Two-factor authentication for admins
   - IP whitelisting
   - Session management UI

## Success Metrics

1. Admin users can successfully create new admins
2. No security vulnerabilities introduced
3. UI remains responsive and intuitive
4. Zero data loss during admin creation
5. Clear audit trail of who created which admin

## Edge Cases to Consider

1. Creating admin with existing email address
2. Network failures during submission
3. Invalid email formats
4. Very long names or phone numbers
5. Concurrent admin creation attempts
6. Admin trying to create admin while being logged out

## Dependencies

- Existing admin authentication system
- Person table and personService
- Admin action logging system
- Toast notification system
- Modal component patterns from CreateGalleryModal

## Risks & Mitigations

1. **Risk**: Unauthorized admin creation
   - **Mitigation**: Strict authentication checks, admin action logging

2. **Risk**: Accidental admin privilege grants
   - **Mitigation**: Clear UI labeling, confirmation in success messages

3. **Risk**: Email deliverability issues
   - **Mitigation**: No email verification required for admin-created users

4. **Risk**: Performance degradation with many admins
   - **Mitigation**: Pagination ready for future implementation