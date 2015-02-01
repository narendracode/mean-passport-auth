var local = require('./passport-strategy/local.js');
var User = require('./models/UserModel.js');
var facebook = require('./passport-strategy/facebook.js');
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-signup', local.signupStrategy);
    passport.use('local-login', local.loginStrategy);
    passport.use('facebook-login',facebook.facebookStrategy);
}
