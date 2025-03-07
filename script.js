document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
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
            fetch("index.php", { method: "POST", body: new URLSearchParams({ action: "delete", id: taskId }) })
            .then(() => taskItem.remove());
        }

        if (e.target.classList.contains("edit")) {
            const nameEl = taskItem.querySelector(".task-name");
            const typeEl = taskItem.querySelector(".task-type");
            const statusEl = taskItem.querySelector(".task-status");
            const priorityEl = taskItem.querySelector(".task-priority");
            const dateEl = taskItem.querySelector(".task-date");

            const newName = prompt("Edytuj nazwę:", nameEl.textContent);
            const newType = prompt("Edytuj typ:", typeEl.textContent);
            const newStatus = prompt("Edytuj status (nowe, w trakcie, gotowe):", statusEl.textContent.split(": ")[1]);
            const newPriority = prompt("Edytuj priorytet (niski, średni, wysoki):", priorityEl.textContent.split(": ")[1]);
            const newDate = prompt("Edytuj planowaną datę (YYYY-MM-DD):", dateEl.textContent.split(": ")[1] || "");

            if (!newName || !newType || !newStatus || !newPriority) return;

            fetch("index.php", { 
                method: "POST", 
                body: new URLSearchParams({ 
                    action: "edit", 
                    id: taskId, 
                    nazwa: newName, 
                    type: newType, 
                    status: newStatus, 
                    priority: newPriority, 
                    planned_date: newDate 
                }) 
            }).then(() => {
                nameEl.textContent = newName;
                typeEl.textContent = newType;
                statusEl.textContent = "Status: " + newStatus;
                priorityEl.textContent = "Priorytet: " + newPriority;
                dateEl.textContent = "Planowana data: " + (newDate || "Brak");
            });
        }

        if (e.target.classList.contains("addComment")) {
            const commentInput = taskItem.querySelector(".commentInput");
            const commentText = commentInput.value.trim();
            if (!commentText) return;

            fetch("index.php", { method: "POST", body: new URLSearchParams({ action: "comment", task_id: taskId, tresc: commentText }) })
            .then(response => response.text())
            .then(commentId => {
                if (!commentId) return;
                const commentsList = taskItem.querySelector(".comments");
                const newComment = document.createElement("li");
                newComment.innerHTML = `${commentText} <button class="deleteComment" data-comment-id="${commentId}">🗑</button>`;
                commentsList.appendChild(newComment);
                commentInput.value = "";
            });
        }

        if (e.target.classList.contains("deleteComment")) {
            const commentId = e.target.dataset.commentId;
            fetch("index.php", { method: "POST", body: new URLSearchParams({ action: "delete_comment", comment_id: commentId }) })
            .then(() => e.target.closest("li").remove());
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
