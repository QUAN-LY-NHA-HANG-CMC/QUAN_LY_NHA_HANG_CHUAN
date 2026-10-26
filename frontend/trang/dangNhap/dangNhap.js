/**
 * MÀN HÌNH ĐĂNG NHẬP HỆ THỐNG (dangNhap.js)
 * Phụ trách: Phong (Frontend Admin & Auth Lead)
 * Đáp ứng các User Story trong Sprint 1:
 * - US-007: Đăng nhập hệ thống bằng tài khoản nhân viên / quản lý
 * - US-008: Đăng xuất khỏi thiết bị
 * - US-014: Ngăn chặn tài khoản bị khóa đăng nhập
 */

class DangNhapModule {
    constructor() {
        this.dangXuLy = false;
    }

    khoiTao() {
        this.veGiaoDien();
    }

    veGiaoDien() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        vungChua.innerHTML = `
            <div class="khung-dang-nhap-bao-ngoai">
                <div class="the-dang-nhap">
                    <!-- Logo & Tiêu đề -->
                    <div class="dau-the-dang-nhap">
                        <div class="logo-dang-nhap">🍽️</div>
                        <h2>HỆ THỐNG QUẢN LÝ NHÀ HÀNG</h2>
                        <p class="khau-hieu-dang-nhap">QUÁN MỘC - NỀN TẢNG GỌI MÓN QR & ĐIỀU HÀNH TẬP TRUNG</p>
                        <div class="badge-sprint-login">Sprint 1 • Phân hệ Quản trị & Xác thực (Phong FE)</div>
                    </div>

                    <!-- Form đăng nhập -->
                    <form id="form-dang-nhap" class="bieu-mau-dang-nhap" onsubmit="window.dangNhapModule.xuLyDangNhap(event)">
                        <div class="nhom-nhap-lieu">
                            <label for="nhap-ten-dang-nhap">
                                👤 Tên đăng nhập hoặc Email <span class="bat-buoc">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="nhap-ten-dang-nhap" 
                                placeholder="Ví dụ: quanly hoặc phong.admin@quanmoc.com" 
                                required 
                                autocomplete="username"
                                autofocus
                            />
                        </div>

                        <div class="nhom-nhap-lieu">
                            <label for="nhap-mat-khau">
                                🔑 Mật khẩu truy cập <span class="bat-buoc">*</span>
                            </label>
                            <div class="khung-mat-khau">
                                <input 
                                    type="password" 
                                    id="nhap-mat-khau" 
                                    placeholder="Nhập mật khẩu (Mặc định: 123456)" 
                                    required 
                                    autocomplete="current-password"
                                />
                                <button type="button" class="nut-hien-mat-khau" onclick="window.dangNhapModule.chuyenTrangThaiMatKhau()" title="Hiện/Ẩn mật khẩu">
                                    👁️
                                </button>
                            </div>
                        </div>

                        <div class="hang-tuy-chon-dang-nhap">
                            <label class="nhan-checkbox">
                                <input type="checkbox" id="ghi-nho-dang-nhap" checked />
                                <span>Ghi nhớ phiên làm việc trên máy này</span>
                            </label>
                            <a href="javascript:void(0)" onclick="window.dangNhapModule.quenMatKhau()" class="link-quen-mat-khau">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button type="submit" id="nut-submit-dang-nhap" class="nut nut-chinh nut-dang-nhap-to">
                            <span>🚀 Đăng nhập hệ thống</span>
                        </button>
                    </form>

                    <!-- Danh sách tài khoản demo 1-click test -->
                    <div class="hop-tai-khoan-mau">
                        <div class="tieu-de-tai-khoan-mau">
                            <span>⚡ Chọn nhanh tài khoản kiểm thử (1-Click Test):</span>
                        </div>
                        <div class="danh-sach-nut-demo">
                            <button type="button" class="nut-demo nut-demo-quanly" onclick="window.dangNhapModule.dienTaiKhoanMau('quanly', '123456')">
                                👑 <strong>Quản lý</strong> (quanly / 123456)
                            </button>
                            <button type="button" class="nut-demo nut-demo-thungan" onclick="window.dangNhapModule.dienTaiKhoanMau('thungan', '123456')">
                                💵 <strong>Thu ngân</strong> (thungan / 123456)
                            </button>
                            <button type="button" class="nut-demo nut-demo-bep" onclick="window.dangNhapModule.dienTaiKhoanMau('bep', '123456')">
                                👨‍🍳 <strong>Đầu bếp</strong> (bep / 123456)
                            </button>
                            <button type="button" class="nut-demo nut-demo-phucvu" onclick="window.dangNhapModule.dienTaiKhoanMau('phucvu', '123456')">
                                🏃 <strong>Phục vụ</strong> (phucvu / 123456)
                            </button>
                            <button type="button" class="nut-demo nut-demo-khoa" onclick="window.dangNhapModule.dienTaiKhoanMau('nhanvien_cu', '123456')" title="Kiểm tra US-014: Chặn tài khoản bị khóa">
                                🔒 <strong>TK đã khóa</strong> (nhanvien_cu)
                            </button>
                        </div>
                    </div>

                    <div class="duoi-the-dang-nhap">
                        <span>Hệ thống bảo mật dữ liệu phân quyền chuẩn RBAC • Tuân thủ chuẩn API {ok, data, msg}</span>
                    </div>
                </div>
            </div>
        `;
    }

    dienTaiKhoanMau(tenDangNhap, matKhau) {
        const oTen = document.getElementById('nhap-ten-dang-nhap');
        const oMatKhau = document.getElementById('nhap-mat-khau');
        if (oTen && oMatKhau) {
            oTen.value = tenDangNhap;
            oMatKhau.value = matKhau;
            if (window.thongBao) {
                window.thongBao.thongTin('Đã điền tài khoản mẫu', `Tài khoản: [${tenDangNhap}] - Mật khẩu: [${matKhau}]`);
            }
        }
    }

    chuyenTrangThaiMatKhau() {
        const oMatKhau = document.getElementById('nhap-mat-khau');
        if (!oMatKhau) return;
        if (oMatKhau.type === 'password') {
            oMatKhau.type = 'text';
        } else {
            oMatKhau.type = 'password';
        }
    }

    async xuLyDangNhap(e) {
        e.preventDefault();
        if (this.dangXuLy) return;

        const oTen = document.getElementById('nhap-ten-dang-nhap');
        const oMatKhau = document.getElementById('nhap-mat-khau');
        const nutSubmit = document.getElementById('nut-submit-dang-nhap');

        if (!oTen || !oMatKhau) return;

        const tenDangNhap = oTen.value.trim();
        const matKhau = oMatKhau.value;

        if (!tenDangNhap || !matKhau) {
            if (window.thongBao) {
                window.thongBao.canhBao('Thiếu thông tin', 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
            }
            return;
        }

        this.dangXuLy = true;
        if (nutSubmit) {
            nutSubmit.disabled = true;
            nutSubmit.innerHTML = '<span>⏳ Đang kiểm tra thông tin...</span>';
        }

        try {
            const ketQua = await window.api.dangNhap(tenDangNhap, matKhau);

            if (ketQua && ketQua.ok) {
                if (window.thongBao) {
                    window.thongBao.thanhCong('Đăng nhập thành công!', ketQua.msg);
                }

                if (window.boDieuHuong) {
                    window.boDieuHuong.capNhatNguoiDung(ketQua.data.nguoiDung);
                }

                // Điều hướng theo quyền
                setTimeout(() => {
                    const vaiTro = ketQua.data.nguoiDung.vaiTro;
                    if (vaiTro === 'QUAN_LY') {
                        window.ungDung.chuyenTab('quanLyNhanVien');
                    } else if (vaiTro === 'BEP') {
                        window.ungDung.chuyenTab('quanLyThucDon');
                    } else {
                        window.ungDung.chuyenTab('quanLyBanQr');
                    }
                }, 400);
            } else {
                if (window.thongBao) {
                    window.thongBao.thatBai('Đăng nhập thất bại', ketQua ? ketQua.msg : 'Có lỗi xảy ra khi xác thực.');
                }
            }
        } catch (loi) {
            console.error('Lỗi đăng nhập:', loi);
            if (window.thongBao) {
                window.thongBao.thatBai('Lỗi hệ thống', 'Không thể kết nối đến máy chủ xác thực.');
            }
        } finally {
            this.dangXuLy = false;
            if (nutSubmit) {
                nutSubmit.disabled = false;
                nutSubmit.innerHTML = '<span>🚀 Đăng nhập hệ thống</span>';
            }
        }
    }

    quenMatKhau() {
        if (window.thongBao) {
            window.thongBao.thongTin(
                'Quên mật khẩu?', 
                'Vui lòng liên hệ Trưởng nhóm hoặc Quản trị viên (Phong Admin) để được cấp lại mật khẩu mới.'
            );
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.dangNhapModule = new DangNhapModule();
