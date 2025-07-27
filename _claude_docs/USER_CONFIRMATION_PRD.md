# Admin User Confirmation Email PRD

## Overview
This document outlines the requirements for implementing email confirmation for newly created or updated admin users in the Recap application. When an admin user is created or an existing user is promoted to admin status, they should receive a verification email that allows them to confirm their account and automatically log in to the admin interface.

## Background
Currently, the Recap application has an email verification system for gallery creation that:
- Sends verification emails via SendGrid when users create galleries
- Creates verification records in the database
- Provides a verification link that confirms the email and sets the user's personId cookie
- Redirects users to their gallery after verification

We need to extend this pattern for admin user management.

## Goals
1. Ensure newly created admin users can verify their email address
2. Provide secure, one-click access to the admin interface
3. Maintain consistency with existing verification patterns
4. Support both new admin creation and existing user promotion scenarios

## User Stories
1. **As a super admin**, I want to create a new admin user so that they receive a confirmation email to access the admin panel
2. **As a super admin**, I want to promote an existing user to admin status so that they receive notification and can access admin features
3. **As a new admin user**, I want to receive a clear email invitation so that I can easily access my admin privileges
4. **As a new admin user**, I want to click a link in my email and be automatically logged in to the admin interface

## Requirements

### Functional Requirements

#### Email Trigger
1. Send confirmation email when:
   - A new user is created with `isAdmin: true` flag
   - An existing user is updated to have `isAdmin: true` flag
   - Email should be sent from the admin management interface

#### Email Content
1. Create new email template with:
   - Subject: "You've been added as an admin to Recap!"
   - Body text: "You have been added as an admin to Recap! Please follow the link below to login"
   - Clear call-to-action button
   - Verification link that includes a unique verification ID
   - Recap branding consistent with existing emails

#### Verification Flow
1. Generate verification record:
   - Create verification entry in database with personId
   - Set expiration (consistent with existing verification flow)
   - No galleryId (since this is for admin access, not gallery access)

2. Verification link behavior:
   - Format: `${BASE_URL}/admin/verify/${verificationId}`
   - On click, verify the verification ID is valid and not expired
   - Set the personId cookie to log the user in
   - Mark verification as used
   - Redirect to `/admin` page

#### Admin Interface Integration
1. Integrate with existing user management modal:
   - Trigger email send after successful user creation/update
   - Show success message indicating email was sent
   - Handle email send failures gracefully

### Technical Requirements

#### Database
1. Use existing verification table structure:
   - No schema changes needed
   - Verification records will have null galleryId for admin verifications

#### API Endpoints
1. Modify existing user creation/update endpoints:
   - `/api/people/[personId]/route.ts` - Add email trigger for admin updates
   - `/api/people/route.ts` - Add email trigger for admin creation

2. Create new verification endpoint:
   - `/api/admin/verify/[verificationId]/route.ts`
   - Validate verification ID
   - Set personId cookie
   - Return success/redirect response

#### Email Service
1. SendGrid Integration:
   - Create new SendGrid template for admin invitation
   - Add new template ID to environment variables
   - Extend SendGridClient with new method: `sendAdminInvitationEmail`

#### Frontend
1. New verification page:
   - `/app/admin/verify/[verificationId]/page.tsx`
   - Similar to existing verification page but redirects to admin
   - Shows success message before redirect

2. Update admin user management:
   - Show loading state while sending email
   - Display success/error messages
   - Handle retry logic for failed emails

### Non-Functional Requirements

#### Security
1. Verification links should be single-use
2. Verification links should expire after 24 hours
3. Only users with `isAdmin: true` should be able to access admin interface
4. Validate that the person being verified has admin privileges

#### Performance
1. Email sending should be asynchronous
2. User creation/update should not be blocked by email sending
3. Failed emails should not prevent user creation

#### UX
1. Clear feedback when email is sent successfully
2. Informative error messages if email fails
3. Smooth redirect experience after verification
4. Mobile-friendly email template

## Implementation Considerations

### Email Template Design
- Use existing Recap email design patterns
- Include Recap logo and branding
- Clear, prominent CTA button
- Responsive design for mobile devices

### Error Handling
1. Email send failures:
   - Log errors for debugging
   - Show user-friendly error message
   - Provide option to resend

2. Verification failures:
   - Invalid/expired link: Show error page with option to request new link
   - Already used: Redirect to admin page if user is logged in

### Monitoring
1. Track email send success/failure rates
2. Monitor verification completion rates
3. Log admin access for security auditing

## Success Metrics
1. 95%+ email delivery rate
2. 80%+ verification completion rate
3. Zero security incidents related to admin access
4. Positive feedback from new admin users

## Future Enhancements
1. Add ability to resend verification emails
2. Implement role-based permissions for different admin levels
3. Add email preferences for admin notifications
4. Support for custom email templates per organization

## Dependencies
- SendGrid email service
- Existing verification system
- Admin user management interface
- Cookie-based authentication system

## Timeline Estimate
- Email template creation: 1 hour
- Backend API modifications: 2-3 hours
- Frontend verification flow: 2 hours
- Integration with admin interface: 1 hour
- Testing and refinement: 2 hours

Total: ~8-10 hours