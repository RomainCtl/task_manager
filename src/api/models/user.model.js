const UserSchema = require("../schema/user.schema");
const db = require('./db');

/**
 * User model
 * @param {object} data - all fields of User object
 */
const User = function(data) {
    this.data = data;
}

User.prototype.data = {};

/**
 * To validate 'data' field of User with user schema (../schema/user.schema)
 */
User.prototype.sanitize = function (data) {
    data = data || {};
    errors = [];
    for (let attr in UserSchema) {
        if (!(attr in data))
            data[attr] = UserSchema[attr].default();

        if (!UserSchema[attr].nullable && !data[attr])
            errors.push('Attribute '+attr+' is missing !');

        if (!UserSchema[attr].validate(data[attr]))
            errors.push('Error with attribute '+attr+' ! Should be type of '+UserSchema[attr].type);
    }

    let a = new Set(Object.keys(data)),
        b = new Set(Object.keys(UserSchema));
    if (!(a.size === b.size && [...a].every(value => b.has(value))))
        errors.push('Unexpected attributes !');

    if (errors.length > 0)
        throw {status: 400, messages: errors};

    return data;
}

// getter & setter to access to user field
User.prototype.get = function(name) {
    return this.data[name];
}
User.prototype.set = function(name, value) {
    this.data[name] = value;
}

/**
 * Find User by ID (static function)
 * @param {string} id - user id
 */
User.findByID = function(id) {
    return new Promise((resolve, reject) => {
        db.hget("users", id, (err, offer) => {
            let reply = JSON.parse(offer);
            if (err) reject(err);
            else if (!reply) reject({message: "Not Found", status: 404});
            else resolve(new User(reply));
        });
    });
}
/**
 * Find all user (static function)
 */
User.find = function() {
    return new Promise((resolve, reject) => {
        db.hgetall("users", (err, reply) => {
            if (err) reject(err);
            else {
                let result = [];
                for (let k in reply)
                    result.push(new User(JSON.parse(reply[k])));
                resolve(result);
            }
        });
    });
}
/**
 * Save user (new or edition)
 */
User.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this.data = this.sanitize(this.data); // validate with schema

        db.hset("users", this.data.id, JSON.stringify(this.data), (err, reply) => {
            if (err) reject(err);
            else resolve(this); // return User object on resolve
        });
    });
}
/**
 * Delete user
 */
User.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        db.hdel("users", this.data.id, (err, reply) => {
            if (err) reject(err);
            else if (reply) resolve();
            else reject();
        });
    });
}

module.exports = User;
