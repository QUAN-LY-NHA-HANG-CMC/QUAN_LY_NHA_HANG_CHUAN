/**
 * ỨNG DỤNG FRONTEND CHÍNH (ungDung.js)
 * Điều phối các Module và Luồng điều hướng Single Page Application (SPA)
 * Tích hợp & đồng bộ toàn diện giữa các phân hệ của Quân (Bàn & Thực đơn) và Phong (Admin Core, Auth, Nhân sự, Phân quyền, Cấu hình)
 */

class UngDungFrontend {
    constructor() {
        this.tabHienTai = 'quanLyNhanVien'; // Mặc định mở Quản lý Nhân sự
    }

    async khoiDong() {
        console.log('🚀 Khởi động Hệ thống Quản Lý Nhà Hàng & Gọi Món QR (Quán Mộc)');

        // Tự động khởi tạo phiên người dùng mặc định (Phong - Quản lý) nếu máy chưa đăng nhập
        if (window.api && !window.api.layAccessToken()) {
            await window.api.dangNhap('quanly', '123456');
        }

        // Đồng bộ cấu hình thương hiệu nhà hàng toàn cục lên Header, Sidebar và Tiêu đề trang
        if (window.api) {
            const cauHinh = await window.api.layCauHinhHeThong();
            this.dongBoThongTinNhaHangToanCuc(cauHinh);
        }

        // Cập nhật giao diện theo quyền đăng nhập
        if (window.boDieuHuong) {
            window.boDieuHuong.capNhatGiaoDienTheoQuyen();
        }

        // Lắng nghe sự kiện click trên Sidebar Menu
        this.ganSuKienDieuHuong();

        // Khởi tạo thành phần Hỗ trợ & Thanh toán tại bàn (Sprint 2 - Phong)
        if (window.hoTroTaiBan) {
            window.hoTroTaiBan.khoiTao(3);
        }

        // Đọc URL hash nếu người dùng truy cập trực tiếp qua liên kết hoặc F5 (VD: #theo-doi-don, #bep-kds, #sprint2)
        const hash = (window.location.hash || '').replace('#', '').trim().toLowerCase();
        const banDoTab = {
            'theo-doi-don': 'theoDoiDonMon',
            'theodoidonmon': 'theoDoiDonMon',
            'sprint2': 'theoDoiDonMon',
            'bep-kds': 'dieuPhoiBep',
            'dieuphoibep': 'dieuPhoiBep',
            'sprint3': 'dieuPhoiBep',
            'e-menu': 'eMenuKhachHang',
            'emenukhachhang': 'eMenuKhachHang',
            'ban-an': 'quanLyBanQr',
            'thuc-don': 'quanLyThucDon',
            'nhan-vien': 'quanLyNhanVien',
            'phan-quyen': 'phanQuyen',
            'cau-hinh': 'cauHinhHeThong',
            'pos': 'posThuNgan',
            'so-do-ban': 'posThuNgan',
            'thanh-toan-pos': 'thanhToanPos',
            'danh-gia': 'danhGiaDichVu',
            'ca-lam-viec': 'caLamViec',
            'calamviec': 'caLamViec',
            'ket-ca': 'caLamViec',
            'bao-cao': 'baoCao',
            'baocao': 'baoCao',
            'doanh-thu': 'baoCao',
            'sprint4': 'baoCao'
        };
        if (hash && banDoTab[hash]) {
            this.tabHienTai = banDoTab[hash];
        }

        // Nạp trang mặc định
        this.chuyenTab(this.tabHienTai);

        // Lắng nghe sự kiện hashchange để điều hướng mượt mà
        window.addEventListener('hashchange', () => {
            const h = (window.location.hash || '').replace('#', '').trim().toLowerCase();
            if (h && banDoTab[h] && banDoTab[h] !== this.tabHienTai) {
                this.chuyenTab(banDoTab[h]);
            }
        });

        // Thông báo chào mừng
        setTimeout(() => {
            if (window.thongBao) {
                const user = window.api ? window.api.layThongTinNguoiDung() : null;
                const ten = user ? user.hoTen : 'Quản trị viên';
                window.thongBao.thongTin(
                    `Xin chào ${ten}!`,
                    'Sprint 1 hoàn chỉnh: Nhân sự, Phân quyền, Cấu hình, Quản lý Bàn & Thực đơn đã đồng bộ.'
                );
            }
        }, 500);
    }

