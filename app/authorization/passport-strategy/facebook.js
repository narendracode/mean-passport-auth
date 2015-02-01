var User = require('../models/UserModel.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var passportConfig = require('../../../config/passportConfig.js');
exports.facebookStrategy = new FacebookStrategy({
		clientID: passportConfig.facebook.clientID,
		clientSecret: passportConfig.facebook.clientSecret,
		callbackURL: 'http://'+passportConfig.projectRoot+'/auth/facebook/callback',
		passReqToCallback: true
	},function(req,accessToken,refreshToken,profile,done){
		console.log("User profile: "+JSON.stringify(profile));
		
		//if local exists with same email, link it with facebook.
		User.findOne({'local.email':profile.emails[0].value},function(err,user){
			if(err){
				//do nothing
			}
			if(user){
				user.facebook.id = profile.id;
				user.facebook.name = profile.displayName;
				user.facebook.token = profile.token;
				user.facebook.email = profile.emails[0].value;
				user.save(function(err){
					if(err){
						throw(err);
					}
					req.login(user,function(err){
						if(err){
							return next(err);
						}
						return done(null,user);
					});
				});
			}else{
			//If user's email is not registered as local email.
			User.findOne({'facebook.id' : profile.id},function(err,user){
				if(err){
					done(err);
				}
				if(user){
					req.login(user,function(err){
						if(err){
							return next(err);
						}
						return done(null,user);
					});
				}else{
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.token = profile.token;
					newUser.facebook.email = profile.emails[0].value;
					newUser.save(function(err){
						if(err){
							throw(err);
						}
						req.login(newUser,function(err){
							if(err){
								return next(err);
							}
							return done(null,newUser);
						});
					});
				}
			});
			}
		});
	}
);
