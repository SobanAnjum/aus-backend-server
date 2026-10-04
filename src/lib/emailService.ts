import { Resend } from 'resend';
import path from 'path';
import fs from 'fs';

// Helper to manually read .env in Node runtime if process.env isn't populated
const loadEnvFile = () => {
  if (typeof process !== 'undefined' && process.cwd) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            process.env[key] = val;
          }
        }
      }
    } catch (_) {}
  }
};

loadEnvFile();

const getEnvVar = (name: string): string => {
  if (typeof process !== 'undefined' && process.env?.[name]) {
    return process.env[name] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[name]) {
    return (import.meta as any).env[name] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[`VITE_${name}`]) {
    return (import.meta as any).env[`VITE_${name}`] as string;
  }
  return '';
};

const getResendClient = (): Resend | null => {
  loadEnvFile();
  const key = getEnvVar('RESEND_API_KEY') || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : '');
  if (key && key.startsWith('re_')) {
    return new Resend(key);
  }
  return null;
};

const getEmailFrom = () => getEnvVar('EMAIL_FROM') || 'A u.S Beratung <onboarding@resend.dev>';
const getAdminEmail = () => getEnvVar('ADMIN_NOTIFICATION_EMAIL') || 'admin@aus-beratung.de';

export interface BookingNotificationData {
  bookingRef: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  taskReason?: string;
  company?: string;
  homeAddress?: string;
  notes?: string;
}

/**
 * 1. Send Booking Confirmation Email to the Customer
 */
