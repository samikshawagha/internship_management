<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $mysqli->real_escape_string($_POST['title']);
    $subject = $mysqli->real_escape_string($_POST['subject']);
    $description = $mysqli->real_escape_string($_POST['description']);
    $total_questions = (int)$_POST['total_questions'];
    $duration_minutes = (int)$_POST['duration_minutes'];
    $passing_score = (int)$_POST['passing_score'];
    $difficulty = $mysqli->real_escape_string($_POST['difficulty_level']);
    $status = (int)$_POST['status'] ?? 1;
    
    $mysqli->query("INSERT INTO assessments (title, subject, description, total_questions, duration_minutes, passing_score, difficulty_level, status, created_at)
        VALUES ('$title', '$subject', '$description', $total_questions, $duration_minutes, $passing_score, '$difficulty', $status, NOW())");
    echo '<div class="alert alert-success">Assessment created successfully!</div>';
}
?>
<div class="content">
    <h2>Create Assessment</h2>
    <form method="post" class="bg-light p-4 rounded" style="max-width:700px;">
        <div class="mb-3">
            <label for="title" class="form-label">Assessment Title</label>
            <input type="text" class="form-control" id="title" name="title" placeholder="e.g., PHP Fundamentals Quiz" required>
        </div>
        <div class="mb-3">
            <label for="subject" class="form-label">Subject</label>
            <input type="text" class="form-control" id="subject" name="subject" placeholder="e.g., Web Development" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description" rows="4" placeholder="Enter assessment description" required></textarea>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="total_questions" class="form-label">Total Questions</label>
                <input type="number" class="form-control" id="total_questions" name="total_questions" min="5" max="100" value="20" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="duration_minutes" class="form-label">Duration (Minutes)</label>
                <input type="number" class="form-control" id="duration_minutes" name="duration_minutes" min="5" max="180" value="30" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="passing_score" class="form-label">Passing Score (%)</label>
                <input type="number" class="form-control" id="passing_score" name="passing_score" min="0" max="100" value="60" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="difficulty_level" class="form-label">Difficulty Level</label>
                <select class="form-control" id="difficulty_level" name="difficulty_level" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate" selected>Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select class="form-control" id="status" name="status" required>
                <option value="1" selected>Active</option>
                <option value="0">Inactive</option>
            </select>
        </div>
        <button type="submit" class="btn btn-success">Create Assessment</button>
        <a href="assessments.php" class="btn btn-secondary">Cancel</a>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>