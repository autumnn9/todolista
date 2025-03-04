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
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("DELETE FROM lista WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        exit;
    } else {
        $nazwa = trim($_POST['nazwa']);
        $type = trim($_POST['type']);
        $stmt = $conn->prepare("INSERT INTO lista (nazwa, type) VALUES (?, ?)");
        $stmt->bind_param("ss", $nazwa, $type);
        $stmt->execute();
        $stmt->close();
        exit;
    }
}

$result = $conn->query("SELECT * FROM lista ORDER BY id DESC");
$tasks = [];
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
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
                    <button class="delete">X</button>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <script src="script.js"></script>
</body>
</html>