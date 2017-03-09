var redis = require('redis');
var settings = require('../config/settings.js');
var logger  = require('./logger.js')(module);

var clients = {};

function getClient(name) {
  if (clients[name]) {
    return clients[name];
  }
  var config = settings.redis;
  if (!config[name])
    return null;
  if (!config[name].password)
    delete config[name].password;    
  var client = redis.createClient(config[name]);
  clients[name] = client;
  return client;
    
}

exports.setTimetable = function(key, value, exp, callback) {
  var client = getClient("Results");
  if (!client) {
    callback("No client");
    return;
  }
  client.set(key, value, function(err) {
    if (err) {
      callback(err);
      return;
    }
    client.expire(key, exp, function(err) {
      callback(err);
    });
  });
}

exports.getTimetable = function(key, callback) {
  var client = getClient("Results");
  if (!client) {
    callback("No client");
    return;
  }
  client.get(key, function(err, reply) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, reply);
  });
}

exports.incError = function(key, callback) {
  var client = getClient("Errors");
  if (!client) {
    callback("No client");
    return;
  }
  client.incr(key, function(err, reply) {
    if (err) {
      callback(err);
      return;
    }
    if (reply > settings.maxProxyErrors)
      logger.error("Sending mail");
    callback(null, reply);
  });
}

exports.clearError = function(key, callback) {
  var client = getClient("Errors");
  if (!client) {
    callback("No client");
    return;
  }
  client.del(key, function(err) {
     callback(err);
  });
}

exports.getError = function(key, callback) {
  var client = getClient("Errors");
  if (!client) {
    callback("No client");
    return;
  }
  client.get(key, function(err, reply) {
    if (err) {
      callback(err, null);
      return;
    }
    if (!reply)
      reply = 0;
    callback(null, reply);
  });
}
