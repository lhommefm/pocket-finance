const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session)
const { db } = require('./db')

// logging midddleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session management
app.use(session({
  store: new pgSession({
    pool: db,
    tableName: 'session'
  }),
  secret: process.env.SESSON_SECRET,
  cookie: { secure: false },
  resave: false,
  saveUninitialized: true
}));

// establish the Passport functionality leveraging Express sessions
app.use(passport.initialize());
app.use(passport.session());

// static middleware for public files
app.use(express.static(path.join(__dirname, '../public')))

// authentication
app.use('/authentication', require('./routes/authentication'));

// direct API calls to the api folder (which needs an index.js)
app.use('/api', require('./api'))

// serve the index.html file for non-specific requests
app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
  next(err)
});

// 404 handling
app.use(function (req, res, next) {
  const err = new Error('Route not found.');
  err.status = 404;
  next(err);
});

// error handlng
app.use(function (err, req, res) {
    console.error('Server routing error ==>', err);
    console.error('Server routing error ==>', err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  })

module.exports = app
