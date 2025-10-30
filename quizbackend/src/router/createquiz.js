
const express=require("express")
const {createQuiz,random, getByCategory,getMixedCategories ,getcategory}=require('../controller/createquiz')

const router=express.Router()



router.post('/create',createQuiz)

router.get('/random',random)
router.get('/categories/:cat', getByCategory)
router.get('/mixed', getMixedCategories); 
router.get('/categories', getcategory );


module.exports=router

