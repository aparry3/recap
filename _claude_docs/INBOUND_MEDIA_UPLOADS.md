# Inbound photo and video uploads

Guests can reply to Recap SMS or email messages with photos/videos. The media is attributed to the matched guest and added to the gallery that contact joined most recently. Album inference is intentionally deferred.

## Implemented

- [x] Record `gallery_person.joined_at` and use it to select the most recent active gallery for an email address or US phone number.
- [x] Receive Twilio MMS media, validate the webhook signature, download media with authenticated Twilio credentials, and reply with TwiML.
- [x] Receive signed SendGrid Inbound Parse multipart webhooks, reject automated or non-SPF-authenticated mail, and send a transactional acknowledgement.
- [x] Accept supported image and video MIME types, write originals to the existing S3 key convention, and create WebP previews.
- [x] Generate real image previews and a neutral play-card preview for videos until server-side video frame extraction is added.
- [x] Store provider/source IDs on media so provider retries cannot create duplicate gallery items.
- [x] Keep unfinished provider uploads out of browser orphan cleanup so provider retries can resume them.
- [x] Add reply-to-upload instructions to consent confirmations and reminders.
- [x] Return a default instructional response for messages without supported media.

## Provider and deployment rollout

- [ ] Run `migrations/20260718010000_inbound_media_uploads.ts` after the guest-reminders migration.
- [ ] Create a SendGrid Inbound Parse subdomain with an MX record pointing to `mx.sendgrid.net`.
- [ ] Configure its destination as `/api/webhooks/sendgrid/inbound` with the default multipart payload (not raw MIME).
- [ ] Attach a SendGrid signature security policy and set `SENDGRID_INBOUND_PARSE_VERIFICATION_KEY` to that policy's public key.
- [ ] Set `SENDGRID_INBOUND_EMAIL` to an address on the parse subdomain; reminder mail uses it as `Reply-To`.
- [ ] Keep the existing SendGrid Event Webhook on `/api/webhooks/sendgrid`; its verification key remains separate.
- [ ] Configure the Twilio Messaging Service inbound URL as `/api/webhooks/twilio/inbound` and add production `TWILIO_API_KEY` / `TWILIO_API_SECRET` credentials with message-media read access.
- [ ] Exercise image, video, multiple-attachment, retry, STOP/START/HELP, unknown-sender, and multi-gallery routing paths with provider test accounts.
- [ ] Enable `MESSAGING_ENABLED=true` only after the migration, S3/provider credentials, DNS, security policies, and webhook URLs are in place.

## Hosting constraint

SendGrid supports inbound messages up to 30 MB, but Vercel Functions currently reject request bodies above 4.5 MB before application code runs. The route works for multipart messages below the platform limit. To support larger email videos, place this same signed webhook handler behind an ingress without that request limit (or move inbound email to a provider flow that stores attachments and sends Recap authenticated download URLs). Twilio MMS does not have this issue because its webhook contains authenticated media URLs rather than the media bytes.
