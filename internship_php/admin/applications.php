<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

$result = $mysqli->query("SELECT a.id,a.date_submitted,s.name as student, c.name as company, i.name as type, a.status
    FROM applications a
    LEFT JOIN students s ON a.student_id=s.id
    LEFT JOIN companies c ON a.company_id=c.id
    LEFT JOIN internship_types i ON a.internship_type_id=i.id
    ORDER BY a.date_submitted DESC");
?>
<div class="content">
    <h2>Internship Applications</h2>
    <table class="table table-striped bg-light">
        <thead><tr><th>ID</th><th>Date</th><th>Student</th><th>Company</th><th>Type</th><th>Status</th></tr></thead>
        <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= $row['id'] ?></td>
                <td><?= $row['date_submitted'] ?></td>
                <td><?= htmlspecialchars($row['student']) ?></td>
                <td><?= htmlspecialchars($row['company']) ?></td>
                <td><?= htmlspecialchars($row['type']) ?></td>
                <td><?= htmlspecialchars($row['status']) ?></td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>