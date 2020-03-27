const express = require('express');
const router = express.Router();

// import route functions
const TaskController = require('./controller/task.controller');
const UserController = require('./controller/user.controller');

/**
 * Middleware that log each request with date
 */
router.use( (req, res, next) => {
    console.log(new Date(Date.now()).toLocaleString(), "::", req.method, "http://"+req.headers.host+req.originalUrl);
    next(); // go to next func (route)
});

// Cross-Origin headers
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// to parse body (json)
router.use(express.json());

/**
 * API routes (see functions for more details)
 */
router.get('/tasks',        TaskController.getall); // get all tasks
router.get('/task/:id',     TaskController.getone); // get task by id
router.post('/task',        TaskController.create); // create task
router.put('/task/:id',     TaskController.update); // edit task
router.delete('/task/:id',  TaskController.delete); // delete task

router.get('/users',        UserController.getall); // get all users
router.get('/user/:id',     UserController.getone); // get user by id
router.post('/user',        UserController.create); // create user
router.put('/user/:id',     UserController.update); // edit user
router.delete('/user/:id',  UserController.delete); // delete user

// export router
module.exports = router;