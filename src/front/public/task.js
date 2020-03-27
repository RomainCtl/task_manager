const statusEnum = {
    UNKNOWN: "Non précisé",
    TASK_REQUIRED: "Une tâche est requise",
    IN_PROGRESS: "En cours",
    DONE: "Achevée",
    CANCELLED: "Annulé"
};

/**
 * get all tasks from API
 */
function getTasks() {
    return axios.get(api_host+":"+api_port+"/api/tasks")
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * get task from id with API
 */
function getTask(id) {
    return axios.get(api_host+":"+api_port+"/api/task/"+id)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * create new task with API
 */
function newTask(task) {
    return axios.post(api_host+":"+api_port+"/api/task", task)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * edit task with API
 */
function editTask(task) {
    console.log(task);
    return axios.put(api_host+":"+api_port+"/api/task/"+task.id, task)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * delete task with API
 */
function deleteTask(task) {
    return axios.delete(api_host+":"+api_port+"/api/task/"+task.id)
    .then( res => {
        return res.data;
    })
    .catch( err => {
        console.log(err);
    });
}
