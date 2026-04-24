<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$student_id = $_SESSION['student']['id'] ?? 0;

// Fetch all applications with internship and company details
$result = $mysqli->query("SELECT a.*, i.title, c.name as company_name FROM applications a
    LEFT JOIN internship_postings i ON a.internship_id=i.id
    LEFT JOIN companies c ON i.company_id=c.id
    WHERE a.student_id=$student_id
    ORDER BY a.date_submitted DESC");
?>
<div class="content">
    <h2>Application Status</h2>
    <p>Track your internship applications below.</p>
    <?php if ($result->num_rows === 0): ?>
        <div class="alert alert-info">You haven't applied for any internships yet. <a href="available_internships.php">Browse available positions</a></div>
    <?php else: ?>
    <div class="table-responsive">
        <table class="table table-striped table-hover bg-light">
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php while ($app = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($app['title']) ?></td>
                    <td><?= htmlspecialchars($app['company_name']) ?></td>
                    <td><?= date('M d, Y', strtotime($app['date_submitted'])) ?></td>
                    <td>
                        <?php
                        $status = $app['status'];
                        if ($status === 'pending') $badge = '<span class="badge bg-warning">Pending</span>';
                        elseif ($status === 'approved') $badge = '<span class="badge bg-success">Approved</span>';
                        elseif ($status === 'rejected') $badge = '<span class="badge bg-danger">Rejected</span>';
                        else $badge = '<span class="badge bg-secondary">Unknown</span>';
                        echo $badge;
                        ?>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#detailsModal<?= $app['id'] ?>">Details</button>
                    </td>
                </tr>

                <!-- Modal -->
                <div class="modal fade" id="detailsModal<?= $app['id'] ?>" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title"><?= htmlspecialchars($app['title']) ?></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p><strong>Company:</strong> <?= htmlspecialchars($app['company_name']) ?></p>
                                <p><strong>Applied On:</strong> <?= date('M d, Y H:i', strtotime($app['date_submitted'])) ?></p>
                                <p><strong>Current Status:</strong> 
                                    <?php
                                    if ($app['status'] === 'pending') echo '<span class="badge bg-warning text-dark">Under Review</span>';
                                    elseif ($app['status'] === 'approved') echo '<span class="badge bg-success">Approved! Check Offer Letter</span>';
                                    elseif ($app['status'] === 'rejected') echo '<span class="badge bg-danger">Rejected</span>';
                                    ?>
                                </p>
                                <?php if ($app['status'] === 'approved'): ?>
                                    <p class="text-success"><i class="fa fa-check-circle"></i> Congratulations! Your offer letter is available in the Offer Letters section.</p>
                                <?php endif; ?>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
            </tbody>
        </table>
    </div>
    <?php endif; ?>
</div>
<?php require_once '../includes/footer.php'; ?>