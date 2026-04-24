<?php
require_once '../includes/header.php';
if (!isset($_SESSION['company'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$company_id = $_SESSION['company']['id'] ?? 0;

// Handle deletion
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $mysqli->query("DELETE FROM internship_postings WHERE id=$id AND company_id=$company_id");
    header('Location: my_internships.php');
    exit;
}

$result = $mysqli->query("SELECT * FROM internship_postings WHERE company_id=$company_id ORDER BY created_at DESC");
?>
<div class="content">
    <h2>My Internship Postings</h2>
    <a href="post_internship.php" class="btn btn-success mb-3">Post New Internship</a>
    
    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info">No internship postings yet. <a href="post_internship.php">Create one now</a></div>
    <?php else: ?>
    <div class="table-responsive">
        <table class="table table-striped bg-light">
            <thead>
                <tr><th>Title</th><th>Duration</th><th>Stipend</th><th>Posted On</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
            <?php while ($posting = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($posting['title']) ?></td>
                    <td><?= htmlspecialchars($posting['duration']) ?></td>
                    <td>₹<?= htmlspecialchars($posting['stipend']) ?></td>
                    <td><?= date('M d, Y', strtotime($posting['created_at'])) ?></td>
                    <td><span class="badge bg-<?= $posting['status'] == 1 ? 'success' : 'secondary' ?>">Active</span></td>
                    <td>
                        <a href="edit_internship.php?id=<?= $posting['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                        <a href="my_internships.php?delete=<?= $posting['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Delete this posting?');">Delete</a>
                    </td>
                </tr>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>