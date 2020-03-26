const express = require('express');
const config = require('./config');
const router = require('./router');

var app = express();

// use router
app.use('/', router);

// specify public directory (assets)
app.use('/public', express.static('./src/front/public'));

/* Launch server */
app.listen(config.port, () => {
    console.log("Server listenning on", config.url+":"+config.port);
});