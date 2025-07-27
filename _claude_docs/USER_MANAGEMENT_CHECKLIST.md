# User Management Implementation Checklist

## Overview
Step-by-step implementation guide for adding admin user management to the admin dashboard.

## Phase 1: Backend API Enhancement ✓

### 1.1 Update Admin POST Endpoint
- [x] Modify `/src/app/api/admin/admins/route.ts` POST handler
- [x] Accept object with `{ name, email, phone? }` instead of just `personId`
- [x] Check if email already exists using `selectPersonByEmail()`
- [x] Create new person with `isAdmin: true` if email doesn't exist
- [x] Return appropriate error if email already exists
- [x] Log admin action with details of who was created

## Phase 2: Frontend Components ✓

### 2.1 Create Admin Modal Component
- [x] Create `/src/app/admin/CreateAdminModal.tsx`
- [x] Copy structure from `CreateGalleryModal.tsx` as template
- [x] Implement form fields:
  - [x] Name input (required)
  - [x] Email input (required, with validation)
  - [x] Phone input (optional)
- [x] Add form validation
- [x] Handle submission to POST endpoint
- [x] Show loading state during submission
- [x] Handle success/error responses

### 2.2 Create Admin Modal Styles
- [x] Create `/src/app/admin/CreateAdminModal.module.scss`
- [x] Reuse modal styles from CreateGalleryModal
- [x] Ensure consistent button and input styling

### 2.3 Update Admin Client
- [x] Update `/src/helpers/api/adminClient.ts`
- [x] Add `createAdmin()` function for POST request
- [x] Include proper TypeScript types

## Phase 3: Admin Page Integration ✓

### 3.1 Update Admin Page Component
- [x] Update `/src/app/admin/page.tsx`
- [x] Add state for admin users list
- [x] Add state for create admin modal visibility
- [x] Fetch admin users on component mount
- [x] Add admin users section below galleries section

### 3.2 Add Admin Users Table
- [x] Create table matching gallery table structure
- [x] Display columns: Name, Email, Phone, Date Added
- [x] Add "Add Admin" button in section header
- [x] Show total count of admin users
- [x] Handle empty state

### 3.3 Wire Up Modal
- [x] Import and use CreateAdminModal component
- [x] Handle modal open/close
- [x] Refresh admin list on successful creation
- [x] Show success toast notification

## Phase 4: Testing & Validation

### 4.1 Functional Testing
- [ ] Test creating admin with valid data
- [ ] Test email validation
- [ ] Test duplicate email prevention
- [ ] Test optional phone field
- [ ] Test modal cancel functionality

### 4.2 Security Testing
- [ ] Verify non-admin users cannot access endpoint
- [ ] Verify admin actions are logged
- [ ] Test with malformed requests

### 4.3 UI Testing
- [ ] Test responsive design on mobile
- [ ] Test keyboard navigation
- [ ] Test loading states
- [ ] Test error states
- [ ] Verify toast notifications work

## Phase 5: Documentation & Cleanup

### 5.1 Code Documentation
- [ ] Add JSDoc comments to new functions
- [ ] Document any complex logic
- [ ] Update this checklist with completion status

### 5.2 Final Checks
- [ ] Run linter and fix any issues
- [ ] Run type checker and fix any issues
- [ ] Test full flow one more time
- [ ] Verify no console errors or warnings

## Completion Criteria

- [ ] Admin can view list of all admin users
- [ ] Admin can click "Add Admin" to open modal
- [ ] Admin can fill out form and create new admin user
- [ ] New admin appears in list immediately
- [ ] Toast notification confirms success
- [ ] Duplicate emails are prevented with clear error
- [ ] All admin actions are logged
- [ ] UI is responsive and matches existing design

## Notes

- Keep the implementation simple - no role management for now
- Reuse existing patterns from gallery management
- Email verification is not required for admin-created users
- Focus on security - all actions must be properly authenticated