export async function sendCustomerBookingConfirmation(data: BookingNotificationData) {
  if (!data.clientEmail) {
    return { success: false, error: 'No client email provided' };
  }

  const resend = getResendClient();
  const EMAIL_FROM = getEmailFrom();

  if (!resend) {
    console.info('[Email Demo] Customer confirmation email logged (Set RESEND_API_KEY to dispatch live email):', {
      to: data.clientEmail,
      subject: `Terminbestätigung: ${data.serviceTitle} am ${data.date} (${data.bookingRef})`,
      ref: data.bookingRef,
    });
    return { success: true, mode: 'demo' };
  }

  const html = `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; }
          .badge { display: inline-block; background-color: #ecfdf5; color: #059669; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
          .details-card { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; }
          .label { color: #64748b; font-size: 13px; }
          .val { font-weight: 700; color: #0f172a; font-size: 14px; text-align: right; }
          .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">✓ Termin verbindlich gebucht</span>
            <h1 class="title" style="margin-top: 12px;">Terminbestätigung</h1>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Buchungsreferenz: <strong>${data.bookingRef}</strong></p>
          </div>

          <p>Sehr geehrte(r) <strong>${data.clientName}</strong>,</p>
          <p>vielen Dank für Ihre Terminbuchung. Ihr Beratungstermin bei <strong>A u.S Beratung</strong> wurde verbindlich reserviert.</p>

          <div class="details-card">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="padding: 8px 0; color: #64748b;">Beratungsleistung:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.serviceTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="padding: 8px 0; color: #64748b;">Datum:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="padding: 8px 0; color: #64748b;">Uhrzeit:</td>
                <td style="padding: 8px 0; font-weight: bold; text-align: right;">${data.startTime} - ${data.endTime} Uhr</td>
              </tr>
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="padding: 8px 0; color: #64748b;">Aufgabe / Anliegen:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #2563eb; text-align: right;">${data.taskReason || 'Erstberatung'}</td>
              </tr>
              ${data.company ? `
              <tr style="border-bottom: 1px solid #edf2f7;">
                <td style="padding: 8px 0; color: #64748b;">Unternehmen:</td>
                <td style="padding: 8px 0; text-align: right;">${data.company}</td>
              </tr>` : ''}
            </table>
          </div>

          <p style="font-size: 13px; color: #475569;">
            Sie können vorab relevante Unterlagen, Bescheide oder Belege direkt in Ihrem Kunden-Portal unter Ihrem Termin hochladen.
          </p>

          <div class="footer">
            A u.S Unternehmens- & Wirtschaftsberatung<br>
            Maximilianstraße 35, 80539 München<br>
            Telefon: +49 89 2154 8920 | E-Mail: termin@aus-beratung.de
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.clientEmail,
      subject: `Terminbestätigung: ${data.serviceTitle} am ${data.date} (${data.bookingRef})`,
      html,
    });
    if (response.error) {
      console.warn(`[Customer Email Resend Sandbox Notice] To: ${data.clientEmail} (${response.error.message})`);
      return { success: true, mode: 'sandbox-fallback', error: response.error };
    }
    console.log(`[Customer Email Live] Sent confirmation to ${data.clientEmail}. ID:`, response.data?.id);
    return { success: true, mode: 'live', response };
  } catch (error: any) {
    console.warn('[Email Fallback] Customer confirmation logged:', error.message);
    return { success: true, mode: 'demo-fallback', error: error.message };
  }
}

/**
 * 2. Send New Booking Alert to Admin
 */
export async function sendAdminNewBookingAlert(data: BookingNotificationData) {
  const resend = getResendClient();
  const EMAIL_FROM = getEmailFrom();
  const ADMIN_EMAIL = getAdminEmail();

  if (!resend) {
    console.info('[Email Demo] Admin new booking alert logged:', {
      to: ADMIN_EMAIL,
      client: data.clientName,
      date: data.date,
      time: `${data.startTime} - ${data.endTime}`,
    });
    return { success: true, mode: 'demo' };
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #f8fafc; padding: 20px; color: #0f172a; }
          .card { max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #cbd5e1; }
          .badge { background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Neuer Termin gebucht</span>
          <h2 style="margin: 12px 0 16px 0; color: #0f172a;">📅 Neuer Termin: ${data.clientName}</h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Referenz:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.bookingRef}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Mandant:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.clientName} ${data.company ? `(${data.company})` : ''}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">E-Mail:</td>
              <td style="padding: 8px 0; font-weight: bold;"><a href="mailto:${data.clientEmail}">${data.clientEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Telefon:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.clientPhone || 'Keine Angabe'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Datum & Zeit:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.date} (${data.startTime} - ${data.endTime})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Leistung:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.serviceTitle}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Aufgabe / Anliegen:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2563eb;">${data.taskReason || 'Erstberatung'}</td>
            </tr>
            ${data.homeAddress ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Adresse:</td>
              <td style="padding: 8px 0;">${data.homeAddress}</td>
            </tr>` : ''}
          </table>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `🚨 Neuer Termin gebucht: ${data.clientName} - ${data.date} ${data.startTime}`,
      html,
    });
    if (response.error) {
      console.warn(`[Admin Alert Resend Sandbox Notice] To: ${ADMIN_EMAIL} (${response.error.message})`);
      return { success: true, mode: 'sandbox-fallback', error: response.error };
    }
    console.log(`[Admin Alert Live] Sent notification to ${ADMIN_EMAIL}. ID:`, response.data?.id);
    return { success: true, mode: 'live', response };
  } catch (error: any) {
    console.warn('[Email Fallback] Admin alert logged:', error.message);
    return { success: true, mode: 'demo-fallback', error: error.message };
  }
}

/**
 * 3. Send High-Alert Message from Admin to Customer
 */
