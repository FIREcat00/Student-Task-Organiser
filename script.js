const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterTasks = document.getElementById("filterTasks");
const currentDate = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];

/* Show today's date */
const today = new Date();
currentDate.textContent = today.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric"
});

/* Add Task */
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const subject = document.getElementById("taskSubject").value.trim();
  const date = document.getElementById("taskDate").value;
  const priority = document.getElementById("taskPriority").value;

  const newTask = {
    id: Date.now(),
    title: title,
    subject: subject,
    date: date,
    priority: priority,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();
  taskForm.reset();
});

/* Save to browser storage */
function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

/* Render tasks */
function renderTasks() {
  const selectedFilter = filterTasks.value;

  let filteredTasks = tasks.filter(function (task) {
    if (selectedFilter === "all") return true;

    if (selectedFilter === "pending") {
      return !task.completed;
    }

    if (selectedFilter === "completed") {
      return task.completed;
    }

    return task.priority === selectedFilter;
  });

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filteredTasks.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  filteredTasks.forEach(function (task) {
    const taskCard = document.createElement("div");

    taskCard.classList.add("task-card");

    if (task.completed) {
      taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `
      <input
        type="checkbox"
        class="task-check"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${task.id})"
      >

      <div class="task-details">
        <p class="task-title">${task.title}</p>
        <p class="task-meta">${task.subject} • Due: ${formatDate(task.date)}</p>
      </div>

      <span class="priority ${task.priority}">
        ${task.priority}
      </span>

      <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
        🗑
      </button>
    `;

    taskList.appendChild(taskCard);
  });

  updateStats();
}

/* Mark task complete */
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

/* Delete task */
function deleteTask(id) {
  const confirmDelete = confirm("Delete this task permanently?");

  if (!confirmDelete) return;

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

/* Update dashboard counts */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;
}

/* Date formatting */
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/* Filter tasks */
filterTasks.addEventListener("change", renderTasks);

/* Start app */
renderTasks();