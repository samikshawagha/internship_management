// Toggle sidebar for small screens
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('sidebarCollapse');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }
});