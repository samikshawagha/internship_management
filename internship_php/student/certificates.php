<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';
require_once '../includes/certificates.php';

$student_id = $_SESSION['student']['id'] ?? 0;
$upload_error = '';
// Handle certificate upload by student
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['certificate_file'])) {
    $uploadDir = __DIR__ . '/../uploads/certificates/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $file = $_FILES['certificate_file'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['pdf'];
    if ($file['error'] === 0 && in_array($ext, $allowed)) {
        $filename = 'cert_' . $student_id . '_' . time() . '.' . $ext;
        $dest = $uploadDir . $filename;
        if (move_uploaded_file($file['tmp_name'], $dest)) {
            $file_path = '/internship_php/uploads/certificates/' . $filename;
            $certificate_number = $mysqli->real_escape_string($_POST['certificate_number'] ?? 'CERT-' . time());
            $grade = $mysqli->real_escape_string($_POST['grade'] ?? '');
            $remarks = $mysqli->real_escape_string($_POST['remarks'] ?? '');

            $mysqli->query("INSERT INTO certificates (student_id, internship_id, certificate_number, issued_date, grade, remarks, file_path)
                VALUES ($student_id, NULL, '$certificate_number', NOW(), '$grade', '$remarks', '$file_path')");

            header('Location: certificates.php?uploaded=1'); exit;
        } else {
            $upload_error = 'Failed to move uploaded file.';
        }
    } else {
        $upload_error = 'Please upload a valid PDF file.';
    }
}

// Handle certificate download
if (isset($_GET['download'])) {
    $cert_id = (int)$_GET['download'];
    $cert = $mysqli->query("SELECT * FROM certificates WHERE id=$cert_id AND student_id=$student_id")->fetch_assoc();
    if ($cert && !empty($cert['file_path'])) {
        $file = $_SERVER['DOCUMENT_ROOT'] . $cert['file_path'];
        if (file_exists($file)) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment;filename="certificate_'.$cert_id.'.pdf"');
            readfile($file);
            exit;
        }
    }
}

// Fetch certificates earned by student
$result = $mysqli->query("SELECT c.*, i.title FROM certificates c
    LEFT JOIN internship_postings i ON c.internship_id=i.id
    WHERE c.student_id=$student_id
    ORDER BY c.issued_date DESC");

$hasCertificates = $result->num_rows > 0;
?>
<div class="content">
    <h2>Certificates</h2>
    <p>View and download your earned internship certificates and achievements.</p>
    <p><a href="event_certificates.php" class="btn btn-sm btn-secondary"><i class="fa fa-certificate"></i> Claim Event Certificates</a></p>

    <?php if (!empty($upload_error)): ?>
        <div class="alert alert-danger"><?= htmlspecialchars($upload_error) ?></div>
    <?php elseif (isset($_GET['uploaded'])): ?>
        <div class="alert alert-success">Certificate uploaded successfully.</div>
    <?php endif; ?>

    <div class="card mb-4">
        <div class="card-body">
            <h5 class="card-title">Add / Upload Certificate</h5>
            <p class="card-text small text-muted">Upload a PDF copy of your certificate (optional grade and remarks).</p>
            <form method="post" enctype="multipart/form-data" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Certificate File (PDF)</label>
                    <input type="file" name="certificate_file" class="form-control" accept="application/pdf" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Certificate Number (optional)</label>
                    <input type="text" name="certificate_number" class="form-control" placeholder="e.g. CERT-2026-001">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Grade (optional)</label>
                    <input type="text" name="grade" class="form-control" placeholder="A / B+">
                </div>
                <div class="col-md-8">
                    <label class="form-label">Remarks (optional)</label>
                    <input type="text" name="remarks" class="form-control" placeholder="Short note or achievement">
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa fa-upload"></i> Upload Certificate
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <?php if ($hasCertificates): ?>
        <h3 class="mt-4 mb-3">Your Earned Certificates</h3>
        <div class="row">
        <?php while ($certificate = $result->fetch_assoc()): ?>
        <div class="col-md-6 mb-3">
            <div class="card text-center shadow-sm">
                <div class="card-body">
                    <i class="fa fa-certificate fa-3x text-warning mb-3"></i>
                    <h5 class="card-title"><?= htmlspecialchars($certificate['title']) ?></h5>
                    <p class="card-text"><strong>Certificate ID:</strong> <?= htmlspecialchars($certificate['certificate_number']) ?></p>
                    <p class="card-text"><strong>Issued Date:</strong> <?= date('M d, Y', strtotime($certificate['issued_date'])) ?></p>
                    <p class="card-text"><strong>Grade:</strong> <span class="badge bg-success"><?= htmlspecialchars($certificate['grade']) ?></span></p>
                    <p class="card-text small text-muted"><?= htmlspecialchars($certificate['remarks']) ?></p>
                    <a href="certificates.php?download=<?= $certificate['id'] ?>" class="btn btn-primary">
                        <i class="fa fa-download"></i> Download Certificate
                    </a>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
        </div>
        <hr class="my-5">
    <?php else: ?>
        <div class="alert alert-info">
            <i class="fa fa-info-circle"></i> You haven't earned any certificates yet. Complete an internship to receive a certificate.
        </div>
        <hr class="my-5">
    <?php endif; ?>

    <h3 class="mb-3">Sample Certificates & Achievements</h3>
    <p class="text-muted">These are examples of certificates you can earn by completing internships.</p>
    <div class="row">
        <?php 
        $dummyCerts = getDummyCertificates();
        foreach ($dummyCerts as $cert) {
            displayCertificateCard($cert);
        }
        ?>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>