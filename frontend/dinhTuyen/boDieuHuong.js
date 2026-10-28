/**
 * BỘ ĐIỀU HƯỚNG VÀ BẢO VỆ PHÂN QUYỀN ROUTER & AUTH GUARD (boDieuHuong.js)
 * Phụ trách: Phong (Frontend Admin & Auth Lead)
 * Đáp ứng các User Story trong Sprint 1:
 * - US-003: Quản lý phiên làm việc, tự động đăng xuất khi hết hạn token
 * - US-004: Chặn truy cập trái phép vào các route quản trị qua Client Guard
 * - US-019 -> US-021: Phân luồng hiển thị menu & kiểm soát quyền theo vai trò (Quản lý, Thu ngân, Bếp, Phục vụ)
 * - Tích hợp & đồng bộ hoàn toàn với các phân hệ Bàn & Thực đơn của Quân mà không sửa đổi file của Quân
 */

class BoDieuHuong {
    constructor() {
        this.nguoiDungHienTai = null;
        this.thoiHanPhienPhut = 60; // 60 phút
        this.khoiTao();
    }

    khoiTao() {
        this.kiemTraPhienLamViec();
    }

    /**
     * Lấy người dùng đang đăng nhập
     */
    layNguoiDung() {
        if (!this.nguoiDungHienTai) {
            this.nguoiDungHienTai = window.api ? window.api.layThongTinNguoiDung() : null;
        }
        return this.nguoiDungHienTai;
    }

    /**
     * Cập nhật thông tin phiên người dùng mới sau đăng nhập
     */
    capNhatNguoiDung(user) {
        this.nguoiDungHienTai = user;
        this.capNhatGiaoDienTheoQuyen();
    }

    /**
     * US-003: Kiểm tra phiên làm việc & Tự động đăng xuất nếu hết hạn token
     */
    kiemTraPhienLamViec() {
        const token = window.api ? window.api.layAccessToken() : null;
        const user = window.api ? window.api.layThongTinNguoiDung() : null;

        if (!token || !user) {
            this.nguoiDungHienTai = null;
            return false;
        }

        // Kiểm tra thời gian đăng nhập (nếu vượt quá thời hạn phiên thì đăng xuất)
        if (user.thoiGianDangNhap) {
            const thoiDiemDangNhap = new Date(user.thoiGianDangNhap).getTime();
            const hienTai = Date.now();
            const soPhutTroiQua = (hienTai - thoiDiemDangNhap) / (1000 * 60);

            if (soPhutTroiQua > this.thoiHanPhienPhut) {
                console.warn('⚠️ Phiên làm việc đã hết hạn. Đang tự động đăng xuất...');
                if (window.thongBao) {
                    window.thongBao.canhBao('Hết hạn phiên làm việc', 'Phiên làm việc đã hết hạn (60 phút). Vui lòng đăng nhập lại.');
                }
                this.xuLyDangXuat();
                return false;
            }
        }

        this.nguoiDungHienTai = user;
        return true;
    }

    /**
     * Kiểm tra người dùng có đang đăng nhập hay không
     */
    daDangNhap() {
        return this.kiemTraPhienLamViec();
    }

    /**
     * Kiểm tra quyền truy cập theo mã quyền (RBAC)
     */
    coQuyen(maQuyen) {
        const user = this.layNguoiDung();
        if (!user) return false;
        // Quản lý luôn có toàn quyền
        if (user.vaiTro === 'QUAN_LY') return true;

        // Lấy danh sách vai trò từ local storage để kiểm tra quyền
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro');
        if (!raw) return false;

        try {
            const dsVaiTro = JSON.parse(raw);
            const vaiTro = dsVaiTro.find(vt => vt.ma === user.vaiTro);
            if (!vaiTro || !Array.isArray(vaiTro.danhSachQuyen)) return false;
            return vaiTro.danhSachQuyen.includes(maQuyen);
        } catch {
            return false;
        }
    }

