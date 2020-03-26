const TaskSchema = require("../schema/task.schema");
const db = require('./db');

const Task = function(data) {
    this.data = data;
}

Task.prototype.data = {};

// to validate data
Task.prototype.sanitize = function (data) {
    data = data || {};
    errors = [];
    for (let attr in TaskSchema) {
        if (!(attr in data))
            data[attr] = TaskSchema[attr].default();

        if (!TaskSchema[attr].nullable && !data[attr])
            errors.push('Attribute '+attr+' is missing !');

        if (!TaskSchema[attr].validate(data[attr]))
            errors.push('Error with attribute '+attr+' ! Should be type of '+TaskSchema[attr].type);
    }

    let a = new Set(Object.keys(data)),
        b = new Set(Object.keys(TaskSchema));
    if (!(a.size === b.size && [...a].every(value => b.has(value))))
        errors.push('Unexpected attributes !');

    if (errors.length > 0)
        throw {status: 400, messages: errors};

    return data;
}

// getter & setter
Task.prototype.get = function(name) {
    return this.data[name];
}
Task.prototype.set = function(name, value) {
    this.data[name] = value;
}


/* Service */
Task.findByID = function(id) {
    return new Promise((resolve, reject) => {
        db.hget("tasks", id, (err, offer) => {
            let reply = JSON.parse(offer);
            if (err) reject(err);
            else if (!reply) reject({message: "Not Found", status: 404});
            else resolve(new Task(reply));
        });
    });
}
Task.find = function() {
    return new Promise((resolve, reject) => {
        db.hgetall("tasks", (err, reply) => {
            if (err) reject(err);
            else {
                let result = [];
                for (let k in reply)
                    result.push(new Task(JSON.parse(reply[k])));
                resolve(result);
            }
        });
    });
}
Task.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this.data = this.sanitize(this.data);

        db.hset("tasks", this.data.id, JSON.stringify(this.data), (err, reply) => {
            if (err) reject(err);
            else resolve(this);
        });
    });
}
Task.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        db.hdel("tasks", this.data.id, (err, reply) => {
            if (err) reject(err);
            else if (reply) resolve();
            else reject();
        });
    });
}

module.exports = Task;
