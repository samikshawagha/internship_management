<?php
require_once 'includes/header.php';
?>
<div class="container text-white" style="padding: 60px 20px;">
    <div class="row align-items-center mb-5">
        <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4">Online Internship Management System</h1>
            <p class="lead mb-4">A comprehensive platform connecting students with internship opportunities at leading companies.</p>
        </div>
    </div>

    <div class="row">
        <div class="col-md-4 mb-4">
            <div class="card bg-light rounded-lg shadow-lg h-100">
                <div class="card-body text-center">
                    <i class="fa fa-graduation-cap fa-3x text-primary mb-3"></i>
                    <h5 class="card-title">For Students</h5>
                    <p class="card-text">Browse internships, apply, track status, and download certificates.</p>
                    <a href="student/login.php" class="btn btn-primary me-2">Login</a>
                    <a href="student/register.php" class="btn btn-outline-primary">Register</a>
                </div>
            </div>
        </div>

        <div class="col-md-4 mb-4">
            <div class="card bg-light rounded-lg shadow-lg h-100">
                <div class="card-body text-center">
                    <i class="fa fa-building fa-3x text-success mb-3"></i>
                    <h5 class="card-title">For Companies</h5>
                    <p class="card-text">Post internships, review applications, send offers, and manage talent.</p>
                    <a href="company/login.php" class="btn btn-success me-2">Login</a>
                    <a href="company/register.php" class="btn btn-outline-success">Register</a>
                </div>
            </div>
        </div>

        <div class="col-md-4 mb-4">
            <div class="card bg-light rounded-lg shadow-lg h-100">
                <div class="card-body text-center">
                    <i class="fa fa-lock fa-3x text-info mb-3"></i>
                    <h5 class="card-title">For Admins</h5>
                    <p class="card-text">Manage departments, approve companies, and generate reports.</p>
                    <a href="admin/login.php" class="btn btn-info">Admin Login</a>
                </div>
            </div>
        </div>
    </div>

    <hr class="my-5 border-light">

    <div class="row mt-5">
        <div class="col-lg-12 text-center">
            <h3 class="mb-4">Key Features</h3>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <div><i class="fa fa-search fa-2x text-warning mb-2"></i></div>
                    <p><strong>Browse & Search</strong><br>Find perfect internship matches</p>
                </div>
                <div class="col-md-3 mb-3">
                    <div><i class="fa fa-check-circle fa-2x text-success mb-2"></i></div>
                    <p><strong>Application Tracking</strong><br>Real-time status updates</p>
                </div>
                <div class="col-md-3 mb-3">
                    <div><i class="fa fa-envelope fa-2x text-primary mb-2"></i></div>
                    <p><strong>Offer Letters</strong><br>Download digital offers</p>
                </div>
                <div class="col-md-3 mb-3">
                    <div><i class="fa fa-certificate fa-2x text-danger mb-2"></i></div>
                    <p><strong>Certificates</strong><br>Earn certificates on completion</p>
                </div>
            </div>
        </div>
    </div>
</div>
<?php require_once 'includes/footer.php'; ?>