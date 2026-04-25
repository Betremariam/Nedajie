import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  try {
    const header = req.header('Authorization') || '';
    const token = header.replace('Bearer ', '').trim();

    if (!token) return res.status(401).json({ msg: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { 
      id: decoded.id, 
      role: decoded.role, 
      stationId: decoded.stationId,
      stationName: decoded.stationName,
      stationIds: decoded.stationIds
    };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ msg: 'Token invalid or expired' });
  }
}
