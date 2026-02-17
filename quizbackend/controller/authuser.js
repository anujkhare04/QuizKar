const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const bcrypt = require("bcrypt");
const usermodel = require("../model/auth");

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

   res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

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
    const { password, username } = req.body;

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
      return res.status().json({
        message: "invalid creditenals",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );
   res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});


    return res.json({
      message: "user logged in !",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      error: err,
    });
  }
};

module.exports.registerseller = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: login first" });
    }

    const seller = await usermodel.findByIdAndUpdate(req.user._id, {
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated seller:", seller);

    res.status(200).json({
      message: "Seller updated",
      seller: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        fullname: {
          firstname: seller.fullname.firstname,
          lastname: seller.fullname.lastname,
          middlename: seller.fullname.middlename,
        },
        role: seller.role,
      },
    });
  } catch (err) {
    console.error("Error in registerseller:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// module.exports.loginseller=async(req,res)=>{
//    const { email, password } = req.body;
//   //   console.log(req.body);
//   const user = await usermodel.findOne({
//     $or: [{ email }],
//   });
//   if (!user) {
//     return res.json("seller not found!");
//   }
//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) {
//     return res.json("invalid credentials");
//   }
//   const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY);
//   res.json({ message: "seller logged in !", user, token });
// };

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

// module.exports.profile = async (req, res) => {
//   const userid = req.userId;

//   const user = await usermodel.findById(userid);

//   return res.status(200).json({
//     message: "profile fetch",
//     user,
//   });
// };

module.exports.profile = async (req, res) => {
  try {
    const userid = req.userId; // string of user id from middleware

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
    const { firstname, middlename, lastname, img } = req.body;

    const user = await usermodel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstname) user.fullname.firstname = firstname;
    if (middlename) user.fullname.middlename = middlename;
    if (lastname) user.fullname.lastname = lastname;
    if (img) user.img = img;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.addQuizResult = async (req, res) => {
  try {
    const userId = req.userId;
    const { score, totalQuestions, topic } = req.body;

    const user = await usermodel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.quizHistory.push({
      score,
      totalQuestions,
      topic,
      date: new Date()
    });

    // Update total score
    user.totalScore = (user.totalScore || 0) + score;

    await user.save();

    return res.status(200).json({
      message: "Quiz result added",
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await usermodel.find().sort({ totalScore: -1 }).limit(10).select("username totalScore img fullname");
    return res.status(200).json({
      message: "Leaderboard fetched",
      leaderboard
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
