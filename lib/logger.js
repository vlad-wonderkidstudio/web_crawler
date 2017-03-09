var util   = require('util'),
    colors   = require('colors/safe');

var LEVELS = {
  "debug" : "white",
  "info" : "green",
  "warn" : "yellow",
  "error" : "red",
  "fatal" : ["red", "bold"]
}

var cwd = process.cwd();

function checkLevels() {
  Object.keys(LEVELS).forEach(function(level) {
    var formats = LEVELS[level];
    formats = Array.isArray(formats) ? formats : [formats];

    formats.forEach(function(format) {
      if (!colors[format]) {
        throw new Error('unknown color code '+format+' in level '+level);
      }
    });
  });
}

function Logger(category) {
  if (!(this instanceof Logger)) return new Logger(category);

  checkLevels();

  if (typeof category !== 'undefined') {
    if (category.filename) {
      // it's a module, so let's extract the filename

      if (category.filename.substr(0, cwd.length) == cwd) {
        // shorten the path 
        this.category = category.filename.slice(cwd.length+1);
      }
      else {
        // path cannot be shortened
        this.category = category.filename;
      }
    }
    else {
      // just a string, assign it
      this.category = category;    
    }
  }
}

function formatLevel(level, text) {
  var formats = LEVELS[level];

  if (typeof formats === 'undefined') {
    throw new Error('unknown logger level: '+level);
  }

  if (!Array.isArray(formats)) {
    formats = [formats];
  }

  formats.forEach(function(format) {
    var color = colors[format];
    text = color(text);
  });

  return text;
}

function ensureLength(str, length) {
  while (str.length < length) {
    str = str + " ";
  }
  return str;
}

Logger.prototype.log = function(level, category /*, args*/) {

  var args = Array.prototype.slice.call(arguments, 0);
  var formatStr = '%s [%s] - %s';

  args.splice(0, 0, formatStr);

  args.splice(1, 1, ensureLength(args[1].toUpperCase(), 5));

  if (this.category) {
    args.splice(2, 0, this.category);
  }

  var now = new Date();
  var result = util.format.apply(util, args);

  result = formatLevel(level, result);
  result = now.toISOString() + " " + result;
 
  //this.transport(result);
  if (level === 'error' || level === 'fatal') {
    console.error(result);
  }
  else {
    console.log(result);
  }
}

Logger.prototype.transport = function(/*args*/) {
  console.log.apply(console, arguments);
}

Logger.prototype.debug = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.splice(0, 0, 'debug');
  return this.log.apply(this, args);
}

Logger.prototype.info = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.splice(0, 0, 'info');
  return this.log.apply(this, args);
}

Logger.prototype.warn = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.splice(0, 0, 'warn');
  return this.log.apply(this, args);
}

Logger.prototype.error = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.splice(0, 0, 'error');
  return this.log.apply(this, args);
}

Logger.prototype.fatal = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.splice(0, 0, 'fatal');
  return this.log.apply(this, args);
}


module.exports = Logger;
module.exports.Logger = new Logger();



