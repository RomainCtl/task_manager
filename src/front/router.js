const express = require('express');
const router = express.Router();

/**
 * Middleware that log each request with date
 */
router.use( (req, res, next) => {
    console.log(new Date(Date.now()).toLocaleString(), "::", req.method, "http://"+req.headers.host+req.originalUrl);
    next(); // go to next func (route)
});

/**
 * Define routes
 */
router.get('/',         (req, res) => res.redirect(301, '/tasks') ); // redirect /task
router.get('/tasks',    (req, res) => res.sendFile(__dirname +'/public/task.html'));
// router.get('/tasks',    (req, res) => res.json({message: 'prout'}));

// export router
module.exports = router;