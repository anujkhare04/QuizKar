const express=require('express')
const cors=require("cors")
const app=express();
const routes=require('./src/router/createquiz.js')

app.use(express.json()); 



app.use(
  cors({
   origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"],
    credentials: true,
  })
);

app.use('/quiz',routes)




module.exports=app
