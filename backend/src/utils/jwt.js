const jwt = require("jsonwebtoken");

const createToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );
};

const sendToken = (user, res) => {
  const token = createToken(user._id, user.email, user.role);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  createToken,
  sendToken
};
