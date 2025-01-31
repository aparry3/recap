import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const SENDGRID_TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID || ''
const SENDGRID_EMAIL = process.env.SENDGRID_EMAIL || ''

if (!SENDGRID_API_KEY || !SENDGRID_TEMPLATE_ID || !SENDGRID_EMAIL) {
    throw new Error('SENDGRID_API_KEY or SENDGRID_TEMPLATE_ID || SENDGRID_EMAIL is not set');
}

export interface TemplateData {
  galleryName: string;
  buttonUrl: string;
  name: string;
}

export class SendGridClient {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async sendTemplateEmail(email: string, templateData: TemplateData): Promise<boolean> {
    try {
      const response = await sgMail.send({
        to: email,
        from: SENDGRID_EMAIL,
        templateId: SENDGRID_TEMPLATE_ID,
        // Ensure template data is properly typed
        dynamicTemplateData: {
          gallery_name: templateData.galleryName,
          button_url: templateData.buttonUrl,
          name: templateData.name,
        }
      }).catch(err => {
        throw new Error(`Error sending template email:, ${err.response.body.errors[0].message}`)
      })
      console.log(response[0])
      return response[0].statusCode >= 200 && response[0].statusCode < 300;
    } catch (error) {
      console.error(error)
      return false
    }
  }
}

export const sendGridClient = new SendGridClient(SENDGRID_API_KEY);