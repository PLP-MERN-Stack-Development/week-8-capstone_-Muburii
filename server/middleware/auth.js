const jwt = require("jsonwebtoken");

// 🔐 Protect routes - verifies token and attaches user to req
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Should contain { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
// 🛡️ Role-based access control
exports.authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};