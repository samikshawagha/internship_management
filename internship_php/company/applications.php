<?php
require_once '../includes/header.php';
if (!isset($_SESSION['company'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$company_id = $_SESSION['company']['id'] ?? 0;

// Handle status update
if (isset($_GET['action']) && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $action = $_GET['action'];
    if ($action === 'approve') {
        $mysqli->query("UPDATE applications SET status='approved' WHERE id=$id");
    } elseif ($action === 'reject') {
        $mysqli->query("UPDATE applications SET status='rejected' WHERE id=$id");
    }
    header('Location: applications.php');
    exit;
}

$result = $mysqli->query("SELECT a.*, i.title, s.name as student_name, s.email FROM applications a
    LEFT JOIN internship_postings i ON a.internship_id=i.id
    LEFT JOIN students s ON a.student_id=s.id
    WHERE i.company_id=$company_id
    ORDER BY a.date_submitted DESC");
?>
<div class="content">
    <h2>Internship Applications</h2>
    <p>Review and manage applications from students.</p>
    
    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info">No applications yet.</div>
    <?php else: ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover bg-light">
            <thead>
                <tr><th>Student</th><th>Position</th><th>Applied On</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
            <?php while ($app = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($app['student_name']) ?></td>
                    <td><?= htmlspecialchars($app['title']) ?></td>
                    <td><?= date('M d, Y', strtotime($app['date_submitted'])) ?></td>
                    <td>
                        <?php
                        if ($app['status'] === 'pending') echo '<span class="badge bg-warning text-dark">Pending</span>';
                        elseif ($app['status'] === 'approved') echo '<span class="badge bg-success">Approved</span>';
                        else echo '<span class="badge bg-danger">Rejected</span>';
                        ?>
                    </td>
                    <td>
                        <?php if ($app['status'] === 'pending'): ?>
                            <a href="applications.php?action=approve&id=<?= $app['id'] ?>" class="btn btn-sm btn-success">Approve</a>
                            <a href="applications.php?action=reject&id=<?= $app['id'] ?>" class="btn btn-sm btn-danger">Reject</a>
                        <?php else: ?>
                            <span class="text-muted">-</span>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>