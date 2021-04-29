const { partnerLogin } = require('../db')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const chalk = require('chalk');

// collect our google configuration into an object
const facebookConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'email', 'first_name', 'last_name']
};

// configure the strategy with our config object
const facebookPassport = new FacebookStrategy(facebookConfig, function (accessToken, refreshToken, profile, done) {
 
  // console.log(chalk.green('Facebook Profile returned ==>', JSON.stringify(profile)));  
  // callback function: pull out returned information from Facebook
  const facebookId = profile.id;
  const email = profile.emails[0].value;

  // console.log(chalk.green('Facebook Profile ==>', facebookId, email));

  // if the email exists in the database, update the user with the Facebook ID if needed
  // if the email does not exist, create a new entry
  partnerLogin(email, "facebook", facebookId)
    .then(function (user) {
      // console.log(chalk.blue('FacebookPassport user for done ==>', JSON.stringify(user)))  
      done(null, user);
    })
    .catch(done);
});

// register our strategy with passport
module.exports = () => passport.use(facebookPassport);