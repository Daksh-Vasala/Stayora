const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 2525,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: "Daksh <daksh.dev.projects@gmail.com>",
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT ✅", info.messageId);
    return info;
  } catch (error) {
    console.error("EMAIL ERROR ❌", error);
    throw error;
  }
};

module.exports = sendMail;