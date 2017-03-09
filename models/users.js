var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var settings = require('../config/settings.js');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  role: String,
  hash: String,
  salt: String,
  apis: [String],
  date: { type: Date, default: Date.now }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    role: this.role,
    apis: this.apis,
  }, settings.secret, {
    expiresIn: "1 day"
  });
};

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}