const jwt = require("jsonwebtoken");
// const userModel=require('../model/auth')
// const cookies = require("cookie-parser");





module.exports.authMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies.token;



    if (!token)
      return res.status(401).json({ message: "token not found unauthorised" });



    const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodeData) return res.status(403).json({ message: "invalid token" });

    req.userId = decodeData.id;

    next();

  } catch (error) {
    res.status(500).json({ message: "Internal server error ", error });
  }

};