    /**
     * Đồng bộ thông tin thương hiệu nhà hàng toàn hệ thống
     * (Header, Sidebar, Tiêu đề trình duyệt và các phân hệ của Quân)
     */
    dongBoThongTinNhaHangToanCuc(cauHinh) {
        if (!cauHinh) return;

        // 1. Cập nhật Sidebar Brand
        const tenQuanSidebar = document.querySelector('.ten-quan');
        const khauHieuSidebar = document.querySelector('.khau-hieu-quan');
        if (tenQuanSidebar && cauHinh.ten) tenQuanSidebar.textContent = cauHinh.ten.toUpperCase();
        if (khauHieuSidebar && cauHinh.khauHieu) khauHieuSidebar.textContent = cauHinh.khauHieu;

        // 2. Cập nhật Header
        const hTen = document.getElementById('header-ten-quan');
        const hDiaChi = document.getElementById('header-dia-chi');
        const hHotline = document.getElementById('header-hotline');
        const hWifi = document.getElementById('header-wifi');
        const hWifiPass = document.getElementById('header-wifi-pass');

        if (hTen) hTen.textContent = `${cauHinh.ten} - ${cauHinh.chiNhanh || ''}`;
        if (hDiaChi) hDiaChi.textContent = cauHinh.diaChi || '';
        if (hHotline) hHotline.textContent = cauHinh.hotline || '';
        if (hWifi) hWifi.textContent = cauHinh.wifiTen || '';
        if (hWifiPass) hWifiPass.textContent = cauHinh.wifiMatKhau || '';

        // 3. Cập nhật Tiêu đề trang
        document.title = `${cauHinh.ten} - Hệ Thống Quản Lý Nhà Hàng & Gọi Món QR`;

        // 4. Đồng bộ sang HANG_SO dùng chung cho các phân hệ khác (Quân)
        if (window.HANG_SO && window.HANG_SO.NHA_HANG_MAC_DINH) {
            Object.assign(window.HANG_SO.NHA_HANG_MAC_DINH, cauHinh);
        }
    }

