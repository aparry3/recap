import sgMail from '@sendgrid/mail';
import { getWelcomeEmailTemplate } from './email/templates/welcome';
import { getOrderNotificationTemplate } from './email/templates/order_notification';
import { getAdminInvitationEmailTemplate } from './email/templates/admin-invitation';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''

const SENDGRID_VERIFICATION_ID = process.env.SENDGRID_VERIFICATION_ID || ''
const SENDGRID_CREATION_ID = process.env.SENDGRID_CREATION_ID || ''
const SENDGRID_WELCOME_ID = process.env.SENDGRID_WELCOME_ID || ''

const SENDGRID_EMAIL = process.env.SENDGRID_EMAIL || ''
const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || ''

if (!SENDGRID_API_KEY || !SENDGRID_VERIFICATION_ID || !SENDGRID_EMAIL || !SENDGRID_WELCOME_ID || !SENDGRID_CREATION_ID || !ORDER_NOTIFICATION_EMAIL) {
    throw new Error('Required environment variables are not set');
}

export interface TemplateData {
  galleryName: string;
  buttonUrl: string;
  name: string;
}

export interface WelcomeEmailData {
  email: string;
  name: string;
  galleryUrl: string;
}

export interface OrderNotificationData {
    customerName: string;
    customerEmail: string;
    galleryName: string;
    galleryUrl: string;
    orderDate: string;
}

export interface AdminInvitationData {
    name: string;
    email: string;
    verificationUrl: string;
}

export class SendGridClient {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async _sendTemplateEmail(email: string, templateData: TemplateData, templateId: string): Promise<boolean> {
    try {
      const response = await sgMail.send({
        to: email,
        from: SENDGRID_EMAIL,
        templateId,
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

  async sendVerificationEmail(email: string, templateData: TemplateData): Promise<boolean> {
    return await this._sendTemplateEmail(email, templateData, SENDGRID_VERIFICATION_ID)
  }

  async sendWelcomeEmail(email: string, templateData: TemplateData): Promise<boolean> {
    return await this._sendTemplateEmail(email, templateData, SENDGRID_WELCOME_ID)
  }

  async sendCreationEmail(email: string, name: string, galleryUrl: string, password: string): Promise<boolean> {
    try {
      const response = await sgMail.send({
        to: email,
        from: {
          email: SENDGRID_EMAIL,
          name: 'Recap'
        },
        subject: 'Your Recap Gallery is Ready! 🎉',
        html: getWelcomeEmailTemplate({
          name,
          galleryUrl,
          password: password
        }),
      }).catch(err => {
        throw new Error(`Error sending welcome email:, ${err.response.body.errors[0].message}`)
      });
      
      return response[0].statusCode >= 200 && response[0].statusCode < 300;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendOrderNotification(data: OrderNotificationData): Promise<boolean> {
    try {
      const response = await sgMail.send({
        to: ORDER_NOTIFICATION_EMAIL,
        from: {
          email: SENDGRID_EMAIL,
          name: 'Recap'
        },
        subject: `New Gallery Order - ${data.galleryName}`,
        html: getOrderNotificationTemplate(data),
      }).catch(err => {
        throw new Error(`Error sending order notification email: ${err.response.body.errors[0].message}`)
      });
      
      return response[0].statusCode >= 200 && response[0].statusCode < 300;
    } catch (error) {
      console.error('Error sending order notification email:', error);
      return false;
    }
  }

  async sendAdminInvitationEmail(data: AdminInvitationData): Promise<boolean> {
    try {
      const response = await sgMail.send({
        to: data.email,
        from: {
          email: SENDGRID_EMAIL,
          name: 'Recap'
        },
        subject: "You've been added as an admin to Recap!",
        html: getAdminInvitationEmailTemplate({
          name: data.name,
          verificationUrl: data.verificationUrl
        }),
      }).catch(err => {
        throw new Error(`Error sending admin invitation email: ${err.response.body.errors[0].message}`)
      });
      
      return response[0].statusCode >= 200 && response[0].statusCode < 300;
    } catch (error) {
      console.error('Error sending admin invitation email:', error);
      return false;
    }
  }
}

export const sendGridClient = new SendGridClient(SENDGRID_API_KEY);