import nodemailer from 'nodemailer';

interface SendVerificationEmailParams {
  to: string;
  token: string;
  name: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function sendVerificationEmail({
  to,
  token,
  name,
}: SendVerificationEmailParams) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject: 'Verify your email',
    text: `Hello ${name}, please verify your email by clicking the link: ${verificationUrl}`,
    html: `
      <p>Hello <strong>${name}</strong>,</p>
      <p>Please verify your email by clicking the link below:</p>
      <p>${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?token=${token}</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
  };

  return transporter.sendMail(mailOptions);
}
