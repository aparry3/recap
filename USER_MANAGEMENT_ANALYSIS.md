# User Management and Gallery Creation Analysis

## Current System Architecture

### Overview
The application is a collaborative photo gallery platform built with Next.js 14, using PostgreSQL for data storage and AWS S3 for media files. The system currently has a basic user management structure with limited admin capabilities.

### Database Schema

#### Core Tables
1. **person** - Stores user information
   - `id` (varchar, primary key)
   - `name` (varchar, not null)
   - `email` (varchar, optional)
   - `phone` (varchar, optional) 
   - `created` (timestamp)

2. **gallery** - Stores gallery information
   - `id` (varchar, primary key)
   - `name` (varchar, not null)
   - `path` (varchar, not null) - URL path for gallery
   - `date` (date, optional) - Event date
   - `person_id` (varchar, foreign key to person) - Creator ID
   - `created` (timestamp)
   - `password` (varchar) - Access password
   - `zola` (varchar, optional) - Zola website URL
   - `theknot` (varchar, optional) - The Knot website URL

3. **gallery_person** - Junction table for gallery participants
   - `gallery_id` (varchar, foreign key)
   - `person_id` (varchar, foreign key)
   - `cover_photo_id` (varchar, optional)
   - `receive_messages` (boolean, optional)

4. **verification** - Email verification system
   - `id` (varchar, primary key)
   - `person_id` (varchar, foreign key)
   - `gallery_id` (varchar, optional)
   - `verified` (boolean)

### Current User Management

#### User Types
Currently, there are only two implicit user types:
1. **Regular Users** - Can create galleries (with payment), upload photos, and participate in galleries
2. **Admin Users** - Identified by email domain (`@ourweddingrecap.com`), can create galleries without payment

#### Admin Detection
Admin status is determined in `src/app/create/page.tsx`:
```typescript
const isAdmin = useMemo(() => {
  return person?.email?.endsWith('ourweddingrecap.com') || false
}, [person])
```

#### Admin Privileges
- Skip payment process when creating galleries
- Skip email verification when creating galleries for others
- Can create galleries on behalf of other users
- UI shows "Admin - Create a" prefix in gallery creation form

### Gallery Creation Flow

#### Regular User Flow
1. User enters gallery details (name, email, registry links)
2. System checks if email exists in database
3. If existing user: sends verification email
4. If new user: proceeds to Stripe payment ($4.99)
5. After payment/verification: creates gallery
6. User receives welcome email with gallery details

#### Admin Flow
1. Admin enters gallery details for any email
2. System skips payment and verification
3. Gallery is created immediately
4. Target user receives welcome email

### Current Limitations

1. **No Role Management System**
   - Admin status is hardcoded based on email domain
   - No database table for roles or permissions
   - Cannot dynamically grant/revoke admin access

2. **Limited Admin Tools**
   - No admin dashboard or console
   - Admins use the same interface as regular users
   - No way to manage users, galleries, or content in bulk

3. **No Audit Trail**
   - No tracking of who created galleries for whom
   - No logging of admin actions

4. **Security Concerns**
   - Admin detection based solely on email domain
   - No additional authentication for admin actions
   - No fine-grained permissions

## Options for Admin Functionality Implementation

### Option 1: Minimal Enhancement (Quick Win)

Add basic role management without major architectural changes.

**Implementation:**
1. Add `role` column to `person` table (default: 'user', options: 'user', 'admin')
2. Create simple admin pages under `/admin/*` routes
3. Add middleware to protect admin routes
4. Create basic admin dashboard with:
   - User list with role management
   - Gallery creation form for any user
   - Basic statistics (total users, galleries, photos)

**Pros:**
- Quick to implement (1-2 days)
- Minimal database changes
- Uses existing authentication flow

**Cons:**
- Limited scalability
- No fine-grained permissions
- Basic UI only

### Option 2: Role-Based Access Control (RBAC)

Implement a proper role and permission system.