export async function sendHighAlertMessageEmail(params: {
  customerEmail: string;
  customerName: string;
  appointmentTitle: string;
  messageContent: string;
  advisorName: string;
}) {
  if (!params.customerEmail) {
    return { success: false, error: 'No customer email' };
  }

  const resend = getResendClient();
  const EMAIL_FROM = getEmailFrom();

  if (!resend) {
    console.info('[Email Demo] High-Alert Email logged:', {
      to: params.customerEmail,
      subject: `🚨 WICHTIGE NACHRICHT: ${params.appointmentTitle}`,
      message: params.messageContent,
    });
    return { success: true, mode: 'demo' };
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #fff; padding: 20px; color: #0f172a; }
          .alert-card { max-width: 580px; margin: 0 auto; border: 2px solid #ef4444; border-radius: 14px; padding: 28px; background: #ffffff; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1); }
          .badge { background-color: #fee2e2; color: #dc2626; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; display: inline-block; letter-spacing: 0.5px; }
          .quote { border-left: 4px solid #ef4444; background-color: #f8fafc; padding: 14px 18px; margin: 18px 0; border-radius: 0 8px 8px 0; font-size: 15px; line-height: 1.5; color: #1e293b; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="alert-card">
          <span class="badge">⚠️ HIGH ALERT / DRINGENDE NACHRICHT</span>
          <h2 style="color: #0f172a; margin: 12px 0 16px 0;">Wichtige Mitteilung zu Ihrem Termin</h2>
          
          <p>Sehr geehrte(r) <strong>${params.customerName}</strong>,</p>
          <p>Ihr Berater <strong>${params.advisorName}</strong> hat eine wichtige Nachricht bezüglich Ihres Termins <em>„${params.appointmentTitle}“</em> gesendet:</p>

          <div class="quote">
            "${params.messageContent}"
          </div>

          <p style="font-size: 13px; color: #64748b;">
            Bitte loggen Sie sich in Ihr Kunden-Portal ein, um direkt auf diese Nachricht zu antworten oder angeforderte Unterlagen hochzuladen.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.customerEmail,
      subject: `🚨 Dringende Nachricht zu Ihrem Termin: ${params.appointmentTitle}`,
      html,
    });
    return { success: true, response };
  } catch (error: any) {
    console.error('[Email Error] Failed to send high alert email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 4. Send 6-Digit Email Verification OTP Code
 */
export async function sendVerificationOtpEmail(email: string, code: string) {
  const resend = getResendClient();
  const EMAIL_FROM = getEmailFrom();

  if (!resend) {
    console.info(`[OTP Login] 🔑 6-Digit Verification Code for ${email} is: ${code}`);
    return { success: true, mode: 'demo', code };
  }

  const html = `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { text-align: center; margin-bottom: 28px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; }
          .subtitle { font-size: 14px; color: #64748b; margin: 0; }
          .otp-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 8px; font-family: monospace; color: #0f172a; margin: 0; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">A u.S Beratung – Anmeldecode</h1>
            <p class="subtitle">Ihr 6-stelliger Bestätigungscode für das Kundenportal</p>
          </div>
          
          <p style="font-size: 14px; color: #334155;">Geben Sie den folgenden Einmalcode ein, um Ihre Anmeldung abzuschließen:</p>
          
          <div class="otp-box">
            <div class="otp-code">${code}</div>
          </div>
          
          <p style="font-size: 13px; color: #64748b; text-align: center;">Dieser Code ist <strong>10 Minuten</strong> gültig. Geben Sie ihn niemals an Dritte weiter.</p>
          
          <div class="footer">
            A u.S Unternehmens- & Wirtschaftsberatung<br>
            Maximilianstraße 35, 80539 München<br>
            © ${new Date().getFullYear()} A u.S Beratung. Alle Rechte vorbehalten.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Ihr A u.S Bestätigungscode: ${code}`,
      html,
    });
    if (response.error) {
      console.warn(`[Email Resend Sandbox Notice] Recipient ${email} restricted by Resend sandbox (${response.error.message}). Verification Code is: ${code}`);
      return { success: true, mode: 'sandbox-fallback', code, error: response.error };
    }
    console.log(`[Email Live] Sent 6-digit OTP code to ${email} via Resend. ID:`, response.data?.id);
    return { success: true, mode: 'live', response };
  } catch (error: any) {
    console.warn(`[OTP Fallback] 🔑 6-Digit Verification Code for ${email} is: ${code}`);
    return { success: true, mode: 'demo-fallback', code, error: error.message };
  }
}
