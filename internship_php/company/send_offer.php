<?php
require_once '../includes/header.php';
if (!isset($_SESSION['company'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$company_id = $_SESSION['company']['id'] ?? 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $student_id = (int)$_POST['student_id'];
    $internship_id = (int)$_POST['internship_id'];
    $subject = $mysqli->real_escape_string($_POST['subject'] ?? 'Internship Offer');
    $content = $mysqli->real_escape_string($_POST['content'] ?? '');

    $mysqli->query("INSERT INTO offer_letters (student_id, internship_id, content, issued_date, status)
        VALUES ($student_id, $internship_id, '$content', NOW(), 'pending')");

    echo '<div class="alert alert-success alert-dismissible fade show" role="alert">Offer letter sent successfully!<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>';
}

// Fetch approved applications for this company without existing offer letters
$result = $mysqli->query("SELECT a.*, i.title, i.id as internship_id, s.name as student_name, s.email, s.id as student_id FROM applications a
    LEFT JOIN internship_postings i ON a.internship_id=i.id
    LEFT JOIN students s ON a.student_id=s.id
    WHERE i.company_id=$company_id AND a.status='approved' AND NOT EXISTS (
        SELECT 1 FROM offer_letters ol WHERE ol.student_id=a.student_id AND ol.internship_id=a.internship_id
    )
    ORDER BY a.date_submitted DESC");
?>
<div class="content">
    <h2>Send Offer Letters</h2>
    <p>Create and send offer letters to selected approved applicants.</p>

    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info"><i class="fa fa-info-circle"></i> No approved applications pending offer letters.</div>
    <?php else: ?>
    <div class="row">
        <?php while ($application = $result->fetch_assoc()): ?>
        <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-success text-white">
                    <h5 class="card-title mb-0"><?= htmlspecialchars($application['student_name']) ?></h5>
                </div>
                <div class="card-body">
                    <p class="card-text"><strong>Position:</strong> <?= htmlspecialchars($application['title']) ?></p>
                    <p class="card-text"><strong>Email:</strong> <a href="mailto:<?= htmlspecialchars($application['email']) ?>"><?= htmlspecialchars($application['email']) ?></a></p>
                    <p class="card-text"><strong>Applied On:</strong> <?= htmlspecialchars(date('M d, Y', strtotime($application['date_submitted']))) ?></p>
                    <p class="text-muted small">Ready to send offer letter</p>
                </div>
                <div class="card-footer bg-light">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#offerModal<?= $application['id'] ?>">
                        <i class="fa fa-envelope"></i> Send Offer Letter
                    </button>
                </div>
            </div>
        </div>

        <!-- Offer Letter Modal -->
        <div class="modal fade" id="offerModal<?= $application['id'] ?>" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Send Offer Letter</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form method="post">
                        <div class="modal-body">
                            <input type="hidden" name="student_id" value="<?= $application['student_id'] ?>">
                            <input type="hidden" name="internship_id" value="<?= $application['internship_id'] ?>">
                            
                            <div class="mb-3">
                                <label class="form-label"><strong>To:</strong></label>
                                <p><?= htmlspecialchars($application['student_name']) ?><br><small class="text-muted"><?= htmlspecialchars($application['email']) ?></small></p>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label"><strong>Position:</strong></label>
                                <p><?= htmlspecialchars($application['title']) ?></p>
                            </div>
                            
                            <div class="mb-3">
                                <label for="subject" class="form-label">Subject</label>
                                <input type="text" class="form-control" id="subject" name="subject" value="Internship Offer - <?= htmlspecialchars($application['title']) ?>" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="content" class="form-label">Letter Content</label>
                                <textarea class="form-control" id="content" name="content" rows="10" required>Dear <?= htmlspecialchars($application['student_name']) ?>,

We are pleased to offer you the position of <?= htmlspecialchars($application['title']) ?> at our company.

Terms & Conditions:
- Duration: [Specify duration]
- Stipend: [Specify amount]
- Start Date: [Specify date]

Please confirm your acceptance within 5 days.

Best regards,
<?= htmlspecialchars($_SESSION['company']['name']) ?></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-success">
                                <i class="fa fa-paper-plane"></i> Send Offer Letter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>