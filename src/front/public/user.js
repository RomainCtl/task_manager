/**
 * get all users from API
 */
function getUsers() {
    return axios.get(api_host+":"+api_port+"/api/users")
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * get user from id with API
 */
function getUser(id) {
    return axios.get(api_host+":"+api_port+"/api/user/"+id)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * create new user with API
 */
function newUser(user) {
    return axios.post(api_host+":"+api_port+"/api/user", user)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * edit user with API
 */
function editUser(user) {
    return axios.put(api_host+":"+api_port+"/api/user/"+user.id, user)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * delete user with API
 */
function deleteUser(user) {
    return axios.delete(api_host+":"+api_port+"/api/user/"+user.id)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}

/**
 * Add user from form
 */
function addUser(e) {
    e.preventDefault();
    let f = e.target.querySelector('input[name="firstname"]'),
        l = e.target.querySelector('input[name="lastname"]');
    newUser({
        firstname: f.value,
        lastname: l.value
    }).finally( () => {
        refreshUserList();
    });
    f.value = "";
    l.value = "";
}
