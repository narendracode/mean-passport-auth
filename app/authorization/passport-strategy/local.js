var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
exports.signupStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
         console.log('##### sign up is called in password local...');
        process.nextTick(function() {
	    User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err){
                    console.log('##### Error occured inside fineOne');
		    return done(err);
		}
                if (user) {
		    console.log('### user already exists.. ');
                    return done(null, false, {'signupMessage': 'Email is already taken.'});
                } else {
			console.log("User successfully registered....");
                    var newUser  = new User();
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
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
        console.log('##### login is  called in passport local..');
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
