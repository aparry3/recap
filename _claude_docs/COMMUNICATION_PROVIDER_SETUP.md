# Recap communications provider setup

Last verified: July 21, 2026

This is the operational setup packet for SMS/MMS through Twilio, outbound email through Twilio SendGrid, inbound email uploads through SendGrid Inbound Parse, and the related Vercel configuration.

The business identity used throughout should be consistent:

- Legal entity: `Parry Technology and Media, LLC` — use the exact spelling from the IRS CP 575 or 147C letter when a provider asks for the legal business name.
- DBA: `Our Wedding Recap`
- Product: `Recap`
- Customer-facing sender identity: `Recap by Our Wedding Recap`
- Canonical public origin: `https://www.ourweddingrecap.com`
- Support email: `aaron@ourweddingrecap.com`

This guide is implementation-specific. It reflects the consent, reminder, reply upload, provider callback, and suppression behavior in PRs #89 and #90. It is not legal advice. Have counsel review the final SMS disclosure, Terms, Privacy Policy, and email footer before production messaging is enabled.

## Do not launch until these gates pass

- [ ] Supply the business facts in the next section. Do not guess at identity or address fields.
- [ ] Deploy the consent/reminder and inbound-media code to staging and run both migrations there.
- [x] Add a public `/sms-consent` reviewer page that reproduces the unchecked opt-in disclosure. Implemented locally; verify the production URL after deployment.
- [x] Strengthen the public Privacy Policy, use a fixed publication date, and identify the legal operator/DBA. Implemented locally; deploy before campaign submission.
- [x] Enforce `Recap by Our Wedding Recap` in outgoing SMS/reply bodies and make the SendGrid From name configurable with the same default.
- [x] Synchronize Twilio STOP/START/HELP callbacks without sending duplicate application replies when Twilio owns the keyword response.
- [x] Add a preview-only Twilio status-callback bypass using Vercel's automation-bypass secret.
- [ ] Change production `BASE_URL` from `https://ourweddingrecap.com/` to `https://www.ourweddingrecap.com` to avoid a redirect and Twilio signature mismatch.
- [x] Constrain first-launch email replies to one photo under 2 MB and direct videos, larger photos, and multiple files to the web gallery; do not advertise unrestricted video-by-email uploads.
- [ ] Use provider credentials isolated from production for staging.
- [ ] Leave `MESSAGING_ENABLED=false` until every provider test passes.

## Business facts the owner must supply

Collect these before starting Twilio brand registration. Values must match official records.

| Field | Required value |
| --- | --- |
| EIN legal name | `[EXACT NAME FROM CP 575 OR 147C]` |
| EIN | `[XX-XXXXXXX]` |
| Formation type | Confirm LLC; choose Twilio's LLC option, currently labeled `Limited Liability Corporation` |
| Business street address | `[ADDRESS MATCHING BUSINESS/IRS RECORDS]` |
| City, state, ZIP, country | `[EXACT VALUES]` |
| Authorized representative | `[FULL LEGAL NAME]` |
| Representative title | `[OWNER / FOUNDER / OTHER ACCURATE TITLE]` |
| Representative business email | `[BUSINESS EMAIL]` |
| Representative mobile number | `[MOBILE NUMBER FOR TWILIO OTP]` |
| Yearly revenue range | `[SELECT ACCURATE TWILIO RANGE]` |
| Expected SMS segments per day | `[CONFIRM; RECOMMEND LOW-VOLUME ONLY IF UNDER 6,000/DAY]` |
| Physical postal address for email | `[VALID STREET ADDRESS, REGISTERED USPS PO BOX, OR REGISTERED COMMERCIAL MAILBOX]` |
| Desired Twilio area code | `[AREA CODE, IDEALLY CONSISTENT WITH BUSINESS LOCATION]` |

Twilio requires a US entity's legal name to match its EIN records. A Low-Volume Standard Brand is appropriate only when the business has an EIN and expects fewer than 6,000 message segments per day. See Twilio's [business-information requirements](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/collect-business-info) and [Low-Volume Standard guide](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/direct-standard-onboarding).

## Rollout order

1. Deploy the completed policy, public opt-in evidence, SMS brand-prefix, keyword-sync, and preview-callback code gates.
2. Refresh the `staging` branch, deploy PRs #89 and #90 there, and run the two migrations against the staging database.
3. Create isolated staging SendGrid and Twilio resources.
4. Configure and test SendGrid outbound email, event callbacks, and inbound email.
5. Create the Twilio business profile, brand, Messaging Service, MMS-capable number, and A2P campaign.
6. Test every path in staging while `MESSAGING_ENABLED` is controlled and the staging database contains only test recipients.
7. Wait for the Twilio campaign to become `VERIFIED`.
8. Configure production-only secrets, deploy to production with `MESSAGING_ENABLED=false`, and run production migrations.
9. Run one internal end-to-end test, then set `MESSAGING_ENABLED=true`.
10. Monitor delivery, suppressions, provider logs, spending, and Vercel failures during the initial rollout.

## Twilio setup

### 1. Account and business profile

Use a paid Twilio account; A2P 10DLC registration is unavailable on a free trial.

In Twilio Console, create or complete the Primary Customer Profile under Trust Hub / Regulatory Compliance.

