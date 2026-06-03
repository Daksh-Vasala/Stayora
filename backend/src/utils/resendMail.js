const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Stayora <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT ✅", response);
    return response;
  } catch (error) {
    console.error("RESEND ERROR ❌", error);
    throw error;
  }
};

module.exports = sendEmail;