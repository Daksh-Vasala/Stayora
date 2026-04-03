const {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  getAllUsers,
} = require("../controllers/userController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const allowedRoles = require("../middlewares/allowedRoles");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/me", authMiddleware, me);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/", authMiddleware, allowedRoles("admin"), getAllUsers);

module.exports = router;
