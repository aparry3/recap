interface AdminInvitationEmailData {
    name: string;
    verificationUrl: string;
}

export const getAdminInvitationEmailTemplate = ({
    name,
    verificationUrl
}: AdminInvitationEmailData): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You've been added as an admin to Recap!</title>
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
                            <h1 style="color: #926C60; font-size: 28px; font-weight: 600; margin: 0; text-align: center;">You've been added as an admin to Recap!</h1>
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 40px 20px;">
                            <p style="margin: 0 0 20px; font-size: 18px;">Hi ${name},</p>
                            
                            <p style="margin: 0 0 25px; font-size: 16px;">You have been added as an admin to Recap! As an admin, you'll have access to powerful tools to manage galleries and users across the platform.</p>
                            
                            <p style="margin: 0 0 20px; font-weight: 600; color: #926C60; font-size: 20px;">What you can do as an admin:</p>
                            
                            <!-- Admin Capabilities Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 30px;">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <p style="margin: 0; font-size: 16px;"><span style="font-size: 20px;">📊</span> <strong>View All Galleries</strong> – Access and manage all galleries on the platform</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <p style="margin: 0; font-size: 16px;"><span style="font-size: 20px;">👥</span> <strong>Manage Users</strong> – Create and manage admin users</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <p style="margin: 0; font-size: 16px;"><span style="font-size: 20px;">🎨</span> <strong>Create Galleries</strong> – Set up galleries on behalf of users</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; font-size: 16px;"><span style="font-size: 20px;">📈</span> <strong>Monitor Activity</strong> – Track platform usage and statistics</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 30px; font-size: 16px;">Please follow the link below to verify your email and access the admin dashboard:</p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #926C60; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 18px;">Access Admin Dashboard</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 20px; font-size: 14px; color: #666;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
                            <p style="margin: 0 0 30px; font-size: 14px; color: #926C60; word-break: break-all;">${verificationUrl}</p>

                            <p style="margin: 0 0 20px; font-size: 16px;">If you have any questions about your admin access or need help getting started, please reach out to our team.</p>
                            
                            <p style="margin: 0 0 15px; font-size: 16px;">Welcome to the admin team! 🎉</p>
                            
                            <p style="margin: 0; color: #926C60; font-size: 16px;">– The Recap Team</p>
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