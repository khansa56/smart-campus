// Task manager: tasks persist in this browser with localStorage.
const STORAGE_KEY = "smartCampusTasks";
const readTasks = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
let tasks = readTasks();
const taskEscape = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
function saveTasks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function renderTasks() {
  const list = document.getElementById("taskList"), empty = document.getElementById("taskEmpty");
  if (!list || !empty) return;
  list.innerHTML = tasks.map(task => `<article class="task-item ${task.completed ? "completed" : ""}"><input type="checkbox" aria-label="Mark ${taskEscape(task.title)} completed" data-action="toggle" data-id="${task.id}" ${task.completed ? "checked" : ""}><div class="task-info"><span class="task-name">${taskEscape(task.title)}</span><span class="task-meta">${taskEscape(task.course)} · Due ${taskEscape(task.due)}</span></div><span class="task-priority ${task.priority.toLowerCase()}">${taskEscape(task.priority)}</span><button class="delete-task" type="button" data-action="delete" data-id="${task.id}" aria-label="Delete task">×</button></article>`).join("");
  empty.classList.toggle("hidden", tasks.length > 0);
  document.getElementById("taskSummary").textContent = `${tasks.filter(task => !task.completed).length} pending · ${tasks.filter(task => task.completed).length} completed · Saved in this browser`;
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  if (!form) return;
  const message = document.getElementById("taskMessage");
  const showMessage = (text, kind) => { message.textContent = text; message.className = `form-message ${kind}`; };
  form.addEventListener("submit", event => {
    event.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const course = document.getElementById("taskCourse").value;
    const due = document.getElementById("taskDue").value;
    const priority = document.getElementById("taskPriority").value;
    if (!title || !course || !due) { showMessage("Please complete all task fields.", "error"); return; }
    tasks.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), title, course, due, priority, completed: false });
    saveTasks(); renderTasks(); form.reset(); document.getElementById("taskPriority").value = "Medium";
    showMessage("Task added successfully!", "success");
  });
  document.getElementById("taskList").addEventListener("change", event => {
    const id = event.target.dataset.id;
    if (event.target.dataset.action === "toggle") {
      tasks = tasks.map(task => task.id === id ? { ...task, completed: event.target.checked } : task);
      saveTasks(); renderTasks(); showMessage("Task status updated.", "success");
    }
  });
  document.getElementById("taskList").addEventListener("click", event => {
    const button = event.target.closest("button[data-action='delete']");
    if (!button) return;
    tasks = tasks.filter(task => task.id !== button.dataset.id);
    saveTasks(); renderTasks(); showMessage("Task deleted.", "success");
  });
  document.getElementById("clearCompleted").addEventListener("click", () => {
    const previous = tasks.length;
    tasks = tasks.filter(task => !task.completed);
    saveTasks(); renderTasks();
    showMessage(previous === tasks.length ? "There are no completed tasks to clear." : "Completed tasks cleared.", "success");
  });
  renderTasks();
});
