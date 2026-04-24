<?php
require_once '../includes/header.php';
if (!isset($_SESSION['student'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

// Read templates (ensure table exists)
$mysqli->query("CREATE TABLE IF NOT EXISTS event_certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    event_date DATE DEFAULT NULL,
    template_html LONGTEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

$res = $mysqli->query("SELECT * FROM event_certificates ORDER BY created_at DESC");

$selected_template = null;
if (isset($_GET['template'])) {
    $id = (int)$_GET['template'];
    $selected_template = $mysqli->query("SELECT * FROM event_certificates WHERE id=$id")->fetch_assoc();
}

?>
<div class="content">
    <h2>Event Certificates</h2>
    <p>Claim certificates for events hosted here.</p>

    <div class="row">
        <?php while ($tpl = $res->fetch_assoc()): ?>
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title"><?= htmlspecialchars($tpl['title']) ?></h5>
                    <p class="card-text small text-muted"><?= htmlspecialchars($tpl['issuer']) ?> • <?= $tpl['event_date'] ? date('M d, Y', strtotime($tpl['event_date'])) : '' ?></p>
                    <p class="card-text"><?= nl2br(htmlspecialchars($tpl['description'])) ?></p>
                    <div>
                        <a class="btn btn-sm btn-primary" href="event_certificates.php?template=<?= $tpl['id'] ?>">Claim Certificate</a>
                    </div>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
    </div>

    <?php if ($selected_template): ?>
        <hr>
        <h4>Claim: <?= htmlspecialchars($selected_template['title']) ?></h4>
        <div class="card mb-3">
            <div class="card-body">
                <p><?= nl2br(htmlspecialchars($selected_template['description'])) ?></p>
                <form method="post" action="../generate_certificate.php">
                    <input type="hidden" name="template_id" value="<?= $selected_template['id'] ?>">
                    <div class="mb-3">
                        <label class="form-label">Display Name on Certificate</label>
                        <input type="text" name="student_name" class="form-control" value="<?= htmlspecialchars($_SESSION['student']['name']) ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Remarks (optional)</label>
                        <input type="text" name="remarks" class="form-control" placeholder="e.g. Participant">
                    </div>
                    <button class="btn btn-success"><i class="fa fa-certificate"></i> Generate Certificate</button>
                </form>
            </div>
        </div>
    <?php endif; ?>

</div>
<?php require_once '../includes/footer.php'; ?>
