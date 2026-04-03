const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access restricted to: ${roles.join(", ")}`
        });
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
  };
};

module.exports = allowRoles;