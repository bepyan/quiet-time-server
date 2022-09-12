import nodemailer from 'nodemailer';

interface IMail {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (mail: IMail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  transporter.sendMail({
    from: `Quiet-Time-Bot <${process.env.NODEMAILER_USER}>`,
    ...mail,
  });
};
