import nodemailer from 'nodemailer';

const user = process.env.GOOGLE_EMAIL;
const pass = process.env.GOOGLE_APP_PASSWORD;

if (!user || !pass) {
  // Not throwing to keep dev servers from crashing; API will error when used
  console.warn('GOOGLE_EMAIL or GOOGLE_APP_PASSWORD not set. Email sending will fail.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass },
});

export async function sendVerificationEmail(to: string, token: string) {
  if (!user || !pass) {
    throw new Error('Email credentials not configured');
  }

  const subject = 'Your UIC Verification Code';
  const text = `Your verification code is: ${token}\n\nIt will expire in 10 minutes.`;

  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
}
