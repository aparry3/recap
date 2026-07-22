interface UserVerificationEmailData {
    name: string;
    galleryName: string;
    verificationUrl: string;
}

const escapeHtml = (value: string): string => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

export const getUserVerificationEmailTemplate = ({
    name,
    galleryName,
    verificationUrl
}: UserVerificationEmailData): string => {
    const safeName = escapeHtml(name);
    const safeGalleryName = escapeHtml(galleryName);
    const safeVerificationUrl = escapeHtml(verificationUrl);
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email for ${safeGalleryName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Cormorant', serif; color: #1D1C1C; line-height: 1.6; letter-spacing: 0; background-color: #FDF8F7;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FDF8F7;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; max-width: 600px; width: 100%;">
                    <!-- Header Section -->
                    <tr>
                        <td align="center" style="background-color: #EFD5D0; padding: 30px 20px;">
                            <img src="https://d2zcso3rdm6ldw.cloudfront.net/branding/wordmarkInverse.png" alt="Our Wedding Recap Logo" style="width: 200px; height: auto; margin-bottom: 20px;">
                            <h1 style="color: #926C60; font-size: 28px; font-weight: 600; margin: 0; text-align: center;">Verify your email for ${safeGalleryName}</h1>
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 40px 20px;">
                            <p style="margin: 0 0 20px; font-size: 18px;">Hi ${safeName},</p>
                            
                            <p style="margin: 0 0 25px; font-size: 16px;">It looks like you've been here before. Click here to verify your email address and add this gallery to your profile.</p>
                            
                            <p style="margin: 0 0 25px; font-size: 16px;">Click to confirm your email address for the ${safeGalleryName} gallery:</p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${safeVerificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #926C60; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 18px;">Verify Email</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px; font-size: 14px; color: #666;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
                            <p style="margin: 0 0 30px; font-size: 14px; color: #926C60; word-break: break-all;">${safeVerificationUrl}</p>

                            <p style="margin: 0 0 20px; font-weight: 600; color: #926C60; font-size: 18px;">What happens after verification?</p>
                            
                            <p style="margin: 0 0 15px; font-size: 16px;">Once your email is verified, you'll be able to:</p>
                            
                            <ul style="margin: 0 0 30px; padding-left: 20px;">
                                <li style="margin-bottom: 10px; font-size: 16px;">Access the ${safeGalleryName} gallery from your profile</li>
                                <li style="margin-bottom: 10px; font-size: 16px;">Upload photos and videos to the gallery</li>
                                <li style="margin-bottom: 10px; font-size: 16px;">Receive notifications when new content is added</li>
                                <li style="margin-bottom: 10px; font-size: 16px;">Get reminders about important gallery events</li>
                                <li style="font-size: 16px;">Manage all your galleries in one place</li>
                            </ul>

                            <p style="margin: 0 0 20px; font-size: 16px;">If you have any questions or need help, feel free to reach out to our support team.</p>
                            
                            <p style="margin: 0 0 15px; font-size: 16px;">See you in the gallery!</p>
                            
                            <p style="margin: 0; color: #926C60; font-size: 16px;">– Our Wedding Recap Team</p>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td align="center" style="background-color: #EFD5D0; padding: 20px;">
                            <p style="color: #926C60; font-size: 14px; margin: 0;">© ${new Date().getFullYear()} Our Wedding Recap. All rights reserved.<br>Owned and operated by Parry Technology and Media, LLC.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
};
