const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD, // Gmail App Password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify connection on startup (VERY useful on Render)
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR ❌:", error);
  } else {
    console.log("SMTP READY ✅");
  }
});

const sendTemplateMail = async (to, subject, htmlFile, replacements = {}) => {
  try {
    const htmlPath = path.join(__dirname, "../templates", htmlFile);
    let htmlContent = fs.readFileSync(htmlPath, "utf-8");

    // replace dynamic variables
    for (const key in replacements) {
      htmlContent = htmlContent.replace(
        new RegExp(`{{${key}}}`, "g"),
        replacements[key]
      );
    }

    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail(mailOptions);

    console.log("📩 Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("MAIL SEND ERROR ❌:", error);
    throw error;
  }
};

module.exports = sendTemplateMail;