const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendTemplateMail = require("../utils/mailUtil.js");
const { sendToken } = require("../utils/jwt.js");

const register = async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ email: userData.email });

    //checks if the email is already registered
    if (existingUser) {
      return res.status(400).json({
        message: "User email already exists, please login",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    //creating user in database
    const createdUser = await User.create(userData);

    //creating token by taking unique fields like user id
    sendToken(createdUser, res);

    // hide password in response
    createdUser.password = undefined;

    //sending email to the user
    await sendTemplateMail(
      userData.email,
      "Welcome to our app",
      "Welcome.html",
      {
        name: userData.name,
      },
    );

    res.status(201).json({
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
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

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    user.password = undefined;

    sendToken(user, res);

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    await res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const me = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, logout, me };
