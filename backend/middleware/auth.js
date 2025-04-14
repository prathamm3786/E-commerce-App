import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    const { token } = req.headers;
  
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access Login Again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default auth;