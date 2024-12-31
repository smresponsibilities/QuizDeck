import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.header("authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: "token is not valid." });
  }
}
