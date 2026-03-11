const mailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, htmlFile, replacements = {}) => {
  const htmlPath = path.join(__dirname, "../templates", htmlFile);
  let htmlContent = fs.readFileSync(htmlPath, "utf-8");

  // replace dynamic variables
  for (const key in replacements) {
    htmlContent = htmlContent.replace(`{{${key}}}`, replacements[key]);
  }

  const mailOptions = {
    from: process.env.MAIL_EMAIL,
    to,
    subject,
    html: htmlContent,
  };

  const mailResponse = await transporter.sendMail(mailOptions);
  return mailResponse;
};

module.exports = sendMail;