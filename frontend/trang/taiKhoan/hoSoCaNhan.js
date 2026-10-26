/**
 * MÀN HÌNH HỒ SƠ CÁ NHÂN & ĐỔI MẬT KHẨU (hoSoCaNhan.js)
 * Phụ trách: Phong (Frontend Admin & Auth Lead)
 * Đáp ứng các User Story trong Sprint 1:
 * - US-009: Đổi mật khẩu cá nhân
 * - US-010: Xem và cập nhật thông tin hồ sơ cá nhân
 */

class HoSoCaNhanModule {
    constructor() {
        this.nguoiDung = null;
    }

    async khoiTao() {
        this.nguoiDung = window.api ? window.api.layThongTinNguoiDung() : null;
        if (!this.nguoiDung) {
            if (window.ungDung) window.ungDung.chuyenTab('dangNhap');
            return;
        }
        this.veGiaoDien();
    }

    veGiaoDien() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua || !this.nguoiDung) return;

        const u = this.nguoiDung;
        const tenVaiTro = {
            'QUAN_LY': '👑 Quản lý / Chủ nhà hàng',
            'THU_NGAN': '💵 Thu ngân',
            'BEP': '👨‍🍳 Đầu bếp (KDS)',
            'PHUC_VU': '🏃 Nhân viên phục vụ'
        }[u.vaiTro] || u.vaiTro;

        const lopBadge = {
            'QUAN_LY': 'badge-cam',
            'THU_NGAN': 'badge-xanh-duong',
            'BEP': 'badge-vang',
            'PHUC_VU': 'badge-xanh-la'
        }[u.vaiTro] || 'badge-xam';

        const kyTuDau = (u.hoTen || u.tenDangNhap || 'U').charAt(0).toUpperCase();

        vungChua.innerHTML = `
            <div class="trang-ho-so-ca-nhan">
                <!-- Tiêu đề trang -->
                <div class="thanh-tieu-de-trang">
                    <div>
                        <h2>👤 Hồ sơ cá nhân & Bảo mật tài khoản</h2>
                        <p class="mo-ta-phu">Quản lý thông tin liên hệ và cập nhật mật khẩu đăng nhập hệ thống Quán Mộc (US-009, US-010)</p>
                    </div>
                    <div>
                        <button class="nut nut-phu" onclick="window.boDieuHuong.xuLyDangXuat()">
                            🚪 Đăng xuất thiết bị
                        </button>
                    </div>
                </div>

                <div class="luoi-hai-cot" style="grid-template-columns: 1fr 1.3fr; gap: 24px;">
                    <!-- Cột trái: Thẻ thông tin tài khoản -->
                    <div class="the-tong-quan-ho-so">
                        <div class="anh-dai-dien-ho-so">${kyTuDau}</div>
                        <h3 class="ho-ten-ho-so">${window.DinhDang ? window.DinhDang.thoatHtml(u.hoTen) : u.hoTen}</h3>
                        <p class="username-ho-so">@${window.DinhDang ? window.DinhDang.thoatHtml(u.tenDangNhap) : u.tenDangNhap}</p>
                        
                        <div style="margin: 14px 0;">
                            <span class="badge ${lopBadge}" style="font-size: 13px; padding: 6px 14px;">
                                ${tenVaiTro}
                            </span>
                        </div>

                        <div class="bang-thong-tin-nhanh">
                            <div class="dong-tt-nhanh">
                                <span class="nhan-tt">Trạng thái:</span>
                                <span class="badge badge-xanh-la">Đang làm việc</span>
                            </div>
                            <div class="dong-tt-nhanh">
                                <span class="nhan-tt">Email:</span>
                                <span class="gia-tri-tt">${window.DinhDang ? window.DinhDang.thoatHtml(u.email || 'Chưa cập nhật') : (u.email || '---')}</span>
                            </div>
                            <div class="dong-tt-nhanh">
                                <span class="nhan-tt">Số điện thoại:</span>
                                <span class="gia-tri-tt">${window.DinhDang ? window.DinhDang.thoatHtml(u.soDienThoai || 'Chưa cập nhật') : (u.soDienThoai || '---')}</span>
                            </div>
                            <div class="dong-tt-nhanh">
                                <span class="nhan-tt">Ngày gia nhập:</span>
                                <span class="gia-tri-tt">${u.ngayTao ? (window.DinhDang ? window.DinhDang.chiNgay(u.ngayTao) : u.ngayTao) : '10/2026'}</span>
                            </div>
                        </div>

                        <div class="hop-luu-y-bao-mat">
                            🔒 <strong>Bảo mật tài khoản:</strong> Không chia sẻ mật khẩu đăng nhập với người khác. Định kỳ đổi mật khẩu sau mỗi 30 ngày.
                        </div>
                    </div>

                    <!-- Cột phải: 2 Form (Cập nhật hồ sơ & Đổi mật khẩu) -->
                    <div class="khung-form-ho-so">
                        <!-- Form 1: Cập nhật thông tin cá nhân (US-010) -->
                        <div class="hop-form-con">
                            <div class="dau-hop-form">
                                <h4>📝 Cập nhật thông tin liên hệ (US-010)</h4>
                            </div>
                            <form id="form-cap-nhat-ho-so" onsubmit="window.hoSoCaNhanModule.xuLyCapNhatHoSo(event)">
                                <div class="nhom-nhap-lieu">
                                    <label>Họ và tên nhân viên <span class="bat-buoc">*</span></label>
                                    <input type="text" id="hs-ho-ten" value="${window.DinhDang ? window.DinhDang.thoatHtml(u.hoTen) : u.hoTen}" required />
                                </div>
                                <div class="hang-nhap-doi">
                                    <div class="nhom-nhap-lieu">
                                        <label>Địa chỉ Email</label>
                                        <input type="email" id="hs-email" value="${window.DinhDang ? window.DinhDang.thoatHtml(u.email || '') : (u.email || '')}" />
                                    </div>
                                    <div class="nhom-nhap-lieu">
                                        <label>Số điện thoại liên hệ</label>
                                        <input type="tel" id="hs-sdt" value="${window.DinhDang ? window.DinhDang.thoatHtml(u.soDienThoai || '') : (u.soDienThoai || '')}" />
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                                    <button type="submit" class="nut nut-chinh">
                                        💾 Lưu thay đổi hồ sơ
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Form 2: Đổi mật khẩu tài khoản (US-009) -->
                        <div class="hop-form-con" style="margin-top: 24px;">
                            <div class="dau-hop-form">
                                <h4>🔑 Đổi mật khẩu đăng nhập (US-009)</h4>
                            </div>
                            <form id="form-doi-mat-khau" onsubmit="window.hoSoCaNhanModule.xuLyDoiMatKhau(event)">
                                <div class="nhom-nhap-lieu">
                                    <label>Mật khẩu hiện tại <span class="bat-buoc">*</span></label>
                                    <input type="password" id="mk-cu" placeholder="Nhập mật khẩu đang dùng" required />
                                </div>
                                <div class="hang-nhap-doi">
                                    <div class="nhom-nhap-lieu">
                                        <label>Mật khẩu mới <span class="bat-buoc">*</span></label>
                                        <input type="password" id="mk-moi" placeholder="Tối thiểu 6 ký tự" minlength="6" required />
                                    </div>
                                    <div class="nhom-nhap-lieu">
                                        <label>Xác nhận mật khẩu mới <span class="bat-buoc">*</span></label>
                                        <input type="password" id="mk-moi-xac-nhan" placeholder="Nhập lại mật khẩu mới" minlength="6" required />
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                                    <button type="submit" class="nut nut-canh-bao" style="background: var(--mau-chinh); color: #FFF; border: none;">
                                        🔄 Cập nhật mật khẩu mới
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async xuLyCapNhatHoSo(e) {
        e.preventDefault();
        const hoTen = document.getElementById('hs-ho-ten').value.trim();
        const email = document.getElementById('hs-email').value.trim();
        const soDienThoai = document.getElementById('hs-sdt').value.trim();

        if (!hoTen) {
            if (window.thongBao) window.thongBao.canhBao('Lỗi', 'Họ tên không được để trống.');
            return;
        }

        const kq = await window.api.capNhatHoSo({ hoTen, email, soDienThoai });
        if (kq && kq.ok) {
            this.nguoiDung = kq.data;
            if (window.boDieuHuong) {
                window.boDieuHuong.capNhatNguoiDung(this.nguoiDung);
            }
            if (window.thongBao) window.thongBao.thanhCong('Thành công', kq.msg);
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Thất bại', kq ? kq.msg : 'Lỗi cập nhật hồ sơ.');
        }
    }

    async xuLyDoiMatKhau(e) {
        e.preventDefault();
        const mkCu = document.getElementById('mk-cu').value;
        const mkMoi = document.getElementById('mk-moi').value;
        const mkXacNhan = document.getElementById('mk-moi-xac-nhan').value;

        if (mkMoi !== mkXacNhan) {
            if (window.thongBao) {
                window.thongBao.canhBao('Mật khẩu không khớp', 'Mật khẩu xác nhận không trùng khớp với mật khẩu mới.');
            }
            return;
        }

        if (mkMoi.length < 6) {
            if (window.thongBao) {
                window.thongBao.canhBao('Mật khẩu quá ngắn', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
            }
            return;
        }

        const kq = await window.api.doiMatKhau(mkCu, mkMoi);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Đổi mật khẩu thành công', kq.msg);
            document.getElementById('form-doi-mat-khau').reset();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Đổi mật khẩu thất bại', kq ? kq.msg : 'Có lỗi xảy ra.');
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.hoSoCaNhanModule = new HoSoCaNhanModule();
