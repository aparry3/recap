interface OrderNotificationData {
    customerName: string;
    customerEmail: string;
    galleryName: string;
    galleryUrl: string;
    orderDate: string;
}

export const getOrderNotificationTemplate = ({
    customerName,
    customerEmail,
    galleryName,
    galleryUrl,
    orderDate
}: OrderNotificationData): string => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Gallery Order - ${galleryName}</title>
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
                            <h1 style="color: #926C60; font-size: 28px; font-weight: 600; margin: 0; text-align: center;">New Gallery Order! 🎉</h1>
                        </td>
                    </tr>

                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 30px 20px;">
                            <p style="margin: 0 0 20px;">Hi there,</p>
                            
                            <p style="margin: 0 0 25px;">A new gallery has been created on Recap! Here are the details:</p>
                            
                            <!-- Order Details Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 25px; background-color: #FDF8F7;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px;"><strong>Customer Name:</strong> ${customerName}</p>
                                        <p style="margin: 0 0 10px;"><strong>Customer Email:</strong> ${customerEmail}</p>
                                        <p style="margin: 0 0 10px;"><strong>Gallery Name:</strong> ${galleryName}</p>
                                        <p style="margin: 0 0 10px;"><strong>Order Date:</strong> ${orderDate}</p>
                                        <p style="margin: 0;"><strong>Gallery URL:</strong> <a href="${galleryUrl}" style="color: #CA9B8C; text-decoration: none;">${galleryUrl}</a></p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 25px;">The customer has been sent their welcome email with setup instructions. You can monitor their gallery's progress through the admin dashboard.</p>
                            
                            <p style="margin: 0 0 15px;">Best regards,</p>
                            
                            <p style="margin: 0; color: #926C60;">– Recap System</p>
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