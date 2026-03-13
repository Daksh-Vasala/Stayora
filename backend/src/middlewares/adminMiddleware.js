const adminMiddleware = async (req, res, next) => {
  try {
    if(!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      })
    }
  
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

module.exports = adminMiddleware