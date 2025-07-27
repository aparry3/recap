# Admin Page Implementation Checklist

## Overview
This checklist provides step-by-step implementation tasks for enhancing the admin page functionality based on the simplified RFC.

## Phase 1: Fix Admin Page UI Layout ✓

### 1.1 Create Admin API Client
- [x] Create new file `/src/helpers/api/adminClient.ts`
- [x] Define interfaces:
  - [x] `GalleryWithStats` interface
  - [x] `UserWithAccess` interface
- [x] Implement functions:
  - [x] `fetchAdminGalleries()` - GET request to `/api/admin/galleries`
  - [x] `fetchAdminUsers()` - GET request to `/api/admin/admins`
- [x] Export all functions and interfaces

### 1.2 Fix Admin Page Component
- [x] Update `/src/app/admin/page.tsx`:
  - [x] Import `fetchAdminGalleries` and `fetchAdminUsers` from adminClient
  - [x] Remove commented out mock data in useEffect
  - [x] Fix layout components:
    - [x] Change main content wrapper from `Container` to `Column`
    - [x] Change section wrappers from `Container` to `Column`
  - [x] Add proper loading state handling
  - [x] Implement gallery search functionality with debouncing
  - [x] Add `getStatus()` function for active/inactive badges
  - [x] Update gallery table to show all required columns
  - [x] Update admin table to show all required columns

### 1.3 Update Admin Page Styles
- [x] Verify `/src/app/admin/page.module.scss` has all required styles:
  - [x] `.adminPage` - main page container
  - [x] `.content` - content wrapper
  - [x] `.section` - section containers
  - [x] `.searchContainer` and `.searchWrapper` - search styling
  - [x] `.tableContainer` and `.table` - table styling
  - [x] `.status` with `.active` and `.inactive` variants
  - [x] `.role` for admin badges
  - [x] `.actionButton` for table actions

## Phase 2: Database Schema Update

### 2.1 Create Migration
- [x] Create new migration file `/migrations/20250725000000_add_gallery_creator.ts`
- [x] Add migration up function:
  - [x] Add `created_by` column to gallery table
  - [x] Add foreign key reference to person.id
  - [x] Add `ON DELETE SET NULL` constraint
  - [x] Create index `gallery_created_by_idx`
- [x] Add migration down function:
  - [x] Drop index `gallery_created_by_idx`
  - [x] Drop column `created_by`
- [x] Run migration: `tsx migrate.ts up`

### 2.2 Update Type Definitions
- [x] Update `/src/lib/types/Gallery.ts`:
  - [x] Add `createdBy?: string` to `GalleryTable` interface
  - [x] Ensure `NewGalleryData` type includes optional `createdBy`

## Phase 3: Update Gallery Creation Logic

### 3.1 Update Gallery Service
- [x] Update `/src/lib/db/galleryService.ts`:
  - [x] Modify `insertGallery()` to include `createdBy` field if provided
  - [x] Ensure the field is properly passed to the database insert

### 3.2 Update Gallery Creation API
- [x] Update `/src/app/api/galleries/route.ts`:
  - [x] Add logic to set `createdBy` field:
    - [x] Use `newGallery.createdBy` if provided
    - [x] Default to `newGallery.personId` for regular users
  - [x] Ensure field is passed to `insertGallery()`

## Phase 4: Admin Gallery Management Endpoints

### 4.1 Update Admin Galleries GET Endpoint
- [x] Update `/src/app/api/admin/galleries/route.ts` GET handler:
  - [x] Add proper gallery stats query with joins
  - [x] Include contributor count using `galleryPerson` join
  - [x] Include photo count using `galleryMedia` join
  - [x] Add search functionality for gallery names
  - [x] Implement pagination with limit and offset
  - [x] Return formatted response with counts as numbers

### 4.2 Create Admin Gallery POST Endpoint
- [x] Add POST handler to `/src/app/api/admin/galleries/route.ts`:
  - [x] Validate required fields (ownerName, ownerEmail, galleryName)
  - [x] Find or create person by email
  - [x] Create gallery with:
    - [x] Generated password
    - [x] Formatted path (lowercase, hyphenated)
    - [x] `createdBy` set to admin.id
    - [x] Optional wedding date, TheKnot, and Zola URLs
  - [x] Handle wedding website scraping if URLs provided
  - [x] Add person to gallery
  - [x] Send welcome email to gallery owner
  - [x] Return gallery object and email status

## Phase 5: Update Create Page for Admin Mode

### 5.1 Modify Create Page
- [ ] Update `/src/app/create/page.tsx`:
  - [ ] Add check in `submitGallery()` for admin creating for others
  - [ ] If admin and different email:
    - [ ] Call POST `/api/admin/galleries` endpoint
    - [ ] Handle response and set gallery state
    - [ ] Skip payment flow
  - [ ] For regular flow, add `createdBy: person?.id` to gallery data

## Phase 6: Admin-Specific Features

### 6.1 Add Gallery Action Buttons
- [x] Update admin page gallery table actions:
  - [x] Import additional icons (`faEye`, `faLink`)
  - [x] Replace single ellipsis button with action buttons:
    - [x] View button - opens gallery in new tab with password
    - [x] Copy Link button - copies full URL with password to clipboard
  - [x] Add proper titles/tooltips to buttons
  - [x] Style buttons appropriately

### 6.2 Add Toast Notifications (Optional)
- [x] Consider adding toast for successful link copy
- [x] Consider adding toast for API errors

## Testing Checklist

### UI Testing
- [ ] Admin page loads without errors
- [ ] Gallery table displays with proper data
- [ ] Admin table displays with proper data
- [ ] Search functionality filters galleries
- [ ] Status badges show correct active/inactive state
- [ ] Action buttons work correctly

### Database Testing
- [ ] Migration runs successfully
- [ ] `created_by` column exists in gallery table
- [ ] Foreign key constraint works properly
- [ ] Index is created successfully

### API Testing
- [ ] GET `/api/admin/galleries` returns gallery data with stats
- [ ] POST `/api/admin/galleries` creates gallery successfully
- [ ] Email is sent to gallery owner
- [ ] Gallery is properly linked to owner

### End-to-End Testing
- [ ] Admin can access admin page
- [ ] Admin can view all galleries with stats
- [ ] Admin can search for galleries
- [ ] Admin can create gallery for another user
- [ ] Gallery owner receives welcome email
- [ ] Admin can view created gallery
- [ ] Admin can copy gallery link

## Deployment Checklist
- [ ] Run database migration in production
- [ ] Deploy updated API endpoints
- [ ] Deploy updated frontend code
- [ ] Verify admin users have proper access
- [ ] Test full flow in production

## Notes
- Keep implementation simple - no audit logging for now
- Reuse existing components and flows where possible
- Focus on core functionality first
- Ensure proper error handling throughout