<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $mysqli->real_escape_string($_POST['name']);
    if ($name !== '') {
        $mysqli->query("INSERT INTO internship_types (name) VALUES ('$name')");
        header('Location: internship_types.php');
        exit;
    }
}
?>
<div class="content">
    <h2>Add Internship Type</h2>
    <form method="post" class="bg-light p-3 rounded" style="max-width:400px;">
        <div class="mb-3">
            <label for="name" class="form-label">Type Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
        <a href="internship_types.php" class="btn btn-secondary">Cancel</a>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>