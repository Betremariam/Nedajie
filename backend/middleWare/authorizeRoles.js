// middlewares/authorizeRoles.js

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new Error("req.user is undefined in authorizeRoles");
      }
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ msg: "Access denied: insufficient permissions" });
      }

      next();
    } catch (err) {
      import('fs').then(fs => {
        fs.appendFileSync('error.log', `AuthorizeRoles Error: ${err.message}\n${err.stack}\n\n`);
      }).catch(() => {});
      res.status(500).json({ msg: "Server error in authorization" });
    }
  };
};

export default authorizeRoles;
