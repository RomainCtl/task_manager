const express = require('express');
const config = require('./config');
const router = require('./router');

var app = express();

// use router
app.use('/', router);

/* Launch server */
app.listen(config.port, () => {
    console.log("Server listenning on", config.url+":"+config.port);
});