# Logged-In Landing Page PRD

## Overview
Update the landing page (`src/app/page.tsx`) to provide a personalized experience for logged-in users, with special handling for gallery members/owners and admin users.

## Current Implementation
- The landing page checks for a `personId` cookie
- If a valid person is found, it redirects to `/galleries`
- The header always shows "Get Started" linking to `/create`
- No differentiation for admin users

## Requirements

### 1. Dynamic Header Navigation
When a user has a valid `personId` cookie set:

#### Check Gallery Membership
- Query the database to determine if the person:
  - Owns any galleries (where `gallery.personId` or `gallery.createdBy` matches their ID)
  - Is a member of any galleries (exists in `galleryPerson` table)

#### Update Header Display
- **If the person owns or is a member of at least one gallery:**
  - Replace "Get Started" button text with "Galleries"
  - Link should navigate to `/galleries` instead of `/create`
  - Maintain the same visual styling as the current button

- **If the person has no gallery associations:**
  - Keep the existing "Get Started" text and `/create` link

### 2. Admin User Redirect
- **Before rendering the page**, check if the person has `isAdmin: true`
- **If admin:** Immediately redirect to `/admin`
- **If not admin:** Continue with normal page rendering

### 3. Implementation Flow
1. Get `personId` from cookie
2. Fetch person data using `selectPerson(personId)`
3. Check if `person.isAdmin === true`
   - If yes: Redirect to `/admin`
   - If no: Continue
4. Check gallery associations:
   - Query owned galleries: `gallery.personId === personId || gallery.createdBy === personId`
   - Query gallery memberships: `galleryPerson.personId === personId`
5. Pass gallery association status to Header component
6. Header renders appropriate button based on status

### 4. Technical Considerations
- The header check should be efficient - consider creating a service method that returns a boolean for "hasGalleries"
- Admin redirect should happen server-side before any client rendering
- Maintain existing cookie validation and error handling
- The Header component will need to accept props to determine which button variant to show

### 5. Edge Cases
- Invalid/expired personId cookie: Maintain current behavior (show default landing page)
- Database query failures: Default to showing "Get Started" to avoid blocking access
- Person exists but isAdmin field is null/undefined: Treat as non-admin

### 6. Success Criteria
- Admin users never see the landing page (immediate redirect to `/admin`)
- Users with galleries see "Galleries" button linking to `/galleries`
- Users without galleries see "Get Started" button linking to `/create`
- No performance degradation on landing page load
- Graceful handling of edge cases