**Implementation:**
1. Create new database tables:
   ```sql
   -- roles table
   CREATE TABLE roles (
     id VARCHAR PRIMARY KEY,
     name VARCHAR NOT NULL,
     description TEXT,
     created TIMESTAMP DEFAULT NOW()
   );

   -- permissions table
   CREATE TABLE permissions (
     id VARCHAR PRIMARY KEY,
     name VARCHAR NOT NULL,
     resource VARCHAR NOT NULL,
     action VARCHAR NOT NULL,
     created TIMESTAMP DEFAULT NOW()
   );

   -- role_permissions junction table
   CREATE TABLE role_permissions (
     role_id VARCHAR REFERENCES roles(id),
     permission_id VARCHAR REFERENCES permissions(id),
     PRIMARY KEY (role_id, permission_id)
   );

   -- user_roles junction table
   CREATE TABLE user_roles (
     person_id VARCHAR REFERENCES person(id),
     role_id VARCHAR REFERENCES roles(id),
     granted_by VARCHAR REFERENCES person(id),
     granted_at TIMESTAMP DEFAULT NOW(),
     PRIMARY KEY (person_id, role_id)
   );
   ```

2. Define permissions:
   - `gallery:create` - Create galleries
   - `gallery:create_for_others` - Create galleries for other users
   - `gallery:manage_all` - Edit/delete any gallery
   - `user:view_all` - View all users
   - `user:manage_roles` - Assign/remove roles
   - `payment:bypass` - Skip payment requirements

3. Create admin console with:
   - User management (search, filter, role assignment)
   - Gallery management (view all, edit, delete)
   - Role management (create/edit roles and permissions)
   - Audit log viewer

**Pros:**
- Scalable and flexible
- Fine-grained control
- Professional-grade security
- Supports multiple admin levels

**Cons:**
- More complex implementation (3-5 days)
- Requires migration strategy
- More testing needed

### Option 3: Lightweight Admin Dashboard

Focus on practical admin tools without complex permission system.

**Implementation:**
1. Add simple `is_admin` boolean to `person` table
2. Create dedicated admin dashboard at `/admin`
3. Implement key features:
   - **Quick Actions**
     - Create gallery for user (with email input)
     - Bulk invite users to gallery
     - Generate gallery access reports
   
   - **Management Views**
     - User search and filtering
     - Gallery browser with stats
     - Recent activity feed
     - Payment history
   
   - **Admin Tools**
     - Toggle admin status for users
     - Send bulk emails
     - Export data (CSV)
     - View system metrics

4. Add activity logging:
   ```sql
   CREATE TABLE admin_actions (
     id VARCHAR PRIMARY KEY,
     admin_id VARCHAR REFERENCES person(id),
     action VARCHAR NOT NULL,
     target_type VARCHAR,
     target_id VARCHAR,
     metadata JSONB,
     created TIMESTAMP DEFAULT NOW()
   );
   ```

**Pros:**
- Balanced approach
- Focuses on actual needs
- Clean, purpose-built UI
- Reasonable implementation time (2-3 days)

**Cons:**
- Less flexible than full RBAC
- May need expansion later

### Option 4: Progressive Enhancement

Start simple and build incrementally.

**Phase 1 (1 day):**
- Add `is_admin` column to database
- Create basic `/admin/create-gallery` page
- Add admin user list

**Phase 2 (1-2 days):**
- Add gallery management interface
- Implement bulk operations
- Add basic analytics

**Phase 3 (2-3 days):**
- Upgrade to role-based system
- Add permission management
- Create audit logging

**Pros:**
- Delivers value quickly
- Can stop at any phase
- Learn from usage patterns
- Lower risk

**Cons:**
- May require some rework
- Temporary solutions

## Recommendation

Based on the current system and typical use cases, I recommend **Option 3: Lightweight Admin Dashboard** for the following reasons:

1. **Practical Focus** - Provides the tools admins actually need without over-engineering
2. **Quick Implementation** - Can be built in 2-3 days with immediate value
3. **Good UX** - Purpose-built interface rather than retrofitting existing pages
4. **Future-Proof** - Can be extended to full RBAC if needed later
5. **Maintains Simplicity** - Aligns with the app's current straightforward architecture

### Proposed Admin Dashboard Features

1. **Dashboard Home**
   - Quick stats (users, galleries, photos, revenue)
   - Recent activity feed
   - Quick actions buttons

2. **User Management**
   - Search/filter users
   - View user details and galleries
   - Toggle admin status
   - Create gallery for user

3. **Gallery Management**
   - Browse all galleries
   - View gallery stats
   - Edit gallery details
   - Manage participants

4. **Tools**
   - Bulk email sender
   - Data export
   - System health metrics

5. **Activity Log**
   - Track all admin actions
   - Filter by admin, action type, date

This approach provides immediate value while keeping the door open for future enhancements based on actual usage patterns and needs.