# Logged-In Landing Page Implementation Checklist

## Overview
This checklist provides step-by-step implementation tasks for updating the landing page to provide personalized experiences for logged-in users, gallery members/owners, and admin users.

## Phase 1: Database Service Layer

### 1.1 Create Gallery Association Check Service
- [ ] Update `/src/lib/db/galleryService.ts`:
  - [ ] Add `checkUserHasGalleries(personId: string): Promise<boolean>` function
    - [ ] Query galleries where `personId === personId OR createdBy === personId`
    - [ ] Query `galleryPerson` table where `personId === personId`
    - [ ] Return true if either query returns results
  - [ ] Add error handling with try/catch
  - [ ] Consider adding caching for performance (optional)

### 1.2 Alternative: Extend Person Service
- [ ] OR update `/src/lib/db/personService.ts`:
  - [ ] Add `selectPersonWithGalleryStatus(personId: string)` function
    - [ ] Return person data plus `hasGalleries` boolean field
    - [ ] Use a single efficient query with joins or subqueries

## Phase 2: Update HomePage Component

### 2.1 Modify Server Component Logic
- [ ] Update `/src/app/page.tsx`:
  - [ ] Import `checkUserHasGalleries` or `selectPersonWithGalleryStatus`
  - [ ] Modify the existing cookie check logic:
    ```typescript
    const personId = cookies().get('personId')?.value
    if (personId) {
        try {
            const person = await selectPerson(personId)
            if (person) {
                // NEW: Check admin status first
                if (person.isAdmin) {
                    return redirect('/admin')
                }
                // NEW: Check gallery associations
                const hasGalleries = await checkUserHasGalleries(personId)
                // Pass this to Header component
            }
        } catch (error) {
            console.error(`Error checking user status: ${error}`)
        }
    }
    ```

### 2.2 Pass Props to Header Component
- [ ] Update HomePage component:
  - [ ] Add props to pass authentication state to Header
  - [ ] Consider creating an interface for auth state:
    ```typescript
    interface AuthState {
      isAuthenticated: boolean
      hasGalleries: boolean
      personId?: string
    }
    ```
  - [ ] Pass authState to Header component

## Phase 3: Update Header Component

### 3.1 Make Header Dynamic
- [ ] Update Header component in `/src/app/page.tsx`:
  - [ ] Add props interface:
    ```typescript
    interface HeaderProps {
      authState?: {
        isAuthenticated: boolean
        hasGalleries: boolean
      }
    }
    ```
  - [ ] Update component signature: `const Header: FC<HeaderProps> = ({ authState }) => {`
  - [ ] Modify the action button logic:
    ```typescript
    const buttonText = authState?.isAuthenticated && authState?.hasGalleries 
      ? 'Galleries' 
      : 'Get Started'
    const buttonHref = authState?.isAuthenticated && authState?.hasGalleries 
      ? '/galleries' 
      : '/create'
    ```
  - [ ] Update the Link component to use dynamic values

### 3.2 Update Mobile Header
- [ ] Check if MobileHeader component needs similar updates
- [ ] Pass authState props if MobileHeader shows action buttons
- [ ] Ensure consistency between desktop and mobile experiences

## Phase 4: Error Handling & Edge Cases

### 4.1 Handle Database Errors
- [ ] Add try/catch blocks around gallery association checks
- [ ] Default to showing "Get Started" on errors
- [ ] Log errors for monitoring but don't block page load

### 4.2 Handle Cookie Edge Cases
- [ ] Test with invalid/expired personId cookies
- [ ] Ensure graceful fallback when person not found
- [ ] Handle null/undefined isAdmin field (treat as false)

### 4.3 Performance Optimization
- [ ] Consider combining person fetch and gallery check into single query
- [ ] Add appropriate database indexes if needed:
  - [ ] Index on `gallery.personId`
  - [ ] Index on `gallery.createdBy`
  - [ ] Index on `galleryPerson.personId`

## Phase 5: Testing & Verification

### 5.1 Manual Testing Scenarios
- [ ] Test as non-authenticated user (no cookie)
- [ ] Test as authenticated user with no galleries
- [ ] Test as authenticated user with owned galleries
- [ ] Test as authenticated user who is gallery member (not owner)
- [ ] Test as admin user (should redirect immediately)
- [ ] Test with invalid personId cookie

### 5.2 Verify UI Behavior
- [ ] Header shows "Get Started" → `/create` for non-authenticated
- [ ] Header shows "Get Started" → `/create` for authenticated without galleries
- [ ] Header shows "Galleries" → `/galleries` for authenticated with galleries
- [ ] Admin users never see landing page (redirect to `/admin`)
- [ ] Mobile header matches desktop behavior

### 5.3 Performance Checks
- [ ] Landing page load time not significantly impacted
- [ ] Database queries are efficient
- [ ] No N+1 query issues

## Phase 6: Code Cleanup & Documentation

### 6.1 Code Quality
- [ ] Remove any console.log statements
- [ ] Add appropriate TypeScript types
- [ ] Ensure consistent error handling patterns
- [ ] Follow existing code style conventions

### 6.2 Update Documentation
- [ ] Update any relevant comments in the code
- [ ] Mark this checklist items as complete
- [ ] Update CLAUDE.md if new patterns introduced

## Success Criteria
- [ ] Admin users are redirected to `/admin` before page renders
- [ ] Users with galleries see "Galleries" button
- [ ] Users without galleries see "Get Started" button
- [ ] All edge cases handled gracefully
- [ ] No performance degradation
- [ ] Mobile experience matches desktop