| Twilio field | Value |
| --- | --- |
| Profile friendly name | `Our Wedding Recap` |
| Legal business name | `[EXACT EIN LEGAL NAME — DO NOT USE THE DBA HERE]` |
| DBA / brand, if requested | `Our Wedding Recap` |
| Business type | Twilio's LLC option, currently `Limited Liability Corporation` |
| Business industry | `TECHNOLOGY` |
| Registration identifier | `EIN` |
| Registration number | `[EIN IN XX-XXXXXXX FORMAT]` |
| Website | `https://www.ourweddingrecap.com` |
| Business regions | `United States` |
| Address | `[ADDRESS MATCHING THE BUSINESS RECORD]` |
| Authorized representative | `[OWNER-SUPPLIED NAME, TITLE, EMAIL, AND MOBILE]` |
| Social profiles | Add only real, active Our Wedding Recap profiles; otherwise leave optional fields blank |

Use `Low-Volume Standard` if the confirmed estimate is under 6,000 segments per day. Use `Standard` if it is not. Do not register as a Sole Proprietor Brand because the sender is an LLC with an EIN.

Do not combine the legal name and DBA in Twilio's **Legal business name** field. Enter the exact name printed on the IRS CP 575 or 147C—even its punctuation—such as `Parry Technology and Media, LLC` only if that is exactly what the IRS letter shows. Do not enter `Parry Technology and Media, LLC d/b/a Our Wedding Recap` unless that entire wording appears as the legal name on the IRS letter. Use `Our Wedding Recap` in a separate DBA/trade-name field if Twilio presents one, and as the profile friendly name/customer-facing brand.

It is appropriate for the same compliance profile to use `https://www.ourweddingrecap.com` as the website because Our Wedding Recap is the DBA/brand through which the LLC operates Recap. Before final submission, deploy and publicly verify the footer, Terms, and Privacy language that explicitly connects `Our Wedding Recap`, `Recap`, and `Parry Technology and Media, LLC`; the website must not require login or redirect to an unrelated brand.

For the compliance profile's **Notification settings**:

| Field | Value |
| --- | --- |
| Notification email | `aaron@parrytechnologymedia.com`, provided it is monitored for approval/rejection notices |
| Status callback URL | Leave blank; notification email satisfies Twilio's requirement to provide at least one notification method |

Do not enter `/api/webhooks/twilio/status` here. That Recap endpoint processes per-message delivery receipts and expects a Recap delivery ID; a compliance-profile lifecycle callback has a different purpose and payload. Add a separate signed endpoint only if automated Trust Hub profile-status processing becomes necessary later.

### 2. Public reviewer evidence

Twilio requires a verifiable opt-in method. Recap's actual opt-in lives inside a password-protected gallery, so do one of the following before submitting the campaign:

1. Preferred: publish `https://www.ourweddingrecap.com/sms-consent`, which contains a public read-only reproduction of the gallery join form and full unchecked SMS checkbox disclosure.
2. Alternative: provide a public video or image URL showing the complete opt-in flow.
3. If using a demo gallery, make it reviewer-accessible and put temporary access instructions in the campaign flow description.

The evidence must show:

- Phone number is optional.
- SMS consent has its own unchecked checkbox and is separate from email consent.
- The checkbox is not required to continue or purchase.
- The visible disclosure says `up to 10 automated texts`, `Message and data rates may apply`, `Reply STOP`, `HELP`, and links to Terms and Privacy.
- The business/product identity is visible.

Twilio accepts a public live flow, video, or screenshot when the production flow is not publicly accessible. See the [A2P registration quickstart](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/quickstart).

### 3. Policy changes required before campaign submission

Use these public URLs:

- Privacy Policy: `https://www.ourweddingrecap.com/privacy`
- Terms and Conditions: `https://www.ourweddingrecap.com/terms`

As of June 30, 2026, new A2P campaigns require both URLs. Both must be public and must not redirect to authentication. See Twilio's [June 2026 campaign URL requirement](https://www.twilio.com/en-us/changelog/a2p-10dlc-campaign-registration-will-require-privacy-policy-and-).

The source now adds this disclosure to the Privacy Policy; confirm it is deployed before campaign submission:

> SMS message frequency varies and will not exceed 10 automated messages per wedding gallery, including the enrollment confirmation. Message and data rates may apply. Reply STOP to opt out or HELP for help. SMS consent and mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. Information may be shared with service providers such as Twilio only as necessary to deliver and support the messaging service.

The source now makes the brand relationship explicit in site/form footers:

> Our Wedding Recap is a brand of Parry Technology and Media, LLC. Recap is an Our Wedding Recap service.

The Terms and Privacy Policy retain the more formal legal formulation that Parry Technology and Media, LLC, doing business as Our Wedding Recap, operates Recap.

Use a fixed date such as `Last updated: [ACTUAL PUBLICATION DATE]`; do not render today's date on every request.

### 4. Messaging Service and number

Go to **Messaging > Services > Create Messaging Service**.

