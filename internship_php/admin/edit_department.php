<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$dept = null;
if ($id) {
    $res = $mysqli->query("SELECT * FROM departments WHERE id=$id");
    $dept = $res->fetch_assoc();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $dept) {
    $name = $mysqli->real_escape_string($_POST['name']);
    $mysqli->query("UPDATE departments SET name='$name' WHERE id=$id");
    header('Location: departments.php');
    exit;
}
?>
<div class="content">
    <h2>Edit Department</h2>
    <?php if ($dept): ?>
    <form method="post" class="bg-light p-3 rounded" style="max-width:400px;">
        <div class="mb-3">
            <label for="name" class="form-label">Department Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($dept['name']) ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="departments.php" class="btn btn-secondary">Cancel</a>
    </form>
    <?php else: ?>
        <p class="text-danger">Department not found.</p>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>