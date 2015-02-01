var passport = require('passport');

exports.facebookLogin = function(req,res,next){
	passport.authenticate('facebook-login',{scope:'email'})(req,res,next);
}

exports.facebookLoginCallback = function(req,res,next){
	passport.authenticate('facebook-login',
	{
		successRedirect:'/',
		failureRedirect:'/login'
	})(req,res,next);
}

exports.localSignup =   function(req, res, next){    
    passport.authenticate('local-signup',function(err, user, info){
         console.log('##### local sign  up is called... error:'+JSON.stringify(err)+"    user:"+JSON.stringify(user)+"  info:"+JSON.stringify(info));
        if (err) { return next(err); }
        if(user){
            return res.json(user);
        }
        if(!user){ return res.json({'message':'Account already exists with the email.'}) }
    })(req, res, next);
}

exports.localLogin = function(req, res, next){
    passport.authenticate('local-login',function(err, user, info){
        if (err) { return next(err); }
        if(user){
            return res.json(user);
        }
        if(!user){ return res.json({'message':info['loginMessage']}) }
    })(req, res, next);
}

exports.logout = function(req, res) {
  if(req.user) {
    req.logout();
    res.json({'status':200,'message':'User successfully logged out.'});
  } else {
    res.json({'status':404,'message':'No user found.'});
  }
};


/**
 * Session
 * returns info on authenticated user
 */
exports.isUserAuthenticated = function(req,res){
   console.log("###### req.user value: "+JSON.stringify(req.user)); 
    if(req.user){
         res.json({'message':true});
    }else{
        res.json({'message':false});
    }
}

exports.getCurentUserInfo = function(req, res) {
    if(req.user){
         res.json(req.user);
    }else{
        res.json({'status':404,'message':'no user found'});
    }
 
};


