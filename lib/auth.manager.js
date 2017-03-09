var logger  = require('./logger.js')(module);

var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


exports.authSetup = function (passport, settings) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'User not found'
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: 'Password is wrong'
          });
        }
        return done(null, user);
      });
    }
  ));

  passport.use(new BasicStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'User not found'
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: 'Password is wrong'
          });
        }
        return done(null, user);
      });
    }
  ));

  var opts = {}
  opts.jwtFromRequest = ExtractJwt.versionOneCompatibility({authScheme: 'Bearer'});
  opts.secretOrKey = settings.secret;

  passport.use(new JwtStrategy(
    opts,
    function(jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'User not found'
          });
        }
        return done(null, user);
      });
    }
  ));

}

exports.authGet = function() {
  return function (req, res) {
    res.send("OK");
  }
}

exports.authPost = function() {
  return function(req, res) {
    var username = req.body.name;
    var password = req.body.password;
    // check if password matches
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log("ERR authenticate: findOne: " + err);
        res.json({ success: false, message: 'Authentication failed.' });
        return;
      }
      if (!user) {
        res.json({ success: false, message: 'User not found.' });
        return;
      }
      if (!user.validPassword(password)) {
        res.json({ success: false, message: 'Password is wrong.' });
        return;
      }
      var token = user.generateJwt();
      res.json({
        success: true,
        message: 'Token sent',
        token: token
      });
    });
  }
}
