import { Resend } from 'resend';
import { getWelcomeEmailTemplate } from './email/templates/welcome';
import { getOrderNotificationTemplate } from './email/templates/order_notification';
import { getAdminInvitationEmailTemplate } from './email/templates/admin-invitation';
import { getUserVerificationEmailTemplate } from './email/templates/user-verification';
import { getReminderEmailTemplate } from './email/templates/reminder';
import { COMMUNICATION_BRAND_NAME } from './brand';
import { oneClickUnsubscribeUrl } from './preferences';

function formatAddress(name: string, email: string): string {
  return `${name} <${email}>`;
}

function configureEmail(requireOrderNotificationEmail = false) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const fromName = process.env.EMAIL_FROM_NAME?.trim() || COMMUNICATION_BRAND_NAME;
  const replyToEmail = process.env.EMAIL_REPLY_TO?.trim();
  const orderNotificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !fromAddress || (requireOrderNotificationEmail && !orderNotificationEmail)) {
    throw new Error('Required Resend environment variables are not set');
  }

  return {
    resend: new Resend(apiKey),
    from: formatAddress(fromName, fromAddress),
    replyToEmail,
    orderNotificationEmail,
  };
}

function supportReplyTo(replyToEmail?: string) {
  return replyToEmail
    ? { replyTo: formatAddress('Our Wedding Recap support', replyToEmail) }
    : {};
}

function requireInboundEmail(): string {
  const inboundEmail = process.env.EMAIL_INBOUND_ADDRESS;
  if (!inboundEmail) throw new Error('EMAIL_INBOUND_ADDRESS is required for reply-to uploads');
  return inboundEmail;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

export interface InboundReplyEmailData {
  email: string;
  subject: string;
  body: string;
}

export function reminderEmailContent(data: ReminderEmailData, postalAddress: string) {
  return {
    subject: data.subject,
    text: `${data.body}\n\nView and upload photos: ${data.galleryUrl}\nOr reply to this email with one photo under 2 MB. Use the gallery link for videos, larger photos, or multiple files.\nManage preferences or unsubscribe: ${data.preferenceUrl}\n\n${postalAddress}`,
    html: getReminderEmailTemplate({
      galleryName: data.galleryName,
      recipientName: data.name,
      body: data.body,
      galleryUrl: data.galleryUrl,
      preferenceUrl: data.preferenceUrl,
    }),
    headers: {
      'List-Unsubscribe': `<${oneClickUnsubscribeUrl(data.preferenceUrl)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    tags: [{ name: 'delivery_id', value: data.deliveryId }],
  };
}

export class EmailClient {
  async sendReminderEmail(data: ReminderEmailData): Promise<string> {
    const { resend, from } = configureEmail();
    const inboundEmail = requireInboundEmail();
    const postalAddress = process.env.BUSINESS_POSTAL_ADDRESS
    if (!postalAddress) throw new Error('BUSINESS_POSTAL_ADDRESS is required for reminder email')
    const { data: result, error } = await resend.emails.send({
      to: data.email,
      from,
      replyTo: formatAddress('Our Wedding Recap uploads', inboundEmail),
      ...reminderEmailContent(data, postalAddress),
    });
    if (error) throw new Error(`Error sending reminder email: ${error.message}`);
    return result?.id || data.deliveryId;
  }

  async sendInboundReply(data: InboundReplyEmailData): Promise<string> {
    const { resend, from } = configureEmail();
    const inboundEmail = requireInboundEmail();
    const { data: result, error } = await resend.emails.send({
      to: data.email,
      from,
      replyTo: formatAddress('Our Wedding Recap uploads', inboundEmail),
      subject: data.subject,
      text: data.body,
      html: `<div style="font-family:Georgia,'Times New Roman',serif;color:#2f2a25;font-size:18px;line-height:1.6;max-width:620px;margin:0 auto;padding:28px;"><p>${escapeHtml(data.body).replaceAll('\n', '<br>')}</p></div>`,
    });
    if (error) throw new Error(`Error sending inbound reply email: ${error.message}`);
    return result?.id || 'submitted';
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
      const { resend, from, replyToEmail } = configureEmail();
      const { error } = await resend.emails.send({
        to: email,
        from,
        ...supportReplyTo(replyToEmail),
        subject: `Verify your email for ${templateData.galleryName || COMMUNICATION_BRAND_NAME}`,
        html: getUserVerificationEmailTemplate({
          name: templateData.name,
          galleryName: templateData.galleryName,
          verificationUrl: templateData.buttonUrl
        }),
      });
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  async sendCreationEmail(email: string, name: string, galleryUrl: string, password: string): Promise<boolean> {
    try {
      const { resend, from, replyToEmail } = configureEmail();
      const { error } = await resend.emails.send({
        to: email,
        from,
        ...supportReplyTo(replyToEmail),
        subject: 'Your Recap Gallery is Ready! 🎉',
        html: getWelcomeEmailTemplate({
          name,
          galleryUrl,
          password: password
        }),
      });
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendOrderNotification(data: OrderNotificationData): Promise<boolean> {
    try {
      const { resend, from, replyToEmail, orderNotificationEmail } = configureEmail(true);
      const { error } = await resend.emails.send({
        to: orderNotificationEmail!,
        from,
        ...supportReplyTo(replyToEmail),
        subject: `New Gallery Order - ${data.galleryName}`,
        html: getOrderNotificationTemplate(data),
      });
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error sending order notification email:', error);
      return false;
    }
  }

  async sendAdminInvitationEmail(data: AdminInvitationData): Promise<boolean> {
    try {
      const { resend, from, replyToEmail } = configureEmail();
      const { error } = await resend.emails.send({
        to: data.email,
        from,
        ...supportReplyTo(replyToEmail),
        subject: "You've been added as an admin to Recap!",
        html: getAdminInvitationEmailTemplate({
          name: data.name,
          verificationUrl: data.verificationUrl
        }),
      });
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error sending admin invitation email:', error);
      return false;
    }
  }

  async sendAdminSignInEmail(data: AdminInvitationData): Promise<boolean> {
    try {
      const { resend, from, replyToEmail } = configureEmail();
      const { error } = await resend.emails.send({
        to: data.email,
        from,
        ...supportReplyTo(replyToEmail),
        subject: 'Sign in to the Our Wedding Recap admin dashboard',
        html: getAdminInvitationEmailTemplate({
          name: data.name,
          verificationUrl: data.verificationUrl,
          purpose: 'sign-in',
        }),
      });
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Error sending admin sign-in email:', error);
      return false;
    }
  }
}

export const emailClient = new EmailClient();
