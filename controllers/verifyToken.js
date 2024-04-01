const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        // Handle token verification error (e.g., 401 Unauthorized)
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = user;
      next();
    });
  } else {
    // User is not authenticated
    return res.status(401).json({ message: "You are not authenticated!" });
  }
};


const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userId === req.params.id || // User accessing their own resource
      req.user.isAdmin // OR has admin privileges
    ) {
      next();
    } else {
      // User is not authorized to access this resource
      res.status(403).json({ message: "Authorization Denied! You cannot access this resource." });
    }
  });
};


const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, (err, user) => {
    if (err) {
      // Handle token verification error (e.g., 401 Unauthorized)
      return res.status(401).json({ message: "Invalid token" });
    }

    if (user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Admin privileges required" });
    }
  });
};


module.exports= {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};
