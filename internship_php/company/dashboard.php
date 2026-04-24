<?php
require_once '../includes/header.php';
if (!isset($_SESSION['company'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';
require_once '../includes/certificates.php';

$company_id = $_SESSION['company']['id'] ?? 0;

// Get statistics
$internshipCount = $mysqli->query("SELECT COUNT(*) as c FROM internship_postings WHERE company_id=$company_id")->fetch_assoc()['c'];
$appCount = $mysqli->query("SELECT COUNT(*) as c FROM applications WHERE internship_id IN (SELECT id FROM internship_postings WHERE company_id=$company_id)")->fetch_assoc()['c'];
$pendingAppCount = $mysqli->query("SELECT COUNT(*) as c FROM applications WHERE internship_id IN (SELECT id FROM internship_postings WHERE company_id=$company_id) AND status='pending'")->fetch_assoc()['c'];
?>
<div class="content">
    <h2>Welcome, <?= htmlspecialchars($_SESSION['company']['name']) ?></h2>
    <div class="row mt-4">
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-briefcase fa-2x text-primary mb-2"></i>
                    <h5 class="card-title">Active Internships</h5>
                    <p class="card-text"><strong><?= $internshipCount ?></strong></p>
                    <a href="my_internships.php" class="btn btn-sm btn-primary">View</a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-file-alt fa-2x text-warning mb-2"></i>
                    <h5 class="card-title">Total Applications</h5>
                    <p class="card-text"><strong><?= $appCount ?></strong></p>
                    <a href="applications.php" class="btn btn-sm btn-warning">Manage</a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-clock fa-2x text-success mb-2"></i>
                    <h5 class="card-title">Pending Review</h5>
                    <p class="card-text"><strong><?= $pendingAppCount ?></strong></p>
                    <a href="applications.php" class="btn btn-sm btn-success">Review</a>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center">
                <div class="card-body">
                    <i class="fa fa-plus-circle fa-2x text-info mb-2"></i>
                    <h5 class="card-title">Post New</h5>
                    <p class="card-text">Create Internship</p>
                    <a href="post_internship.php" class="btn btn-sm btn-info">Post Now</a>
                </div>
            </div>
        </div>
    </div>

    <hr class="my-5">

    <h3 class="mt-5 mb-4">Sample Achievement Certificates</h3>
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