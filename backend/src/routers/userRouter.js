const {
  register,
  login,
  logout,
  me,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", me);

module.exports = router;
