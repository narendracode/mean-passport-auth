var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

userSchema.plugin(require('mongoose-role'), {
        roles: ['user', 'admin'],
        accessLevels: {
                'admin': ['user', 'admin'],
                'user': ['user']
        }
});


userSchema.virtual('password')
.set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.local.password = this.encryptPassword(password);
    })
.get(function() { return this._password });

var validatePresenceOf = function (value) {
   return value && value.length;
};


// methods ======================
userSchema.methods = {
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.local.password);
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.local.password;
  },
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },
  encryptPassword: function (password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  } 
} //methods end

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
