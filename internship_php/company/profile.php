<?php
require_once '../includes/header.php';
if (!isset($_SESSION['company'])) { header('Location: login.php'); exit; }
require_once 'sidebar.php';

$company_id = $_SESSION['company']['id'] ?? 0;

// Fetch company data
$company = $mysqli->query("SELECT * FROM companies WHERE id=$company_id")->fetch_assoc();

// Handle profile update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $mysqli->real_escape_string($_POST['name']);
    $email = $mysqli->real_escape_string($_POST['email']);
    $phone = $mysqli->real_escape_string($_POST['phone']);
    $address = $mysqli->real_escape_string($_POST['address']);
    
    $mysqli->query("UPDATE companies SET name='$name', email='$email', phone='$phone', address='$address' WHERE id=$company_id");
    $_SESSION['company']['name'] = $name;
    echo '<div class="alert alert-success">Profile updated successfully!</div>';
    $company = $mysqli->query("SELECT * FROM companies WHERE id=$company_id")->fetch_assoc();
}
?>
<div class="content">
    <h2>Company Profile</h2>
    <form method="post" class="bg-light p-4 rounded" style="max-width:600px;">
        <div class="mb-3">
            <label for="name" class="form-label">Company Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($company['name']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($company['email']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input type="tel" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($company['phone']) ?>" required>
        </div>
        <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea class="form-control" id="address" name="address" rows="3" required><?= htmlspecialchars($company['address']) ?></textarea>
        </div>
        <div class="mb-3">
            <p><strong>Status:</strong> 
                <?php
                if ($company['status'] == 1) echo '<span class="badge bg-success">Approved</span>';
                elseif ($company['status'] == 0) echo '<span class="badge bg-warning text-dark">Pending Approval</span>';
                else echo '<span class="badge bg-danger">Rejected</span>';
                ?>
            </p>
        </div>
        <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
</div>
<?php require_once '../includes/footer.php'; ?>