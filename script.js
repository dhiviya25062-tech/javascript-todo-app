let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");


// CREATE
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// SAVE TO LOCAL STORAGE
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// READ + DISPLAY
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <button class="complete-btn">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>
        `;

        taskList.appendChild(li);

    });

    updateTaskCount();
}


// UPDATE
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {

        task.text = newText.trim();

        saveTasks();

        renderTasks();
    }
}


// COMPLETE / UNCOMPLETE
function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderTasks();
}


// DELETE
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// TASK COUNT
function updateTaskCount() {

    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${activeTasks} active task${activeTasks !== 1 ? "s" : ""}`;
}


// ADD BUTTON EVENT
addTaskBtn.addEventListener("click", addTask);


// ENTER KEY EVENT
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// FILTER EVENTS
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });

});


// EVENT DELEGATION
taskList.addEventListener("click", function(event) {

    const taskElement = event.target.closest(".task");

    if (!taskElement) {
        return;
    }

    const id = Number(taskElement.dataset.id);

    if (event.target.classList.contains("complete-btn")) {
        toggleTask(id);
    }

    if (event.target.classList.contains("edit-btn")) {
        editTask(id);
    }

    if (event.target.classList.contains("delete-btn")) {
        deleteTask(id);
    }

});


// INITIAL DISPLAY
renderTasks();