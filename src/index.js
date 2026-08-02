require('dotenv').config();
// const runMode = process.env.RUN_MODE || 'LOCAL';
// process.env.PORT = process.env.PORT || process.env[`PORT_${runMode.toUpperCase()}`] || '3000';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

var app = express();

// Enable CORS for all routes
app.use(cors());
app.options('*', cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", require("./routes"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, 'Endpoint not found'));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
