const jwt = require("jsonwebtoken");

// Generate a JSON Web Token for a user
const generateToken = (user) => {
  const { id, name, username } = user;

  const payload = {
    user: {
      id,
      username,
      name,
    },
  };

  // Sign the token with a secret and set expiration
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
};

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid Token." });
  }

  try {
    // Verify token and set user info to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    // Token verification failed
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = { generateToken, authenticateToken };
