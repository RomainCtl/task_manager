var tasks = [],
    filters = {
        tags: [],
        not_completed_not_cancelled_not_yet_expired: false
    };

/**
 * Add event listener on each 'trash' button (to delete task)
 */
function setTaskDeleteEffect() {
    let close = document.getElementsByClassName("delete");
    for (i = 0; i < close.length; i++) {
        close[i].addEventListener('click', e => {
            let t = e.target.parentElement,
                task = JSON.parse( t.getAttribute("data-task") );

            deleteTask(task)
            .then( () => {
                refreshTaskList();
            });
        });
    }
}
/**
 * Add event listener on each 'trash' button (to delete user)
 */
function setUserDeleteEffect() {
    let close = document.getElementsByClassName("userdelete");
    for (i = 0; i < close.length; i++) {
        close[i].addEventListener('click', e => {
            let t = e.target.parentElement,
                user = JSON.parse( t.getAttribute("data-user") );

            deleteUser(user)
            .then( () => {
                refreshUserList();
            });
        });
    }
}
/**
 * Add event listener on each 'edit' button (to edit task)
 */
function setTaskEditEffect() {
    refreshUserList()
    .then( () => {
        let edit = document.getElementsByClassName("edit");
        for (i = 0; i < edit.length; i++) {
            edit[i].addEventListener('click', e => {
                let t = e.target.parentElement,
                    task = JSON.parse( t.getAttribute("data-task") ); // get task object from 'data-task' attribute

                // send data to input fields
                id.value = task.id;
                title.value = task.title;
                let date = new Date(task.date_begin);
                date_begin.value = date.getFullYear()+"-"+
                        ("0"+(date.getMonth()+1)).slice(-2)+"-"+
                        ("0"+date.getUTCDate()).slice(-2);
                date = new Date(task.date_end);
                date_end.value = date.getFullYear()+"-"+
                        ("0"+(date.getMonth()+1)).slice(-2)+"-"+
                        ("0"+date.getUTCDate()).slice(-2);
                status_e.value = task.status;
                tags.value = task.tags.join(" ");
                user.value = task.user_id;

                // display edit btn, hide add btn and display modal window
                editTaskbtn.style.display = "flex";
                addTaskbtn.style.display = "none";
                modal.style.display = "flex";
            });
        }
    });
}
/**
 * Add event listener on each 'edit' button (to edit user)
 */
function setUserEditEffect() {
    let edit = document.getElementsByClassName("useredit");
    for (i = 0; i < edit.length; i++) {
        edit[i].addEventListener('click', e => {
            let p = e.target.parentElement,
                user = JSON.parse( p.getAttribute("data-user") );

            // remove childs & text
            while (p.lastElementChild) p.removeChild(p.lastElementChild);
            p.innerText = "";

            // create fields for edition
            let firstname = document.createElement("INPUT"),
                lastname = document.createElement("INPUT"),
                cancel = document.createElement("SPAN"),
                save = document.createElement("BUTTON");
            firstname.value = user.firstname;
            lastname.value = user.lastname;

            // cancel button
            cancel.className = "btn";
            cancel.appendChild( document.createTextNode("\u00D7") );
            cancel.addEventListener('click', () => {
                refreshTaskList(); // will refresh task (and assigned user) and user
            });

            // save button
            save.innerText = "Enregistrer";
            save.addEventListener('click', () => {
                editUser({
                    id: user.id,
                    firstname: firstname.value,
                    lastname: lastname.value
                })
                .then(() => {
                    refreshTaskList(); // will refresh task (and assigned user) and user
                });
            });

            p.appendChild(firstname);
            p.appendChild(lastname);
            p.appendChild(cancel);
            p.appendChild(save);
        });
    }
}

/**
 * Update task list
 */
function refreshTaskList() {
    function get_user(id, i) {
        return getUser(id)
        .then(user => {
            return [user, i];
        })
        .catch(err => {
            return [null, i];
        });
    }

    getTasks()
    .then(tasks => {
        let promises = [];
        for (let k in tasks)
            if (!!tasks[k].user_id)
                promises.push( get_user(tasks[k].user_id, k) );

        Promise.all(promises)
        .then(values => {
            for (let k in values) // add user to their task
                tasks[values[k][1]]['user'] = values[k][0];
        })
        .catch(err => {
            console.error(err);
        })
        .finally( () => {
            window.tasks = tasks;
            displayTaskList();
        });
    })
    .catch(err => {
        console.error(err);
    });
}
/**
 * refresh User list and display it
 */
