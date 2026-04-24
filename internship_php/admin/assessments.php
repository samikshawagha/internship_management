<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

// Handle deletion
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $mysqli->query("DELETE FROM assessments WHERE id=$id");
    header('Location: assessments.php');
    exit;
}

$result = $mysqli->query("SELECT * FROM assessments ORDER BY created_at DESC");
?>
<div class="content">
    <h2>Assessment Management</h2>
    <a href="add_assessment.php" class="btn btn-success mb-3">Create Assessment</a>
    
    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info">No assessments created yet. <a href="add_assessment.php">Create one now</a></div>
    <?php else: ?>
    <div class="table-responsive">
        <table class="table table-striped bg-light">
            <thead>
                <tr><th>Title</th><th>Subject</th><th>Questions</th><th>Duration</th><th>Passing Score</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
            <?php while ($assessment = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($assessment['title']) ?></td>
                    <td><?= htmlspecialchars($assessment['subject']) ?></td>
                    <td><?= $assessment['total_questions'] ?></td>
                    <td><?= $assessment['duration_minutes'] ?> min</td>
                    <td><?= $assessment['passing_score'] ?>%</td>
                    <td><span class="badge bg-<?= $assessment['status']==1 ? 'success' : 'warning' ?>"><?= $assessment['status']==1 ? 'Active' : 'Inactive' ?></span></td>
                    <td>
                        <a href="edit_assessment.php?id=<?= $assessment['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                        <a href="view_results.php?id=<?= $assessment['id'] ?>" class="btn btn-sm btn-info">Results</a>
                        <a href="assessments.php?delete=<?= $assessment['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this assessment?');">Delete</a>
                    </td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>