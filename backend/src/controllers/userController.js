const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      return res.status(400).json({
        message: "User email already exists, please login",
      });
    }

    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    userData.password = hashedPassword;

    const createdUser = await User.create(userData);

    // hide password in response
    createdUser.password = undefined;

    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { register };