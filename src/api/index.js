const express = require('express');
const config = require('./config');
const router = require('./router');
const db = require('./models/db');

var app = express();

// use router
app.use('/', router);

/* Launch server */
app.listen(config.port, () => {
    console.log("Server listenning on", config.url+":"+config.port);
});

/* Connect to database */
db.on('connect', () => {
    console.log('Connected to Redis on', config.redis_host+":"+config.redis_port);
});