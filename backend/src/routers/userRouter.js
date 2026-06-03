const {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  changePassword,
  updateUserProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");
const sendEmail = require("../utils/mailer.js")

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/me", authMiddleware, me);

router.get("stats", authMiddleware)

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/verify-email", verifyEmail)

router.post("/resend-verification", resendVerification)

router.put("/change-password", authMiddleware, changePassword)

router.put("/update", authMiddleware, updateUserProfile);

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "dakshvasala22@gmail.com",
      subject: "SendGrid Test",
      html: "<h1>Test Email</h1>",
    });

    res.send("Email sent");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
module.exports = router;
