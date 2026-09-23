/* MOBILE MENU */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


/* DARK / LIGHT MODE */

const themeBtn = document.getElementById("themeBtn");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");

        themeBtn.textContent =
            document.body.classList.contains("light")
                ? "☀"
                : "◐";
    });
}


/* FOCUS TIMER */

let timeLeft = 25 * 60;
let timerInterval = null;

const timer = document.getElementById("timer");
const startTimer = document.getElementById("startTimer");
const resetTimer = document.getElementById("resetTimer");
const timerMode = document.getElementById("timerMode");

function updateTimer() {
    if (!timer) return;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.textContent =
        `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
}

if (startTimer) {
    startTimer.addEventListener("click", () => {

        if (timerInterval !== null) return;

        timerMode.textContent = "FOCUSING";
        startTimer.textContent = "Running...";

        timerInterval = setInterval(() => {

            timeLeft--;
            updateTimer();

            if (timeLeft <= 0) {

                clearInterval(timerInterval);
                timerInterval = null;

                timerMode.textContent = "COMPLETE";
                startTimer.textContent = "Start session";

                timeLeft = 25 * 60;
                updateTimer();

                alert("Focus session complete. Take a short break!");
            }

        }, 1000);
    });
}

if (resetTimer) {
    resetTimer.addEventListener("click", () => {

        clearInterval(timerInterval);
        timerInterval = null;

        timeLeft = 25 * 60;

        updateTimer();

        if (timerMode) timerMode.textContent = "READY";
        if (startTimer) startTimer.textContent = "Start session";
    });
}

updateTimer();


/* TASKS */

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");

const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const heroProgress = document.getElementById("heroProgress");
const heroProgressBar = document.getElementById("heroProgressBar");

function setProgress(value) {

    if (progressPercent)
        progressPercent.textContent = value + "%";

    if (progressFill)
        progressFill.style.width = value + "%";

    if (heroProgress)
        heroProgress.textContent = value + "%";

    if (heroProgressBar)
        heroProgressBar.style.width = value + "%";
}

function updateProgress() {

    if (!taskList) return;

    const tasks = taskList.querySelectorAll(".task");
    const completed =
        taskList.querySelectorAll(".task.completed-task").length;

    if (tasks.length === 0) {
        setProgress(0);
        return;
    }

    const percentage =
        Math.round((completed / tasks.length) * 100);

    setProgress(percentage);
}

function setupTask(task) {

    const checkbox = task.querySelector("input");
    const small = task.querySelector("small");

    if (!checkbox) return;

    checkbox.addEventListener("change", () => {

        task.classList.toggle(
            "completed-task",
            checkbox.checked
        );

        if (small) {
            small.textContent =
                checkbox.checked ? "DONE" : "TODO";
        }

        updateProgress();
    });
}

document.querySelectorAll(".task").forEach(setupTask);

if (addTask) {
    addTask.addEventListener("click", () => {

        const value = taskInput.value.trim();

        if (value === "") return;

        const task = document.createElement("div");

        task.className = "task";

        task.innerHTML = `
            <label>
                <input type="checkbox">
                <span>${value}</span>
            </label>
            <small>TODO</small>
        `;

        taskList.appendChild(task);

        setupTask(task);

        taskInput.value = "";

        updateProgress();
    });
}

if (taskInput) {
    taskInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            addTask.click();
        }

    });
}

updateProgress();


/* GOAL */

const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalStatus = document.getElementById("goalStatus");

if (goalForm) {

    goalForm.addEventListener("submit", event => {

        event.preventDefault();

        const goal = goalInput.value.trim();

        if (goal === "") return;

        goalStatus.textContent =
            "Saved: " + goal;

        goalInput.value = "";
    });
}
