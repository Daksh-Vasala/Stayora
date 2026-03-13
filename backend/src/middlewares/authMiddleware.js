const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // cookie-parser exposes cookies as `req.cookies` (note the plural)
    const token = req.cookies?.token;

    //checks if the token is in cookie or not
    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    //checks the authentication
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
    }

    //storing the user details in req.user 
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    //forwarding the req to next controller or middleware
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = authMiddleware