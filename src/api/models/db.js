const redis = require('redis');
const config = require('../config');

module.exports = redis.createClient(config.redis_port, config.redis_host);