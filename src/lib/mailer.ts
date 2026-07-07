import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@eulab.cloud";
  
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
}
