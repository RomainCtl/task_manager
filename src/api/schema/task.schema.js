const { uuid, isUuid } = require('uuidv4');
const status = require("../models/status");

// this header is for Swagger doc (Model definition of Task)

/**
 * @typedef Task
 * @property {string} id.required - unique Task identifier
 * @property {string} title.required - Task title
 * @property {string} date_begin - Task beginning date
 * @property {string} date_end - Task end date
 * @property {enum} status - Task's status - eg: Non précisé,Une tâche est requise,En cours,Achevée,Annulé
 * @property {Array.<string>} tags
 */
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
        type: 'string',
        validate:  e => e instanceof Date || !!Date.parse(e)
    },
    date_end: {
        default: () => new Date(),
        nullable: false,
        type: 'string',
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