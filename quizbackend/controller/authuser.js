const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usermodel = require("../model/auth");
const { sendResetEmail } = require("../service/mailservice");
const crypto = require("crypto");

const getCookieOptions = (req) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
  domain: process.env.NODE_ENV === "production" ? req.hostname : undefined,
});

module.exports.regsiteruser = async (req, res) => {
  console.log(req.body);

  try {
    const {
      email,
      password,
      username,
      fullname: { firstname, lastname, middlename },

    } = req.body;

    const user = await usermodel.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      console.log("⚠️ Duplicate user found:", user.email, user.username);
      return res.status(400).json({ message: "User already existed" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const Regsiteruser = await usermodel.create({
      email,
      username,
      password: hashpassword,
      fullname: {
        firstname,
        lastname,
        middlename,
      },

    });

    const token = jwt.sign(
      { id: Regsiteruser._id, email: Regsiteruser.email },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("token", token, getCookieOptions(req));

    return res.json({
      message: "User register successfully",
      Regsiteruser,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

module.exports.loginuser = async (req, res) => {
  try {
    const { password, username ,email } = req.body;

    if (!username || !password ) {
      return res.status(400).json({
        message: "username and password are required",
      });
    }

    const user = await usermodel.findOne({
      $or: [{ username }],
    });

    if (!user) {
      return res.status(400).json({
        message: "user not found!",
      });
    }

    const isvalid = await bcrypt.compare(password, user.password);

    if (!isvalid) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );


    
    res.cookie("token", token, getCookieOptions(req));

    return res.json({
      message: "user logged in !",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};


module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    console.log(token);

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};


module.exports.profile = async (req, res) => {
  try {
    const userid = req.userId; 

    const user = await usermodel.findById(userid).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "profile fetched",
      user,
    });
  } catch (error) {
    console.log("Error in profile route:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, firstname, lastname, middlename } = req.body || {};

    if (typeof username === "string" && username.trim()) {
      const nextUsername = username.trim();
      const existingUsername = await usermodel.findOne({
        username: nextUsername,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = nextUsername;
    }

    user.fullname = user.fullname || {};
    if (typeof firstname === "string" && firstname.trim()) user.fullname.firstname = firstname.trim();
    if (typeof lastname === "string" && lastname.trim()) user.fullname.lastname = lastname.trim();
    if (typeof middlename === "string") user.fullname.middlename = middlename.trim();

    if (req.file && req.file.buffer) {
      const mimeType = req.file.mimetype || "image/jpeg";
      const base64 = req.file.buffer.toString("base64");
      user.img = `data:${mimeType};base64,${base64}`;
    }

    await user.save();
    const safeUser = await usermodel.findById(userId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
module.exports.forgotPassword= async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usermodel.findOne({ email });
   
    
   
    if (!user) {
      return res.json({ msg: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendResetEmail(user.email, token ,user.username);

    res.json({ msg: "Reset link sent to email" });

  } catch (err) {
    res.status(500).json({ msg: "Error sending reset email" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await usermodel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ msg: "Error resetting password" });
  }
};
