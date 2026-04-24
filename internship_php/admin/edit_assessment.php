<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$assessment = $mysqli->query("SELECT * FROM assessments WHERE id=$id")->fetch_assoc();

if (!$assessment) {
    echo '<div class="alert alert-danger">Assessment not found.</div>';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $mysqli->real_escape_string($_POST['title']);
    $subject = $mysqli->real_escape_string($_POST['subject']);
    $description = $mysqli->real_escape_string($_POST['description']);
    $total_questions = (int)$_POST['total_questions'];
    $duration_minutes = (int)$_POST['duration_minutes'];
    $passing_score = (int)$_POST['passing_score'];
    $difficulty = $mysqli->real_escape_string($_POST['difficulty_level']);
    $status = (int)$_POST['status'] ?? 1;
    
    $mysqli->query("UPDATE assessments SET title='$title', subject='$subject', description='$description', 
        total_questions=$total_questions, duration_minutes=$duration_minutes, passing_score=$passing_score, 
        difficulty_level='$difficulty', status=$status WHERE id=$id");
    echo '<div class="alert alert-success">Assessment updated successfully!</div>';
    $assessment = $mysqli->query("SELECT * FROM assessments WHERE id=$id")->fetch_assoc();
}
?>
<div class="content">
    <h2>Edit Assessment</h2>
    <form method="post" class="bg-light p-4 rounded" style="max-width:700px;">
        <div class="mb-3">
            <label for="title" class="form-label">Assessment Title</label>
            <input type="text" class="form-control" id="title" name="title" value="<?= htmlspecialchars($assessment['title']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="subject" class="form-label">Subject</label>
            <input type="text" class="form-control" id="subject" name="subject" value="<?= htmlspecialchars($assessment['subject']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description" rows="4" required><?= htmlspecialchars($assessment['description']) ?></textarea>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="total_questions" class="form-label">Total Questions</label>
                <input type="number" class="form-control" id="total_questions" name="total_questions" min="5" max="100" value="<?= $assessment['total_questions'] ?>" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="duration_minutes" class="form-label">Duration (Minutes)</label>
                <input type="number" class="form-control" id="duration_minutes" name="duration_minutes" min="5" max="180" value="<?= $assessment['duration_minutes'] ?>" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="passing_score" class="form-label">Passing Score (%)</label>
                <input type="number" class="form-control" id="passing_score" name="passing_score" min="0" max="100" value="<?= $assessment['passing_score'] ?>" required>
            </div>
            <div class="col-md-6 mb-3">
                <label for="difficulty_level" class="form-label">Difficulty Level</label>
                <select class="form-control" id="difficulty_level" name="difficulty_level" required>
                    <option value="beginner" <?= $assessment['difficulty_level']=='beginner' ? 'selected' : '' ?>>Beginner</option>
                    <option value="intermediate" <?= $assessment['difficulty_level']=='intermediate' ? 'selected' : '' ?>>Intermediate</option>
                    <option value="advanced" <?= $assessment['difficulty_level']=='advanced' ? 'selected' : '' ?>>Advanced</option>
                </select>
            </div>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select class="form-control" id="status" name="status" required>
                <option value="1" <?= $assessment['status']==1 ? 'selected' : '' ?>>Active</option>
                <option value="0" <?= $assessment['status']==0 ? 'selected' : '' ?>>Inactive</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Update Assessment</button>
        <a href="assessments.php" class="btn btn-secondary">Back</a>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>