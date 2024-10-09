// Select DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const archivedTasks = document.getElementById("archived-tasks");
const categorySelect = document.getElementById("category-select");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");
const darkModeToggle = document.getElementById("dark-mode-toggle");

let isDarkMode = false;

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add event listener for adding tasks
addTaskBtn.addEventListener("click", addTask);
darkModeToggle.addEventListener("click", toggleDarkMode);

// Add Task Function
function addTask() {
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const dateTime = new Date().toLocaleString();
    const taskObj = {
        text: taskText,
        createdAt: dateTime,
        category: category,
        priority: priority,
        dueDate: dueDate,
        isCompleted: false
    };

    createTaskElement(taskObj);
    saveTaskToLocalStorage(taskObj);
    taskInput.value = "";
}

// Create task element in the UI
function createTaskElement(taskObj) {
    const li = document.createElement("li");
    li.classList.add("task-item", `category-${taskObj.category.toLowerCase()}`, `priority-${taskObj.priority.toLowerCase()}`);

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskObj.text;

    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date");
    dateSpan.textContent = ` (Created on: ${taskObj.createdAt})`;

    const dueDateSpan = document.createElement("span");
    dueDateSpan.classList.add("due-date");
    dueDateSpan.textContent = taskObj.dueDate ? `Due: ${taskObj.dueDate}` : "";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskObj.text, li);
    });

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", () => {
        completeTask(taskObj.text, li);
    });

    li.appendChild(taskSpan);
    li.appendChild(dateSpan);
    li.appendChild(dueDateSpan);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Load tasks from localStorage on page load
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => createTaskElement(task));
}

// Add task from local storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Save task to local storage
function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function completeTask(taskText, li) {
    li.classList.add("completed");
    moveToArchived(taskText, li);
}

function moveToArchived(taskText, li) {
    const archivedTask = {
        text: taskText,
        archivedAt: new Date().toLocaleString()
    };

    archivedTasks.appendChild(li);
    removeTaskFromLocalStorage(taskText);
    li.removeChild(li.querySelector('.complete-btn'));
}

function deleteTask(taskText, taskElement) {
    taskElement.classList.add("fade-out");
    setTimeout(() => {
        taskElement.remove();
        removeTaskFromLocalStorage(taskText);
    }, 500);
}

function removeTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Sorting tasks by date
document.getElementById("sort-date").addEventListener("click", () => {
    sortTasks("date");
});

// Sorting tasks by priority
document.getElementById("sort-priority").addEventListener("click", () => {
    sortTasks("priority");
});

function sortTasks(criteria) {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
        const aText = a.querySelector("span").textContent;
        const bText = b.querySelector("span").textContent;

        if (criteria === "date") {
            const aDate = new Date(a.querySelector(".task-date").textContent.replace(" (Created on: ", "").replace(")", ""));
            const bDate = new Date(b.querySelector(".task-date").textContent.replace(" (Created on: ", "").replace(")", ""));
            return aDate - bDate;
        } else if (criteria === "priority") {
            const aPriority = a.classList.contains("priority-high") ? 1 : (a.classList.contains("priority-medium") ? 2 : 3);
            const bPriority = b.classList.contains("priority-high") ? 1 : (b.classList.contains("priority-medium") ? 2 : 3);
            return aPriority - bPriority;
        }
    });

    tasks.forEach(task => taskList.appendChild(task));
}
