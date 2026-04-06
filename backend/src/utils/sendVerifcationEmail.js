const sendTemplateMail = require("../utils/mailUtil");

// utils/sendVerificationEmail.js
const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  await sendTemplateMail(
    user.email,
    "Verify Your Email - Stayora",
    "verification-email.html",
    {
      name: user.name,
      verificationLink: verificationLink,
      year: new Date().getFullYear()
    }
  );
};

module.exports = sendVerificationEmail;