# Verification Email HTML Template Migration Checklist

## Overview
This checklist guides the migration of the user verification email from SendGrid template ID to HTML/CSS template defined in code, following the pattern established by the admin invitation, gallery creation, and order notification email implementations.

## Current State Analysis
- **Regular User Verification**: Uses SendGrid template ID (`SENDGRID_VERIFICATION_ID`) via `_sendTemplateEmail` ❌
- **Admin Invitation**: Already uses HTML template in code ✓
- **Gallery Creation**: Already uses HTML template in code (`sendCreationEmail`) ✓
- **Order Notification**: Already uses HTML template in code ✓
- **Welcome Email**: No longer exists (removed from codebase)

## Phase 1: Create HTML Email Templates

### 1.1 User Verification Email Template
- [ ] Create `/src/lib/email/templates/user-verification.ts`:
  - [ ] Create interface `UserVerificationEmailData` with fields:
    - `name: string`
    - `galleryName: string`
    - `verificationUrl: string`
  - [ ] Create `getUserVerificationEmailTemplate()` function
  - [ ] Design HTML email template with:
    - [ ] Subject: "Verify your email for {galleryName}"
    - [ ] Recap branding (consistent with admin-invitation template)
    - [ ] Personalized greeting: "Hi {name},"
    - [ ] Body text explaining email verification is needed
    - [ ] CTA button: "Verify Email"
    - [ ] Fallback text link for email clients that block buttons
    - [ ] Mobile-responsive table-based layout
    - [ ] Footer with copyright
  - [ ] Use same color scheme and styling as admin-invitation template:
    - Background: `#FDF8F7`
    - Primary color: `#926C60`
    - Header background: `#EFD5D0`
    - Button background: `#926C60`


## Phase 2: Email Service Updates

### 2.1 Update SendGrid Client Methods
- [ ] Modify `/src/lib/email.ts`:
  - [ ] Import new email template:
    - [ ] `getUserVerificationEmailTemplate` from `'./email/templates/user-verification'`
  - [ ] Update `sendVerificationEmail()` method:
    - [ ] Remove call to `_sendTemplateEmail`
    - [ ] Implement direct `sgMail.send()` call similar to other methods
    - [ ] Use HTML template with inline CSS
    - [ ] Map existing `TemplateData` interface fields to template
    - [ ] Add proper subject line: "Verify your email for {galleryName}"
    - [ ] Include proper error handling with try-catch
  - [ ] Remove `_sendTemplateEmail()` method entirely (no longer needed)

### 2.2 Clean Up Template ID Dependencies
- [ ] Remove/deprecate environment variable:
  - [ ] `SENDGRID_VERIFICATION_ID` (after migration is stable)
- [ ] Update environment variable validation to remove `SENDGRID_VERIFICATION_ID` requirement
- [ ] Document removal in `.env.example`

## Phase 3: Data Mapping & Compatibility

### 3.1 Verification Email Data Mapping
- [ ] Update `/src/app/api/verifications/route.ts`:
  - [ ] Ensure data structure matches new template requirements
  - [ ] Map `buttonUrl` to `verificationUrl` for consistency
  - [ ] Verify all required fields are provided

### 3.2 Template Data Interfaces
- [ ] Ensure consistent naming across all email templates:
  - [ ] Use `verificationUrl` instead of `buttonUrl`
  - [ ] Standardize field names across templates
  - [ ] Create shared types if applicable

## Phase 4: Testing & Validation

### 4.1 Template Testing
- [ ] Test user verification email template:
  - [ ] Render with sample data
  - [ ] Verify all variables are replaced correctly
  - [ ] Check HTML validity
  - [ ] Test in multiple email clients (Gmail, Outlook, Apple Mail)
  - [ ] Verify mobile responsiveness
  - [ ] Test with long names/gallery names
  - [ ] Verify special characters are escaped properly

### 4.2 Integration Testing
- [ ] Test complete verification flow:
  - [ ] User triggers verification
  - [ ] Email is sent with HTML template
  - [ ] Links work correctly
  - [ ] Styling appears as expected
