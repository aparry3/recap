function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function paragraphs(value: string): string {
  return value.split(/\n{2,}/).map((paragraph) =>
    `<p style="margin:0 0 18px;line-height:1.6;color:#2f2a25;font-size:18px;">${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`
  ).join('')
}

export function getReminderEmailTemplate(input: {
  galleryName: string
  recipientName: string
  body: string
  galleryUrl: string
  preferenceUrl: string
}): string {
  const postalAddress = escapeHtml(process.env.BUSINESS_POSTAL_ADDRESS || 'Parry Technology and Media, LLC, owner and operator of Our Wedding Recap, United States')
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f0e9;font-family:Georgia,'Times New Roman',serif;color:#2f2a25;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f0e9;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(47,42,37,.08);">
          <tr><td style="background:#5f6650;padding:26px 32px;color:#ffffff;text-align:center;">
            <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.85;">Our Wedding Recap</div>
            <div style="font-size:30px;margin-top:8px;">${escapeHtml(input.galleryName)}</div>
          </td></tr>
          <tr><td style="padding:34px 36px 22px;">
            <p style="margin:0 0 18px;font-size:20px;">Hi ${escapeHtml(input.recipientName)},</p>
            ${paragraphs(input.body)}
            <p style="margin:22px 0 18px;line-height:1.6;color:#2f2a25;font-size:18px;"><strong>Have a photo ready?</strong> Reply with one photo under 2 MB and Our Wedding Recap will add it to your gallery. Use the gallery link for videos, larger photos, or multiple files.</p>
            <p style="text-align:center;margin:30px 0;">
              <a href="${escapeHtml(input.galleryUrl)}" style="display:inline-block;background:#5f6650;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:8px;font-size:17px;">View &amp; upload photos</a>
            </p>
          </td></tr>
          <tr><td style="padding:22px 36px 30px;background:#faf8f4;text-align:center;color:#746d64;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;">
            <p style="margin:0 0 8px;">You received this because you opted in to email updates for this gallery.</p>
            <p style="margin:0 0 8px;"><a href="${escapeHtml(input.preferenceUrl)}" style="color:#5f6650;">Manage preferences or unsubscribe</a></p>
            <p style="margin:0;">${postalAddress}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}
