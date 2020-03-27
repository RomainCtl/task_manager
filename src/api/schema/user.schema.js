const { uuid, isUuid } = require('uuidv4');

/**
 * @typedef User
 * @property {string} id.required - unique User identifier
 * @property {string} firstname.required - User firstname
 * @property {string} lastname.required - User lastname
 */
module.exports = {
    id: {
        default: () => uuid(),
        nullable: false,
        type: 'string',
        validate: e => isUuid(e)
    },
    firstname: {
        default: () => null,
        nullable: false,
        type: 'string',
        validate: e => !!e
    },
    lastname: {
        default: () => null,
        nullable: false,
        type: 'string',
        validate: e => !!e
    }
}