
const express = require('express')
const { regsiteruser, loginuser, registerseller, logout, forgotPassword ,resetPassword,profile, updateProfile, getLeaderboard, addQuizResult } = require('../controller/authuser')
const multer = require("multer");

const { authMiddleware, authSeller } = require('../middleware/authuser')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });


router.post('/register', regsiteruser)
router.post('/login', loginuser)

router.get('/profile', authMiddleware, profile)
router.put('/profile', authMiddleware, upload.single("img"), updateProfile)

router.post('/logout', authMiddleware, logout)
router.post("/forgot", forgotPassword);

router.get("/reset/:token", (req, res) => {
  res.send("Show reset password form");
});
router.post("/reset/:token", resetPassword);






module.exports = router

