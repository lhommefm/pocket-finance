const { partnerLogin } = require('../db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const chalk = require('chalk');

// collect our google configuration into an object
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
};

// configure the strategy with our config object
const googlePassport = new GoogleStrategy(googleConfig, function (request, accessToken, refreshToken, profile, done) {
  
  // callback function: pull out returned information from Google
  const googleId = profile.id;
  const firstName = profile.name.familyName;
  const lastName = profile.name.givenName;
  const email = profile.emails[0].value;

  console.log(chalk.green('Google Profile ==>', googleId, firstName, lastName, email));

  // if the email exists in the database, update the user with the Google ID if needed
  // if the email does not exist, create a new entry
  partnerLogin(email, firstName, lastName, "google", googleId) 
    .then(function (user) {
      console.log(chalk.blue('GooglePassport user for done ==>', JSON.stringify(user)))
      done(null, user);
    })
    .catch(done);

});

// register our strategy with passport
module.exports = () => passport.use(googlePassport);