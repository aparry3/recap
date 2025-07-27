# Verification Email HTML Template Migration Checklist

## Overview
This checklist guides the migration of all verification emails from SendGrid template IDs to HTML/CSS templates defined in code, following the pattern established by the admin invitation email implementation.

## Current State Analysis
- **Regular User Verification**: Uses SendGrid template ID (`SENDGRID_VERIFICATION_ID`)
- **Welcome Email**: Uses SendGrid template ID (`SENDGRID_WELCOME_ID`)
- **Admin Invitation**: Already uses HTML template in code ✓
- **Gallery Creation**: Already uses HTML template in code ✓
- **Order Notification**: Already uses HTML template in code ✓

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

### 1.2 Welcome Email Template (if migrating from template ID)
- [ ] Create `/src/lib/email/templates/welcome-email.ts`:
  - [ ] Create interface `WelcomeEmailData` with fields:
    - `name: string`
    - `galleryName: string`
    - `galleryUrl: string`
  - [ ] Create `getWelcomeEmailTemplate()` function
  - [ ] Design HTML email template with:
    - [ ] Subject: "Welcome to {galleryName}!"
    - [ ] Consistent branding with other templates
    - [ ] Welcome message and gallery access instructions
    - [ ] CTA button: "View Gallery"
    - [ ] Mobile-responsive design

## Phase 2: Email Service Updates

### 2.1 Update SendGrid Client Methods
- [ ] Modify `/src/lib/email.ts`:
  - [ ] Import new email templates:
    - [ ] `getUserVerificationEmailTemplate`
    - [ ] `getWelcomeEmailTemplate` (if migrating)
  - [ ] Update `sendVerificationEmail()` method:
    - [ ] Remove template ID approach
    - [ ] Use HTML template with inline CSS
    - [ ] Map existing `TemplateData` to new interface fields
    - [ ] Maintain backward compatibility with existing calls
  - [ ] Update `sendWelcomeEmail()` method (if migrating):
    - [ ] Switch from template ID to HTML template
    - [ ] Ensure all data mapping is correct

### 2.2 Remove Template ID Dependencies
- [ ] Remove/deprecate environment variables (keep for rollback):
  - [ ] `SENDGRID_VERIFICATION_ID`
  - [ ] `SENDGRID_WELCOME_ID` (if migrating)
  - [ ] `SENDGRID_CREATION_ID` (already migrated)
- [ ] Update environment variable validation
- [ ] Document deprecated variables in `.env.example`

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

### 5.1 Gradual Rollout
- [ ] Implement feature flag for template switching:
  - [ ] `USE_HTML_VERIFICATION_TEMPLATE` environment variable
  - [ ] Default to false initially
  - [ ] Allow toggling between old and new approach
- [ ] Create monitoring for email delivery success rates
- [ ] Plan rollback strategy if issues arise

### 5.2 A/B Testing (Optional)
- [ ] Send percentage of emails with new template
- [ ] Monitor open rates and click-through rates
- [ ] Compare with SendGrid template performance
- [ ] Adjust based on metrics

## Phase 6: Documentation & Cleanup

### 6.1 Update Documentation
- [ ] Update API documentation for email endpoints
- [ ] Document new template structure
- [ ] Add template customization guide
- [ ] Update troubleshooting guides

### 6.2 Code Cleanup
- [ ] Remove old template ID logic (after full migration)
- [ ] Clean up unused imports
- [ ] Update type definitions
- [ ] Run linting and type checking

### 6.3 SendGrid Cleanup
- [ ] Archive old SendGrid templates (don't delete immediately)
- [ ] Update SendGrid dashboard documentation
- [ ] Remove template ID references from deployment docs

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

1. **Code Control**: All email templates in version control
2. **Consistency**: Easier to maintain consistent branding
3. **Flexibility**: Quick updates without SendGrid dashboard access
4. **Testing**: Easier to unit test email templates
5. **Cost**: Reduced dependency on SendGrid features

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

- [ ] All verification emails use HTML templates in code
- [ ] Email delivery rates remain stable or improve
- [ ] No increase in user complaints about email appearance
- [ ] Templates are maintainable and well-documented
- [ ] Easy to update branding across all emails
- [ ] Reduced dependency on external services

## Timeline Estimate

- Phase 1: 3-4 hours (template creation)
- Phase 2: 2 hours (service updates)
- Phase 3: 1 hour (data mapping)
- Phase 4: 3-4 hours (testing)
- Phase 5: 2 hours (migration setup)
- Phase 6: 2 hours (documentation)
- Phase 7: 2 hours (monitoring)

**Total: 15-18 hours**

## Next Steps

1. Review and approve this checklist
2. Create feature branch: `feature/html-verification-emails`
3. Start with Phase 1: Template creation
4. Test thoroughly before production deployment
5. Plan gradual rollout strategy
6. Monitor post-deployment metrics