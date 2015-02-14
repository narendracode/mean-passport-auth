var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
exports.signupStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
      User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err){
        return done(err);
    }
                if (user) {
                    return done(null, false, {'signupMessage': 'Email is already taken.'});
                } else {
                    var newUser  = new User();
                    newUser.role =  'user';
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    console.log(" ####### new User created with session id : "+req.signedCookies['connect.sid']);
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                         req.login(newUser, function(err) {  
                            if (err) { return next(err); }
                            return done(null, newUser);
                        });
                    });   
               }
            });    
        });
    }                                      
);



exports.loginStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            var mUser = new User();
            User.findOne({ 'local.email' :  email}, function(err, user) {
                if (err)
                    return done(err);
                if (!user) {
                     return done(null, false, {'loginMessage': "Username doesn't exists."});
                } 
                if(!user.validPassword(password)){
          return done(null, false, {'loginMessage': 'Password is wrong.'}); 
        }
                req.login(user, function(err) {  
                     if (err){ 
                         return next(err); 
                     }
                      return done(null, user);
                });
            });    
        });
    }                                      
);
