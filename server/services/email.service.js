const nodemailer = require('nodemailer');
const config = require('../config');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (config.isTest || !config.email.host) {
    transporter = {
      sendMail: async (options) => {
        if (!config.isTest) {
          console.log('[Email]', options.to, options.subject);
        }
        return { messageId: 'test-mode' };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();
  return mailer.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
    text,
  });
};

const sendVerificationEmail = async (user, rawToken) => {
  const verifyUrl = `${config.clientUrl}/verify-email?token=${rawToken}`;
  return sendEmail({
    to: user.email,
    subject: 'Verify your EventSphere account',
    text: `Verify your email: ${verifyUrl}`,
    html: `<p>Hi ${user.name},</p><p><a href="${verifyUrl}">Verify your email</a></p><p>This link expires in 24 hours.</p>`,
  });
};

const sendPasswordResetEmail = async (user, rawToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${rawToken}`;
  return sendEmail({
    to: user.email,
    subject: 'Reset your EventSphere password',
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Hi ${user.name},</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
