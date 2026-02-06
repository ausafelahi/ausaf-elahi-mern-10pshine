const { Resend } = require("resend");
const logger = require("../config/logger");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendPasswordResetOTP = async (email, otp, userName = "User") => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Password Reset - OTP Verification",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 40px;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 40px;
              margin-top: 20px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #667eea;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              text-align: left;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
            h1 {
              color: white;
              margin: 0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: white;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Nodus</div>
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>We received a request to reset your password. Use the OTP below to proceed with password reset.</p>
            
            <div class="otp-box">
              ${otp}
            </div>
            
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Never share this OTP with anyone</li>
                <li>We will never ask for your OTP via phone or email</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <div class="footer">
              <p>This is an automated message from Nodus. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Nodus. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error({ error }, "Failed to send OTP email via Resend");
      throw new Error(`Email sending failed: ${error.message}`);
    }

    logger.info(
      { email, messageId: data?.id },
      "Password reset OTP email sent successfully",
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error(
      { error: error.message },
      "Error in sending password reset OTP",
    );
    throw error;
  }
};

const sendPasswordResetConfirmation = async (email, userName = "User") => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Password Reset Successful",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              border-radius: 10px;
              padding: 40px;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 40px;
              margin-top: 20px;
            }
            .success-icon {
              font-size: 64px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
            h1 {
              color: white;
              margin: 0;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: white;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Nodus</div>
            <h1>Password Reset Successful</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">✅</div>
            <h2>Hello ${userName}!</h2>
            <p>Your password has been successfully reset.</p>
            <p>You can now login with your new password.</p>
            
            <p style="margin-top: 30px;">If you didn't make this change, please contact our support immediately.</p>
            
            <div class="footer">
              <p>This is an automated message from Notes App. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} Nodus. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error({ error }, "Failed to send confirmation email via Resend");
      throw new Error(`Email sending failed: ${error.message}`);
    }

    logger.info(
      { email, messageId: data?.id },
      "Password reset confirmation email sent",
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    logger.error(
      { error: error.message },
      "Error in sending password reset confirmation",
    );
    throw error;
  }
};

module.exports = {
  generateOTP,
  sendPasswordResetOTP,
  sendPasswordResetConfirmation,
};
