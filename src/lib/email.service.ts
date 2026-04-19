import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'HelpHive <noreply@helphive.in>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  // Skip if Resend is not configured
  if (!resend) {
    console.log('Email (dev mode):', { to, subject });
    return { success: true, id: 'dev-mode' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Email sent:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email send failed:', err);
    return { success: false, error: err };
  }
}

// Verification email
export async function sendVerificationEmail(email: string, code: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F7F7; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .header { background: #FF385C; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .bee { font-size: 48px; }
        .content { padding: 32px; text-align: center; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #FF385C; background: #F7F7F7; padding: 16px 32px; border-radius: 8px; display: inline-block; margin: 16px 0; }
        .footer { padding: 16px; text-align: center; color: #717171; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="bee">🐝</div>
          <h1>HelpHive</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email</h2>
          <p>Enter this code to complete your registration:</p>
          <div class="code">${code}</div>
          <p style="color: #717171; font-size: 14px;">This code expires in 10 minutes.</p>
        </div>
        <div class="footer">
          HelpHive - Your Adventure Starts Here
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your HelpHive account',
    html,
  });
}

// Welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F7F7; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .header { background: #FF385C; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .bee { font-size: 48px; }
        .content { padding: 32px; text-align: center; }
        .content h2 { margin: 0 0 16px; color: #222222; }
        .content p { color: #717171; line-height: 1.6; }
        .btn { display: inline-block; background: #FF385C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .footer { padding: 16px; text-align: center; color: #717171; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="bee">🐝</div>
          <h1>HelpHive</h1>
        </div>
        <div class="content">
          <h2>Welcome, ${name}!</h2>
          <p>Your account is now verified and ready to use. Start exploring vehicles, book local experiences, and join tournaments!</p>
          <a href="${APP_URL}/explore/vehicles" class="btn">Explore Now</a>
        </div>
        <div class="footer">
          HelpHive - Your Adventure Starts Here
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to HelpHive! 🐝',
    html,
  });
}

// Password reset email
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F7F7; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .header { background: #FF385C; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .bee { font-size: 48px; }
        .content { padding: 32px; text-align: center; }
        .content h2 { margin: 0 0 16px; color: #222222; }
        .content p { color: #717171; line-height: 1.6; }
        .btn { display: inline-block; background: #FF385C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
        .footer { padding: 16px; text-align: center; color: #717171; font-size: 12px; }
        .warning { background: #FEF3C7; padding: 12px; border-radius: 8px; margin-top: 16px; font-size: 14px; color: #C45A00; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="bee">🐝</div>
          <h1>HelpHive</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <div class="warning">If you didn't request this, you can safely ignore this email.</div>
        </div>
        <div class="footer">
          HelpHive - Your Adventure Starts Here
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your HelpHive password',
    html,
  });
}

// Guide registration confirmation
export async function sendGuideConfirmationEmail(email: string, name: string, city: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F7F7; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .header { background: #008A05; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .bee { font-size: 48px; }
        .content { padding: 32px; text-align: center; }
        .content h2 { margin: 0 0 16px; color: #222222; }
        .content p { color: #717171; line-height: 1.6; }
        .badge { background: #D1FAE5; color: #008A05; padding: 8px 16px; border-radius: 20px; font-weight: 600; display: inline-block; margin: 8px 0; }
        .footer { padding: 16px; text-align: center; color: #717171; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="bee">🐝</div>
          <h1>HelpHive</h1>
        </div>
        <div class="content">
          <h2>Local Guide Application</h2>
          <div class="badge">Application Received</div>
          <p>Hi ${name},</p>
          <p>We've received your application to become a local guide in <strong>${city}</strong>. Our team will review your application within 24-48 hours.</p>
          <p style="font-size: 14px; color: #717171;">You'll be notified once your account is approved.</p>
        </div>
        <div class="footer">
          HelpHive - Your Adventure Starts Here
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Guide Application Received - HelpHive',
    html,
  });
}

// Tournament registration confirmation
export async function sendTournamentConfirmationEmail(email: string, name: string, tournament: string, prize: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F7F7; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .bee { font-size: 48px; }
        .content { padding: 32px; text-align: center; }
        .content h2 { margin: 0 0 16px; color: #222222; }
        .content p { color: #717171; line-height: 1.6; }
        .trophy { font-size: 64px; }
        .prize { font-size: 28px; font-weight: bold; color: #FF385C; }
        .footer { padding: 16px; text-align: center; color: #717171; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="bee">🏆</div>
          <h1>Tournament</h1>
        </div>
        <div class="content">
          <h2>You're In, ${name}!</h2>
          <div class="trophy">🎯</div>
          <p>You've successfully registered for <strong>${tournament}</strong></p>
          <p>Prize Pool: <span class="prize">${prize}</span></p>
          <p style="font-size: 14px; color: #717171; margin-top: 16px;">Good luck! We'll send you reminders before the tournament starts.</p>
        </div>
        <div class="footer">
          HelpHive - Your Adventure Starts Here
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Tournament Registration Confirmed - ${tournament}`,
    html,
  });
}

// Payment confirmation email
export async function sendPaymentConfirmationEmail(email: string, name: string, amount: string, plan: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #F7F7F7; margin: 0; padding: 20px; }
        .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .header { background: #008A05; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .check { font-size: 64px; }
        .content { padding: 32px; text-align: center; }
        .content h2 { margin: 0 0 16px; color: #222222; }
        .amount { font-size: 32px; font-weight: bold; color: #008A05; }
        .details { background: #F7F7F7; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: left; }
        .details p { margin: 8px 0; color: #222222; }
        .footer { padding: 16px; text-align: center; color: #717171; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="check">✅</div>
          <h1>Payment Confirmed</h1>
        </div>
        <div class="content">
          <h2>Thank You, ${name}!</h2>
          <div class="amount">₹${amount}</div>
          <div class="details">
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p><strong>Transaction ID:</strong> ${Date.now().toString(36).toUpperCase()}</p>
          </div>
          <p style="font-size: 14px; color: #717171;">A receipt has been sent to your email.</p>
        </div>
        <div class="footer">
          HelpHive - Your Adventure Starts Here
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Payment Confirmed - ${plan}`,
    html,
  });
}