document.addEventListener('DOMContentLoaded', () => {
    // --- Pop-up Pemberitahuan Awal ---
    const welcomePopup = document.getElementById('welcome-popup');
    const ageConsentCheckbox = document.getElementById('age-consent');
    const popupOkBtn = document.getElementById('popup-ok-btn');
    const consentWarning = document.getElementById('consent-warning');

    // Tampilkan pop-up saat halaman dimuat
    welcomePopup.classList.remove('hidden');

    popupOkBtn.addEventListener('click', () => {
        if (ageConsentCheckbox.checked) {
            welcomePopup.classList.add('hidden'); // Sembunyikan pop-up dengan animasi
            // Mulai efek mengetik setelah pop-up benar-benar hilang
            setTimeout(startTypingEffect, 600); // Durasi disesuaikan dengan transisi CSS pop-up (lebih lama karena animasinya lebih smooth)
        } else {
            consentWarning.textContent = 'Mohon centang panduan kami untuk melanjutkan.';
            consentWarning.classList.add('show'); // Tampilkan peringatan
        }
    });

    // Sembunyikan peringatan jika checkbox dicentang setelahnya
    ageConsentCheckbox.addEventListener('change', () => {
        if (ageConsentCheckbox.checked) {
            consentWarning.classList.remove('show');
            consentWarning.textContent = '';
        }
    });

    // --- Panel Navigasi (Media, Payment, Script) ---
    const goToMediaBtn = document.getElementById('go-to-media-btn');
    const goToPaymentBtn = document.getElementById('go-to-payment-btn');
    const goToScriptBtn = document.getElementById('go-to-script-btn');
    
    const mediaPanel = document.getElementById('media-panel');
    const paymentPanel = document.getElementById('payment-panel');
    const scriptPanel = document.getElementById('script-panel');

    const closeButtons = document.querySelectorAll('.close-btn');

    // Function to close all panels
    const closeAllPanels = () => {
        mediaPanel.classList.remove('open');
        paymentPanel.classList.remove('open');
        scriptPanel.classList.remove('open');
    };

    goToMediaBtn.addEventListener('click', () => {
        closeAllPanels(); // Tutup panel lain terlebih dahulu
        mediaPanel.classList.add('open');
    });

    goToPaymentBtn.addEventListener('click', () => {
        closeAllPanels(); // Tutup panel lain terlebih dahulu
        paymentPanel.classList.add('open');
    });

    goToScriptBtn.addEventListener('click', () => {
        closeAllPanels(); // Tutup panel lain terlebih dahulu
        scriptPanel.classList.add('open');
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Dapatkan elemen panel terdekat dari tombol close yang diklik
            const panelToClose = e.target.closest('.side-panel');
            if (panelToClose) {
                panelToClose.classList.remove('open');
            }
        });
    });

    // --- Fungsi Salin ke Clipboard ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const textToCopy = e.target.dataset.text;
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalText = button.textContent;
                button.textContent = 'Tersalin!';
                // Memberi feedback visual singkat
                button.style.backgroundColor = 'var(--primary-color)';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = ''; // Kembalikan warna asli
                }, 1500);
            } catch (err) {
                console.error('Gagal menyalin:', err);
                alert('Gagal menyalin. Silakan salin manual: ' + textToCopy);
            }
        });
    });

    // --- Tombol Unduh QR (mengambil dari Catbox.moe) ---
    const downloadQrBtn = document.querySelector('.download-qr-btn');
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', () => {
            const qrImageUrl = document.querySelector('.qr-code-img').src;
            // Cek apakah URL QR code valid (contoh: mengandung catbox.moe atau setidaknya http/https)
            if (qrImageUrl && (qrImageUrl.startsWith('http://') || qrImageUrl.startsWith('https://'))) {
                const link = document.createElement('a');
                link.href = qrImageUrl;
                link.download = 'QR_Annas_Nasrullah.png'; // Nama file yang akan diunduh
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('QR Code berhasil diunduh!');
            } else {
                alert('URL QR Code tidak valid atau tidak dapat diunduh. Pastikan link langsung ke gambar.');
            }
        });
    }

    // --- Efek Mengetik untuk Bagian "Tentang Annas" ---
    const aboutTextElement = document.getElementById('about-text');
    const fullText = `Annas Nasrullah Adalah Seorang Developer Pemula Yang Sedang Terjun Ke Dunia Coding. Berusia 18 Tahun, Annas Bersemangat Dalam Mengembangkan Solusi Digital.
    
Benefit Script ASOPOU x Funtion 
    
Funtion Bug WhatsApp 
• Force close 
• Delay Hard 
• Sedot Paket Atau Download Sebuah file dengan 1gb dan 1000gb
• Cash Home
• Ui Sistem Hp Akan Hitam Layar nya berapa menit 

SCRIPT ASOPOU  🤓

Fitur Lainnya 
• Fitur Jaga Group
• Fitur Download 
 - tiktok
- YouTube 
• Fitur Pushkontak
- khusus grup 
- khusus menggunakan Id Grup 
• Fitur Bug
•Dll`;


    let charIndex = 0;
    let typingInterval;

    function typeChar() {
        if (charIndex < fullText.length) {
            aboutTextElement.textContent += fullText.charAt(charIndex);
            charIndex++;
            // Sesuaikan kecepatan mengetik di sini (nilai lebih kecil = lebih cepat)
            typingInterval = setTimeout(typeChar, 30); // 30 milidetik per karakter (sedikit lebih cepat)
        } else {
            // Setelah selesai mengetik, tambahkan kelas untuk efek glitch/pulse
            aboutTextElement.classList.add('finished');
        }
    }

    function startTypingEffect() {
        // Bersihkan teks dan reset indeks sebelum memulai
        aboutTextElement.textContent = '';
        charIndex = 0;
        aboutTextElement.classList.remove('finished'); // Hapus kelas jika ada dari sebelumnya
        clearTimeout(typingInterval); // Hapus interval yang mungkin masih berjalan
        typeChar(); // Mulai efek mengetik
    }

    // Catatan: startTypingEffect dipanggil setelah pop-up ditutup oleh pengguna.
});