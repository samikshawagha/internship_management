<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

// export CSV
if (isset($_GET['export']) && $_GET['export'] === 'applications') {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment;filename=applications.csv');
    $out = fopen('php://output', 'w');
    fputcsv($out,['ID','Date','Student','Company','Type','Status']);
    $res = $mysqli->query("SELECT a.id,a.date_submitted,s.name as student, c.name as company, i.name as type, a.status
        FROM applications a
        LEFT JOIN students s ON a.student_id=s.id
        LEFT JOIN companies c ON a.company_id=c.id
        LEFT JOIN internship_types i ON a.internship_type_id=i.id");
    while ($row = $res->fetch_assoc()) {
        fputcsv($out,[$row['id'],$row['date_submitted'],$row['student'],$row['company'],$row['type'],$row['status']]);
    }
    exit;
}

// compute counts
$deptCount = $mysqli->query("SELECT COUNT(*) as c FROM departments")->fetch_assoc()['c'];
$companyCount = $mysqli->query("SELECT COUNT(*) as c FROM companies")->fetch_assoc()['c'];
$studentCount = $mysqli->query("SELECT COUNT(*) as c FROM students")->fetch_assoc()['c'];
$appCount = $mysqli->query("SELECT COUNT(*) as c FROM applications")->fetch_assoc()['c'];
?>
<div class="content">
    <h2>Reports</h2>
    <div class="row">
        <div class="col-md-3"><div class="card"><div class="card-body">Departments: <strong><?= $deptCount ?></strong></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Companies: <strong><?= $companyCount ?></strong></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Students: <strong><?= $studentCount ?></strong></div></div></div>
        <div class="col-md-3"><div class="card"><div class="card-body">Applications: <strong><?= $appCount ?></strong></div></div></div>
    </div>
    <p class="mt-3"><a href="reports.php?export=applications" class="btn btn-info">Export Applications CSV</a></p>
</div>
<?php require_once '../includes/footer.php'; ?>