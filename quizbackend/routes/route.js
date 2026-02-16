
const express = require('express')
const { regsiteruser, loginuser, registerseller, logout, profile, updateProfile, getLeaderboard, addQuizResult } = require('../controller/authuser')

const { authMiddleware, authSeller } = require('../middleware/authuser')

const router = express.Router()


router.post('/register', regsiteruser)
router.post('/login', loginuser)

router.get('/profile', authMiddleware, profile)
router.put('/profile', authMiddleware, updateProfile)
router.get('/leaderboard', authMiddleware, getLeaderboard)
router.post('/quiz-result', authMiddleware, addQuizResult)



router.post('/logout', authMiddleware, logout)





module.exports = router

