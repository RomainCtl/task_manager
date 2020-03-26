const TaskModel = require('../models/task.model');

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