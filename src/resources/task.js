const Task = require('../model/task');

async function get_one(req, res) {
    const id = req.params.id;
    Task.findOne(id)
    .then(task => {
        res.json(task);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status).end();
    });
}

async function get_all(req, res) {
    Task.find()
    .then(task_list => {
        res.json(task_list);
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
}

async function create(req, res) {
    let new_task = new Task(req.body);
    new_task.save()
    .then(task => {
        res.json(task);
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
}

async function update(req, res) {
    const id = req.params.id;
    const body = req.body;
    Task.findOne(id)
    .then(task => {
        for(let k in body)
            if (k in task.data) task.set(k, body[k]);

        return task.save();
    })
    .then(task => {
        res.json(task);
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
}

async function delete_(req, res) {
    const id = req.params.id;
    Task.findOne(id)
    .then(task => {
        return task.delete();
    })
    .then(() => {
        res.json({message: "successful deletion"});
    })
    .catch(err => {
        console.error(err);
        res.status(err.status || 500).end();
    });
}

module.exports = {
	getall: get_all,
	getone: get_one,
	create: create,
	delete: delete_,
	update: update
}