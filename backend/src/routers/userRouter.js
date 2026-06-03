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
  const sendEmail = require("../utils/resendMail");

  await sendEmail({
    to: "daksh.dev.projects@gmail.com",
    subject: "Test Email",
    html: "<h1>Resend is working 🚀</h1>",
  });

  res.send("Email sent");
});
module.exports = router;
