
const express = require("express")
const multer = require("multer");
const {
  getPerformance,
  getLeaderboard,
  getSaved,
  Saved,
  Aiquestions,
  AiquestionsFromFile,
  createQuiz,
  random,
  getByCategory,
  getMixedCategories,
  getcategory,
  generateMockTestTopic,
  evaluateMockTest
} = require('../controller/createquiz')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });



router.post('/create', createQuiz)
router.post('/saved', Saved)  // analysis
router.get("/getsaved/:userId", getSaved);
router.get('/random', random)
router.get('/categories/:cat', getByCategory)
router.get('/mixed', getMixedCategories);
router.get('/categories', getcategory);
router.post('/Aiques', Aiquestions);
router.post('/Aiques/file', upload.single("file"), AiquestionsFromFile);
router.post('/mock-test/topic', generateMockTestTopic);
router.post('/mock-test/evaluate', evaluateMockTest);
router.get("/performance/:userId", getPerformance);
router.get("/leaderboard", getLeaderboard);

module.exports = router