function refreshUserList() {
    return getUsers()
    .then(res => {
        // remove all users
        while (userlist.lastElementChild) userlist.removeChild(userlist.lastElementChild);
        while (user.lastElementChild) user.removeChild(user.lastElementChild);
        user.appendChild(document.createElement("option")); // empty option

        for (let s in res) {
            let e = document.createElement("option"),
                l = document.createElement("P");
            e.setAttribute('value', res[s].id);
            l.setAttribute("data-user", JSON.stringify(res[s]));
            e.innerHTML = l.innerHTML = res[s].firstname+" "+res[s].lastname;
            user.appendChild(e);

            // add edit btn
            let span = document.createElement("span");
            span.className = "btn useredit";
            span.appendChild( document.createTextNode("\u270E") );
            l.appendChild(span);

            // add delete btn
            span = document.createElement("span");
            span.className = "btn userdelete";
            span.appendChild( document.createTextNode("🗑") );
            l.appendChild(span);

            userlist.appendChild(l);
        }

        setUserDeleteEffect();
        setUserEditEffect();
    })
    .catch(err => {
        console.error(err);
    });
}


/**
 * Create HTML element that represents the Task object
 * @param {Task} task - Task object
 * @requires TR element (HTML) to display
 */
function createTaskElement(task) {
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

    // add column for user
    span = document.createElement("td");
    span.appendChild( document.createTextNode(task.user ? task.user.firstname +" "+task.user.lastname : "") );
    e.appendChild(span);

    // add edit btn
    span = document.createElement("td");
    span.className = "edit btn";
    span.appendChild( document.createTextNode("\u270E") );
    e.appendChild(span);

    // add delete btn
    span = document.createElement("td");
    span.className = "delete btn";
    span.appendChild( document.createTextNode("🗑") );
    e.appendChild(span);

    return e;
}
/**
 * Display tasks table
 */
function displayTaskList() {
    // remove all tasks
    let ul = document.getElementById("todolist");
    while (ul.lastElementChild) ul.removeChild(ul.lastElementChild);

    let tasks_to_display = tasks;

    // Filter tasks by tags in search input field
    if (!(filters.tags.length <= 1 && !filters.tags[0]))
        tasks_to_display = tasks_to_display.filter(task => task.tags.some(e => filters.tags.indexOf(e) >= 0));

    // Filter tasks by 'not completed & not cancelled that is not yet expired'
    if (filters.not_completed_not_cancelled_not_yet_expired)
        tasks_to_display = tasks_to_display.filter(task => [status.DONE, status.CANCELLED].indexOf(task.status) == -1 && new Date(task.date_end) - new Date() >= 0 );

    // display all tasks
    for (let t in tasks_to_display)
        ul.appendChild( createTaskElement(tasks_to_display[t]) );

    // and add edit and delete effect on btn
    setTaskDeleteEffect();
    setTaskEditEffect();
}

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
        tags: tags.value.split(" "),
        user_id: user.options[user.selectedIndex].value
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
    user.value = "";
}


// Get all needed elements
var modal = document.getElementById("modal"),
    btn = document.getElementById("modal_btn"),
    search_input = document.getElementById("search"),
    current_filter = document.getElementById("current_filter"),
    userlist = document.getElementById("userlist"),
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
    tags = document.getElementById("tags"),
    user = document.getElementById("user");


// https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

/**
 * Launched to init page (event, data, ...)
 */
docReady(function() {
    // add status to select field
    for (let s in statusEnum) {
        let e = document.createElement("option");
        e.setAttribute('value', statusEnum[s]);
        e.innerHTML = statusEnum[s];
        status_e.appendChild(e);
    }

    // When the user clicks on the button, open the modal
    btn.addEventListener('click', () => {
        editTaskbtn.style.display = "none";
        addTaskbtn.style.display = "flex";
        modal.style.display = "flex";
        refreshUserList();
    });
    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', () => {
        modal.style.display = "none";
    });
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (e) => {
        if (event.target == modal) {
            modal.style.display = "none";
            clearModal();
        }
    });
    // When the user clicks on button 'Ajouter', add Task and close the modal
    addTaskbtn.addEventListener('click', () => {
        newTask( getTaskFromModal() )
        .then( () => {
            refreshTaskList();
        });
        modal.style.display = "none";
    });
    // When the user clicks on button 'Enregistrer', edit Task and close the modal
    editTaskbtn.addEventListener('click', () => {
        editTask( getTaskFromModal() )
        .then( () => {
            refreshTaskList();
        });
        modal.style.display = "none";
    });
    // When the user enter characters on tags filter field, apply them
    search_input.addEventListener('keyup', e => {
        // if (e.keyCode === 13) {}
        filters.tags = search_input.value.trim().replace(/\s\s+/g, ' ').split(" ");
        displayTaskList();
    });
    // When the user check 'tâches non achevées et non annulées qui ne sont pas arrivées à échéance.' checkbox, apply filter
    current_filter.addEventListener('click', e => {
        filters.not_completed_not_cancelled_not_yet_expired = e.target.checked;
        displayTaskList();
    })

    refreshTaskList(); // get tasks from api and display them
});
