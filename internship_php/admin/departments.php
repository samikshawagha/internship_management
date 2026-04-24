<?php
require_once '../includes/header.php';
// authentication check
if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}
require_once '../includes/sidebar.php';

// handle deletion
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $mysqli->query("DELETE FROM departments WHERE id=$id");
    header('Location: departments.php');
    exit;
}

// fetch all departments
$result = $mysqli->query("SELECT * FROM departments ORDER BY name");
?>
<div class="content">
    <h2>Departments</h2>
    <p><a href="add_department.php" class="btn btn-success">Add Department</a></p>
    <table class="table table-striped bg-light">
        <thead>
            <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= $row['id'] ?></td>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td>
                    <a href="edit_department.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                    <a href="departments.php?delete=<?= $row['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete?');">Delete</a>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>