<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "lista";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'delete') {
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("DELETE FROM lista WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        exit;
    }

    if ($action === 'edit') {
        $id = intval($_POST['id']);
        $nazwa = trim($_POST['nazwa']);
        $type = trim($_POST['type']);
        $stmt = $conn->prepare("UPDATE lista SET nazwa = ?, type = ? WHERE id = ?");
        $stmt->bind_param("ssi", $nazwa, $type, $id);
        $stmt->execute();
        $stmt->close();
        exit;
    }

    if ($action === 'comment') {
        $task_id = intval($_POST['task_id']);
        $tresc = trim($_POST['tresc']);
        $stmt = $conn->prepare("INSERT INTO komentarze (task_id, tresc) VALUES (?, ?)");
        $stmt->bind_param("is", $task_id, $tresc);
        $stmt->execute();
        $stmt->close();
        exit;
    }

    $nazwa = trim($_POST['nazwa']);
    $type = trim($_POST['type']);
    $stmt = $conn->prepare("INSERT INTO lista (nazwa, type) VALUES (?, ?)");
    $stmt->bind_param("ss", $nazwa, $type);
    $stmt->execute();
    $stmt->close();
    exit;
}

$result = $conn->query("SELECT * FROM lista ORDER BY id DESC");
$tasks = [];
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

$comments = [];
$commentResult = $conn->query("SELECT * FROM komentarze ORDER BY created_at ASC");
while ($row = $commentResult->fetch_assoc()) {
    $comments[$row['task_id']][] = $row;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TO-DO Lista</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>To-Do Lista</h1>
        <form id="taskForm">
            <input type="text" id="taskInput" name="nazwa" placeholder="Dodaj zadanie" required>
            <select id="taskType" name="type">
                <option value="praca">Praca</option>
                <option value="dom">Dom</option>
                <option value="inne">Inne</option>
            </select>
            <button type="submit">Dodać</button>
        </form>

        <ul id="taskList">
            <?php foreach ($tasks as $task): ?>
                <li data-id="<?= $task['id'] ?>" draggable="true">
                    <span class="task-name"><?= htmlspecialchars($task['nazwa']) ?></span>
                    <span class="task-type"><?= htmlspecialchars($task['type']) ?></span>
                    <button class="edit">✎</button>
                    <button class="delete">X</button>

                    <ul class="comments">
                        <?php foreach ($comments[$task['id']] ?? [] as $comment): ?>
                            <li><?= htmlspecialchars($comment['tresc']) ?></li>
                        <?php endforeach; ?>
                    </ul>

                    <input type="text" class="commentInput" placeholder="Dodaj komentarz">
                    <button class="addComment">Dodać komentarz</button>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <script src="script.js"></script>
</body>
</html>
