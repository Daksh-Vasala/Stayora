const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const sendTemplateMail = require("../utils/mailUtil.js");
const { sendToken } = require("../utils/jwt.js");
const crypto = require("crypto");
const bookingModel = require("../models/bookingModel.js");
const sendWelcomeAndVerificationMail = require("../utils/sendWelcomeAndVerificationMail.js");

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

    const verificationToken = jwt.sign(
      { id: createdUser._id },
      process.env.JWT_KEY,
      { expiresIn: "24h" },
    );

    // Save token to user
    createdUser.verificationToken = verificationToken;
    createdUser.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await createdUser.save();

    await sendWelcomeAndVerificationMail(createdUser, verificationToken);    

    //creating token by taking unique fields like user id
    sendToken(createdUser, res);

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
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if(!token){
      return res.status(400).json({
        success: false,
        message: "Verification token is required"
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY)
    } catch (error) {
      if(error.name === "TokenExporedError"){
        return res.status(400).json({
          success: false,
          message: "Verification link has expired. Please request a new one."
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid verification token"
      });
    }

    const user = await User.findById(decoded.id)
    
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

     // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified. You can login now."
      });
    }

    // Update user as verified
    user.is_verified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now book properties."
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error"
    })
  }
}

// POST /api/auth/resend-verification (Optional but good to have)
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    // Generate new token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Save token
    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email resent. Please check your inbox."
    });

  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email"
    });
  }
};

module.exports = { verifyEmail, resendVerification };

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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      await sendTemplateMail(
        user.email,
        "Password Reset Request",
        "resetPassword.html",
        { resetURL },
      );
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        message: "Email could not be sent",
      });
    }

    res.status(200).json({
      message: "If email exists, reset link sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(400).json({ message: "No user found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {
      totalBookings: 0,
      completitonRate: 85,
    };

    const totalBookings = await bookingModel.countDocuments({ user: userId });
    stats.totalBookings = totalBookings;

    const user = await User.findById(userId);
    let completedFields = 0;
    const totalFields = 5;

    if (user.name) completedFields++;
    if (user.email) completedFields++;
    if (user.phone) completedFields++;
    if (user.location) completedFields++;
    if (user.is_verified) completedFields++;

    stats.completionRate = Math.round((completedFields / totalFields) * 100);

    if (!users) {
      return res.status(400).json({ message: "No user found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  getAllUsers,
  verifyEmail
};