    ganSuKienDieuHuong() {
        const cacMucMenu = document.querySelectorAll('.muc-menu[data-tab]');
        cacMucMenu.forEach(muc => {
            muc.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = muc.getAttribute('data-tab');
                this.chuyenTab(tab);
            });
        });
    }

    chuyenTab(tab) {
        // Đóng các modal đang mở nếu có
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (modal) {
            modal.classList.remove('mo');
            modal.innerHTML = '';
        }

        // Kiểm tra Auth Guard & Quyền truy cập qua Router Guard (US-004 & US-019 -> US-021)
        if (window.boDieuHuong && !window.boDieuHuong.kiemTraQuyenTruyCapTab(tab)) {
            return;
        }

        // Hủy interval đồng hồ của KDS nếu chuyển sang tab khác
        if (tab !== 'dieuPhoiBep' && window.dieuPhoiBepModule) {
            window.dieuPhoiBepModule.huyDongHo();
        }

        this.tabHienTai = tab;

        // Cập nhật URL Hash tương ứng mà không làm giật trang
        const banDoHash = {
            'theoDoiDonMon': 'theo-doi-don',
            'dieuPhoiBep': 'bep-kds',
            'eMenuKhachHang': 'e-menu',
            'quanLyBanQr': 'ban-an',
            'quanLyThucDon': 'thuc-don',
            'quanLyNhanVien': 'nhan-vien',
            'phanQuyen': 'phan-quyen',
            'cauHinhHeThong': 'cau-hinh',
            'posThuNgan': 'pos',
            'baoCao': 'bao-cao'
        };
        if (banDoHash[tab] && window.location.hash !== '#' + banDoHash[tab]) {
            try {
                history.replaceState(null, '', '#' + banDoHash[tab]);
            } catch {
                window.location.hash = banDoHash[tab];
            }
        }

        // Cập nhật trạng thái active trên sidebar
        document.querySelectorAll('.muc-menu[data-tab]').forEach(muc => {
            if (muc.getAttribute('data-tab') === tab) {
                muc.classList.add('kich-hoat');
            } else {
                muc.classList.remove('kich-hoat');
            }
        });

        // Cập nhật trạng thái active trên thanh Header pill nếu có
        document.querySelectorAll('.nut-vai-tro-pill[data-tab-nav]').forEach(pill => {
            if (pill.getAttribute('data-tab-nav') === tab) {
                pill.classList.add('kich-hoat');
            } else {
                pill.classList.remove('kich-hoat');
            }
        });

        // Điều phối render nội dung tương ứng theo module
        if (tab === 'dangNhap') {
            if (window.dangNhapModule) {
                window.dangNhapModule.khoiTao();
            }
        } else if (tab === 'hoSoCaNhan') {
            if (window.hoSoCaNhanModule) {
                window.hoSoCaNhanModule.khoiTao();
            }
        } else if (tab === 'quanLyNhanVien') {
            // US-011 -> US-014 (Phong)
            if (window.quanLyNhanVien) {
                window.quanLyNhanVien.khoiTao();
            }
        } else if (tab === 'phanQuyen') {
            // US-015 -> US-018, US-022 (Phong)
            if (window.phanQuyenModule) {
                window.phanQuyenModule.khoiTao();
            }
        } else if (tab === 'cauHinhHeThong') {
            // US-041 -> US-044 (Phong)
            if (window.cauHinhHeThongModule) {
                window.cauHinhHeThongModule.khoiTao();
            }
        } else if (tab === 'quanLyBanQr') {
            // US-023 -> US-030 (Quân)
            if (window.quanLyBanQr) {
                window.quanLyBanQr.khoiTao();
            }
        } else if (tab === 'quanLyThucDon') {
            // US-031 -> US-040 (Quân)
            if (window.quanLyThucDon) {
                window.quanLyThucDon.khoiTao();
            }
        } else if (tab === 'theoDoiDonMon') {
            // US-063 -> US-078 (Sprint 2 - Phong: Đặt món, Theo dõi đơn & Real-time)
            if (window.theoDoiDonMonModule) {
                window.theoDoiDonMonModule.khoiTao();
            }
        } else if (tab === 'dieuPhoiBep') {
            // US-079 -> US-088 (Sprint 3 - Phong: Điều phối Bếp KDS & Kiểm soát hết món)
            if (window.dieuPhoiBepModule) {
                window.dieuPhoiBepModule.khoiTao();
            }
        } else if (tab === 'eMenuKhachHang') {
            if (window.thucDonQr) {
                window.thucDonQr.khoiTao();
            }
        } else if (tab === 'posThuNgan' || tab === 'soDoBanPos') {
            // US-089 -> US-098 (Sprint 3 - Quân: Sơ đồ bàn POS)
            if (window.soDoBanPos) {
                window.soDoBanPos.khoiTao();
            }
        } else if (tab === 'thanhToanPos') {
            // US-099 -> US-110 (Sprint 3 - Quân: Quầy Thu ngân & Thanh toán POS)
            if (window.thanhToanPos) {
                window.thanhToanPos.khoiTao();
            }
        } else if (tab === 'danhGiaDichVu') {
            // US-111 -> US-116 (Sprint 4 - Quân: Đánh giá chất lượng dịch vụ)
            if (window.quanLyDanhGia) {
                window.quanLyDanhGia.khoiTao();
            }
        } else if (tab === 'caLamViec') {
            // US-117 -> US-122 (Sprint 4 - Phong: Quản lý Ca làm việc & Kết ca)
            if (window.caLamViecModule) {
                window.caLamViecModule.khoiTao();
            }
        } else if (tab === 'baoCao') {
            // US-123 -> US-134 (Sprint 4 - Phong: Dashboard Báo cáo Doanh thu & Đối soát hóa đơn)
            if (window.baoCaoDoanhThuModule) {
                window.baoCaoDoanhThuModule.khoiTao();
            }
        } else {
            // Các tab thuộc Sprint 2, 3, 4
            this.veTrangChoSprint(tab);
        }
    }

    veTrangChoSprint(tab) {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        const thongTinTab = {
            'eMenuKhachHang': {
                sprint: 'Sprint 2',
                tieuDe: '📱 Web Gọi Món E-Menu Cho Khách Hàng (US-045 -> US-062)',
                moTa: 'Giao diện khách quét QR trên điện thoại: Xem thực đơn di động, chọn món, thêm Topping, giỏ hàng thời gian thực.'
            },
            'dieuPhoiBep': {
                sprint: 'Sprint 3',
                tieuDe: '👨‍🍳 Màn Hình Điều Phối Bếp KDS (US-079 -> US-088)',
                moTa: 'Hàng đợi chế biến theo thứ tự thời gian (FIFO), gom mẻ món ăn cùng loại, báo hết món tức thì.'
            },
            'posThuNgan': {
                sprint: 'Sprint 3',
                tieuDe: '💵 POS Thu Ngân & Thanh Toán VietQR (US-089 -> US-110)',
                moTa: 'Sơ đồ bàn trực quan theo trạng thái, tính tiền hóa đơn, sinh mã VietQR Napas động và in bill tạm tính.'
            },
            'baoCao': {
                sprint: 'Sprint 4',
                tieuDe: '📊 Báo Cáo Doanh Thu & Đánh Giá (US-111 -> US-134)',
                moTa: 'Dashboard thống kê doanh thu theo ngày/tháng, Top món bán chạy, quản lý ca thu ngân và xem đánh giá sao.'
            }
        }[tab] || { sprint: 'Tương lai', tieuDe: 'Tính năng đang phát triển', moTa: '' };

        vungChua.innerHTML = `
            <div class="khung-trong">
                <div class="badge badge-vang" style="margin-bottom: 12px; font-size: 13px; padding: 4px 12px;">
                    ${thongTinTab.sprint} (Theo kế hoạch phân công)
                </div>
                <h2>${thongTinTab.tieuDe}</h2>
                <p style="max-width: 600px; margin: 12px auto 24px; line-height: 1.6; color: var(--mau-chu-phu);">
                    ${thongTinTab.moTa}
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="nut nut-chinh" onclick="window.ungDung.chuyenTab('quanLyBanQr')">
                        🪑 Về Quản lý Bàn & QR (Sprint 1 - Quân)
                    </button>
                    <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('quanLyThucDon')">
                        🍲 Về Quản lý Thực đơn (Sprint 1 - Quân)
                    </button>
                    <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('quanLyNhanVien')">
                        👥 Về Quản lý Nhân sự (Sprint 1 - Phong)
                    </button>
                    <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('phanQuyen')">
                        🛡️ Về Phân quyền RBAC (Sprint 1 - Phong)
                    </button>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ungDung = new UngDungFrontend();
    window.ungDung.khoiDong();
});
