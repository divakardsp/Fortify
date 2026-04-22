import "dotenv/config";
import nodemailer from "nodemailer";
import type { TransportOptions } from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
} as TransportOptions);

const sendVerificationEmail = async (
    to: string,
    token: string,
    name: string,
    subject: string = "Email Verification",
) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; color:#ffffff; text-align:center; padding:20px; font-size:22px; font-weight:bold;">
              Verify Your Email
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Hi ${name},</h2>
              
              <p style="font-size:16px; line-height:1.5;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="http://localhost:${process.env.PORT}/api/auth/verify-email/${token}" 
                   style="background:#4f46e5; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:6px; font-size:16px; display:inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#666;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px; color:#4f46e5;">
                http://localhost:${process.env.PORT}/api/auth/verify-email/${token}
              </p>

              <p style="font-size:14px; color:#999; margin-top:30px;">
                This link will expire in 10 minutes. If you didn’t create an account, you can ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#999;">
              © 2026 Your Company. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

await transporter.sendMail({
    from: `hello@divakarsinghpurva.me`,
    to,
    subject,
    html
})
};

const sendPasswordUpdatedEmail = async (to: string, name: string, subject: string = "Password Updated") => {
  const html = `<!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Updated</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">


      <!-- Header -->
      <tr>
        <td style="background:#22c55e; color:#ffffff; text-align:center; padding:20px; font-size:22px; font-weight:bold;">
          Password Updated Successfully
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:#333333;">
          <h2 style="margin-top:0;">Hi ${name},</h2>
          
          <p style="font-size:16px; line-height:1.5;">
            Your password has been successfully updated.
          </p>

          <p style="font-size:16px; line-height:1.5;">
            If you made this change, no further action is required.
          </p>

          <p style="font-size:16px; line-height:1.5; color:#dc2626;">
            If you did NOT change your password, please reset it immediately or contact support.
          </p>

          <p style="font-size:14px; color:#999; margin-top:30px;">
            For your security, we recommend not sharing your password with anyone.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#999;">
          © 2026 Your Company. All rights reserved.
        </td>
      </tr>

    </table>
  </td>
</tr>


  </table>
</body>
</html>
`

await transporter.sendMail({
    from: `hello@divakarsinghpurva.me`,
    to,
    subject,
    html
})
}

const sendResetPasswordEmail = async (to: string, token: string,  name: string, subject: string = "Reset Password") => {
  const html = `<!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">


      <!-- Header -->
      <tr>
        <td style="background:#ef4444; color:#ffffff; text-align:center; padding:20px; font-size:22px; font-weight:bold;">
          Reset Your Password
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px; color:#333333;">
          <h2 style="margin-top:0;">Hi ${name},</h2>
          
          <p style="font-size:16px; line-height:1.5;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>

          <!-- Button -->
          <div style="text-align:center; margin:30px 0;">
            <a href="http://localhost:5473/api/auth/reset-password/${token}" 
               style="background:#ef4444; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:6px; font-size:16px; display:inline-block;">
              Reset Password
            </a>
          </div>

          <p style="font-size:14px; color:#666;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>

          <p style="word-break:break-all; font-size:14px; color:#ef4444;">
            "http://localhost:5473/api/auth/reset-password/${token}"
          </p>

          <p style="font-size:14px; color:#999; margin-top:30px;">
            This link will expire in 15 minutes. If you didn’t request a password reset, you can safely ignore this email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#999;">
          © 2026 Your Company. All rights reserved.
        </td>
      </tr>

    </table>
  </td>
</tr>


  </table>
</body>
</html>
`
await transporter.sendMail({
    from: `hello@divakarsinghpurva.me`,
    to,
    subject,
    html
})
}

export {sendVerificationEmail, sendPasswordUpdatedEmail, sendResetPasswordEmail}
