document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.getElementById('loginCard');
    const dashboardCard = document.getElementById('dashboardCard');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const successMessage = document.getElementById('successMessage');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    let isSubmitting = false;

    // --- SELEKSI STATUS LOGIN AWAL ---
    // Cek apakah pengguna sebelumnya sudah login atau belum di browser ini
    function checkLoginStatus() {
        const savedUser = localStorage.getItem('isLoggedInAs');
        if (savedUser) {
            // Sembunyikan Form Login, Munculkan Halaman Utama / Tombol Logout
            loginCard.style.display = 'none';
            dashboardCard.style.display = 'block';
            userDisplay.textContent = savedUser;
        } else {
            // Tampilkan kembali Form Login biasa
            loginCard.style.display = 'block';
            dashboardCard.style.display = 'none';
        }
    }
    checkLoginStatus();

    // --- AKTIVASI PASWORD TOGGLE (Mata Intip) ---
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const eyeIcon = passwordToggle.querySelector('.eye-icon');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.add('show-password');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('show-password');
            }
        });
    }

    // --- VALIDASI HUBUNGAN INPUT ---
    function showError(fieldId, message) {
        const group = document.getElementById(`${fieldId}Group`);
        const errorSpan = document.getElementById(`${fieldId}Error`);
        if (group && errorSpan) {
            group.classList.add('error');
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    }

    function clearError(fieldId) {
        const group = document.getElementById(`${fieldId}Group`);
        const errorSpan = document.getElementById(`${fieldId}Error`);
        if (group && errorSpan) {
            group.classList.remove('error');
            errorSpan.classList.remove('show');
            errorSpan.textContent = '';
        }
    }

    // Real-time clearance saat mengetik kembali
    usernameInput.addEventListener('input', () => clearError('username'));
    passwordInput.addEventListener('input', () => clearError('password'));

    // --- PROSES SUBMIT LOGIN ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        let isValid = true;

        // Validasi Sederhana Form Kosong
        if (!usernameVal) {
            showError('username', 'Username tidak boleh kosong.');
            isValid = false;
        }
        if (!passwordVal) {
            showError('password', 'Password tidak boleh kosong.');
            isValid = false;
        } else if (passwordVal.length < 4) {
            showError('password', 'Password minimal terdiri dari 4 karakter.');
            isValid = false;
        }

        if (!isValid) {
            // Efek Getar jika gagal validasi
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => loginForm.style.animation = '', 500);
            return;
        }

        // Jalankan Simulasi Loading Button
        isSubmitting = true;
        const submitBtn = loginForm.querySelector('.login-btn');
        submitBtn.classList.add('loading');

        // Simulasi hit API / Server selama 1.5 detik
        setTimeout(() => {
            isSubmitting = false;
            submitBtn.classList.remove('loading');

            // Simpan status pendaftaran login ke LocalStorage komputer pengguna
            localStorage.setItem('isLoggedInAs', usernameVal);

            // Tampilkan UI Animasi Sukses Berhasil
            // Menyembunyikan form internal card
            loginForm.style.opacity = '0';
            document.querySelector('.divider').style.opacity = '0';
            document.querySelector('.social-login').style.opacity = '0';
            document.querySelector('.signup-link').style.opacity = '0';

            setTimeout(() => {
                loginForm.style.display = 'none';
                document.querySelector('.divider').style.display = 'none';
                document.querySelector('.social-login').style.display = 'none';
                document.querySelector('.signup-link').style.display = 'none';
                
                successMessage.classList.add('show');

                // Jeda 2 detik lalu transisi ganti konten ke Halaman Utama dengan Tombol Logout
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    // Reset isi form
                    loginForm.reset();
                    // Kembalikan opacity form agar normal saat logout nanti
                    loginForm.style.opacity = '1';
                    document.querySelector('.divider').style.opacity = '1';
                    document.querySelector('.social-login').style.opacity = '1';
                    document.querySelector('.signup-link').style.opacity = '1';
                    loginForm.style.display = 'block';
                    document.querySelector('.divider').style.display = 'flex';
                    document.querySelector('.social-login').style.display = 'flex';
                    document.querySelector('.signup-link').style.display = 'block';

                    // Update UI Total ke Dashboard/Halaman utama
                    checkLoginStatus();
                }, 2000);
            }, 300);

        }, 1500);
    });

    // --- PROSES LOGOUT (KEMBALI KE TOMBOL LOGIN) ---
    logoutBtn.addEventListener('click', () => {
        // Hapus data login dari memori browser
        localStorage.removeItem('isLoggedInAs');
        // Update tampilan agar form login muncul lagi
        checkLoginStatus();
    });
});
