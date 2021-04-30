
const express = require('express')
const router = express.Router()
const { db, deserializeUser } = require('../db');
const passport = require('passport')
const googleStrategy = require('./googleStrategy')(passport)
const facebookStrategy = require('./facebookStrategy')(passport)
const chalk = require('chalk');

// logout route, begins with /authentication
router.delete('/logout', (req, res, next) => {
  console.log('logout triggered')
  req.logout();
  req.session.destroy()
  res.sendStatus(204);
});

// fetch the logged-in user on our session to use in updating state, even if they refresh
// Passport attaches the session user to the request object
// begins with /authentication
router.get('/me', (req, res, next) => {
  // console.log(chalk.blue('req.user ==>',JSON.stringify(req.user)));
  res.json(!!req.user);
});

// login with Google, begins with /authentication
router.get('/google', passport.authenticate('google', { 
  scope: ['email', 'profile'] 
}));

// login with Google callback, begins with /authentication
router.get('/google/callback',  passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/authenticate/login'
}));

// login with Facebook, begins with /authentication
router.get('/facebook', passport.authenticate('facebook', { 
  scope: ['email', 'public_profile'] 
}));

// login with Facebook callback, begins with /authentication
router.get('/facebook/callback',  passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/authenticate/login'
}));

// serialize user after login to place an identifier in the session store
passport.serializeUser((user, done) => {
  try {
    console.log(chalk.blue('serializeUser ==>', JSON.stringify(user)))
    done(null, user.user_id);
  } catch (err) {
    console.log(chalk.red('serializeUserError ==>', err))
    done(err);
  }
});

// deserialize user_id from session after each request to get necessary info from db
passport.deserializeUser(async (user_id, done) => {
  try {
      const user = await deserializeUser(user_id);
      console.log(chalk.blue('passport deseralizeUser ==>', JSON.stringify(user)));
      if (!user) {  
        done(null, false);
      } else {
        done(null, user);
      }
  } catch (error) {
    console.log(chalk.red('passport deseralizeUserError ==>', error));
    done(error)
  }
});

module.exports = router
