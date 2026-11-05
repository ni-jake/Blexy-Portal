document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const portalContainer = document.getElementById('portal-container');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const role = document.getElementById('login-role').value;
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // Admin password check
            if (role === 'Admin' && password !== 'admin123') {
                alert('Access Denied: Incorrect Admin Password! Use: admin123');
                return;
            }

            // Save session
            sessionStorage.setItem('blexy_role', role);
            sessionStorage.setItem('blexy_user', email);

            // Switch screen
            if (loginSection) loginSection.classList.add('hidden');
            if (portalContainer) portalContainer.classList.remove('hidden');

            // Route to target view
            document.querySelectorAll('.portal-view').forEach(view => view.classList.add('hidden'));
            const targetView = document.getElementById(`view-${role.toLowerCase()}`);
            if (targetView) targetView.classList.remove('hidden');

            // Load role data
            if (role === 'Admin' && typeof loadStudentDirectory === 'function') loadStudentDirectory();
            if (role === 'Trainer' && typeof loadAttendanceRoster === 'function') loadAttendanceRoster();
            if (role === 'Student' && typeof loadStudentFees === 'function') loadStudentFees();
        });
    }
});