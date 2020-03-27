const api_host = "http://localhost";
const api_port = 4000;
const statusEnum = {
    UNKNOWN: "Non précisé",
    TASK_REQUIRED: "Une tâche est requise",
    IN_PROGRESS: "En cours",
    DONE: "Achevée",
    CANCELLED: "Annulé"
};

var tasks = [], // task get from API
    displayed_tasks = [], // task displayed (according to filter)
    not_completed_not_cancelled_not_yet_expired = false;

/**
 * get all tasks from API
 */
function getTasks() {
    axios.get(api_host+":"+api_port+"/api/tasks")
    .then( res => {
        window.tasks = res.data;
        window.displayed_tasks = res.data;
        filt(); // launch 'not_completed_not_cancelled_not_yet_expired' filter function to display new tasks
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * create new task with API
 */
function newTask(task) {
    axios.post(api_host+":"+api_port+"/api/task", task)
    .then( res => {
        // TODO do something with result
        getTasks();
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
    axios.put(api_host+":"+api_port+"/api/task/"+task.id, task)
    .then( res => {
        // TODO do something with result
        getTasks();
    })
    .catch( err => {
        console.log(err);
    });
}
/**
 * delete task with API
 */
function deleteTask(task) {
    axios.delete(api_host+":"+api_port+"/api/task/"+task.id)
    .then( res => {
        // TODO do something with result
        getTasks();
    })
    .catch( err => {
        console.log(err);
    });
}


/**
 * Add event listener on each 'trash' button (to delete task)
 */
function setCloseEffect() {
    let close = document.getElementsByClassName("delete");
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            let t = this.parentElement,
                task = JSON.parse( t.getAttribute("data-task") );

            deleteTask(task);
        }
    }
}

/**
 * Add event listener on each 'edit' button (to edit task)
 */
function setEditEffect() {
    let edit = document.getElementsByClassName("edit");
    for (i = 0; i < edit.length; i++) {
        edit[i].onclick = function() {
            let t = this.parentElement,
                task = JSON.parse( t.getAttribute("data-task") ); // get task object from 'data-task' attribute

            // send data to input fields
            id.value = task.id;
            title.value = task.title;
            let date = new Date(task.date_begin);
            date_begin.value = date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+date.getUTCDate();
            date = new Date(task.date_end);
            date_end.value = date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+date.getUTCDate();
            status_e.value = task.status;
            tags.value = task.tags.join(" ");

            // display edit btn, hide add btn and display modal window
            editTaskbtn.style.display = "flex";
            addTaskbtn.style.display = "none";
            modal.style.display = "flex";
        }
    }
}

/**
 * Create HTML element that represents the Task object
 * @param {Task} task - Task object
 * @requires TR element (HTML) to display
 */
function createChild(task) {
    let e = document.createElement("tr");
    e.setAttribute("data-task", JSON.stringify(task)); // stock task object in attr of TR element

    // add column for title
    let span = document.createElement("td");
    span.appendChild( document.createTextNode(task.title) );
    e.appendChild(span);

    // add column for begin date
    span = document.createElement("td");
    let date = new Date(task.date_begin);
    span.appendChild( document.createTextNode(date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+date.getUTCDate()) );
    e.appendChild(span);

    // add column for end date
    span = document.createElement("td");
    date = new Date(task.date_end);
    span.appendChild( document.createTextNode(date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+date.getUTCDate()) );
    e.appendChild(span);

    // add column for status
    span = document.createElement("td");
    span.appendChild( document.createTextNode(task.status) );
    e.appendChild(span);

    // add delete btn
    span = document.createElement("td");
    let txt = document.createTextNode("🗑");
    span.className = "delete";
    span.appendChild(txt);
    e.appendChild(span);

    // add edit btn
    span = document.createElement("td");
    txt = document.createTextNode("\u270E");
    span.className = "edit";
    span.appendChild(txt);
    e.appendChild(span);

    return e;
}
/**
 * Update task list
 */
function refreshList() {
    // remove all tasks
    let ul = document.getElementById("todolist");
    while (ul.lastElementChild) ul.removeChild(ul.lastElementChild);

    // display all tasks
    for (let t in displayed_tasks)
        ul.appendChild( createChild(displayed_tasks[t]) );

    // and add edit and delete effect on btn
    setCloseEffect();
    setEditEffect();
}


/**
 * Get all needed elements
 */
var modal = document.getElementById("modal"),
    btn = document.getElementById("modal_btn"),
    search_input = document.getElementById("search"),
    current_filter = document.getElementById("current_filter");
    // modal btns
    span = document.getElementById("close_modal"),
    addTaskbtn = document.getElementById("addTask"),
    editTaskbtn = document.getElementById("editTask"),
    // modal inputs
    id = document.getElementById("id"),
    title = document.getElementById("title"),
    date_begin = document.getElementById("date_begin"),
    date_end = document.getElementById("date_end"),
    status_e = document.getElementById("status"),
    tags = document.getElementById("tags");


/**
 * Get data from modal windows
 * @returns Task object
 */
function getTaskFromModal() {
    let task = {
        id: id.value,
        title: title.value,
        date_begin: date_begin.value,
        date_end: date_end.value,
        status: status_e.options[status_e.selectedIndex].value,
        tags: tags.value.split(" ")
    };

    clearModal();

    return task;
}
/**
 * Clear input fields of Modal window
 */
function clearModal() {
    // clear inputs
    id.value = "";
    title.value = "";
    date_begin.value = "";
    date_end.value = "";
    status.value = "";
    tags.value = "";
}

/**
 * Function launched to init page
 */
function init() {
    // add statsus to select field
    for (let s in statusEnum) {
        let e = document.createElement("option");
        e.setAttribute('value', statusEnum[s]);
        e.innerHTML = statusEnum[s];
        status_e.appendChild(e);
    }

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        editTaskbtn.style.display = "none";
        addTaskbtn.style.display = "flex";
        modal.style.display = "flex";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            clearModal();
        }
    }
    // When the user clicks on button 'Ajouter', add Task and close the modal
    addTaskbtn.onclick = function() {
        newTask( getTaskFromModal() );
        modal.style.display = "none";
    }
    // When the user clicks on button 'Enregistrer', edit Task and close the modal
    editTaskbtn.onclick = function() {
        editTask( getTaskFromModal() );
        modal.style.display = "none";
    }
    // When the user enter characters on tags filter field, apply them
    search_input.addEventListener('keyup', e => {
        // if (e.keyCode === 13)
            search();
    });
    // When the user check 'tâches non achevées et non annulées qui ne sont pas arrivées à échéance.' checkbox, apply filter
    current_filter.addEventListener('click', e => {
        not_completed_not_cancelled_not_yet_expired = e.target.checked;
        filt();
    })

    getTasks(); // get tasks from api and display them
}
init();


/**
 * Filter tasks by tags and display them
 */
function search() {
    let search_tag = search_input.value.trim().replace(/\s\s+/g, ' ').split(" ");

    if (search_tag.length == 1 && !search_tag[0])
        displayed_tasks = tasks;
    else
        displayed_tasks = tasks.filter(task => task.tags.some(e => search_tag.indexOf(e) >= 0));

    refreshList();
}

/**
 * Filter tasks by 'not completed & not cancelled that is not yet expired' and display them
 */
function filt() {
    if (!not_completed_not_cancelled_not_yet_expired)
        search();
    else {
        displayed_tasks = displayed_tasks.filter(task => [status.DONE, status.CANCELLED].indexOf(task.status) == -1 && new Date(task.date_end) - new Date() >= 0 );
        refreshList();
    }
}