const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, name, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Default to gmail, can be customized
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SkillPilot AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your SkillPilot AI account',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0514; color: #ffffff; padding: 40px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a78bfa; margin: 0; font-size: 28px;">Welcome to SkillPilot AI</h1>
          <p style="color: #94a3b8; font-size: 16px;">Master any skill, powered by AI.</p>
        </div>
        
        <div style="background-color: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(167, 139, 250, 0.2);">
          <h2 style="margin-top: 0; color: #ffffff;">Hello ${name},</h2>
          <p style="line-height: 1.6; color: #cbd5e1;">
            Thank you for joining SkillPilot AI! We're excited to help you on your learning journey. 
            To get started and access your personalized roadmap, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(to right, #7c3aed, #db2777); color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);">
              Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #64748b; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #a78bfa; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #475569; font-size: 12px;">
          &copy; ${new Date().getFullYear()} SkillPilot AI. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
