const express = require('express');
const router = express.Router();

// import route func
const task = require('./resources/task');

/**
 * Middleware that log each request with date
 */
router.use( (req, res, next) => {
    console.log(new Date(Date.now()).toLocaleString(), "::", req.method, "http://"+req.headers.host+req.originalUrl);
    next(); // go to next func (route)
});

// to parse body
router.use(express.json());

/**
 * API routes
 */
router.get('/api/todo',         task.getall);
router.get('/api/todo/:id',     task.getone);
router.post('/api/todo',        task.create);
router.put('/api/todo/:id',     task.update);
router.delete('/api/todo/:id',  task.delete);

// export router
module.exports = router;