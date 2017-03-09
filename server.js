require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

var passport = require('passport');


var mongoose = require('mongoose');
var _ = require('lodash');

var User = require('./models/users.js').User;

var api = require('./api.js');
var dataManager = require('./lib/data.manager.js');
var proxyManager = require('./lib/proxy.manager.js');
var settings = require('./config/settings.js');
var trips =  require('./trips/trips.js');


require('./lib/auth.manager.js').authSetup(passport, settings);

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


app.use(morgan('dev'));
app.use(passport.initialize());


require('./routes.js')(app, passport);

mongoose.connect('mongodb://127.0.0.1:27017/crawler2api');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  proxyManager.loadProxies(function(err) {
    if (err) {
      console.log("Error loading proxies");
    }
    app.listen(settings.serverPort, function () {
      console.log('Server listening on port ' + settings.serverPort + '!');
    });
  });
});

