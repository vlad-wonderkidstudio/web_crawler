exports.serverPort  = process.env.SERVER_PORT || 3000;

exports.redisHost = process.env.REDIS_HOST || "localhost";
exports.redisPort = process.env.REDIS_PORT || "6379";
exports.redisPass = process.env.REDIS_PASS || null;

exports.secret = "apisecret";


exports.maxProxyErrors = 5;
exports.maxServerErrors = 10;
exports.redis = {
  "Settings": {
    host: exports.redisHost,
    port: exports.redisPort,
    password:exports.redisPass,
    db: 0
  },
  "Results": {
    host: exports.redisHost,
    port: exports.redisPort,
    password:exports.redisPass,
    db: 1 
  },
  "Errors" : {
    host: exports.redisHost,
    port: exports.redisPort,
    password:exports.redisPass,
    db: 2
  }
};

exports.subdir = '';