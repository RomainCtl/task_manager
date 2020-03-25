const schemas = require("./schemas.js");
const status = require("./status");
const { uuid } = require('uuidv4');
const _ = require("lodash");

const Task = function(data) {
    this.data = data;
}

/* FIXME replace me by DB */
const mock_list = [
    new Task({
        id: "f1b7826e-14fd-49f1-bc7e-d9b1f8043c03",
        title: "list",
        date_begin: new Date(2020, 2, 25),
        date_end: new Date(2020, 2, 26),
        status: status.CANCELLED,
        tags: ["prout"]
    }),
    new Task({
        id: "e41a6ff2-c405-4744-a456-0ae444fb63c6",
        title: "Todo list",
        date_begin: new Date(2020, 2, 25),
        date_end: new Date(2020, 2, 26),
        status: status.IN_PROGRESS,
        tags: ["list", "todo", "tasks"]
    }),
    new Task({
        id: "26198359-c9a1-44b4-ae25-781c17893d77",
        title: "Gateau chocolat",
        date_begin: new Date(2020, 2, 28),
        date_end: new Date(2020, 2, 29),
        status: status.UNKNOWN,
        tags: ["chocolat", "gateau", "patisserie"]
    })
];
/* end of FIXME */


Task.prototype.data = {};

// to validate data
Task.prototype.sanitize = function (data) { // TODO make it great ! (check type, status, ...) + Improve schema
    data = data || {};
    schema = schemas.task;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

// getter & setter
Task.prototype.get = function(name) {
    return this.data[name];
}
Task.prototype.set = function(name, value) {
    this.data[name] = value;
}


/* Service */
Task.findOne = function(id) {
    return new Promise((resolve, reject) => {
        for (let key in mock_list)
            if (mock_list[key].get('id') == id)
                resolve(mock_list[key]);
        reject({message: "Not Found", status: 404});
    });
}
Task.find = function() {
    return new Promise((resolve, reject) => {
        resolve( mock_list.map(x => x.data) );
    });
}
Task.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this.data = this.sanitize(this.data);
        if (!this.data.id)
            this.data.id = uuid();
        resolve(this);
    });
}
Task.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

module.exports = Task;