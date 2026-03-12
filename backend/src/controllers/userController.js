const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendTemplateMail = require("../utils/mailUtil.js");

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
    const token = jwt.sign(
      { id: createdUser._id, role: createdUser.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" },
    );

    //setting the token in browser's cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    //checks if the user is not registered in database
    if (!user) {
      return res.status(400).json({
        message: "User not found, please sign up",
      });
    }

    //comparing passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    //removing password from the body
    user.password = undefined;

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credientials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      data: user,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { register, login };
