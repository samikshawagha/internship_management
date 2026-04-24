<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: ../admin/login.php'); exit; }
require_once 'sidebar.php';
require_once '../includes/certificates.php';

// Get student ID from session
$student_id = $_SESSION['student']['id'] ?? 0;

// Get statistics
$appCount = $mysqli->query("SELECT COUNT(*) as c FROM applications WHERE student_id=$student_id")->fetch_assoc()['c'];
$certCount = $mysqli->query("SELECT COUNT(*) as c FROM certificates WHERE student_id=$student_id")->fetch_assoc()['c'];
$internshipCount = $mysqli->query("SELECT COUNT(*) as c FROM internship_postings WHERE status=1")->fetch_assoc()['c'];
$assessmentCount = $mysqli->query("SELECT COUNT(*) as c FROM assessments WHERE status=1")->fetch_assoc()['c'];
$completedAssessments = $mysqli->query("SELECT COUNT(*) as c FROM assessment_results WHERE student_id=$student_id")->fetch_assoc()['c'];
?>
<div class="content">
    <h2>Welcome, <?= htmlspecialchars($_SESSION['student']['name']) ?></h2>
    <div class="row mt-4">
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-briefcase fa-2x text-primary mb-2"></i>
                    <h5 class="card-title">Available Internships</h5>
                    <p class="card-text"><strong><?= $internshipCount ?></strong></p>
                    <a href="available_internships.php" class="btn btn-sm btn-primary">View</a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-file-alt fa-2x text-success mb-2"></i>
                    <h5 class="card-title">My Applications</h5>
                    <p class="card-text"><strong><?= $appCount ?></strong></p>
                    <a href="application_status.php" class="btn btn-sm btn-success">Track</a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-certificate fa-2x text-warning mb-2"></i>
                    <h5 class="card-title">Certificates</h5>
                    <p class="card-text"><strong><?= $certCount ?></strong></p>
                    <a href="certificates.php" class="btn btn-sm btn-warning">View</a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-download fa-2x text-info mb-2"></i>
                    <h5 class="card-title">Offer Letters</h5>
                    <p class="card-text"><strong><?= $certCount ?></strong></p>
                    <a href="offer_letters.php" class="btn btn-sm btn-info">Download</a>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-clipboard fa-2x text-danger mb-2"></i>
                    <h5 class="card-title">Assessments</h5>
                    <p class="card-text"><strong><?= $completedAssessments ?>/<?= $assessmentCount ?></strong></p>
                    <a href="assessments.php" class="btn btn-sm btn-danger">Take Now</a>
                </div>
            </div>
        </div>

    <hr class="my-5">

    <h3 class="mt-5 mb-4">Your Certificates & Achievements</h3>
    <div class="row">
        <?php 
        $certs = getDummyCertificates();
        foreach ($certs as $cert) {
            displayCertificateCard($cert);
        }
        ?>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>