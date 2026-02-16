const express = require('express')
const cors = require("cors")
const cookieParser = require('cookie-parser')
const app = express();
const routes = require('./src/router/createquiz.js')
const authroutes = require('./routes/route.js')

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);


app.use('/quiz', routes)
app.use('/auth', authroutes)




module.exports = app
