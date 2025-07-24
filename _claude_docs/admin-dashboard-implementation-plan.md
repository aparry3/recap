# Implementation Plan for Option 3: Lightweight Admin Dashboard

## Overview
This document outlines the implementation plan for adding a lightweight admin dashboard to the Recap application, based on Option 3 from the USER_MANAGEMENT_ANALYSIS.md document.

## Timeline
- **Total Duration**: 2-3 days
- **Approach**: Phased implementation with immediate value delivery

## Phase 1: Database & Core Infrastructure (Day 1)

### 1.1 Database Migration
- Add `is_admin` boolean column to `person` table
- Create `admin_actions` table for audit logging
- Update database types and services

### 1.2 Admin Authentication & Middleware
- Create admin route middleware (`/app/admin/_middleware.ts`)
- Update person service to include admin status
- Migrate existing admin users (those with @ourweddingrecap.com emails)

### 1.3 Update Existing Code
- Replace email-based admin detection with `is_admin` flag
- Update gallery creation flow to use new admin status

## Phase 2: Admin Dashboard UI (Day 2)

### 2.1 Dashboard Layout
- Create admin layout component with sidebar navigation
- Design consistent admin UI theme using existing SCSS patterns
- Implement responsive design for mobile admin access

### 2.2 Core Pages Structure
- `/admin` - Dashboard home with stats and activity
- `/admin/users` - User management
- `/admin/galleries` - Gallery management
- `/admin/tools` - Export, metrics, bulk operations
- `/admin/logs` - Activity audit logs

### 2.3 Quick Actions Implementation
- "Create Gallery for User" form with email lookup
- Bulk invite functionality
- Quick stats widgets (total users, galleries, photos, revenue)

## Phase 3: Feature Implementation (Day 3)

### 3.1 User Management
- Search/filter functionality with pagination
- User detail view showing galleries and activity
- Toggle admin status with confirmation
- Email verification status management

### 3.2 Gallery Management
- Gallery browser with filtering options
- Gallery stats (photos, participants, activity)
- Edit gallery details inline
- Manage gallery participants

### 3.3 Admin Tools & Logging
- CSV export for users and galleries
- System metrics dashboard
- Activity logging for all admin actions
- Bulk email functionality (if needed)

## Technical Implementation Details

### Database Schema Changes
```sql
-- Add admin flag to person table
ALTER TABLE person ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create admin actions log
CREATE TABLE admin_actions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR NOT NULL REFERENCES person(id),
  action VARCHAR NOT NULL,
  target_type VARCHAR,
  target_id VARCHAR,
  metadata JSONB,
  created TIMESTAMP DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_created ON admin_actions(created DESC);

-- Migrate existing admin users
UPDATE person 
SET is_admin = TRUE 
WHERE email LIKE '%@ourweddingrecap.com';
```

### Key Components Structure
```
src/
  app/
    admin/
      layout.tsx          # Admin layout with sidebar
      page.tsx           # Dashboard home
      users/
        page.tsx         # User list
        [userId]/
          page.tsx       # User detail
      galleries/
        page.tsx         # Gallery list
        [galleryId]/
          page.tsx       # Gallery detail
      tools/
        page.tsx         # Admin tools
      logs/
        page.tsx         # Activity logs
  components/
    admin/
      AdminSidebar.tsx
      AdminHeader.tsx
      StatsCard.tsx
      UserTable.tsx
      GalleryTable.tsx
      ActivityFeed.tsx
  lib/
    admin/
      middleware.ts      # Admin auth check
      actions.ts         # Admin-specific actions
  helpers/
    api/
      adminClient.ts     # Admin API client
```

### API Endpoints
```
/api/admin/stats          # Dashboard statistics
/api/admin/users          # User management
/api/admin/galleries      # Gallery management
/api/admin/actions        # Activity logs
/api/admin/tools/export   # Data export
```

### Security Considerations
- All admin routes protected by middleware
- Admin actions logged with full context
- Sensitive operations require confirmation
- Rate limiting on bulk operations
- Regular audit of admin access logs

## Migration Strategy
1. Deploy database changes first
2. Run migration to set `is_admin=true` for existing admin emails
3. Deploy new admin dashboard
4. Update existing admin detection code
5. Monitor and adjust based on usage

## Key Features by Priority

### High Priority
- Admin flag in database
- Basic admin authentication
- Create gallery for any user
- User list with search
- Gallery list with filters
- Activity logging

### Medium Priority
- Dashboard with stats
- User detail pages
- Gallery management
- Bulk operations
- Export functionality

### Low Priority
- Email tools
- Advanced metrics
- Custom reports
- API usage stats

## Success Metrics
- Reduction in time to create galleries for users
- Improved visibility into system usage
- Faster response to user issues
- Better tracking of admin activities

## Implementation Notes

### Admin Detection Update
Replace current email-based detection:
```typescript
// OLD
const isAdmin = person?.email?.endsWith('ourweddingrecap.com') || false

// NEW
const isAdmin = person?.is_admin || false
```

### Activity Logging Example
```typescript
async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: any
) {
  await insertAdminAction({
    id: uuidv4(),
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata,
    created: new Date()
  })
}
```

### Quick Action: Create Gallery for User
1. Admin enters user email
2. System checks if user exists
3. If new user, create person record
4. Create gallery with admin as creator
5. Log action with metadata
6. Send welcome email to user

## Risks and Mitigations
- **Risk**: Breaking existing admin functionality
  - **Mitigation**: Careful migration with fallback to email detection
- **Risk**: Unauthorized admin access
  - **Mitigation**: Strong authentication and audit logging
- **Risk**: Performance impact
  - **Mitigation**: Efficient queries with proper indexing

## Future Enhancements
- Role-based permissions (super admin, support, etc.)
- API key management for integrations
- Advanced analytics and reporting
- Automated admin tasks
- Integration with customer support tools

This plan provides a practical approach to implementing admin functionality while maintaining the application's simplicity and leaving room for future growth.