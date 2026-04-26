// middlewares/verifyToken.js
import jwt from "jsonwebtoken";
const { verify } = jwt;


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user to request
    next();
  } catch (err) {
    import('fs').then(fs => {
       fs.appendFileSync('error.log', `VerifyToken Error: ${err.message}\n${err.stack}\n\n`);
    }).catch(() => {});
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

export default verifyToken;
