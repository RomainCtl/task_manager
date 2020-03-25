const status = require("./status");
schemas = {
    task: {
        id: null,
        title: null,
        date_begin: new Date(),
        date_end: new Date(),
        status: status.UNKNOWN,
        tags: []
    }
}

module.exports = schemas;