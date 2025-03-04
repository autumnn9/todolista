document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskType = document.getElementById("taskType");
    const taskList = document.getElementById("taskList");

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskValue = taskInput.value.trim();
        if (!taskValue) return;

        const formData = new FormData();
        formData.append("nazwa", taskValue);
        formData.append("type", taskType.value);

        fetch("index.php", { method: "POST", body: formData })
            .then(() => location.reload());
    });

    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
            const taskItem = e.target.closest("li");
            const taskId = taskItem.dataset.id;

            const formData = new FormData();
            formData.append("action", "delete");
            formData.append("id", taskId);

            fetch("index.php", { method: "POST", body: formData })
                .then(() => taskItem.remove());
        }
    });

    let draggedItem = null;

    taskList.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        setTimeout(() => (e.target.style.display = "none"), 0);
    });

    taskList.addEventListener("dragend", (e) => {
        setTimeout(() => (e.target.style.display = "flex"), 0);
        draggedItem = null;
    });

    taskList.addEventListener("dragover", (e) => e.preventDefault());

    taskList.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.target.tagName === "LI") {
            taskList.insertBefore(draggedItem, e.target);
        }
    });
});