| Field | Value |
| --- | --- |
| Friendly name | `Our Wedding Recap - Production` |
| Messaging Service use case | Select `Notifications` / `Notify my users` if shown; otherwise select the closest `Mixed` option |
| Sender pool | One US local 10DLC number with both SMS and MMS capabilities |
| Number type | Local 10-digit long code, not toll-free, shortcode, or alphanumeric sender |
| Smart encoding | `On` |
| MMS Converter | `Off` unless a later product decision intentionally converts unsupported MMS to links |
| Validity period | `3600` seconds |

Buy the number in Twilio, confirm that the Console lists both SMS and MMS capabilities, then add it to the Messaging Service sender pool before campaign submission. An MMS-capable sender is required because guests reply with photos and videos. Twilio documents sender-pool and MMS behavior in [Messaging Services](https://www.twilio.com/docs/messaging/services).

Do not use a toll-free number unless you intentionally choose the separate Toll-Free Verification process instead of A2P 10DLC.

### 5. A2P 10DLC campaign values

Create the campaign under the approved Our Wedding Recap Brand and attach the production Messaging Service.

| Campaign field | Value |
| --- | --- |
| Campaign use case | `Low Volume Mixed` |
| Subscriber opt-in | `Yes` |
| Embedded links | `Yes` |
| Embedded phone numbers | `No` |
| Number pooling | `No` |
| Direct lending | `No` |
| Age-gated content | `No` |
| Affiliate marketing | `No` |
| Privacy Policy URL | `https://www.ourweddingrecap.com/privacy` |
| Terms and Conditions URL | `https://www.ourweddingrecap.com/terms` |
| Initial opt-in keywords | Leave blank; Recap does not allow initial subscription by SMS keyword |
| Initial opt-in message | Leave blank because initial keyword opt-in is not supported |

#### Campaign description — copy/paste

```text
Parry Technology and Media, LLC, doing business as Our Wedding Recap, operates the Recap wedding gallery service. This low-volume campaign sends opted-in wedding guests a one-time enrollment confirmation and up to nine additional business-initiated transactional and customer-care messages for a specific wedding gallery. Messages can include ceremony or reception logistics, gallery deadlines, and requests or reminders to upload wedding photos and videos. Guests may also initiate conversations by replying with MMS media, and Recap responds with upload status or help. Messages are sent only to guests who enter their own US mobile number and separately check an unchecked SMS consent box on a gallery join page. Recap does not use purchased lists, affiliate marketing, lead generation, direct lending, or third-party promotional content.
```

#### Message flow / how users consent — copy/paste after verifying the public proof URL

```text
Guests receive a wedding gallery link from the couple and visit a gallery on https://www.ourweddingrecap.com. After entering that gallery's password, a guest enters a name and may optionally enter a US mobile number. SMS consent uses a separate checkbox from email consent and is unchecked by default. The checkbox says: "By checking this box, you agree to receive up to 10 automated wedding update texts about this gallery, including a confirmation. If you message Recap, we may send additional service responses to your request. Message and data rates may apply. Reply STOP to stop or HELP for help. Consent is optional and is not a condition of purchase." The disclosure links to https://www.ourweddingrecap.com/terms and https://www.ourweddingrecap.com/privacy. After the guest checks the box and submits the form, Recap records the disclosure version, timestamp, source, IP address, and user agent and sends an enrollment confirmation. Guests can later disable SMS in a signed communication-preferences page or reply STOP. Initial SMS keyword opt-in is not supported; START only removes a prior carrier block, after which the guest must re-enable a gallery in the preference center. Public evidence of the password-gated opt-in flow is available at https://www.ourweddingrecap.com/sms-consent.
```

Open the proof URL in a private browser window immediately before submission and confirm it returns the public page without a redirect or login.

#### Sample messages — copy/paste

Use all five if Twilio permits five samples. They cover every material message type in the implementation.

```text
Recap by Our Wedding Recap: You're subscribed to up to 10 automated updates for [Gallery Name]. Msg & data rates may apply. View and upload: https://www.ourweddingrecap.com/[gallery-slug]. Reply STOP to stop or HELP for help.
```

```text
Recap by Our Wedding Recap: [Gallery Name] reminder: the ceremony begins at [time] on [date] at [venue]. Details and uploads: https://www.ourweddingrecap.com/[gallery-slug]. Reply STOP to stop or HELP for help.
```

```text
Recap by Our Wedding Recap: Share your favorite photos and videos from [Gallery Name]. Upload at https://www.ourweddingrecap.com/[gallery-slug] or reply with media. Reply STOP to stop or HELP for help.
```

```text
Recap by Our Wedding Recap: Please upload your [Gallery Name] photos by [date] so the couple can enjoy them. https://www.ourweddingrecap.com/[gallery-slug]. Reply STOP to stop or HELP for help.
```

```text
Recap by Our Wedding Recap: We added [number] photos or videos to [Gallery Name]. View the gallery: https://www.ourweddingrecap.com/[gallery-slug]. Reply STOP to stop or HELP for help.
```

Twilio currently requires two to five representative samples, brand identification, real domains, brackets for variable content, and opt-out language aligned with the campaign. See [Gather the Required Business Information](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/collect-business-info).

### 6. Opt-out and help configuration

For campaign registration, select Twilio-managed opt-out/help behavior. The application synchronizes provider callbacks with Recap's suppressions and intentionally returns empty TwiML for STOP, START, and HELP so Twilio remains the owner of the user-facing keyword response. Keep the provider defaults unless the campaign form requires explicit values.

If the form requires explicit values, use:

| Field | Value |
| --- | --- |
| Opt-out keywords | `STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT, REVOKE, OPTOUT` |
| Opt-out message | `Recap by Our Wedding Recap: You are unsubscribed and will receive no further texts. Reply START to allow texts again, then re-enable a gallery in communication preferences.` |
| Help keywords | `HELP, INFO` |
| Help message | `Recap by Our Wedding Recap provides wedding gallery updates and photo/video uploads. Visit https://www.ourweddingrecap.com or email aaron@ourweddingrecap.com. Reply STOP to stop. Msg & data rates may apply.` |

Advanced Opt-Out is recommended because Twilio includes `OptOutType=STOP|START|HELP` in the webhook. Recap uses that metadata first, falls back to the full configured keyword lists (including `REVOKE`, `OPTOUT`, and `YES`), updates its own suppression state, and sends no second application reply. Test the exact configured STOP, START, and HELP messages in staging before launch. Twilio warns not to send a second application reply after Advanced Opt-Out has already responded. See [Advanced Opt-Out](https://www.twilio.com/docs/messaging/tutorials/advanced-opt-out) and [Twilio STOP filtering](https://help.twilio.com/hc/en-us/articles/223134027-Twilio-support-for-opt-out-keywords-SMS-STOP-filtering-).

### 7. Messaging Service integration

Under the Messaging Service **Integration** section:

| Field | Production value |
| --- | --- |
| Incoming message handling | `Send to webhook` / `Send a webhook` |
| Request URL | `https://www.ourweddingrecap.com/api/webhooks/twilio/inbound` |
| HTTP method | `POST` |
| Fallback URL | Leave blank initially |
| Delivery Status Callback | Leave blank; Recap supplies a per-message callback containing its delivery ID |

Recap supplies this status callback on each outgoing request:

```text
https://www.ourweddingrecap.com/api/webhooks/twilio/status?deliveryId=[recap-delivery-id]
```

Twilio signs webhooks using the exact URL and account Auth Token. The application's `BASE_URL` must therefore be the same non-redirecting `https://www.ourweddingrecap.com` origin. See Twilio's [webhook security documentation](https://www.twilio.com/docs/usage/webhooks/webhooks-security).

### 8. Twilio credentials

Copy the Account SID and Auth Token from Twilio Console. The Auth Token remains necessary for webhook signature validation even when API keys are used for REST calls.

Create a production API key:

| Field | Value |
| --- | --- |
| Friendly name | `Recap Production Media Read` |
| Key type | Prefer `Restricted` if the Console offers permission for reading Message Media; otherwise use `Standard` |
| Required use | Authenticated downloads of Twilio-hosted inbound MMS media |

The current implementation still uses Account SID + Auth Token to submit outgoing messages, and uses API Key SID + Secret only for inbound media downloads. A future hardening change can move message submission to an API key, but the Auth Token will still be retained for signature validation. Twilio recommends API keys over Auth Tokens for REST authentication; see the [API key overview](https://www.twilio.com/docs/iam/api-keys).

Record these values without committing them:

```text
TWILIO_ACCOUNT_SID=AC................................
TWILIO_AUTH_TOKEN=[SECRET]
TWILIO_MESSAGING_SERVICE_SID=MG................................
TWILIO_API_KEY=SK................................
TWILIO_API_SECRET=[SECRET SHOWN ONCE]
```

### 9. Twilio registration expectations

- Campaign review is currently documented as taking roughly two to three weeks; do not schedule launch assuming instant approval.
- The Messaging Service must contain the intended 10DLC number before the campaign is submitted.
- Do not send US application traffic from that number until the campaign is `VERIFIED`.
- Registration and recurring campaign fees apply. Current pricing can change; verify it in Twilio immediately before submission.

## SendGrid setup

### 1. Account identity

In SendGrid **Settings > Account Details**, set:

| Field | Value |
| --- | --- |
| Company name | `Our Wedding Recap (Parry Technology and Media, LLC)` |
| Website | `https://www.ourweddingrecap.com` |
| Billing/company address | `[OWNER-SUPPLIED VALID BUSINESS ADDRESS]` |
| Time zone | `[TIME ZONE OF PRIMARY BUSINESS LOCATION]` |

The currently deployed sender is `no-reply@ourweddingrecap.com`. It can remain the authenticated envelope/From address because the application now supports a separate monitored Reply-To. Use:

```text
SENDGRID_EMAIL=no-reply@ourweddingrecap.com
SENDGRID_FROM_NAME=Recap by Our Wedding Recap
SENDGRID_REPLY_TO_EMAIL=aaron@ourweddingrecap.com
```

`SENDGRID_FROM_NAME` defaults to `Recap by Our Wedding Recap`, but set it explicitly so the deployment configuration documents the approved identity. General transactional email uses `SENDGRID_REPLY_TO_EMAIL`; reminder and inbound-upload replies intentionally use `SENDGRID_INBOUND_EMAIL` so attachments reach Inbound Parse. If a monitored `hello@ourweddingrecap.com` mailbox is later created, it may replace both the From and support Reply-To after its domain is authenticated.

### 2. Authenticate the sending domain

Go to **Settings > Sender Authentication > Domain Authentication**.

| Field | Value |
| --- | --- |
| DNS host | Select the actual DNS provider |
| Domain | `ourweddingrecap.com` |
| Advanced settings > Automated Security | `On` |
| Custom return path/subdomain | Accept SendGrid's generated value or use `em` if offered |
| Default authenticated domain | `Yes` if this is the only Recap sending domain |

Add the three CNAME records generated by SendGrid exactly as shown. Do not copy example SendGrid record targets from this guide; account-specific targets contain a unique account ID. If DNS is managed by Cloudflare, keep these records DNS-only rather than proxied. Click **Verify** in SendGrid after DNS propagates.

Domain Authentication provides SPF and DKIM. Keep the existing root-domain Google Workspace MX records unchanged. SendGrid recommends domain authentication before production email; see [Sender Identity](https://www.twilio.com/docs/sendgrid/for-developers/sending-email/sender-identity) and [Domain Authentication](https://www.twilio.com/docs/sendgrid/api-reference/domain-authentication).

The root currently publishes `v=DMARC1; p=none;`. Keep monitoring initially, add an aggregate-report mailbox if desired, and move toward `quarantine` or `reject` only after all legitimate senders are aligned. See SendGrid's [DMARC guide](https://www.twilio.com/docs/sendgrid/ui/sending-email/dmarc).

### 3. Create the application API key

The existing Vercel key has only these scopes and is appropriately narrow:

```text
mail.send
sender_verification_eligible
2fa_required
```

For a replacement or isolated environment key, use:

| Field | Value |
| --- | --- |
| Name | `Recap Production Mail Send` |
| Access | `Restricted Access` / `Custom Access` |
| Mail Send | `Full Access` |
| Every other product permission | `No Access` |

Copy the key once into `SENDGRID_API_KEY`. Do not use the application key for one-time account setup. Create a temporary full-access setup key only if the Inbound Parse security-policy API requires it, then delete that setup key after configuration. SendGrid documents API key scopes and one-time display behavior in [API Keys](https://www.twilio.com/docs/sendgrid/ui/account-and-settings/api-keys).

### 4. Create the reminder unsubscribe group

Go to **Marketing > Unsubscribe Groups > Create New Group**.

| Field | Value |
| --- | --- |
| Group name | `Wedding Gallery Updates` |
| Description | `Optional wedding reminders and gallery updates from Recap.` |
| Display on preferences page | `Yes` |
| Default group | `No` |

Copy the numeric Group ID to:

```text
SENDGRID_REMINDER_UNSUBSCRIBE_GROUP_ID=[POSITIVE INTEGER]
```

Recap sends this value as `asm.group_id` and uses SendGrid's group-unsubscribe URL in every reminder. See [Manage recipients who unsubscribe](https://www.twilio.com/docs/sendgrid/ui/sending-email/create-and-manage-unsubscribe-groups).

### 5. Configure the signed Event Webhook

Go to **Settings > Mail Settings > Event Webhooks > Add Event Webhook**.

| Field | Value |
| --- | --- |
| Friendly name | `Recap Production Delivery Events` |
| Enabled | `On` |
| Post URL | `https://www.ourweddingrecap.com/api/webhooks/sendgrid` |
| Processed | `On` |
| Delivered | `On` |
| Deferred | `On` |
| Bounce | `On` |
| Dropped | `On` |
| Spam Report | `On` |
| Unsubscribe | `On` |
| Group Unsubscribe | `On` |
| Open / Click | Optional and not consumed by Recap |
| Signed Event Webhook | `On` |
| OAuth | `Off` |

Save before testing so SendGrid generates the signing key. Reopen the webhook, copy its public verification key, and set:

```text
SENDGRID_EVENT_WEBHOOK_VERIFICATION_KEY=[EVENT WEBHOOK ECDSA PUBLIC KEY]
```

This is a public verification key, not the private signing key. It is separate from the Inbound Parse security-policy key. After the environment variable is deployed, click **Test Your Integration** and verify a 2xx response. SendGrid's signing setup is documented in [Event Webhook Security Features](https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/getting-started-event-webhook-security-features).

### 6. Configure inbound email DNS and Parse

Use a dedicated subdomain that does not handle ordinary employee email:

```text
uploads.ourweddingrecap.com
```

At the DNS provider, add:

| Host | Type | Priority | Value | TTL |
| --- | --- | --- | --- | --- |
| `uploads` | `MX` | `10` | `mx.sendgrid.net` | `3600` or provider default |

Do not change the root `ourweddingrecap.com` MX records; they currently route ordinary mail to Google Workspace.

In SendGrid **Settings > Inbound Parse > Add Host & URL**:

| Field | Value |
| --- | --- |
| Receiving domain | `uploads.ourweddingrecap.com` |
| Destination URL | `https://www.ourweddingrecap.com/api/webhooks/sendgrid/inbound` |
| Check incoming emails for spam | `On` |
| POST the raw, full MIME message | `Off` |

The application requires SendGrid's default multipart form, not raw MIME. SendGrid does not follow redirects, so use the exact `www` URL. Configure the reply address as:

```text
SENDGRID_INBOUND_EMAIL=photos@uploads.ourweddingrecap.com
```

Inbound Parse accepts arbitrary local parts on the receiving hostname except reserved names such as `abuse`, `postmaster`, and `unsubscribe`. SendGrid's current setup requirements are in [Configure the Inbound Parse Webhook](https://www.twilio.com/docs/sendgrid/for-developers/parsing-email/setting-up-the-inbound-parse-webhook).

### 7. Sign the Inbound Parse webhook

The current Recap route rejects unsigned Inbound Parse requests. Create a signature-only security policy with a temporary SendGrid setup API key:

```bash
export SENDGRID_SETUP_API_KEY='[TEMPORARY FULL-ACCESS KEY]'

curl --request POST 'https://api.sendgrid.com/v3/user/webhooks/security/policies' \
  --header "Authorization: Bearer ${SENDGRID_SETUP_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '{"name":"Recap inbound uploads production","signature":{"enabled":true}}'
```

From the response, record:

- `policy.id`
- `policy.signature.public_key`

Set the public key in Vercel:

```text
SENDGRID_INBOUND_PARSE_VERIFICATION_KEY=[INBOUND POLICY ECDSA PUBLIC KEY]
```

Attach the policy while preserving the non-raw payload:

```bash
export SENDGRID_INBOUND_POLICY_ID='[POLICY UUID]'

curl --request PATCH \
  'https://api.sendgrid.com/v3/user/webhooks/parse/settings/uploads.ourweddingrecap.com' \
  --header "Authorization: Bearer ${SENDGRID_SETUP_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data "{\"url\":\"https://www.ourweddingrecap.com/api/webhooks/sendgrid/inbound\",\"spam_check\":true,\"send_raw\":false,\"security_policy\":\"${SENDGRID_INBOUND_POLICY_ID}\"}"
```

Delete the temporary setup API key after the policy is attached. Do not delete the security policy itself. SendGrid requires signature verification against the exact raw multipart bytes; Recap already performs that validation before parsing. See [Securing Inbound Parse Webhooks](https://www.twilio.com/docs/sendgrid/for-developers/parsing-email/securing-your-parse-webhooks).

### 8. Email footer and sender address

Set:

```text
BUSINESS_POSTAL_ADDRESS=[VALID PHYSICAL POSTAL ADDRESS]
```

Use the actual business street address, a USPS-registered PO Box, or a properly registered commercial mailbox. Do not use only `United States`. The FTC's [CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) explains the physical-address and opt-out requirements.

Reminder email already includes:

- Sender identity
- Gallery link
- Reply-to-upload instructions
- Signed Recap preference link
- SendGrid group unsubscribe link
- Postal address

Test both plain-text and HTML versions, because both are generated by the application.

### 9. Email attachment limit

SendGrid accepts inbound messages up to 30 MB, but Vercel Functions reject request or response bodies above 4.5 MB. MIME/base64 encoding also makes the complete request larger than the original attachment. SendGrid retries 5xx responses, while Vercel's 413 can occur before application code can store the media.

For the first launch, Recap therefore supports **one photo under 2 MB per email**. The route skips larger individual email attachments, and all outgoing/acknowledgement copy directs guests to the web gallery for videos, larger photos, or multiple files. This conservative product limit leaves room for MIME encoding and headers, but an unsolicited oversized message can still be rejected by Vercel before Recap can send a friendly response.

Do not advertise video-by-email or unrestricted email attachments. If full-size email media becomes a product requirement later, choose one:

1. Put the signed Inbound Parse handler behind an ingress that accepts at least 30 MB.
2. Change providers/architecture so attachments are stored by the provider and Recap receives authenticated download URLs.
3. Move the Inbound Parse handler to an environment whose verified request-body limit safely exceeds SendGrid's maximum.

See SendGrid's [30 MB inbound limit](https://www.twilio.com/docs/sendgrid/for-developers/parsing-email/inbound-email) and Vercel's [4.5 MB function payload limit](https://vercel.com/docs/functions/limitations).

## Vercel environment variables

### Production

Add these to the **Production** target only unless noted:

```text
# Twilio
TWILIO_ACCOUNT_SID=AC................................
TWILIO_AUTH_TOKEN=[PRODUCTION AUTH TOKEN]
TWILIO_MESSAGING_SERVICE_SID=MG................................
TWILIO_API_KEY=SK................................
TWILIO_API_SECRET=[PRODUCTION API KEY SECRET]

# Reminder generation
OPENAI_API_KEY=[PRODUCTION AGNTZ/OPENAI KEY]

# SendGrid
SENDGRID_API_KEY=[PRODUCTION MAIL-SEND-ONLY KEY]
SENDGRID_EMAIL=no-reply@ourweddingrecap.com
SENDGRID_FROM_NAME=Recap by Our Wedding Recap
SENDGRID_REPLY_TO_EMAIL=aaron@ourweddingrecap.com
SENDGRID_REMINDER_UNSUBSCRIBE_GROUP_ID=[INTEGER]
SENDGRID_EVENT_WEBHOOK_VERIFICATION_KEY=[EVENT WEBHOOK PUBLIC KEY]
SENDGRID_INBOUND_PARSE_VERIFICATION_KEY=[INBOUND POLICY PUBLIC KEY]
SENDGRID_INBOUND_EMAIL=photos@uploads.ourweddingrecap.com
ORDER_NOTIFICATION_EMAIL=aaron@ourweddingrecap.com

# Messaging security and operations
AUTH_SESSION_SECRET=[UNIQUE RANDOM SECRET]
PREFERENCE_TOKEN_SECRET=[UNIQUE RANDOM SECRET]
CRON_SECRET=[UNIQUE RANDOM SECRET]
BUSINESS_POSTAL_ADDRESS=[VALID PHYSICAL POSTAL ADDRESS]
MESSAGING_ENABLED=false

# Canonical origin
BASE_URL=https://www.ourweddingrecap.com
NEXT_PUBLIC_BASE_URL=https://www.ourweddingrecap.com
```

The pre-existing `POSTGRES_*` and `AWS_*` variables are also required because consent/delivery state is stored in PostgreSQL and inbound media is written to S3. Keep those values environment-specific; the preflight command below checks their presence without printing them.

Generate each signing/session secret independently; do not reuse one value:

```bash
openssl rand -base64 48
```

Vercel automatically sends `CRON_SECRET` as `Authorization: Bearer ...` on production cron requests. Vercel Cron invokes production only, not preview deployments. See [Managing Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs) and [Cron Jobs](https://vercel.com/docs/cron-jobs).

### Staging

Add a separate value for every variable above under **Preview**, scoped specifically to Git branch `staging`.

Use:

- A staging Twilio subaccount, Messaging Service, MMS-capable number, and credentials.
- A SendGrid subuser or separate staging account if the plan permits; otherwise use a separate mail-send API key and only test with controlled addresses.
- `SENDGRID_EMAIL=staging@ourweddingrecap.com` after authenticating the sender.
- `SENDGRID_FROM_NAME=Recap by Our Wedding Recap` and a monitored staging-safe `SENDGRID_REPLY_TO_EMAIL`.
- `SENDGRID_INBOUND_EMAIL=photos@uploads-staging.ourweddingrecap.com` with a separate inbound parse hostname and MX record.
- A separate SendGrid unsubscribe group and separate event/inbound signing keys.
- Unique session, preference, cron, and bypass secrets.
- `BASE_URL=https://staging.ourweddingrecap.com`.
- `MESSAGING_ENABLED=false` until the staging test window.

Do not set provider credentials for all Preview deployments. Branch-scoped values keep arbitrary pull-request previews from sending messages.

### Protected staging webhooks

`staging.ourweddingrecap.com` currently requires Vercel login, so Twilio and SendGrid cannot reach it directly. Create a **Protection Bypass for Automation** secret in Vercel and append it to provider webhook URLs:

```text
https://staging.ourweddingrecap.com/api/webhooks/twilio/inbound?x-vercel-protection-bypass=[STAGING BYPASS SECRET]
https://staging.ourweddingrecap.com/api/webhooks/sendgrid?x-vercel-protection-bypass=[STAGING BYPASS SECRET]
https://staging.ourweddingrecap.com/api/webhooks/sendgrid/inbound?x-vercel-protection-bypass=[STAGING BYPASS SECRET]
```

Do not put the production provider endpoints behind this bypass. Rotate the staging bypass secret if a configured webhook URL is exposed. Vercel documents the query-parameter method for third-party webhooks in [Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

Twilio's signature includes the full configured URL, including the bypass query parameter. Recap's validation retains the incoming query string, so use exactly the same URL in Twilio.

For preview deployments, the Twilio client now appends `x-vercel-protection-bypass` to each generated delivery-status callback when `VERCEL_ENV=preview` and `VERCEL_AUTOMATION_BYPASS_SECRET` is available. Vercel supplies that system environment variable when the automation bypass is configured for the project. Confirm it is exposed to the branch-scoped preview deployment before testing. The application never appends the bypass to production callbacks. Do not put the bypass secret into `BASE_URL`, because that variable is also used as the origin for gallery and preference links.

### Configuration preflight

After loading a complete environment file, run:

```bash
pnpm communications:check -- --environment=staging --env-file=.env.staging.local
pnpm communications:check -- --environment=staging --env-file=.env.staging.local --network

pnpm communications:check -- --environment=production --env-file=.env.production.local
pnpm communications:check -- --environment=production --env-file=.env.production.local --network
```

The command checks all PostgreSQL, AWS, OpenAI, Twilio, SendGrid, signing, postal-address, and base-URL variables without printing their values. The network pass additionally verifies that Privacy, Terms, and SMS-consent pages return 200 without redirects and contain the expected disclosure; it also checks root MX, Inbound Parse MX, and DMARC. A nonzero exit means configuration is not ready. Keep these downloaded environment files outside source control and remove them from the workstation when they are no longer needed.

Run the production preflight with `MESSAGING_ENABLED=false`. A `true` value is reported as a warning because provider registration and the complete end-to-end checklist—not environment shape alone—authorize launch.

## Database and deployment

Run these in order against staging first, then production only after staging succeeds:

```text
migrations/20260718000000_guest_reminders.ts
migrations/20260718010000_inbound_media_uploads.ts
```

Do not infer the target from a local `.env.local`. Confirm the database host and database name before running each migration. Deployment does not automatically run either migration.

Keep `MESSAGING_ENABLED=false` during migration and initial deployment. The kill switch prevents scheduled delivery and reply-media processing but does not replace provider registration or consent controls.

## End-to-end verification

### SendGrid outbound

- [ ] Send a verification/transactional email from the configured sender.
- [ ] Confirm SPF, DKIM, and DMARC pass in the received headers.
- [ ] Confirm the visible From name is `Recap by Our Wedding Recap` or the approved equivalent.
- [ ] Confirm Reply-To is monitored or points to the inbound upload address as intended.
- [ ] Confirm HTML and plain-text reminder versions contain gallery, preference, unsubscribe, and postal-address links/text.
- [ ] Click the group unsubscribe link and verify Recap records the signed group-unsubscribe callback.
- [ ] Trigger a bounce only with a controlled provider test address and verify global email suppression.

### SendGrid inbound

- [ ] Email one supported photo under 2 MB from an opted-in test guest.
- [ ] Email a photo over 2 MB but below the Vercel request limit and verify it is not uploaded and the acknowledgement directs the guest to web upload.
- [ ] Send an unsupported attachment and verify the instructional response.
- [ ] Send from an unknown email and verify no gallery media is created.
- [ ] Verify the image is attributed to the matched person and latest gallery.
- [ ] Replay the same provider payload and verify no duplicate media row.
- [ ] Test an automated email and a message without passing SPF; verify both are ignored.
- [ ] Confirm the application never advertises email video, large-file, or multi-file support and that web upload remains the fallback.
- [ ] Confirm an unsolicited message above 4.5 MB fails at Vercel as documented until ingress is redesigned.

### Twilio

- [ ] Confirm the campaign status is `VERIFIED` and the MMS-capable number is in the campaign Messaging Service.
- [ ] Join a test gallery with the SMS box unchecked; verify no confirmation is sent.
- [ ] Check SMS consent; verify exactly one branded confirmation arrives.
- [ ] Send a reminder and verify brand name, live gallery domain, STOP, and HELP are present.
- [ ] Reply with one image, one video, and multiple attachments.
- [ ] Send text without media and verify the upload instructions.
- [ ] Test unknown-sender behavior.
- [ ] Test a guest whose phone belongs to multiple galleries; verify the latest joined active gallery is selected.
- [ ] Test `STOP`, every provider synonym, `START`, `YES`, `UNSTOP`, `HELP`, and `INFO` after the provider-keyword code gate is complete.
- [ ] Verify no duplicate START/HELP reply is generated.
- [ ] Verify Twilio delivery callbacks update submitted, delivered, failed, and undelivered states.
- [ ] Verify the tenth SMS per guest/gallery is the final allowed message and an eleventh is suppressed.

### Operational launch

- [ ] Set provider spend alerts and Twilio geographic permissions to the intended US traffic only.
- [ ] Confirm Vercel Cron is enabled and its last invocation is authorized.
- [ ] Confirm the production webhook URLs return application responses rather than redirects, 401s, 404s, or Vercel login pages.
- [ ] Confirm logs do not print contact data, message bodies, media, tokens, or provider secrets.
- [ ] Set `MESSAGING_ENABLED=true` only after every applicable checkbox above passes.
- [ ] Keep the old provider credentials active until the first successful production send, then revoke unused keys.

## Current-state audit from July 21, 2026

Verified without changing provider or deployment configuration:

- Vercel has `SENDGRID_API_KEY` and `SENDGRID_EMAIL` for Development, Preview, and Production.
- The configured sender is `no-reply@ourweddingrecap.com`.
- The deployed SendGrid key is limited to `mail.send`; it cannot inspect or configure domains, webhooks, or unsubscribe groups.
- Twilio variables are absent from Vercel.
- `SENDGRID_FROM_NAME`, `SENDGRID_REPLY_TO_EMAIL`, `SENDGRID_REMINDER_UNSUBSCRIBE_GROUP_ID`, both SendGrid verification keys, `SENDGRID_INBOUND_EMAIL`, `AUTH_SESSION_SECRET`, `PREFERENCE_TOKEN_SECRET`, `CRON_SECRET`, `BUSINESS_POSTAL_ADDRESS`, and `MESSAGING_ENABLED` are absent from Vercel.
- Production `BASE_URL` is currently `https://ourweddingrecap.com/`, which redirects to `www`; it must be corrected for Twilio signature validation.
- The `staging` branch has separate database/S3/base-URL settings but is stale and its deployment is protected by Vercel Authentication.
- `ourweddingrecap.com` has Google Workspace MX records and a monitoring-only DMARC record (`p=none`). No inbound-parse MX exists yet at `uploads.ourweddingrecap.com`.
- The local branch adds a public `/sms-consent` reviewer page, fixed-date carrier-review language, the legal operator/DBA identity, consistent communication branding, provider-owned keyword replies, and preview-safe status callbacks. None of these local changes should be represented as live until deployed.
- The code supports signed Twilio, SendGrid Event Webhook, and SendGrid Inbound Parse callbacks; no live provider integration test has been run.
