<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$student = null;
if ($id) {
    $res = $mysqli->query("SELECT * FROM students WHERE id=$id");
    $student = $res->fetch_assoc();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $student) {
    $name = $mysqli->real_escape_string($_POST['name']);
    $email = $mysqli->real_escape_string($_POST['email']);
    $mysqli->query("UPDATE students SET name='$name', email='$email' WHERE id=$id");
    header('Location: students.php');
    exit;
}
?>
<div class="content">
    <h2>Edit Student</h2>
    <?php if ($student): ?>
    <form method="post" class="bg-light p-3 rounded" style="max-width:400px;">
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($student['name']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($student['email']) ?>" required>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="students.php" class="btn btn-secondary">Cancel</a>
    </form>
    <?php else: ?>
        <p class="text-danger">Student not found.</p>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>