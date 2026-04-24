<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';
require_once '../includes/certificates.php';

// simple stats counts
$deptCount = $mysqli->query("SELECT COUNT(*) as c FROM departments")->fetch_assoc()['c'];
$companyCount = $mysqli->query("SELECT COUNT(*) as c FROM companies")->fetch_assoc()['c'];
$studentCount = $mysqli->query("SELECT COUNT(*) as c FROM students")->fetch_assoc()['c'];
$appCount = $mysqli->query("SELECT COUNT(*) as c FROM applications")->fetch_assoc()['c'];
?>
<div class="content">
    <h2>Dashboard</h2>
    <div class="row">
        <div class="col-md-3"><div class="card"><div class="card-body">Departments: <strong><?= $deptCount ?></strong></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Companies: <strong><?= $companyCount ?></strong></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Students: <strong><?= $studentCount ?></strong></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Applications: <strong><?= $appCount ?></strong></div></div></div>
    </div>

    <hr class="my-5">

    <h3 class="mt-5 mb-4">Sample Certificates</h3>
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