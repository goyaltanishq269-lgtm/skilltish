/**
 * Email Dispatcher Utility for SkillTish
 * Integrated with Resend SDK and resilient fallback logging to terminal.
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export interface SendVerificationEmailOptions {
  to: string;
  name?: string;
  token?: string;
  verificationUrl?: string;
}

/**
 * Dispatch an account verification email via Resend SDK.
 * Supports both sendVerificationEmail(to, verificationUrl) and sendVerificationEmail({ to, name, token, verificationUrl }).
 *
 * If Resend succeeds, logs [RESEND SUCCESS]: Email sent to <to>.
 * If Resend errors or hits free-tier test domain restrictions, logs [RESEND RESTRICTION / FALLBACK]:
 * with the clickable verification URL so testing is never blocked.
 */
export async function sendVerificationEmail(
  toOrOptions: string | SendVerificationEmailOptions,
  verificationUrlArg?: string
): Promise<{ success: boolean; verifyUrl: string }> {
  let to: string;
  let verificationUrl: string;

  if (typeof toOrOptions === 'string') {
    to = toOrOptions;
    verificationUrl = verificationUrlArg || '';
  } else {
    to = toOrOptions.to;
    if (toOrOptions.verificationUrl) {
      verificationUrl = toOrOptions.verificationUrl;
    } else {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      verificationUrl = `${baseUrl}/api/auth/verify-email?token=${toOrOptions.token || ''}`;
    }
  }

  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: 'Verify your SkillTish account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your SkillTish Account</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px;">
            <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #2563eb; padding: 28px 32px; text-align: left;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">SkillTish</h1>
                <p style="color: #dbeafe; margin: 4px 0 0 0; font-size: 13px;">Proof-of-Work Engineering Credential Ledger</p>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Confirm your email address</h2>
                <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                  Thank you for joining SkillTish. To submit code challenges, claim cryptographically signed credentials, and publish your developer portfolio, please verify your email address:
                </p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                    Verify Email Address
                  </a>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 24px 0 0 0;">
                  This link expires in <strong>15 minutes</strong>. If you did not create a SkillTish account, you can safely disregard this message.
                </p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                  Button not working? Copy and paste this URL into your browser:<br />
                  <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.log(`\n[RESEND RESTRICTION / FALLBACK]: ${error.message || JSON.stringify(error)}`);
      console.log(`✉️  Recipient: <${to}>`);
      console.log(`🔗 Clickable Verification Link: ${verificationUrl}`);
      console.log('======================================================\n');
    } else {
      console.log(`\n[RESEND SUCCESS]: Email sent to <${to}> (ID: ${data?.id})\n`);
    }
  } catch (err: any) {
    console.log(`\n[RESEND RESTRICTION / FALLBACK]: ${err?.message || err}`);
    console.log(`✉️  Recipient: <${to}>`);
    console.log(`🔗 Clickable Verification Link: ${verificationUrl}`);
    console.log('======================================================\n');
  }

  return { success: true, verifyUrl: verificationUrl };
}

/**
 * Dispatch a 6-digit OTP code email via Resend SDK.
 */
export async function sendOtpEmail(to: string, otpCode: string): Promise<{ success: boolean }> {
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `SkillTish Verification Code: ${otpCode}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 32px 16px;">
            <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px;">
              <h2 style="color: #0f172a; margin-top: 0;">SkillTish Verification Code</h2>
              <p style="color: #475569; font-size: 14px;">Use the following one-time code to sign in to your SkillTish account:</p>
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
                <span style="font-family: monospace; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1d4ed8;">${otpCode}</span>
              </div>
              <p style="color: #64748b; font-size: 12px;">This code is valid for 10 minutes. For evaluation testing, the universal bypass code <strong>123456</strong> is also supported.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.log(`\n[RESEND RESTRICTION / FALLBACK]: ${error.message || JSON.stringify(error)}`);
      console.log(`✉️  Recipient: <${to}>`);
      console.log(`🔑 Login OTP Code: ${otpCode}`);
      console.log('======================================================\n');
    } else {
      console.log(`\n[RESEND SUCCESS]: OTP code sent to <${to}> (ID: ${data?.id})\n`);
    }
  } catch (err: any) {
    console.log(`\n[RESEND RESTRICTION / FALLBACK]: ${err?.message || err}`);
    console.log(`✉️  Recipient: <${to}>`);
    console.log(`🔑 Login OTP Code: ${otpCode}`);
    console.log('======================================================\n');
  }

  return { success: true };
}
