document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Welcome Pop-up ---
    const welcomePopup = document.getElementById('welcome-popup');
    const ageConsentCheckbox = document.getElementById('age-consent');
    const popupOkBtn = document.getElementById('popup-ok-btn');
    const consentWarning = document.getElementById('consent-warning');

    // Display the pop-up on page load
    welcomePopup.classList.remove('hidden');

    popupOkBtn.addEventListener('click', () => {
        if (ageConsentCheckbox.checked) {
            welcomePopup.classList.add('hidden'); // Hide pop-up with animation
            // Start typing effect after pop-up fully disappears
            setTimeout(startTypingEffect, 600); // Matches CSS transition duration for smoothness
        } else {
            consentWarning.textContent = 'Mohon centang panduan kami untuk melanjutkan.';
            consentWarning.classList.add('show'); // Show warning
        }
    });

    // Hide warning if checkbox is checked later
    ageConsentCheckbox.addEventListener('change', () => {
        if (ageConsentCheckbox.checked) {
            consentWarning.classList.remove('show');
            consentWarning.textContent = '';
        }
    });

    // --- Side Panels (Media, Payment, Function Bug) ---
    const goToMediaBtn = document.getElementById('go-to-media-btn');
    const goToPaymentBtn = document.getElementById('go-to-payment-btn');
    const goToFunctionBugBtn = document.getElementById('go-to-function-bug-btn'); // Button for Function Bug
    const adminAccessBtn = document.getElementById('admin-access-btn'); // Admin access button

    const mediaPanel = document.getElementById('media-panel');
    const paymentPanel = document.getElementById('payment-panel');
    const functionBugPanel = document.getElementById('function-bug-panel'); // Panel for Function Bug
    const adminLoginPanel = document.getElementById('admin-login-panel'); // Admin login panel

    const closeButtons = document.querySelectorAll('.close-btn');

    // Function to close all panels
    const closeAllPanels = () => {
        mediaPanel.classList.remove('open');
        paymentPanel.classList.remove('open');
        functionBugPanel.classList.remove('open');
        adminLoginPanel.classList.add('hidden-panel'); // Ensure login panel is hidden
    };

    goToMediaBtn.addEventListener('click', () => {
        closeAllPanels();
        mediaPanel.classList.add('open');
    });

    goToPaymentBtn.addEventListener('click', () => {
        closeAllPanels();
        paymentPanel.classList.add('open');
    });

    goToFunctionBugBtn.addEventListener('click', () => { // Event listener for Function Bug
        closeAllPanels();
        functionBugPanel.classList.add('open');
    });

    adminAccessBtn.addEventListener('click', () => {
        closeAllPanels();
        adminLoginPanel.classList.remove('hidden-panel'); // Show admin login panel
        document.getElementById('admin-username').value = ''; // Clear fields
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-login-message').textContent = '';
        document.getElementById('admin-login-message').classList.remove('show');
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Find the closest panel or popup-overlay parent
            const panelToClose = e.target.closest('.side-panel') || e.target.closest('.popup-overlay');
            if (panelToClose) {
                panelToClose.classList.remove('open');
                panelToClose.classList.add('hidden-panel'); // Hide login popup if it's the target
            }
        });
    });

    // --- Admin Login Functionality ---
    const adminUsernameInput = document.getElementById('admin-username');
    const adminPasswordInput = document.getElementById('admin-password');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLoginMessage = document.getElementById('admin-login-message');
    const addFunctionSection = document.getElementById('add-function-section'); // Section to add functions

    // Admin Credentials (INSECURE - for frontend demo only. DO NOT USE IN PRODUCTION)
    const ADMIN_USERNAME = 'Annas';
    const ADMIN_PASSWORD = '1';

    let isAdminLoggedIn = false;

    // Check login status from localStorage on load (for persistence across refresh)
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        isAdminLoggedIn = true;
        addFunctionSection.classList.add('visible');
        // Add class to default function item if already logged in (for delete button visibility)
        const defaultFunctionItem = document.querySelector('.function-item[data-function-id="XrL_ConQuerorX"]');
        if(defaultFunctionItem) {
            defaultFunctionItem.classList.add('admin-visible');
        }
    }


    adminLoginBtn.addEventListener('click', () => {
        const username = adminUsernameInput.value;
        const password = adminPasswordInput.value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            isAdminLoggedIn = true;
            localStorage.setItem('isAdminLoggedIn', 'true'); // Save login status
            adminLoginPanel.classList.add('hidden-panel');
            addFunctionSection.classList.add('visible'); // Show admin-only section
            
            // Make delete buttons visible for ALL functions including default
            const allFunctionItems = document.querySelectorAll('.function-item');
            allFunctionItems.forEach(item => item.classList.add('admin-visible'));

            alert('Login Admin Berhasil! Anda sekarang dapat menambahkan & menghapus fungsi.');
        } else {
            adminLoginMessage.textContent = 'Username atau password salah!';
            adminLoginMessage.classList.add('show');
        }
    });

    // --- Add/Delete Dynamic Functions (Admin Only) ---
    const newFunctionTitleInput = document.getElementById('new-function-title');
    const newFunctionEffectInput = document.getElementById('new-function-effect');
    const newFunctionCodeTextarea = document.getElementById('new-function-code');
    const addFunctionBtn = document.getElementById('add-function-btn');
    const dynamicFunctionsContainer = document.getElementById('dynamic-functions-container');
    const adminActionMessage = document.getElementById('admin-action-message');


    // Load functions from localStorage (simulated persistence)
    let dynamicFunctions = JSON.parse(localStorage.getItem('dynamicFunctions')) || [];

    const renderDynamicFunctions = () => {
        dynamicFunctionsContainer.innerHTML = ''; // Clear existing
        dynamicFunctions.forEach((func, index) => {
            const functionItem = document.createElement('div');
            functionItem.classList.add('function-item');
            functionItem.dataset.functionIndex = index; // Store index for deletion
            if (isAdminLoggedIn) {
                functionItem.classList.add('admin-visible'); // Show delete button if admin
            }

            functionItem.innerHTML = `
                <h3>${func.title}</h3>
                <pre class="code-block" data-function-id="dynamic_func_${index}">${func.code}</pre>
                <button class="copy-code-btn" data-target="dynamic_func_${index}">Salin Kode</button>
                <p class="effect-text">EFFECT: ${func.effect}</p>
                <button class="delete-function-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            dynamicFunctionsContainer.appendChild(functionItem);
        });
        // Re-attach event listeners for new copy and delete buttons
        attachCopyCodeListeners();
        attachDeleteFunctionListeners();
    };

    const showAdminMessage = (message, type = 'success') => {
        adminActionMessage.textContent = message;
        adminActionMessage.className = 'admin-action-message show'; // Reset class
        if (type === 'error') {
            adminActionMessage.style.color = 'var(--error-color)';
        } else {
            adminActionMessage.style.color = 'var(--admin-color)';
        }
        setTimeout(() => {
            adminActionMessage.classList.remove('show');
        }, 3000);
    };

    addFunctionBtn.addEventListener('click', () => {
        if (!isAdminLoggedIn) {
            showAdminMessage('Anda harus login sebagai Admin untuk menambahkan fungsi!', 'error');
            return;
        }

        const title = newFunctionTitleInput.value.trim();
        const effect = newFunctionEffectInput.value.trim();
        const code = newFunctionCodeTextarea.value.trim();

        if (title && effect && code) {
            dynamicFunctions.push({ title, effect, code });
            localStorage.setItem('dynamicFunctions', JSON.stringify(dynamicFunctions)); // Save to local storage
            renderDynamicFunctions(); // Re-render to show new function
            // Clear input fields
            newFunctionTitleInput.value = '';
            newFunctionEffectInput.value = '';
            newFunctionCodeTextarea.value = '';
            showAdminMessage('Fungsi berhasil ditambahkan!');
        } else {
            showAdminMessage('Mohon isi semua kolom untuk menambahkan fungsi!', 'error');
        }
    });

    // Attach listener for delete buttons
    function attachDeleteFunctionListeners() {
        const deleteButtons = document.querySelectorAll('.delete-function-btn');
        deleteButtons.forEach(button => {
            button.removeEventListener('click', handleDeleteFunction); // Prevent duplicates
            button.addEventListener('click', handleDeleteFunction);
        });
    }

    function handleDeleteFunction(e) {
        if (!isAdminLoggedIn) {
            showAdminMessage('Anda harus login sebagai Admin untuk menghapus fungsi!', 'error');
            return;
        }

        const indexToDelete = parseInt(e.target.dataset.index);
        if (confirm('Apakah Anda yakin ingin menghapus fungsi ini?')) {
            dynamicFunctions.splice(indexToDelete, 1); // Remove item from array
            localStorage.setItem('dynamicFunctions', JSON.stringify(dynamicFunctions)); // Update localStorage
            renderDynamicFunctions(); // Re-render the list
            showAdminMessage('Fungsi berhasil dihapus!');
        }
    }


    // Initial render of dynamic functions when the page loads
    renderDynamicFunctions();

    // --- Copy Code Functionality ---
    // Function to attach listeners (re-usable for dynamic content)
    function attachCopyCodeListeners() {
        const copyCodeButtons = document.querySelectorAll('.copy-code-btn');
        copyCodeButtons.forEach(button => {
            // Remove existing listener to prevent duplicates
            button.removeEventListener('click', handleCopyCode);
            button.addEventListener('click', handleCopyCode);
        });
    }

    async function handleCopyCode(e) {
        const targetId = e.target.dataset.target;
        const codeBlock = document.querySelector(`.code-block[data-function-id="${targetId}"]`);
        if (codeBlock) {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent.trim());
                const originalText = e.target.textContent;
                e.target.textContent = 'Tersalin!';
                e.target.style.backgroundColor = 'var(--primary-color)';
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.backgroundColor = '';
                }, 1500);
            } catch (err) {
                console.error('Failed to copy code: ', err);
                alert('Gagal menyalin kode. Silakan salin manual.');
            }
        }
    }

    // Attach initial copy code listeners (for the default XrL function)
    attachCopyCodeListeners();


    // --- Download QR Button (from Catbox.moe) ---
    const downloadQrBtn = document.querySelector('.download-qr-btn');
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', () => {
            const qrImageUrl = document.querySelector('.qr-code-img').src;
            // Check if QR code URL is valid (e.g., contains http/https)
            if (qrImageUrl && (qrImageUrl.startsWith('http://') || qrImageUrl.startsWith('https://'))) {
                const link = document.createElement('a');
                link.href = qrImageUrl;
                link.download = 'QR_Annas_Nasrullah.png'; // Desired file name for download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('QR Code berhasil diunduh!');
            } else {
                alert('URL QR Code tidak valid atau tidak dapat diunduh. Pastikan link langsung ke gambar.');
            }
        });
    }

    // --- Typing Effect for "About Annas" Section ---
    const aboutTextElement = document.getElementById('about-text');
    const fullText = `Annas Nasrullah adalah sosok muda berusia 18 tahun yang tidak hanya bermimpi, tapi bergerak. Ia melangkah ke dunia coding bukan sekadar untuk belajar, tapi untuk menciptakan. Dalam sunyi malam dan layar gelap, jemarinya menari di atas keyboard, menulis masa depan baris demi baris.

Ia bukan sekadar developer pemula. Ia adalah arsitek ide, pemburu solusi, dan pejuang logika yang tak kenal lelah. Saat yang lain sibuk bermain, Annas sibuk membangun. Bukan karena terpaksa, tapi karena cinta pada dunia digital yang terus berkembang.

Di balik error yang muncul, ia menemukan tantangan. Di balik bug yang membandel, ia melihat kesempatan. Ia tahu, setiap kegagalan hanya batu loncatan menuju keberhasilan. Dan di dunia yang dipenuhi algoritma dan kemungkinan tak terbatas, Annas memilih untuk menjadi pembeda.

Ia tidak menunggu masa depan, ia sedang menulisnya. Dan dunia, cepat atau lambat, akan mengenal nama Annas Nasrullah bukan sebagai pemula, tapi sebagai sosok yang mengubah arah teknologi dengan keberanian dan tekadnya sendiri.)`;

    let charIndex = 0;
    let typingInterval;

    function typeChar() {
        if (charIndex < fullText.length) {
            aboutTextElement.textContent += fullText.charAt(charIndex);
            charIndex++;
            // Adjust typing speed here (smaller value = faster)
            typingInterval = setTimeout(typeChar, 30); // 30 milliseconds per character
        } else {
            // After typing finishes, add class for glitch/pulse effect
            aboutTextElement.classList.add('finished');
        }
    }

    function startTypingEffect() {
        // Clear existing text and reset index
        aboutTextElement.textContent = '';
        charIndex = 0;
        aboutTextElement.classList.remove('finished'); // Remove class if present
        clearTimeout(typingInterval); // Clear any pending interval
        typeChar(); // Start the typing effect
    }
});