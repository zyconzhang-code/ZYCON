import nodemailer from "nodemailer";
import config from "../config/index.js";

export async function sendEmail(subject: string, html: string, text: string) {
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    throw new Error("SMTP 未配置，请设置 SMTP_HOST/SMTP_USER/SMTP_PASS。");
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });

  const fromAddress = config.smtp.from ?? config.smtp.user;
  await transporter.sendMail({
    from: fromAddress,
    to: config.recipient,
    subject,
    html,
    text
  });
}
