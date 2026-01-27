import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const tokenValue = token.split(" ")[1]; 
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    
    if (decoded.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default adminAuth;