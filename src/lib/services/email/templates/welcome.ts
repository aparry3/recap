interface WelcomeEmailData {
    name: string;
    galleryUrl: string;
    password: string;
}

export const getWelcomeEmailTemplate = ({
    name,
    galleryUrl,
    password
}: WelcomeEmailData): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Recap Gallery is Ready!</title>
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
                            <img src="https://d2zcso3rdm6ldw.cloudfront.net/branding/wordmarkInverse.png" alt="Recap Logo" style="width: 200px; height: auto; margin-bottom: 20px;">
                            <h1 style="color: #926C60; font-size: 28px; font-weight: 600; margin: 0; text-align: center;">Your Recap Gallery is Ready! 🎉</h1>
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 30px 20px;">
                            <p style="margin: 0 0 20px;">Hi ${name},</p>
                            
                            <p style="margin: 0 0 25px;">Your Recap wedding gallery is set up and ready to go! 🎊 Now it's time to start collecting all those amazing memories from your guests.</p>
                            
                            <p style="margin: 0 0 20px; font-weight: 600; color: #926C60; font-size: 20px;">Here's what to do next:</p>
                            
                            <!-- Steps Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 25px;">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <p style="margin: 0; font-weight: 500;"><span style="font-size: 20px;">✅</span> <strong>Download Your QR Code</strong> – Click the QR code icon at the top of your gallery to customize and download it. Add it to your save-the-dates, invites, or wedding signs!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <p style="margin: 0; font-weight: 500;"><span style="font-size: 20px;">📸</span> <strong>Start Collecting Photos</strong> – Guests can start uploading photos now—even before the wedding! Encourage them to share old photos of you two by scanning the QR code.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <p style="margin: 0; font-weight: 500;"><span style="font-size: 20px;">📲</span> <strong>Guests Get Reminders</strong> – If they enter their phone number or email, they'll receive helpful updates like event details and reminders to upload photos before and after the wedding.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; font-weight: 500;"><span style="font-size: 20px;">💾</span> <strong>Manage Your Gallery</strong> – You can organize photos into albums, download everything, and (soon) even create a video from your wedding moments!</p>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 25px; background-color: #EFD5D0;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="margin: 0 0 15px; font-weight: 600; color: #926C60;">Your personal gallery link:</p>
                                        <a href="${galleryUrl}?password=${password}" style="display: inline-block; padding: 12px 24px; background-color: #926C60; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px;">View Gallery</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 25px;">If you have any questions, reply to this email or reach out to aaron@ourweddingrecap.com—we'll get back to you within 12 hours.</p>
                            
                            <p style="margin: 0 0 15px;">Happy planning! 🥂</p>
                            
                            <p style="margin: 0; color: #926C60;">– The Recap Team</p>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td align="center" style="background-color: #EFD5D0; padding: 20px;">
                            <p style="color: #926C60; font-size: 14px; margin: 0;">© ${new Date().getFullYear()} Recap. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}; 