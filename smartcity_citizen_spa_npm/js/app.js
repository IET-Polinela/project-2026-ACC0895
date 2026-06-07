// ============================================================
// VARIABEL GLOBAL: State aplikasi
// ============================================================
let currentTab  = 'my_reports'; // Tab yang sedang aktif
let currentPage = 1;            // Halaman pagination yang sedang aktif
let editingReportId = null;     // ID laporan yang sedang di-edit (null = mode buat baru)


// ============================================================
// FUNGSI UTAMA: Update Navbar
// ============================================================
function updateNavbar() {
    const navMenus = document.getElementById('nav-menus');
    const token = localStorage.getItem('access_token');

    if (token) {
        navMenus.innerHTML = `
            <button class="btn btn-outline-light btn-sm" onclick="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
            </button>
        `;
    } else {
        navMenus.innerHTML = '';
    }
}

function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.hash = '#login';
    updateNavbar();
}


// ============================================================
// FUNGSI GANTI TAB: Switch Tab dengan Update Style Tombol
// ============================================================
/**
 * Fungsi untuk berpindah antar tab (Laporan Saya / Feed Kota)
 * @param {string} tab      - 'my_reports' atau 'feed'
 * @param {Element} buttonEl - Elemen tombol yang diklik
 */
function switchTab(tab, buttonEl) {
    // Reset semua tab button: hilangkan class 'active'
    document.querySelectorAll('.nav-link[id^="tab-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Aktifkan tombol yang diklik
    buttonEl.classList.add('active');
    
    // Muat data tab yang dipilih dari halaman 1
    loadDashboardData(tab, 1);
}


// ============================================================
// STEP 3: Fetching Paginated List & Render
// ============================================================

/**
 * Fungsi utama untuk memuat data dashboard.
 * Dipanggil saat halaman dimuat, saat ganti tab, atau saat ganti halaman.
 * @param {string} tab   - 'my_reports' atau 'feed'
 * @param {number} page  - nomor halaman (default 1)
 */
async function loadDashboardData(tab = currentTab, page = currentPage) {
    // Update state global
    currentTab  = tab;
    currentPage = page;

    // Tembak API dengan parameter tab dan page
    const response = await requestAPI(`/api/report/?tab=${tab}&page=${page}`, 'GET');

    if (response && response.status === 200) {

        // ---- INSTRUKSI 1: Ekstraksi Data Paginasi ----
        const data        = await response.json();
        const reports     = data.results || [];  // Array laporan untuk halaman ini
        const totalCount  = data.count   || 0;   // Total seluruh laporan (semua halaman)
        const totalPages  = Math.ceil(totalCount / 10); // Hitung jumlah halaman

        // ---- INSTRUKSI 2: Pembaruan UI ----
        renderList(reports, tab);           // Gambar kartu-kartu laporan
        renderPagination(totalPages);       // Gambar tombol halaman
        loadSummaryStats();                 // Update angka rekap di sidebar

    } else {
        // Tampilkan pesan error jika API gagal
        const listContainer = document.getElementById('listContainer');
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="col-12 text-center text-muted p-5">
                    <i class="bi bi-exclamation-triangle fs-1"></i>
                    <p>Gagal memuat data laporan.</p>
                </div>
            `;
        }
        const paginationContainer = document.getElementById('paginationContainer');
        if (paginationContainer) paginationContainer.innerHTML = '';
    }
}


/**
 * Render daftar laporan sebagai Bootstrap Cards dengan Progress Bar.
 * @param {Array}  reports - Array objek laporan dari API
 * @param {string} tab     - Tab aktif, untuk menentukan visibilitas tombol Edit
 */
function renderList(reports, tab) {
    const listContainer = document.getElementById('listContainer');
    if (!listContainer) return;

    if (reports.length === 0) {
        listContainer.innerHTML = `
            <div class="col-12 text-center text-muted p-5">
                <i class="bi bi-inbox fs-1"></i>
                <p class="mt-2">Belum ada laporan.</p>
            </div>
        `;
        return;
    }

    // Peta status → konfigurasi Progress Bar (warna + nilai %)
    const statusConfig = {
        'DRAFT':       { label: 'Draft',        color: 'secondary', pct: 10  },
        'REPORTED':    { label: 'Dilaporkan',   color: 'info',      pct: 30  },
        'VERIFIED':    { label: 'Diverifikasi', color: 'primary',   pct: 50  },
        'IN_PROGRESS': { label: 'Diproses',     color: 'warning',   pct: 75  },
        'RESOLVED':    { label: 'Selesai',      color: 'success',   pct: 100 },
    };

    // Buat HTML untuk setiap laporan
    const cardsHTML = reports.map(report => {
        const cfg     = statusConfig[report.status] || { label: report.status, color: 'dark', pct: 0 };
        const isOwner = report.is_owner;

        // Tampilkan nama pelapor:
        // - Tab "my_reports" → tampilkan nama asli (dari reporter_username)
        // - Tab "feed" → sensor identitas menjadi "Warga Anonim"
        const reporterName = tab === 'feed'
            ? 'Warga Anonim'
            : (report.reporter_username || 'Tidak Diketahui');

        // Tombol Edit hanya muncul jika laporan milik user (is_owner=true)
        // DAN statusnya masih DRAFT
        const editButton = (isOwner && report.status === 'DRAFT')
            ? `<button class="btn btn-sm btn-warning" onclick="editDraft(${report.id})">
                   <i class="bi bi-pencil-fill me-1"></i>Edit
               </button>`
            : '';

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <span class="badge bg-${cfg.color} mb-2">${cfg.label}</span>
                        <h6 class="card-title fw-bold">${report.title}</h6>
                        <p class="card-text text-muted small">${report.description.substring(0, 80)}...</p>
                        <p class="card-text small">
                            <i class="bi bi-geo-alt-fill text-danger me-1"></i>${report.location}
                        </p>
                        <p class="card-text small text-muted">
                            <i class="bi bi-person-fill me-1"></i>${reporterName}
                        </p>
                    </div>

                    <!-- Progress Bar Status -->
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">Progress: ${cfg.label}</small>
                        <div class="progress mt-1" style="height: 8px;">
                            <div class="progress-bar bg-${cfg.color}"
                                 role="progressbar"
                                 style="width: ${cfg.pct}%"
                                 aria-valuenow="${cfg.pct}"
                                 aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <div class="mt-2">${editButton}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    listContainer.innerHTML = cardsHTML;
}


/**
 * Render tombol-tombol navigasi halaman (pagination).
 * @param {number} totalPages - Total jumlah halaman
 */
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let buttonsHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage ? 'active' : '';
        buttonsHTML += `
            <li class="page-item ${isActive}">
                <button class="page-link" onclick="loadDashboardData('${currentTab}', ${i})">${i}</button>
            </li>
        `;
    }

    paginationContainer.innerHTML = `
        <nav>
            <ul class="pagination justify-content-center">
                ${buttonsHTML}
            </ul>
        </nav>
    `;
}


// ============================================================
// STEP 4: Kalkulasi Rekap Status di Sidebar (Bypass Pagination)
// ============================================================

/**
 * Muat semua laporan user sekaligus (bypass pagination dengan page_size besar)
 * untuk menghitung rekap DRAFT, IN_PROGRESS, RESOLVED.
 */
async function loadSummaryStats() {
    // Minta semua data sekaligus dengan page_size=1000 (trik bypass pagination)
    const response = await requestAPI('/api/report/?tab=my_reports&page_size=1000', 'GET');

    if (response && response.status === 200) {
        const data    = await response.json();
        const reports = data.results || [];

        // Hitung jumlah tiap status menggunakan .filter().length
        const draftCount      = reports.filter(r => r.status === 'DRAFT').length;
        const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS').length;
        const resolvedCount   = reports.filter(r => r.status === 'RESOLVED').length;

        // Masukkan angka ke elemen sidebar
        const elDraft      = document.getElementById('count-draft');
        const elInProgress = document.getElementById('count-inprogress');
        const elResolved   = document.getElementById('count-resolved');

        if (elDraft)      elDraft.textContent      = draftCount;
        if (elInProgress) elInProgress.textContent = inProgressCount;
        if (elResolved)   elResolved.textContent    = resolvedCount;
    }
}


// ============================================================
// STEP 5: Report Management via Modal Form
// ============================================================

/**
 * Buka modal untuk mengedit laporan DRAFT yang sudah ada.
 * Isi form dengan data lama, set editingReportId.
 * @param {number} id - ID laporan yang akan diedit
 */
async function editDraft(id) {
    // Set ID laporan yang sedang diedit (mode EDIT)
    editingReportId = id;

    // Ambil data laporan lama dari API
    const response = await requestAPI(`/api/report/${id}/`, 'GET');
    if (response && response.status === 200) {
        const report = await response.json();

        // Isi semua field form dengan data lama
        document.getElementById('fieldTitle').value       = report.title;
        document.getElementById('fieldCategory').value    = report.category;
        document.getElementById('fieldDescription').value = report.description;
        document.getElementById('fieldLocation').value    = report.location;

        // Ganti judul modal menjadi "Edit Laporan"
        document.getElementById('reportModalLabel').innerHTML =
            '<i class="bi bi-pencil-square me-2"></i>Edit Laporan Draft';

        // Tampilkan modal menggunakan Bootstrap JS API
        const modalEl = document.getElementById('reportModal');
        const modal   = new bootstrap.Modal(modalEl);
        modal.show();
    }
}


/**
 * Buka modal kosong untuk membuat laporan BARU.
 * Reset form dan set editingReportId = null.
 */
function openNewReportModal() {
    // Reset state: mode BUAT BARU
    editingReportId = null;

    // Kosongkan semua field form
    document.getElementById('reportForm').reset();

    // Kembalikan judul modal ke default
    document.getElementById('reportModalLabel').innerHTML =
        '<i class="bi bi-pencil-square me-2"></i>Buat Laporan Baru';

    // Tampilkan modal
    const modalEl = document.getElementById('reportModal');
    const modal   = new bootstrap.Modal(modalEl);
    modal.show();
}


/**
 * Kirim form laporan ke API.
 * Jika editingReportId == null → POST (buat baru)
 * Jika editingReportId != null → PUT (update laporan lama)
 * @param {string} statusToSend - 'DRAFT' untuk Simpan Draft, 'REPORTED' untuk Ajukan
 */
async function submitReport(statusToSend) {
    const title       = document.getElementById('fieldTitle').value.trim();
    const category    = document.getElementById('fieldCategory').value;
    const description = document.getElementById('fieldDescription').value.trim();
    const location    = document.getElementById('fieldLocation').value.trim();

    // Validasi sederhana
    if (!title || !category || !description || !location) {
        alert('Semua field wajib diisi!');
        return;
    }

    const payload = { title, category, description, location, status: statusToSend };

    let response;
    if (editingReportId === null) {
        // Mode BUAT BARU → POST ke /api/report/
        response = await requestAPI('/api/report/', 'POST', payload);
    } else {
        // Mode EDIT → PUT ke /api/report/{id}/
        response = await requestAPI(`/api/report/${editingReportId}/`, 'PUT', payload);
    }

    if (response && (response.status === 201 || response.status === 200)) {
        // Sukses: tutup modal, reset form, reset state, refresh data
        const modalEl    = document.getElementById('reportModal');
        const modalInst  = bootstrap.Modal.getInstance(modalEl);
        if (modalInst) modalInst.hide();

        document.getElementById('reportForm').reset();
        editingReportId = null; // Reset kembali ke mode buat baru

        // Refresh dashboard TANPA reload halaman (inilah keunggulan SPA!)
        loadDashboardData(currentTab, currentPage);

    } else {
        const errData = await response.json();
        alert('Gagal menyimpan laporan: ' + JSON.stringify(errData));
    }
}


// ============================================================
// EVENT LISTENERS: Pasang handler untuk tombol di modal
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const btnDraft  = document.getElementById('btnDraft');
    const btnSubmit = document.getElementById('btnSubmit');

    if (btnDraft) {
        btnDraft.addEventListener('click', function () {
            submitReport('DRAFT');    // Simpan sebagai Draft
        });
    }

    if (btnSubmit) {
        btnSubmit.addEventListener('click', function () {
            submitReport('REPORTED'); // Ajukan (status REPORTED)
        });
    }
});