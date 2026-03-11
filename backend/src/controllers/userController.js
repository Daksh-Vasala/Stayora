const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailUtil.js");

const register = async (req, res) => {
  try {
    const userData = req.body;

    //checks f
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
    await sendMail(
      userData.email,
      "Welcome to our app",
      "Welcome.html",
      {
        name: userData.name
      }
    );

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

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "User not found, please sign up",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    user.password = undefined;
    if (isMatch) {
      res.status(200).json({
        message: "User logged in successfully",
        data: user,
        role: user.role,
      });
    } else {
      res.status(401).json({
        message: "Invalid credientials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { register, login };
