const {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  getAllUsers,
  verifyEmail,
  resendVerification,
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

router.get("/", authMiddleware, allowedRoles("admin"), getAllUsers);

module.exports = router;
