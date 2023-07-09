const router = require("express").Router();
const passport = require('passport');


router.get('/auth/google', passport.authenticate('google', {
  scope:
    ['email', 'profile'],
  accessType: 'offline',
  prompt: 'consent',
}
));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    scope:
      ['email', 'profile'],
    accessType: 'offline',
    prompt: 'consent',
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  }));

module.exports = router;
