<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$type = null;
if ($id) {
    $res = $mysqli->query("SELECT * FROM internship_types WHERE id=$id");
    $type = $res->fetch_assoc();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $type) {
    $name = $mysqli->real_escape_string($_POST['name']);
    $mysqli->query("UPDATE internship_types SET name='$name' WHERE id=$id");
    header('Location: internship_types.php');
    exit;
}
?>
<div class="content">
    <h2>Edit Internship Type</h2>
    <?php if ($type): ?>
    <form method="post" class="bg-light p-3 rounded" style="max-width:400px;">
        <div class="mb-3">
            <label for="name" class="form-label">Type Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($type['name']) ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="internship_types.php" class="btn btn-secondary">Cancel</a>
    </form>
    <?php else: ?>
        <p class="text-danger">Type not found.</p>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>