- [ ] Test error scenarios:
  - [ ] Missing data fields
  - [ ] Email send failures
  - [ ] Invalid email addresses

### 4.3 Cross-Template Consistency
- [ ] Verify all email templates have:
  - [ ] Consistent branding
  - [ ] Same color scheme
  - [ ] Similar layout structure
  - [ ] Consistent CTA button styles
  - [ ] Same font (Cormorant)
  - [ ] Matching footer design

## Phase 5: Migration Strategy

### 5.1 Direct Migration
- [ ] Since we're only migrating one email type, implement direct cutover:
  - [ ] Update `sendVerificationEmail()` method in one commit
  - [ ] Remove `_sendTemplateEmail()` in same commit
  - [ ] Test thoroughly before deploying
- [ ] Create monitoring for email delivery success rates
- [ ] Keep `SENDGRID_VERIFICATION_ID` temporarily for emergency rollback

### 5.2 Rollback Plan
- [ ] Keep old template ID in SendGrid dashboard
- [ ] Document quick rollback steps if needed
- [ ] Monitor email delivery metrics post-deployment

## Phase 6: Documentation & Cleanup

### 6.1 Update Documentation
- [ ] Update API documentation for email endpoints
- [ ] Document new template structure
- [ ] Add template customization guide
- [ ] Update troubleshooting guides

### 6.2 Code Cleanup
- [ ] Remove `_sendTemplateEmail()` method
- [ ] Clean up unused imports
- [ ] Update type definitions if needed
- [ ] Run linting and type checking

### 6.3 SendGrid Cleanup
- [ ] Archive old verification template in SendGrid (don't delete immediately)
- [ ] Update SendGrid dashboard documentation
- [ ] Remove `SENDGRID_VERIFICATION_ID` from deployment docs after stable

## Phase 7: Performance & Monitoring

### 7.1 Performance Optimization
- [ ] Minimize HTML/CSS size
- [ ] Optimize inline styles
- [ ] Ensure fast email rendering
- [ ] Test with large recipient lists

### 7.2 Monitoring Setup
- [ ] Track email delivery rates
- [ ] Monitor template rendering errors
- [ ] Set up alerts for email failures
- [ ] Log template version used for each email

## Implementation Benefits

1. **Code Control**: All email templates now in version control
2. **Consistency**: All emails use same pattern (HTML templates in code)
3. **Flexibility**: Quick updates without SendGrid dashboard access
4. **Testing**: Easier to unit test email templates
5. **Simplification**: Remove `_sendTemplateEmail` abstraction

## Risk Mitigation

1. **Delivery Issues**: 
   - Keep SendGrid templates as backup
   - Implement gradual rollout
   - Monitor delivery rates closely

2. **Rendering Problems**:
   - Test across multiple email clients
   - Use email testing services
   - Implement fallback text

3. **Performance Impact**:
   - Profile template rendering time
   - Consider caching compiled templates
   - Monitor email queue performance

## Success Criteria

- [ ] User verification emails use HTML template in code
- [ ] `_sendTemplateEmail()` method removed
- [ ] Email delivery rates remain stable or improve
- [ ] No increase in user complaints about email appearance
- [ ] All email methods follow same pattern
- [ ] No dependency on SendGrid template IDs

## Timeline Estimate

- Phase 1: 2-3 hours (single template creation)
- Phase 2: 1 hour (service updates)
- Phase 3: 30 minutes (data mapping)
- Phase 4: 2-3 hours (testing)
- Phase 5: 30 minutes (direct migration)
- Phase 6: 1 hour (documentation)
- Phase 7: 1 hour (monitoring)

**Total: 8-10 hours**

## Next Steps

1. Review and approve this checklist
2. Create feature branch: `feature/html-verification-email`
3. Start with Phase 1: Create user verification template
4. Update `sendVerificationEmail()` method
5. Remove `_sendTemplateEmail()` method
6. Test thoroughly before production deployment
7. Monitor post-deployment metrics