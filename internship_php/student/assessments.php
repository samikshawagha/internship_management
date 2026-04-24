<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$student_id = $_SESSION['student']['id'] ?? 0;

// Handle assessment submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['assessment_id'])) {
    $assessment_id = (int)$_POST['assessment_id'];
    $score = (int)$_POST['score'] ?? 0;
    
    // Check if already submitted
    $check = $mysqli->query("SELECT id FROM assessment_results WHERE student_id=$student_id AND assessment_id=$assessment_id");
    if ($check->num_rows === 0) {
        $mysqli->query("INSERT INTO assessment_results (student_id, assessment_id, score, completion_date) VALUES ($student_id, $assessment_id, $score, NOW())");
        echo '<div class="alert alert-success alert-dismissible fade show" role="alert">Assessment submitted successfully!<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    } else {
        echo '<div class="alert alert-warning alert-dismissible fade show" role="alert">You have already submitted this assessment.<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
    }
}

// Fetch all available assessments
$result = $mysqli->query("SELECT * FROM assessments WHERE status=1 ORDER BY created_at DESC");
?>
<div class="content">
    <h2>Assessments</h2>
    <p>Take various assessments to evaluate your skills and knowledge.</p>
    
    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info">No assessments available at this time.</div>
    <?php else: ?>
    <div class="row">
        <?php while ($assessment = $result->fetch_assoc()): 
            // Check if student already completed this
            $completed = $mysqli->query("SELECT score FROM assessment_results WHERE student_id=$student_id AND assessment_id=".$assessment['id'])->fetch_assoc();
        ?>
        <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0"><?= htmlspecialchars($assessment['title']) ?></h5>
                </div>
                <div class="card-body">
                    <p class="card-text"><strong>Subject:</strong> <?= htmlspecialchars($assessment['subject']) ?></p>
                    <p class="card-text"><strong>Duration:</strong> <?= $assessment['duration_minutes'] ?> minutes</p>
                    <p class="card-text"><strong>Total Questions:</strong> <?= $assessment['total_questions'] ?></p>
                    <p class="card-text"><strong>Passing Score:</strong> <?= $assessment['passing_score'] ?>%</p>
                    
                    <?php if ($completed): ?>
                        <div class="alert alert-success mb-3">
                            <i class="fa fa-check-circle"></i> <strong>Completed!</strong><br>
                            Your Score: <strong><?= $completed['score'] ?>%</strong>
                        </div>
                    <?php endif; ?>
                    
                    <p class="text-muted small"><?= htmlspecialchars(substr($assessment['description'], 0, 100)) ?>...</p>
                </div>
                <div class="card-footer bg-light">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#assessmentModal<?= $assessment['id'] ?>">
                        <i class="fa fa-eye"></i> View Details
                    </button>
                    <?php if (!$completed): ?>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="assessment_id" value="<?= $assessment['id'] ?>">
                            <input type="hidden" name="score" value="<?= rand(65, 95) ?>">
                            <button type="submit" class="btn btn-success">Start Assessment</button>
                        </form>
                    <?php else: ?>
                        <button class="btn btn-outline-secondary" disabled>Already Completed</button>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Assessment Modal -->
        <div class="modal fade" id="assessmentModal<?= $assessment['id'] ?>" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><?= htmlspecialchars($assessment['title']) ?></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Subject:</strong> <?= htmlspecialchars($assessment['subject']) ?></p>
                        <p><strong>Description:</strong></p>
                        <p><?= nl2br(htmlspecialchars($assessment['description'])) ?></p>
                        <hr>
                        <p><strong>Assessment Details:</strong></p>
                        <ul>
                            <li>Duration: <?= $assessment['duration_minutes'] ?> minutes</li>
                            <li>Total Questions: <?= $assessment['total_questions'] ?></li>
                            <li>Passing Score: <?= $assessment['passing_score'] ?>%</li>
                            <li>Difficulty Level: <?= ucfirst($assessment['difficulty_level']) ?></li>
                        </ul>
                        <?php if ($completed): ?>
                            <div class="alert alert-success">
                                <i class="fa fa-check-circle"></i> You have completed this assessment.
                                <br><strong>Your Score: <?= $completed['score'] ?>%</strong>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <?php if (!$completed): ?>
                            <form method="post" style="display:inline;">
                                <input type="hidden" name="assessment_id" value="<?= $assessment['id'] ?>">
                                <input type="hidden" name="score" value="<?= rand(65, 95) ?>">
                                <button type="submit" class="btn btn-primary">Start Assessment</button>
                            </form>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>