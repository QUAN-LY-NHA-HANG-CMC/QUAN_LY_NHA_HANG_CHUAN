/**
 * ỨNG DỤNG FRONTEND CHÍNH (ungDung.js)
 * Điều phối các Module và Luồng điều hướng Single Page Application (SPA)
 * Phụ trách: Quân (Frontend Lead - Client & POS)
 */

class UngDungFrontend {
    constructor() {
        this.tabHienTai = 'quanLyBanQr'; // Mặc định mở Sơ đồ bàn & QR
    }

    async khoiDong() {
        console.log('🚀 Khởi động Giao diện Quản Lý Nhà Hàng & Gọi Món QR (Quán Mộc)');

        // Lắng nghe sự kiện click trên Sidebar Menu
        this.ganSuKienDieuHuong();

        // Nạp trang mặc định
        this.chuyenTab(this.tabHienTai);

        // Thông báo chào mừng
        setTimeout(() => {
            if (window.thongBao) {
                window.thongBao.thongTin('Xin chào Quân (Frontend Lead)!', 'Sprint 1: Quản lý Bàn & Mã QR và Quản lý Thực đơn đã sẵn sàng.');
            }
        }, 600);
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
        this.tabHienTai = tab;

        // Cập nhật trạng thái active trên sidebar
        document.querySelectorAll('.muc-menu[data-tab]').forEach(muc => {
            if (muc.getAttribute('data-tab') === tab) {
                muc.classList.add('kich-hoat');
            } else {
                muc.classList.remove('kich-hoat');
            }
        });

        // Điều phối render nội dung tương ứng
        if (tab === 'quanLyBanQr') {
            if (window.quanLyBanQr) {
                window.quanLyBanQr.khoiTao();
            }
        } else if (tab === 'quanLyThucDon') {
            if (window.quanLyThucDon) {
                window.quanLyThucDon.khoiTao();
            }
        } else if (tab === 'eMenuKhachHang') {
            if (window.thucDonQr) {
                window.thucDonQr.khoiTao();
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
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="nut nut-chinh" onclick="window.ungDung.chuyenTab('quanLyBanQr')">
                        🪑 Về Quản lý Bàn & QR (Sprint 1)
                    </button>
                    <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('quanLyThucDon')">
                        🍲 Về Quản lý Thực đơn (Sprint 1)
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
