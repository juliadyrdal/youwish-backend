require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const connectToDatabase = require('./db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Use CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN, 
  credentials: true,
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectToDatabase();

// Define routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Handle auth errors before general errors
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
