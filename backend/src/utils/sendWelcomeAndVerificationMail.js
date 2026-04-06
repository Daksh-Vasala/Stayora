const sendTemplateMail = require("../utils/mailUtil.js")

// utils/sendWelcomeAndVerificationEmail.js
const sendWelcomeAndVerificationEmail = async (user, verificationToken) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await sendTemplateMail(
      user.email,
      "Welcome to Stayora! ✨ Verify your email", // Single subject
      "welcome-verification.html", // Single template
      {
        name: user.name,
        verificationLink: verificationLink,
        year: new Date().getFullYear()
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendWelcomeAndVerificationEmail;