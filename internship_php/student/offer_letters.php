<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$student_id = $_SESSION['student']['id'] ?? 0;

// Handle download
if (isset($_GET['download'])) {
    $letter_id = (int)$_GET['download'];
    $letter = $mysqli->query("SELECT * FROM offer_letters WHERE id=$letter_id AND student_id=$student_id")->fetch_assoc();
    if ($letter) {
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment;filename="offer_letter_'.$letter_id.'.pdf"');
        echo $letter['pdf_content']; // Assuming PDF is stored as blob or you generate it
        exit;
    }
}

// Fetch offer letters for approved applications
$result = $mysqli->query("SELECT ol.*, i.title, c.name as company_name FROM offer_letters ol
    LEFT JOIN internship_postings i ON ol.internship_id=i.id
    LEFT JOIN companies c ON i.company_id=c.id
    WHERE ol.student_id=$student_id
    ORDER BY ol.issued_date DESC");
?>
<div class="content">
    <h2>Offer Letters</h2>
    <p>View and download your offer letters for approved applications.</p>
    
    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info">
            <i class="fa fa-info-circle"></i> No offer letters yet. Check back after your applications are approved.
        </div>
    <?php else: ?>
    <div class="row">
        <?php while ($letter = $result->fetch_assoc()): ?>
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title"><?= htmlspecialchars($letter['title']) ?></h5>
                    <p class="card-text"><strong>Company:</strong> <?= htmlspecialchars($letter['company_name']) ?></p>
                    <p class="card-text"><strong>Issued Date:</strong> <?= date('M d, Y', strtotime($letter['issued_date'])) ?></p>
                    <p class="card-text"><strong>Status:</strong> 
                        <?php
                        if ($letter['status'] === 'accepted') echo '<span class="badge bg-success">Accepted</span>';
                        elseif ($letter['status'] === 'pending') echo '<span class="badge bg-warning text-dark">Pending Your Response</span>';
                        else echo '<span class="badge bg-secondary">'.$letter['status'].'</span>';
                        ?>
                    </p>
                    <a href="offer_letters.php?download=<?= $letter['id'] ?>" class="btn btn-primary">
                        <i class="fa fa-download"></i> Download PDF
                    </a>
                    <?php if ($letter['status'] === 'pending'): ?>
                        <a href="accept_offer.php?id=<?= $letter['id'] ?>" class="btn btn-success">Accept</a>
                        <a href="reject_offer.php?id=<?= $letter['id'] ?>" class="btn btn-danger">Reject</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>