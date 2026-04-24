<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$student_id = $_SESSION['student']['id'] ?? 0;

// Fetch student data
$student = $mysqli->query("SELECT * FROM students WHERE id=$student_id")->fetch_assoc();

// Handle profile update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $mysqli->real_escape_string($_POST['name']);
    $email = $mysqli->real_escape_string($_POST['email']);
    $phone = $mysqli->real_escape_string($_POST['phone'] ?? '');
    $address = $mysqli->real_escape_string($_POST['address'] ?? '');
    
    $mysqli->query("UPDATE students SET name='$name', email='$email', phone='$phone', address='$address' WHERE id=$student_id");
    $_SESSION['student']['name'] = $name;
    echo '<div class="alert alert-success">Profile updated successfully!</div>';
    $student = $mysqli->query("SELECT * FROM students WHERE id=$student_id")->fetch_assoc();
}
?>
<div class="content">
    <h2>My Profile</h2>
    <form method="post" class="bg-light p-4 rounded" style="max-width:500px;">
        <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($student['name']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($student['email']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Phone (Optional)</label>
            <input type="tel" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($student['phone'] ?? '') ?>">
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">Address (Optional)</label>
            <textarea class="form-control" id="address" name="address" rows="3"><?= htmlspecialchars($student['address'] ?? '') ?></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>