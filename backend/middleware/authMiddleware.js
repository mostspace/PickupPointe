const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const verifyTokenAndShopper = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    if (req.userRole == "shopper") {
      next();
    } else {
      return res.status(401).json({ error: "You are not a shopper" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const verifyTokenAndVendor = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    if (req.userRole == "vendor") {
      next();
    } else {
      return res.status(401).json({ error: "You are not a vendor" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const verifyTokenAndTabletUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    if (req.userRole == "tabletUser") {
      next();
    } else {
      return res.status(401).json({ error: "You are not a tablet user." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const verifyTokenAndRole = (roles) => {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
      if (roles.includes(req.userRole)) {
        next();
      } else {
        return res.status(401).json({ error: `You are not a ${role}` });
      }
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = {
  verifyToken,
  verifyTokenAndShopper,
  verifyTokenAndVendor,
  verifyTokenAndTabletUser,
  verifyTokenAndRole,
};
