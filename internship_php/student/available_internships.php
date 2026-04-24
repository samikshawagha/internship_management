<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$student_id = $_SESSION['student']['id'] ?? 0;

// Handle application submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['internship_id'])) {
    $internship_id = (int)$_POST['internship_id'];
    $exists = $mysqli->query("SELECT id FROM applications WHERE student_id=$student_id AND internship_id=$internship_id");
    if ($exists->num_rows === 0) {
        $mysqli->query("INSERT INTO applications (student_id, internship_id, date_submitted, status) VALUES ($student_id, $internship_id, NOW(), 'pending')");
        echo '<div class="alert alert-success">Application submitted!</div>';
    } else {
        echo '<div class="alert alert-warning">You have already applied for this internship.</div>';
    }
}

// Fetch all active internship postings
$result = $mysqli->query("SELECT i.*, c.name as company_name FROM internship_postings i LEFT JOIN companies c ON i.company_id=c.id WHERE i.status=1 ORDER BY i.created_at DESC");
?>
<div class="content">
    <h2>Available Internships</h2>
    <p>Browse and apply for available internship positions.</p>
    <div class="row">
    <?php while ($internship = $result->fetch_assoc()): ?>
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title"><?= htmlspecialchars($internship['title']) ?></h5>
                    <p class="card-text"><strong>Company:</strong> <?= htmlspecialchars($internship['company_name']) ?></p>
                    <p class="card-text"><strong>Duration:</strong> <?= htmlspecialchars($internship['duration']) ?></p>
                    <p class="card-text"><strong>Stipend:</strong> ₹<?= htmlspecialchars($internship['stipend']) ?></p>
                    <p class="card-text"><?= htmlspecialchars(substr($internship['description'], 0, 100)) ?>...</p>
                    <form method="post" style="display:inline;">
                        <input type="hidden" name="internship_id" value="<?= $internship['id'] ?>">
                        <button type="submit" class="btn btn-primary">Apply Now</button>
                    </form>
                    <a href="#" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#detailsModal<?= $internship['id'] ?>">View Details</a>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="detailsModal<?= $internship['id'] ?>" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><?= htmlspecialchars($internship['title']) ?></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Company:</strong> <?= htmlspecialchars($internship['company_name']) ?></p>
                        <p><strong>Duration:</strong> <?= htmlspecialchars($internship['duration']) ?></p>
                        <p><strong>Stipend:</strong> ₹<?= htmlspecialchars($internship['stipend']) ?></p>
                        <p><strong>Description:</strong></p>
                        <p><?= nl2br(htmlspecialchars($internship['description'])) ?></p>
                        <p><strong>Requirements:</strong></p>
                        <p><?= nl2br(htmlspecialchars($internship['requirements'])) ?></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    <?php endwhile; ?>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>