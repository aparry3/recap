interface WelcomeEmailData {
    name: string;
    howToUrl: string;
    createUrl: string;
}

export const getWelcomeEmailTemplate = ({
    name,
    howToUrl = 'https://recap.photos/howto',
    createUrl = 'https://recap.photos/create'
}: WelcomeEmailData): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Recap!</title>
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
                            <h1 style="color: #926C60; font-size: 28px; font-weight: 600; margin: 0; text-align: center;">Welcome to Recap! Let's Start Collecting Your Wedding Memories 🎉</h1>
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 30px 20px;">
                            <p style="margin: 0 0 15px;">Hi ${name},</p>
                            
                            <p style="margin: 0 0 20px;">Welcome to Recap! We're thrilled to help you collect and organize all your wedding photos in one beautiful place. Getting started is easy, and we've laid out your next steps below.</p>
                            
                            <!-- Steps Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                <!-- Step 1 -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <div style="color: #CA9B8C; font-size: 20px; font-weight: 500; margin-bottom: 10px;">
                                            <span style="font-size: 24px; margin-right: 8px;">📸</span> Create Your First Album
                                        </div>
                                        <div style="margin-left: 20px;">
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Head to your dashboard and click "Create Album"</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Perfect for engagement photos, wedding events, or your big day</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Customize your album name and cover photo</p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Step 2 -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <div style="color: #CA9B8C; font-size: 20px; font-weight: 500; margin-bottom: 10px;">
                                            <span style="font-size: 24px; margin-right: 8px;">💌</span> Share Recap With Your Guests
                                        </div>
                                        <div style="margin-left: 20px;">
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Add your unique QR codes to your save-the-dates</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Include them in your wedding invitations</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Place them on reception table cards</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> No app needed - guests can upload instantly!</p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Step 3 -->
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <div style="color: #CA9B8C; font-size: 20px; font-weight: 500; margin-bottom: 10px;">
                                            <span style="font-size: 24px; margin-right: 8px;">🌐</span> Connect Your Wedding Website
                                        </div>
                                        <div style="margin-left: 20px;">
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Already using The Knot or Zola? Great!</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Add your Recap link to your wedding website</p>
                                            <p style="margin: 5px 0;"><span style="color: #CA9B8C; margin-right: 8px;">•</span> Make it easy for guests to find all your photo albums</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 15px;">Need help getting started? Just reply to this email - we're here to make your wedding photo collection as seamless as possible.</p>
                            
                            <p style="margin: 0 0 15px;">Happy planning!</p>
                            
                            <p style="margin: 0 0 15px;">The Recap Team</p>
                            
                            <p style="margin: 0 0 30px; font-style: italic;">P.S. Check out our <a href="${howToUrl}" style="color: #CA9B8C; text-decoration: none;">How It Works guide</a> for more tips and inspiration!</p>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td align="center" style="background-color: #EFD5D0; padding: 30px 20px;">
                            <a href="${createUrl}" style="display: inline-block; background-color: #CA9B8C; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-bottom: 20px; font-weight: 700; font-size: 18px;">Create Your First Album</a>
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