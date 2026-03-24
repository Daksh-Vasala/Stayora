const {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/me", authMiddleware, me);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
