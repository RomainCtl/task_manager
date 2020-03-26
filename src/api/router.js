const express = require('express');
const router = express.Router();

// import route func
const TaskController = require('./controller/task.controller');

/**
 * Middleware that log each request with date
 */
router.use( (req, res, next) => {
    console.log(new Date(Date.now()).toLocaleString(), "::", req.method, "http://"+req.headers.host+req.originalUrl);
    next(); // go to next func (route)
});

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// to parse body
router.use(express.json());

/**
 * API routes
 */
router.get('/api/tasks',        TaskController.getall);
router.get('/api/task/:id',     TaskController.getone);
router.post('/api/task',        TaskController.create);
router.put('/api/task/:id',     TaskController.update);
router.delete('/api/task/:id',  TaskController.delete);

// export router
module.exports = router;