var request = require('request');
var fs  = require('fs');
var _ = require('lodash');

var logger  = require('./logger.js')(module);
var config = require('../config/settings.js');
var useragents = require('./json/useragents.json');


var ualen = useragents.length;
var uagents = _.sampleSize(useragents,ualen);

var proxies = [];
var prlen = 0;

const proxyFile = __dirname + '/json/proxies.txt';

var cnt = 0;

exports.loadProxies = function(callback) {
  fs.readFile(proxyFile, "utf-8", function(err, data) {
    if (err) {
      logger.error("Error reading proxies: " + err);
      callback(err);
      return;
    }
    var lines = data.split(/\r?\n/);
    for (var i=0;i<lines.length;i++) {
      if (lines[i].length == 0)
        continue;
      var item = lines[i].split(":");
      if (item.length != 4) {
        logger.error("Invalid proxy: " + lines[i]);
        continue;
      }
      var proxy = "http://"+item[2]+":"+item[3]+"@"+item[0]+":"+item[1];
      proxies.push(proxy);
    }
    prlen = proxies.length;
    if (prlen == 0) {
      logger.error("Zero proxies in the file");
      callback("Zero");
      return;
    }
    callback(null);
  });
}

exports.getProxies = function()
{
  return proxies;
}

exports.getNextProxy = function() {
  if (prlen == 0 || ualen == 0) {
    console.log("No proxies to return");
    return null;
  }
  var res = {
    proxy: proxies[cnt%prlen],
    uagent: uagents[cnt%ualen]
  };
  cnt++;
  return res;
}