    /**
     * US-004 & US-019 -> US-021: Chặn truy cập trái phép & kiểm tra quyền vào Tab
     * @param {string} tab Tên tab muốn điều hướng tới
     * @returns {boolean} Cho phép hay chặn
     */
    kiemTraQuyenTruyCapTab(tab) {
        // Tab công khai không cần đăng nhập
        if (tab === 'dangNhap' || tab === 'eMenuKhachHang' || tab === 'theoDoiDonMon') {
            return true;
        }

        // Bắt buộc phải đăng nhập đối với các chức năng nội bộ quản trị
        if (!this.daDangNhap()) {
            if (window.thongBao) {
                window.thongBao.canhBao('Yêu cầu đăng nhập', 'Vui lòng đăng nhập tài khoản nhân viên để tiếp tục.');
            }
            if (window.ungDung) {
                window.ungDung.chuyenTab('dangNhap');
            }
            return false;
        }

        const user = this.layNguoiDung();
        const vaiTro = user ? user.vaiTro : '';

        // Phân quyền chi tiết cho từng tab
        // 1. Quản lý nhân sự & phân quyền: Chỉ QUAN_LY
        if (tab === 'quanLyNhanVien' || tab === 'phanQuyen') {
            if (vaiTro !== 'QUAN_LY') {
                if (window.thongBao) {
                    window.thongBao.thatBai('Từ chối truy cập', 'Chức năng Quản lý Nhân sự & Phân quyền chỉ dành riêng cho Quản lý!');
                }
                return false;
            }
        }

        // 2. Cấu hình hệ thống: Chỉ QUAN_LY
        if (tab === 'cauHinhHeThong') {
            if (vaiTro !== 'QUAN_LY') {
                if (window.thongBao) {
                    window.thongBao.thatBai('Từ chối truy cập', 'Bạn không có quyền xem hoặc chỉnh sửa Cấu hình hệ thống!');
                }
                return false;
            }
        }

        // 3. Quản lý thực đơn (Quân): QUAN_LY hoặc BEP
        if (tab === 'quanLyThucDon') {
            if (vaiTro !== 'QUAN_LY' && vaiTro !== 'BEP') {
                if (window.thongBao) {
                    window.thongBao.canhBao('Hạn chế quyền', 'Tài khoản của bạn chỉ có quyền xem, không được chỉnh sửa thực đơn.');
                }
            }
        }

        // 4. Màn hình Bếp KDS: QUAN_LY hoặc BEP
        if (tab === 'dieuPhoiBep') {
            if (vaiTro !== 'QUAN_LY' && vaiTro !== 'BEP') {
                if (window.thongBao) {
                    window.thongBao.thatBai('Từ chối truy cập', 'Màn hình điều phối chế biến chỉ dành cho Đầu bếp hoặc Quản lý!');
                }
                return false;
            }
        }

        // 5. Sơ đồ bàn POS (Quân - Sprint 3): QUAN_LY, THU_NGAN hoặc PHUC_VU
        if (tab === 'soDoBanPos') {
            if (vaiTro !== 'QUAN_LY' && vaiTro !== 'THU_NGAN' && vaiTro !== 'PHUC_VU') {
                if (window.thongBao) {
                    window.thongBao.thatBai('Từ chối truy cập', 'Chức năng Sơ đồ bàn chỉ dành cho Phục vụ, Thu ngân hoặc Quản lý!');
                }
                return false;
            }
        }

        // 6. Thu ngân & Hóa đơn POS (Quân - Sprint 3): QUAN_LY hoặc THU_NGAN
        if (tab === 'posThuNgan' || tab === 'thanhToanPos') {
            if (vaiTro !== 'QUAN_LY' && vaiTro !== 'THU_NGAN') {
                if (window.thongBao) {
                    window.thongBao.thatBai('Từ chối truy cập', 'Chức năng Thu ngân & Thanh toán chỉ dành cho Thu ngân hoặc Quản lý!');
                }
                return false;
            }
        }

        return true;
    }

    /**
     * Chuyển đổi vai trò người dùng nhanh (1-Click Switch Role)
     * Giúp giảng viên/người dùng kiểm thử tức thì tính tương thích giữa phần của Phong và Quân
     */
    async doiVaiTroNhanh(maVaiTro) {
        const banDoTaiKhoan = {
            'QUAN_LY': { tenDangNhap: 'quanly', matKhau: '123456' },
            'THU_NGAN': { tenDangNhap: 'thungan', matKhau: '123456' },
            'BEP': { tenDangNhap: 'bep', matKhau: '123456' },
            'PHUC_VU': { tenDangNhap: 'phucvu', matKhau: '123456' }
        };

        const thongTin = banDoTaiKhoan[maVaiTro];
        if (!thongTin) return;

        const kq = await window.api.dangNhap(thongTin.tenDangNhap, thongTin.matKhau);
        if (kq && kq.ok) {
            this.capNhatNguoiDung(kq.data.nguoiDung);
            if (window.thongBao) {
                window.thongBao.thongTin('Chuyển vai trò thành công', `Đang thao tác với quyền: ${kq.data.nguoiDung.hoTen} (${maVaiTro})`);
            }

            // Kiểm tra tab hiện tại có được phép truy cập với vai trò mới không
            const tabHienTai = window.ungDung ? window.ungDung.tabHienTai : '';
            if (!this.kiemTraQuyenTruyCapTab(tabHienTai)) {
                if (maVaiTro === 'QUAN_LY') window.ungDung.chuyenTab('quanLyNhanVien');
                else if (maVaiTro === 'BEP') window.ungDung.chuyenTab('quanLyThucDon');
                else window.ungDung.chuyenTab('quanLyBanQr');
            } else {
                // Tải lại nội dung tab hiện tại với phân quyền mới
                window.ungDung.chuyenTab(tabHienTai);
            }
        }
    }

