<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

$assessment_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$assessment = $mysqli->query("SELECT * FROM assessments WHERE id=$assessment_id")->fetch_assoc();

if (!$assessment) {
    echo '<div class="alert alert-danger">Assessment not found.</div>';
    exit;
}

// Fetch results for this assessment
$results = $mysqli->query("SELECT ar.*, s.name as student_name, s.email FROM assessment_results ar
    LEFT JOIN students s ON ar.student_id=s.id
    WHERE ar.assessment_id=$assessment_id
    ORDER BY ar.completion_date DESC");

// Calculate statistics
$totalAttempts = $results->num_rows;
$result->data_seek(0);
$scores = [];
while ($row = $results->fetch_assoc()) {
    $scores[] = $row['score'];
}
$avgScore = $totalAttempts > 0 ? round(array_sum($scores) / $totalAttempts, 2) : 0;
$maxScore = $totalAttempts > 0 ? max($scores) : 0;
$minScore = $totalAttempts > 0 ? min($scores) : 0;
$passCount = 0;
foreach ($scores as $score) {
    if ($score >= $assessment['passing_score']) {
        $passCount++;
    }
}
?>
<div class="content">
    <h2>Assessment Results: <?= htmlspecialchars($assessment['title']) ?></h2>
    
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <h5>Total Attempts</h5>
                    <p class="h3 text-primary"><?= $totalAttempts ?></p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <h5>Average Score</h5>
                    <p class="h3 text-info"><?= $avgScore ?>%</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <h5>Pass Count</h5>
                    <p class="h3 text-success"><?= $passCount ?></p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <h5>Highest Score</h5>
                    <p class="h3 text-warning"><?= $maxScore ?>%</p>
                </div>
            </div>
        </div>
    </div>

    <h3>Student Results</h3>
    <?php if ($totalAttempts === 0): ?>
        <div class="alert alert-info">No results yet. Students haven't taken this assessment.</div>
    <?php else: ?>
    <div class="table-responsive">
        <table class="table table-striped bg-light">
            <thead>
                <tr><th>Student Name</th><th>Email</th><th>Score</th><th>Status</th><th>Completed On</th></tr>
            </thead>
            <tbody>
            <?php 
            $results->data_seek(0);
            while ($row = $results->fetch_assoc()): 
                $passed = $row['score'] >= $assessment['passing_score'];
            ?>
                <tr>
                    <td><?= htmlspecialchars($row['student_name']) ?></td>
                    <td><?= htmlspecialchars($row['email']) ?></td>
                    <td><strong><?= $row['score'] ?>%</strong></td>
                    <td><span class="badge bg-<?= $passed ? 'success' : 'danger' ?>"><?= $passed ? 'Passed' : 'Failed' ?></span></td>
                    <td><?= date('M d, Y H:i', strtotime($row['completion_date'])) ?></td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>

    <a href="assessments.php" class="btn btn-secondary mt-3">Back to Assessments</a>
</div>
<?php require_once '../includes/footer.php'; ?>