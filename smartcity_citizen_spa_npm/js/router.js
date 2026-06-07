// Definisi konten tiap "halaman" — perhatikan tanda backtick (`) bukan petik satu (')!
const routes = {
    '#login': `
        <div class="row justify-content-center mt-5">
            <div class="col-md-4 card shadow-sm border-0 p-4">
                <h4 class="text-center fw-bold mb-4">Login Warga</h4>
                <form id="loginForm">
                    <input type="text" id="loginUsername" class="form-control mb-3"
                           placeholder="Username" required>
                    <input type="password" id="loginPassword" class="form-control mb-3"
                           placeholder="Password" required>
                    <button type="submit" class="btn btn-primary w-100 fw-bold">
                        <i class="bi bi-box-arrow-in-right me-2"></i>Masuk
                    </button>
                </form>
            </div>
        </div>
    `,

'#dashboard': `
    <div class="row g-4">

        <!-- SIDEBAR KIRI: Tombol + Rekap Status -->
        <aside class="col-12 col-lg-3">
            <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">

                <!-- Tombol Tambah Laporan Baru -->
                <button class="btn btn-primary btn-lg w-100 fw-bold mb-4"
                        onclick="openNewReportModal()">
                    <i class="bi bi-plus-circle-fill me-2"></i>Laporan Baru
                </button>

                <!-- Rekap Status -->
                <h6 class="fw-bold text-muted mb-3">
                    <i class="bi bi-bar-chart-fill me-2"></i>Rekap Laporanku
                </h6>
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span class="small">📝 Draft</span>
                    <span class="badge bg-secondary" id="count-draft">0</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span class="small">⚙️ Diproses</span>
                    <span class="badge bg-warning text-dark" id="count-inprogress">0</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span class="small">✅ Selesai</span>
                    <span class="badge bg-success" id="count-resolved">0</span>
                </div>
            </div>
        </aside>

        <!-- KONTEN TENGAH + KANAN: Daftar Laporan -->
        <section class="col-12 col-lg-9">

            <!-- Tab Switcher -->
            <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                    <button class="nav-link active fw-semibold" id="tab-my"
                            onclick="switchTab('my_reports', this)">
                        <i class="bi bi-person-fill me-1"></i>Laporan Saya
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link fw-semibold" id="tab-feed"
                            onclick="switchTab('feed', this)">
                        <i class="bi bi-globe me-1"></i>Feed Kota
                    </button>
                </li>
            </ul>

            <!-- Container kartu laporan (diisi oleh renderList) -->
            <div id="listContainer" class="row"></div>

            <!-- Container tombol halaman (diisi oleh renderPagination) -->
            <div id="paginationContainer" class="mt-3"></div>

        </section>
    </div>
`,
};

// Fungsi yang menangani perpindahan halaman
function handleRouting() {
    const hash = window.location.hash || '#login'; // Default ke halaman login
    document.getElementById('app-content').innerHTML = routes[hash] || routes['#login'];

    // Update navbar setiap kali routing
    if (typeof updateNavbar === 'function') {
        updateNavbar();
    }

    // Jika halaman login, aktifkan form login
    if (hash === '#login' && typeof setupLoginForm === 'function') {
        setupLoginForm();
    }

    // Jika halaman dashboard, panggil loadDashboardData()
    if (hash === '#dashboard' && typeof loadDashboardData === 'function') {
        loadDashboardData('my_reports', 1);
    }
}

// Dengarkan perubahan hash URL
window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);
