import sgMail from '@sendgrid/mail';
import { getWelcomeEmailTemplate } from './email/templates/welcome';
import { getOrderNotificationTemplate } from './email/templates/order_notification';
import { getAdminInvitationEmailTemplate } from './email/templates/admin-invitation';
import { getUserVerificationEmailTemplate } from './email/templates/user-verification';
import { getReminderEmailTemplate } from './email/templates/reminder';

function configureSendGrid(requireOrderNotificationEmail = false) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const senderEmail = process.env.SENDGRID_EMAIL;
  const orderNotificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !senderEmail || (requireOrderNotificationEmail && !orderNotificationEmail)) {
    throw new Error('Required SendGrid environment variables are not set');
  }

  sgMail.setApiKey(apiKey);

  return {
    senderEmail,
    orderNotificationEmail,
  };
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

export interface ReminderEmailData {
  email: string;
  name: string;
  galleryName: string;
  galleryUrl: string;
  preferenceUrl: string;
  subject: string;
  body: string;
  deliveryId: string;
}

export class SendGridClient {
  async sendReminderEmail(data: ReminderEmailData): Promise<string> {
    const { senderEmail } = configureSendGrid();
    const unsubscribeGroupId = process.env.SENDGRID_REMINDER_UNSUBSCRIBE_GROUP_ID
    if (!process.env.BUSINESS_POSTAL_ADDRESS) throw new Error('BUSINESS_POSTAL_ADDRESS is required for reminder email')
    if (!unsubscribeGroupId) throw new Error('SENDGRID_REMINDER_UNSUBSCRIBE_GROUP_ID is required for reminder email')
    const [response] = await sgMail.send({
      to: data.email,
      from: { email: senderEmail, name: 'Recap' },
      subject: data.subject,
      text: `${data.body}\n\nView and upload photos: ${data.galleryUrl}\nManage preferences: ${data.preferenceUrl}`,
      html: getReminderEmailTemplate({
        galleryName: data.galleryName,
        recipientName: data.name,
        body: data.body,
        galleryUrl: data.galleryUrl,
        preferenceUrl: data.preferenceUrl,
      }),
      customArgs: { delivery_id: data.deliveryId },
      asm: { groupId: Number(unsubscribeGroupId) },
    });
    const messageId = response.headers['x-message-id'];
    return Array.isArray(messageId) ? messageId[0] : String(messageId || data.deliveryId);
  }

  async sendReminderConfirmation(data: Omit<ReminderEmailData, 'subject' | 'body'>): Promise<string> {
    return this.sendReminderEmail({
      ...data,
      subject: `You're subscribed to ${data.galleryName} updates`,
      body: `You're all set to receive wedding reminders and gallery updates by email.`,
    });
  }

  async sendVerificationEmail(email: string, templateData: TemplateData): Promise<boolean> {
    try {
      const { senderEmail } = configureSendGrid();
      const response = await sgMail.send({
        to: email,
        from: {
          email: senderEmail,
          name: 'Recap'
        },
        subject: `Verify your email for ${templateData.galleryName}`,
        html: getUserVerificationEmailTemplate({
          name: templateData.name,
          galleryName: templateData.galleryName,
          verificationUrl: templateData.buttonUrl
        }),
      }).catch(err => {
        throw new Error(`Error sending verification email: ${err.response.body.errors[0].message}`)
      });
      
      return response[0].statusCode >= 200 && response[0].statusCode < 300;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  async sendCreationEmail(email: string, name: string, galleryUrl: string, password: string): Promise<boolean> {
    try {
      const { senderEmail } = configureSendGrid();
      const response = await sgMail.send({
        to: email,
        from: {
          email: senderEmail,
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
      const { senderEmail, orderNotificationEmail } = configureSendGrid(true);
      const response = await sgMail.send({
        to: orderNotificationEmail!,
        from: {
          email: senderEmail,
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
      const { senderEmail } = configureSendGrid();
      const response = await sgMail.send({
        to: data.email,
        from: {
          email: senderEmail,
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

export const sendGridClient = new SendGridClient();
