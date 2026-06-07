document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const successMessage = document.getElementById('successMessage');
    
    let isSubmitting = false;

    // Toggle Sembunyi/Lihat Password (Mata Intip)
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

    // Fungsi Menampilkan Validasi Error UI
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

    // Hapus error real-time saat mulai mengetik ulang
    usernameInput.addEventListener('input', () => clearError('username'));
    passwordInput.addEventListener('input', () => clearError('password'));

    // Proses Submit Form
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        let isValid = true;

        // Validasi dasar input kosong
        if (!usernameVal) {
            showError('username', 'Username tidak boleh kosong.');
            isValid = false;
        }
        if (!passwordVal) {
            showError('password', 'Password tidak boleh kosong.');
            isValid = false;
        }

        // Efek getar kartu jika validasi gagal
        if (!isValid) {
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => loginForm.style.animation = '', 500);
            return;
        }

        // Aktifkan efek putaran Loading Button
        isSubmitting = true;
        const submitBtn = loginForm.querySelector('.login-btn');
        submitBtn.classList.add('loading');

        // Simulasi tunggu proses autentikasi server (1.5 Detik)
        setTimeout(() => {
            isSubmitting = false;
            submitBtn.classList.remove('loading');

            // Simpan identitas nama username ke memori komputer (localStorage)
            localStorage.setItem('isLoggedInAs', usernameVal);

            // Efek transisi menyembunyikan form login secara perlahan
            loginForm.style.opacity = '0';
            document.querySelector('.divider').style.opacity = '0';
            document.querySelector('.social-login').style.opacity = '0';
            document.querySelector('.signup-link').style.opacity = '0';

            setTimeout(() => {
                loginForm.style.display = 'none';
                document.querySelector('.divider').style.display = 'none';
                document.querySelector('.social-login').style.display = 'none';
                document.querySelector('.signup-link').style.display = 'none';
                
                // Munculkan checkmark animasi sukses masuk
                successMessage.classList.add('show');

                // Jeda 2 detik agar user sempat membaca info sukses, lalu lempar ke index.html utama
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            }, 300);

        }, 1500);
    });
});
