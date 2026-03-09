const User = require("../models/userModel.js");

const register = async (req, res) => {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      return res.status(400).json({
        message: "User email already exists, please login",
      });
    }

    const createdUser = await User.create(userData);

    createdUser.password = undefined;

    res.status(201).json({
      message: "User created successfully",
      data: createdUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      error
    });
  }
};

module.exports = { register };