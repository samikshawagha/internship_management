<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $mysqli->real_escape_string($_POST['name']);
    $email = $mysqli->real_escape_string($_POST['email']);
    if ($name !== '' && $email !== '') {
        $mysqli->query("INSERT INTO students (name,email) VALUES ('$name','$email')");
        header('Location: students.php');
        exit;
    }
}
?>
<div class="content">
    <h2>Add Student</h2>
    <form method="post" class="bg-light p-3 rounded" style="max-width:400px;">
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
        <a href="students.php" class="btn btn-secondary">Cancel</a>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>