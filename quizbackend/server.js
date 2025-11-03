require('dotenv').config();

const app=require("./app.js")
const connectDb=require('../quizbackend/src/db/db.js')

const port=3000

connectDb();




app.listen(port,()=>{
 return res.json(`server started at ${port}`);
    
})


