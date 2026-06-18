const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();

const routes = require('./src/router/createquiz.js');
const authroutes = require('./routes/route.js');

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://quiz-website-delta.vercel.app",
      "https://quizwebsite-production-af02.up.railway.app"
    ],
    credentials: true,
  })
);

app.use(['/api/quiz', '/quiz'], routes);
app.use(['/api/auth', '/auth'], authroutes);

app.get(['/api/health', '/health'], (req, res) =>
  res.status(200).json({ status: 'ok', message: 'Backend is live' })
);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found', path: req.originalUrl });
});

module.exports = app;
