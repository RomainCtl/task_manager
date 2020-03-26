const TaskModel = require('../models/task.model');

/**
 * @route GET /task/{id}
 * @summary Find a Task
 * @group Operations about Task
 * @param {string} id.path.required - Task's id
 * @returns {Task.model} 200 - A single task object
 * @returns {object} 404 - Task not Found
 * @returns {Error}  default - Unexpected error
 */
async function get_one(req, res) {
    const id = req.params.id;
    TaskModel.findByID(id)
    .then(task => {
        res.status(200).json(task.data);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status).json(err).end();
    });
}

/**
 * @route GET /tasks
 * @summary Find list of Task
 * @group Operations about Task
 * @returns {Array.<Task>} 200 - List of task object
 * @returns {Error}  default - Unexpected error
 */
async function get_all(req, res) {
    TaskModel.find()
    .then(task_list => {
        res.status(200).json(task_list.map(x => x.data));
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
}

/**
 * @route POST /task
 * @summary Create new Task
 * @group Operations about Task
 * @param {Task.model} task.body.required - Task's object
 * @returns {Task.model} 200 - A single task object
 * @returns {Error}  default - Unexpected error
 */
async function create(req, res) {
    const body = req.body;
    delete body['id'];
    let new_task = new TaskModel(body);
    new_task.save()
    .then(task => {
        res.status(200).json(task.data);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status || 500).json(err || {}).end();
    });
}

/**
 * @route PUT /task/{id}
 * @summary Edit Task
 * @group Operations about Task
 * @param {string} id.path.required - Task's id
 * @param {Task.model} task.body.required - Task's object
 * @returns {Task.model} 200 - A single task object
 * @returns {object} 404 - Task not Found
 * @returns {Error}  default - Unexpected error
 */
async function update(req, res) {
    const id = req.params.id;
    const body = req.body;
    delete body['id'];
    TaskModel.findByID(id)
    .then(task => {
        for(let k in body)
            if (k in task.data && !!body[k])
                task.set(k, body[k]);

        return task.save();
    })
    .then(task => {
        res.status(200).json(task.data);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status || 500).json(err || {}).end();
    });
}

/**
 * @route DELETE /task/{id}
 * @summary Delete a Task
 * @group Operations about Task
 * @param {string} id.path.required - Task's id
 * @returns {Task.model} 200 - A single task object
 * @returns {object} 404 - Task not Found
 * @returns {Error}  default - Unexpected error
 */
async function delete_(req, res) {
    const id = req.params.id;
    TaskModel.findByID(id)
    .then(task => {
        return task.delete();
    })
    .then(() => {
        res.status(200).json({message: "successful deletion"});
    })
    .catch(err => {
        console.error(err);
        res.status(err.status || 500).json(err || {}).end();
    });
}

module.exports = {
	getall: get_all,
	getone: get_one,
	create: create,
	delete: delete_,
	update: update
}