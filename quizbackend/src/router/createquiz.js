
const express = require("express")
const { Aiquestions, createQuiz, random, getByCategory, getMixedCategories, getcategory, generateMockTestTopic, evaluateMockTest } = require('../controller/createquiz')

const router = express.Router()



router.post('/create', createQuiz)

router.get('/random', random)
router.get('/categories/:cat', getByCategory)
router.get('/mixed', getMixedCategories);
router.get('/categories', getcategory);
router.post('/Aiques', Aiquestions);
router.post('/mock-test/topic', generateMockTestTopic);
router.post('/mock-test/evaluate', evaluateMockTest);


module.exports = router

