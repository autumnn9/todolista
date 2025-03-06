document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskType = document.getElementById("taskType");
    const taskList = document.getElementById("taskList");

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        fetch("index.php", { method: "POST", body: formData }).then(() => location.reload());
    });

    taskList.addEventListener("click", (e) => {
        const taskItem = e.target.closest("li");
        const taskId = taskItem.dataset.id;

        if (e.target.classList.contains("delete")) {
            fetch("index.php", { 
                method: "POST", 
                body: new URLSearchParams({ action: "delete", id: taskId }) 
            }).then(() => taskItem.remove());
        }

        if (e.target.classList.contains("edit")) {
            const nameEl = taskItem.querySelector(".task-name");
            const typeEl = taskItem.querySelector(".task-type");

            const newName = prompt("Edytuj nazwę:", nameEl.textContent);
            if (!newName) return;

            fetch("index.php", { 
                method: "POST", 
                body: new URLSearchParams({ 
                    action: "edit", 
                    id: taskId, 
                    nazwa: newName, 
                    type: typeEl.textContent 
                }) 
            }).then(() => {
                nameEl.textContent = newName;
            });
        }

        if (e.target.classList.contains("addComment")) {
            const commentInput = taskItem.querySelector(".commentInput");
            const commentText = commentInput.value.trim();
            if (!commentText) return;

            fetch("index.php", { 
                method: "POST", 
                body: new URLSearchParams({ 
                    action: "comment", 
                    task_id: taskId, 
                    tresc: commentText 
                }) 
            }).then(() => {
                const commentsList = taskItem.querySelector(".comments");
                const newComment = document.createElement("li");
                newComment.textContent = commentText;
                commentsList.appendChild(newComment);
                commentInput.value = "";
            });
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
