# Simple Guest Wedding Reminders

## Summary

Add optional SMS and email reminders for gallery guests. Owners and admins can manually create reminders by choosing a date, time, channels, and message, or use OpenAI through agntz to generate drafts from an invitation, The Knot/Zola URL, or written prompt.

Each reminder has one absolute send timestamp. There is no calendar model, event relationship, recurring schedule, relative offset, or automatic rescheduling. AI-created reminders always require review before scheduling.

## Implementation

### Reminder and consent data

- Add `gallery.timezone` so local reminder times can be converted into UTC.
- Add `reminder` with gallery, title, absolute `sendAt`, status, enabled channels, email subject/body, SMS body, source, version, and audit timestamps.
- Do not modify or depend on `wedding_event`; no schedule or recommendation tables are needed.
- Add channel-specific consent plus an append-only consent-event audit trail with status, timestamp, disclosure version, and source.
- Add global channel suppressions and idempotent per-guest/channel delivery records.
- Limit SMS to 10 messages per guest/gallery, including the confirmation text.

### Guest experience

- Keep email and phone optional.
- Present separate unchecked email and SMS consent controls. Contact entry alone does not imply consent.
- Display SMS disclosure covering automated messages, the 10-message maximum, message/data rates, STOP/HELP, optional consent, and Terms/Privacy.
- Send an immediate confirmation when an enabled channel and provider configuration are active.
- Provide signed preference links and process Twilio STOP/START/HELP plus SendGrid unsubscribe, bounce, and complaint events.
- Do not convert legacy `receive_messages` values into consent.

### Reminder management

- Add a Reminders section to owner/admin gallery settings.
- Show reminders, status, gallery-local send time, enabled channels, current eligible audience, and delivery summary.
- Provide add/edit, preview, schedule, cancel, delete, and confirmed send-now actions.
- Use separate email subject/body and SMS body fields.
- Wrap plain email content in fixed Recap branding with gallery CTA, postal address, and preference link.
- Store and dispatch only the absolute UTC timestamp selected in the UI.

### AI through agntz

- Replace Gemini with an embedded `@agntz/sdk` agent using OpenAI `gpt-5.6-terra`.
- Accept an owner prompt, The Knot/Zola page text, or invitation PDF/image up to 4 MB.
- Return one to three reminder drafts containing an absolute local timestamp, email copy, SMS copy, evidence, and warnings.
- Convert validated local timestamps to UTC using the gallery timezone.
- Treat source content as untrusted, send no guest contact data to the model, and expose no delivery tools.
- Require the owner/admin to edit, save, and schedule generated drafts manually.

### Delivery and interfaces

- Use Twilio Messaging Services for SMS and the existing SendGrid integration for email.
- Run a protected Vercel Pro cron route every minute.
- Atomically claim due reminders, recheck consent/suppression/membership/SMS cap, create idempotent deliveries, send in bounded batches, and update provider status through signed webhooks.
- Route send-now through the same queue by setting `sendAt` to the current time.
- Add owner/admin APIs for reminder CRUD, AI generation, actions, and delivery summaries.
- Add signed guest-preference, Twilio webhook, SendGrid webhook, and cron endpoints.
- Require a signed HTTP-only owner/admin session for reminder management.
- Use `MESSAGING_ENABLED` as an emergency send kill switch.

## Testing and Acceptance

- Contact entry without checked consent never enables reminders.
- Email and SMS consent, confirmation, preferences, STOP/START, unsubscribe, bounce, and complaint behavior are channel-specific.
- Local times convert correctly to UTC, including daylight-saving transitions.
- AI inputs produce grounded, editable drafts and never schedule or send messages.
- Scheduled and send-now reminders target only currently eligible guests.
- Concurrent cron calls and duplicate provider callbacks cannot duplicate a delivery.
- SMS confirmation plus reminders cannot exceed 10 messages per guest/gallery.
- Branded emails contain the gallery link, required address, and preference link.

## Assumptions

- Version one is US-only and runs on Vercel Pro.
- Twilio provides SMS and SendGrid provides email.
- All model calls use OpenAI through agntz; there is no Gemini fallback.
- The Knot and Zola are the only website imports.
- Every reminder targets all currently eligible gallery guests; segmentation and recurring reminders are deferred.
- Recommendations may be written directly into reminder copy or the AI prompt and have no separate data model.
