<?php
require_once '../includes/header.php';
if (!isset($_SESSION['company'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$company_id = $_SESSION['company']['id'] ?? 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $mysqli->real_escape_string($_POST['title']);
    $description = $mysqli->real_escape_string($_POST['description']);
    $requirements = $mysqli->real_escape_string($_POST['requirements']);
    $duration = $mysqli->real_escape_string($_POST['duration']);
    $stipend = (int)$_POST['stipend'];
    
    $mysqli->query("INSERT INTO internship_postings (company_id, title, description, requirements, duration, stipend, status, created_at)
        VALUES ($company_id, '$title', '$description', '$requirements', '$duration', $stipend, 1, NOW())");
    echo '<div class="alert alert-success">Internship posted successfully!</div>';
}
?>
<div class="content">
    <h2>Post New Internship</h2>
    <form method="post" class="bg-light p-4 rounded" style="max-width:600px;">
        <div class="mb-3">
            <label for="title" class="form-label">Internship Title</label>
            <input type="text" class="form-control" id="title" name="title" placeholder="e.g., Junior Web Developer" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description" rows="4" placeholder="Describe the internship role and responsibilities" required></textarea>
        </div>
        <div class="mb-3">
            <label for="requirements" class="form-label">Requirements</label>
            <textarea class="form-control" id="requirements" name="requirements" rows="3" placeholder="Skills, experience, qualifications required" required></textarea>
        </div>
        <div class="mb-3">
            <label for="duration" class="form-label">Duration</label>
            <input type="text" class="form-control" id="duration" name="duration" placeholder="e.g., 3 months" required>
        </div>
        <div class="mb-3">
            <label for="stipend" class="form-label">Monthly Stipend (₹)</label>
            <input type="number" class="form-control" id="stipend" name="stipend" placeholder="0" required>
        </div>
        <button type="submit" class="btn btn-success">Post Internship</button>
        <a href="my_internships.php" class="btn btn-secondary">View My Postings</a>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>