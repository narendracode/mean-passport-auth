var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require("mongoose");
var passport = require('passport');
var flash = require("connect-flash");
var RedisStore = require('connect-redis')(session)


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("mean-to-do-app-secret"));
app.use(session({
	secret : "mean-to-do-app-secret",
	resave : true,
	saveUninitialized : true,
	store: new RedisStore({
		//url: 'redis://192.168.0.13'
		host: config.redisHost,
		port: config.redisPort
		})
	}));

require('./app/authorization/passport')(passport); //settting up passport config

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use(xsrf);

app.use(express.static(path.join(__dirname, 'client/src')));
app.use('/vendor',express.static(path.join(__dirname, 'client/vendor')));
app.use('/app',express.static(path.join(__dirname, 'client/src/app')));
app.use('/common',express.static(path.join(__dirname, 'client/src/common')));
app.use('/assets',express.static(path.join(__dirname, 'client/src/assets')));
var connect = function(){
   var options = {
      server: {
         socketOptions:{
            keepAlive : 1
         }
      }
   };
   mongoose.connect(config.db,options);
};
connect();
mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);

require('./config/routes')(app);
require('./config/express')(app);


module.exports = app;