    /**
     * Phân luồng hiển thị menu Sidebar & Header dựa theo vai trò (US-019 -> US-021)
     */
    capNhatGiaoDienTheoQuyen() {
        const user = this.layNguoiDung();
        const vaiTro = user ? user.vaiTro : null;

        // 1. Cập nhật thông tin người dùng ở chân Sidebar
        const anhUser = document.querySelector('.anh-dai-dien-user');
        const tenUser = document.querySelector('.ten-user');
        const vaiTroUser = document.querySelector('.vai-tro-user');

        if (anhUser && tenUser && vaiTroUser) {
            if (user) {
                const kyTuDau = (user.hoTen || user.tenDangNhap || 'U').charAt(0).toUpperCase();
                anhUser.textContent = kyTuDau;
                anhUser.title = `${user.hoTen} (${user.email})`;
                tenUser.innerHTML = `${window.DinhDang ? window.DinhDang.thoatHtml(user.hoTen) : user.hoTen}`;
                
                const tenVaiTro = {
                    'QUAN_LY': '👑 Quản lý (Chủ quán)',
                    'THU_NGAN': '💵 Thu ngân',
                    'BEP': '👨‍🍳 Đầu bếp KDS',
                    'PHUC_VU': '🏃 Nhân viên phục vụ'
                }[vaiTro] || 'Nhân viên';

                vaiTroUser.innerHTML = `
                    <span style="display:block; margin-bottom: 4px;">${tenVaiTro}</span>
                    <div style="display:flex; gap: 6px; font-size: 11px;">
                        <a href="javascript:void(0)" onclick="window.ungDung.chuyenTab('hoSoCaNhan')" style="color: #F8F6F0; text-decoration: underline;">Hồ sơ</a>
                        <span>|</span>
                        <a href="javascript:void(0)" onclick="window.boDieuHuong.xuLyDangXuat()" style="color: #FCA5A5; text-decoration: underline;">Đăng xuất</a>
                    </div>
                `;
            } else {
                anhUser.textContent = '?';
                tenUser.textContent = 'Chưa đăng nhập';
                vaiTroUser.innerHTML = `
                    <a href="javascript:void(0)" onclick="window.ungDung.chuyenTab('dangNhap')" style="color: #F8F6F0; text-decoration: underline; font-weight: 600;">
                        🔑 Đăng nhập ngay
                    </a>
                `;
            }
        }

        // 2. Cập nhật tên user trên Header
        const headUserName = document.getElementById('head-user-name');
        if (headUserName) {
            headUserName.textContent = user ? (user.hoTen || user.tenDangNhap) : 'Chưa đăng nhập';
        }

        // 3. Cập nhật trạng thái active của các Pill đổi vai trò trên Header
        document.querySelectorAll('.nut-vai-tro-pill[data-role]').forEach(pill => {
            const role = pill.getAttribute('data-role');
            if (role === vaiTro) {
                pill.classList.add('kich-hoat');
            } else {
                pill.classList.remove('kich-hoat');
            }
        });

        // 4. Cập nhật hiển thị Sidebar theo vai trò
        document.querySelectorAll('.muc-menu[data-tab]').forEach(muc => {
            const tab = muc.getAttribute('data-tab');

            // Quản lý Nhân sự, Phân quyền, Cấu hình: Chỉ QUAN_LY mới thấy
            if (tab === 'quanLyNhanVien' || tab === 'phanQuyen' || tab === 'cauHinhHeThong') {
                if (!user || user.vaiTro !== 'QUAN_LY') {
                    muc.style.display = 'none';
                } else {
                    muc.style.display = 'flex';
                }
            } else if (tab === 'dieuPhoiBep') {
                if (user && user.vaiTro === 'THU_NGAN') {
                    muc.style.opacity = '0.4';
                } else {
                    muc.style.opacity = '1';
                }
            } else if (tab === 'posThuNgan') {
                if (user && user.vaiTro === 'BEP') {
                    muc.style.opacity = '0.4';
                } else {
                    muc.style.opacity = '1';
                }
            } else {
                muc.style.display = 'flex';
            }
        });
    }

    /**
     * Xử lý đăng xuất tài khoản (US-008)
     */
    async xuLyDangXuat() {
        if (window.api) {
            await window.api.dangXuat();
        }
        this.nguoiDungHienTai = null;
        this.capNhatGiaoDienTheoQuyen();

        if (window.thongBao) {
            window.thongBao.thongTin('Đã đăng xuất', 'Bạn đã đăng xuất khỏi hệ thống an toàn.');
        }

        if (window.ungDung) {
            window.ungDung.chuyenTab('dangNhap');
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.boDieuHuong = new BoDieuHuong();
