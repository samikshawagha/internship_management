<?php
// Dummy Certificate Generator
function getDummyCertificates() {
    return [
        [
            'id' => 1,
            'name' => 'Web Development Internship Certificate',
            'issuer' => 'TechCorp Solutions',
            'date' => '2025-12-15',
            'grade' => 'A+',
            'color' => 'primary'
        ],
        [
            'id' => 2,
            'name' => 'Data Analytics Internship Certificate',
            'issuer' => 'DataInsight Inc.',
            'date' => '2025-11-20',
            'grade' => 'A',
            'color' => 'success'
        ],
        [
            'id' => 3,
            'name' => 'Full Stack Development Certificate',
            'issuer' => 'CodeMasters Ltd.',
            'date' => '2025-10-10',
            'grade' => 'A-',
            'color' => 'info'
        ],
        [
            'id' => 4,
            'name' => 'UI/UX Design Internship Certificate',
            'issuer' => 'CreativeMinds Studio',
            'date' => '2025-09-05',
            'grade' => 'B+',
            'color' => 'warning'
        ]
    ];
}

function displayCertificateCard($cert) {
    ?>
    <div class="col-md-6 col-lg-3 mb-3">
        <div class="card certificate-card h-100 border-<?= $cert['color'] ?> shadow-sm">
            <div class="card-body text-center">
                <div class="certificate-icon mb-3">
                    <i class="fa fa-certificate fa-3x text-<?= $cert['color'] ?>"></i>
                </div>
                <h6 class="card-title"><?= htmlspecialchars($cert['name']) ?></h6>
                <p class="card-text small text-muted"><?= htmlspecialchars($cert['issuer']) ?></p>
                <p class="card-text mb-2">
                    <strong>Grade:</strong> <span class="badge bg-<?= $cert['color'] ?>"><?= $cert['grade'] ?></span>
                </p>
                <p class="card-text small">
                    <strong>Date:</strong> <?= date('M d, Y', strtotime($cert['date'])) ?>
                </p>
                <button class="btn btn-sm btn-<?= $cert['color'] ?>" data-bs-toggle="modal" data-bs-target="#certModal<?= $cert['id'] ?>">
                    <i class="fa fa-download"></i> Download
                </button>
            </div>
        </div>
        
        <!-- Certificate Modal -->
        <div class="modal fade" id="certModal<?= $cert['id'] ?>" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Certificate Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center p-4">
                        <div class="border border-<?= $cert['color'] ?> rounded p-5 bg-light">
                            <i class="fa fa-certificate fa-5x text-<?= $cert['color'] ?> mb-3"></i>
                            <h4><?= htmlspecialchars($cert['name']) ?></h4>
                            <p class="text-muted">This certifies that you have successfully completed the internship program</p>
                            <hr>
                            <p><strong><?= htmlspecialchars($cert['issuer']) ?></strong></p>
                            <p>Grade: <strong><?= $cert['grade'] ?></strong></p>
                            <p>Date: <?= date('M d, Y', strtotime($cert['date'])) ?></p>
                            <p class="text-muted small">Certificate ID: CERT-<?= str_pad($cert['id'], 5, '0', STR_PAD_LEFT) ?></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-<?= $cert['color'] ?>">
                            <i class="fa fa-download"></i> Download PDF
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
}
?>