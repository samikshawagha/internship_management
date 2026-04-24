<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once '../includes/sidebar.php';

// handle status change
if (isset($_GET['action']) && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $action = $_GET['action'];
    if ($action === 'approve') {
        $mysqli->query("UPDATE companies SET status=1 WHERE id=$id");
    } elseif ($action === 'reject') {
        $mysqli->query("UPDATE companies SET status=2 WHERE id=$id");
    }
    header('Location: companies.php');
    exit;
}

$result = $mysqli->query("SELECT * FROM companies ORDER BY name");
?>
<div class="content">
    <h2>Companies</h2>
    <p>Approve or reject company registrations here.</p>
    <table class="table table-striped bg-light">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= $row['id'] ?></td>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= htmlspecialchars($row['email']) ?></td>
                <td><?php
                    if ($row['status']==1) echo 'Approved';
                    elseif ($row['status']==2) echo 'Rejected';
                    else echo 'Pending';
                ?></td>
                <td>
                    <?php if ($row['status']==0): ?>
                        <a href="companies.php?action=approve&id=<?= $row['id'] ?>" class="btn btn-sm btn-success">Approve</a>
                        <a href="companies.php?action=reject&id=<?= $row['id'] ?>" class="btn btn-sm btn-danger">Reject</a>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
</div>
<?php require_once '../includes/footer.php'; ?>