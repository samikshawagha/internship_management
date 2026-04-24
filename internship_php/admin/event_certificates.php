<?php
require_once '../includes/header.php';
if (!isset($_SESSION['admin'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

// Ensure templates table exists
$mysqli->query("CREATE TABLE IF NOT EXISTS event_certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    event_date DATE DEFAULT NULL,
    template_html LONGTEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)");

// Handle create
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['title'])) {
    $title = $mysqli->real_escape_string($_POST['title']);
    $issuer = $mysqli->real_escape_string($_POST['issuer'] ?? '');
    $description = $mysqli->real_escape_string($_POST['description'] ?? '');
    $event_date = $_POST['event_date'] ? $mysqli->real_escape_string($_POST['event_date']) : 'NULL';
    $template_html = $mysqli->real_escape_string($_POST['template_html'] ?? '');

    $mysqli->query("INSERT INTO event_certificates (title, issuer, description, event_date, template_html)
        VALUES ('$title', '$issuer', '$description', " . ($event_date === 'NULL' ? 'NULL' : "'$event_date'") . ", '$template_html')");
    header('Location: event_certificates.php'); exit;
}

$res = $mysqli->query("SELECT * FROM event_certificates ORDER BY created_at DESC");
?>
<div class="content">
    <h2>Event Certificate Templates</h2>
    <p>Create certificate templates for events so students can claim them.</p>

    <div class="card mb-4">
        <div class="card-body">
            <h5 class="card-title">Create Template</h5>
            <form method="post" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Title</label>
                    <input name="title" class="form-control" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Issuer</label>
                    <input name="issuer" class="form-control" placeholder="e.g. CodeSoft">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Event Date</label>
                    <input type="date" name="event_date" class="form-control">
                </div>
                <div class="col-12">
                    <label class="form-label">Description / Notes</label>
                    <textarea name="description" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-12">
                    <label class="form-label">Template HTML (use %STUDENT_NAME%, %TITLE%, %ISSUER%, %DATE%)</label>
                    <textarea name="template_html" class="form-control" rows="6">&lt;div style="font-family: Arial, sans-serif; padding:40px; text-align:center; border:8px solid #4facfe;"&gt;
  &lt;h1 style="margin:0;color:#1a73e8;"&gt;%TITLE%&lt;/h1&gt;
  &lt;h3 style="margin-top:6px;color:#0b5ed7;"&gt;Presented to&lt;/h3&gt;
  &lt;h2 style="margin:6px 0 20px;font-weight:700;"&gt;%STUDENT_NAME%&lt;/h2&gt;
  &lt;p&gt;For participating in &lt;strong&gt;%TITLE%&lt;/strong&gt; on %DATE%&lt;/p&gt;
  &lt;p style="margin-top:30px;"&gt;&lt;strong&gt;%ISSUER%&lt;/strong&gt;&lt;/p&gt;
&lt;/div&gt;</textarea>
                </div>
                <div class="col-12">
                    <button class="btn btn-primary">Create Template</button>
                </div>
            </form>
        </div>
    </div>

    <h4>Existing Templates</h4>
    <div class="row">
        <?php while ($tpl = $res->fetch_assoc()): ?>
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title"><?= htmlspecialchars($tpl['title']) ?></h5>
                    <p class="card-text small text-muted"><?= htmlspecialchars($tpl['issuer']) ?> • <?= $tpl['event_date'] ? date('M d, Y', strtotime($tpl['event_date'])) : '' ?></p>
                    <p class="card-text"><?= nl2br(htmlspecialchars($tpl['description'])) ?></p>
                    <div>
                        <a class="btn btn-sm btn-outline-primary" href="../student/event_certificates.php?template=<?= $tpl['id'] ?>">View / Claim</a>
                    </div>
                </div>
            </div>
        </div>
        <?php endwhile; ?>
    </div>
</div>
<?php require_once '../includes/footer.php'; ?>
