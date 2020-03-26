const { uuid, isUuid } = require('uuidv4');
const status = require("../models/status");

module.exports = {
    id: {
        default: () => uuid(),
        nullable: false,
        type: 'string',
        validate: e => isUuid(e)
    },
    title: {
        default: () => null,
        nullable: false,
        type: 'string',
        validate: e => !!e
    },
    date_begin: {
        default: () => new Date(),
        nullable: false,
        type: 'object',
        validate:  e => e instanceof Date || !!Date.parse(e)
    },
    date_end: {
        default: () => new Date(),
        nullable: false,
        type: 'object',
        validate: e => e instanceof Date || !!Date.parse(e)
    },
    status: {
        default: () => status.UNKNOWN,
        nullable: false,
        type: 'string',
        validate: e => Object.values(status).includes(e)
    },
    tags: {
        default: () => [],
        nullable: false,
        type: 'object',
        validate: e => Array.isArray(e)
    }
}