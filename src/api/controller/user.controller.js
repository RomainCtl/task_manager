const UserModel = require('../models/user.model');

// theses headers are for Swagger doc (Routes definitions for User)

/**
 * @route GET /user/{id}
 * @summary Find a User
 * @group Operations about User
 * @param {string} id.path.required - User's id
 * @returns {User.model} 200 - A single task object
 * @returns {object} 404 - User not Found
 * @returns {Error}  default - Unexpected error
 */
async function get_one(req, res) {
    const id = req.params.id;
    UserModel.findByID(id)
    .then(user => {
        res.status(200).json(user.data);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status).json(err).end();
    });
}

/**
 * @route GET /users
 * @summary Find list of User
 * @group Operations about User
 * @returns {Array.<User>} 200 - List of user object
 * @returns {Error}  default - Unexpected error
 */
async function get_all(req, res) {
    UserModel.find()
    .then(user_list => {
        res.status(200).json(user_list.map(x => x.data));
    })
    .catch(err => {
        console.error(err);
        res.status(500).end();
    });
}

/**
 * @route POST /user
 * @summary Create new User
 * @group Operations about User
 * @param {User.model} user.body.required - User's object
 * @returns {User.model} 200 - A single user object
 * @returns {Error}  default - Unexpected error
 */
async function create(req, res) {
    const body = req.body;
    delete body['id'];
    let new_user = new UserModel(body);
    new_user.save()
    .then(user => {
        res.status(200).json(user.data);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status || 500).json(err || {}).end();
    });
}

/**
 * @route PUT /user/{id}
 * @summary Edit User
 * @group Operations about User
 * @param {string} id.path.required - User's id
 * @param {User.model} user.body.required - User's object
 * @returns {User.model} 200 - A single user object
 * @returns {object} 404 - User not Found
 * @returns {Error}  default - Unexpected error
 */
async function update(req, res) {
    const id = req.params.id;
    const body = req.body;
    delete body['id'];
    UserModel.findByID(id)
    .then(user => {
        for(let k in body)
            if (k in user.data && !!body[k])
            user.set(k, body[k]);

        return user.save();
    })
    .then(user => {
        res.status(200).json(user.data);
    })
    .catch(err => {
        console.error(err);
        res.status(err.status || 500).json(err || {}).end();
    });
}

/**
 * @route DELETE /user/{id}
 * @summary Delete a User
 * @group Operations about User
 * @param {string} id.path.required - User's id
 * @returns {User.model} 200 - A single user object
 * @returns {object} 404 - User not Found
 * @returns {Error}  default - Unexpected error
 */
async function delete_(req, res) {
    const id = req.params.id;
    UserModel.findByID(id)
    .then(user => {
        return user.delete();
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