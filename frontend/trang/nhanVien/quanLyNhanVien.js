/**
 * MODULE QUẢN LÝ NHÂN SỰ & HỒ SƠ TÀI KHOẢN (quanLyNhanVien.js)
 * Phụ trách: Phong (Frontend Admin & Auth Lead)
 * Đáp ứng các User Story trong Sprint 1:
 * - US-011: Quản lý tạo mới tài khoản cho nhân viên (Thu ngân, Bếp, Phục vụ)
 * - US-012: Quản lý xem danh sách và tìm kiếm hồ sơ nhân viên
 * - US-013: Quản lý cập nhật thông tin hoặc đặt lại mật khẩu cho nhân viên
 * - US-014: Quản lý khóa / mở khóa tài khoản nhân viên đã nghỉ việc
 */

class QuanLyNhanVienModule {
    constructor() {
        this.danhSachNhanVien = [];
        this.danhSachVaiTro = [];
        this.boLocVaiTro = 'ALL';
        this.boLocTrangThai = 'ALL';
        this.tuKhoaTimKiem = '';
        this.nhanVienDangChon = null;
    }

    async khoiTao() {
        await this.taiDuLieu();
        this.veGiaoDien();
    }

    async taiDuLieu() {
        this.danhSachNhanVien = await window.api.layDanhSachNhanVien();
        this.danhSachVaiTro = await window.api.layDanhSachVaiTro();
    }

    veGiaoDien() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        // Thống kê nhanh
        const tongNhanVien = this.danhSachNhanVien.length;
        const dangLamViec = this.danhSachNhanVien.filter(nv => nv.trangThai === 'DANG_LAM_VIEC').length;
        const daKhoa = this.danhSachNhanVien.filter(nv => nv.trangThai === 'DA_KHOA').length;
        const soQuanLy = this.danhSachNhanVien.filter(nv => nv.vaiTro === 'QUAN_LY').length;
        const soThuNgan = this.danhSachNhanVien.filter(nv => nv.vaiTro === 'THU_NGAN').length;
        const soBep = this.danhSachNhanVien.filter(nv => nv.vaiTro === 'BEP').length;

        // Lọc danh sách nhân viên theo bộ lọc và tìm kiếm (US-012)
        const danhSachHienThi = this.danhSachNhanVien.filter(nv => {
            const thoaVaiTro = (this.boLocVaiTro === 'ALL') || (nv.vaiTro === this.boLocVaiTro);
            const thoaTrangThai = (this.boLocTrangThai === 'ALL') || (nv.trangThai === this.boLocTrangThai);
            const tk = this.tuKhoaTimKiem.toLowerCase();
            const thoaTimKiem = !this.tuKhoaTimKiem || 
                (nv.hoTen && nv.hoTen.toLowerCase().includes(tk)) ||
                (nv.tenDangNhap && nv.tenDangNhap.toLowerCase().includes(tk)) ||
                (nv.email && nv.email.toLowerCase().includes(tk)) ||
                (nv.soDienThoai && nv.soDienThoai.includes(tk));
            return thoaVaiTro && thoaTrangThai && thoaTimKiem;
        });

        vungChua.innerHTML = `
            <div class="trang-quan-ly-nhan-vien">
                <!-- Tiêu đề trang & Nút thêm mới (US-011) -->
                <div class="thanh-tieu-de-trang">
                    <div>
                        <h2>👥 Quản lý Nhân sự & Tài khoản nội bộ</h2>
                        <p class="mo-ta-phu">Danh sách tài khoản nhân viên, phân vai trò công việc và kiểm soát trạng thái hoạt động (US-011 -> US-014)</p>
                    </div>
                    <div class="nhom-nut-hanh-dong">
                        <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('phanQuyen')">
                            🛡️ Ma trận Phân quyền (${this.danhSachVaiTro.length} vai trò)
                        </button>
                        <button class="nut nut-chinh" onclick="window.quanLyNhanVien.moModalThemNhanVien()">
                            ➕ Thêm nhân viên mới
                        </button>
                    </div>
                </div>

                <!-- Thẻ thống kê chỉ số nhân sự -->
                <div class="luoi-thong-ke">
                    <div class="the-chi-so">
                        <div class="so-chi-so">${tongNhanVien}</div>
                        <div class="nhan-chi-so">Tổng số nhân sự</div>
                    </div>
                    <div class="the-chi-so chi-so-xanh">
                        <div class="so-chi-so">${dangLamViec}</div>
                        <div class="nhan-chi-so">Đang làm việc</div>
                    </div>
                    <div class="the-chi-so chi-so-xam">
                        <div class="so-chi-so">${daKhoa}</div>
                        <div class="nhan-chi-so">Đã khóa / Nghỉ việc</div>
                    </div>
                    <div class="the-chi-so chi-so-cam">
                        <div class="so-chi-so">${soQuanLy} QL / ${soThuNgan} TN / ${soBep} Bếp</div>
                        <div class="nhan-chi-so">Cơ cấu vị trí làm việc</div>
                    </div>
                </div>

                <!-- Thanh tìm kiếm & Bộ lọc (US-012) -->
                <div class="thanh-bo-loc">
                    <div class="cac-tab-khu-vuc">
                        <button class="tab-khu-vuc ${this.boLocVaiTro === 'ALL' ? 'kich-hoat' : ''}" onclick="window.quanLyNhanVien.chuyenBoLocVaiTro('ALL')">
                            Tất cả vai trò (${tongNhanVien})
                        </button>
                        <button class="tab-khu-vuc ${this.boLocVaiTro === 'QUAN_LY' ? 'kich-hoat' : ''}" onclick="window.quanLyNhanVien.chuyenBoLocVaiTro('QUAN_LY')">
                            👑 Quản lý (${soQuanLy})
                        </button>
                        <button class="tab-khu-vuc ${this.boLocVaiTro === 'THU_NGAN' ? 'kich-hoat' : ''}" onclick="window.quanLyNhanVien.chuyenBoLocVaiTro('THU_NGAN')">
                            💵 Thu ngân (${soThuNgan})
                        </button>
                        <button class="tab-khu-vuc ${this.boLocVaiTro === 'BEP' ? 'kich-hoat' : ''}" onclick="window.quanLyNhanVien.chuyenBoLocVaiTro('BEP')">
                            👨‍🍳 Đầu bếp (${soBep})
                        </button>
                        <button class="tab-khu-vuc ${this.boLocVaiTro === 'PHUC_VU' ? 'kich-hoat' : ''}" onclick="window.quanLyNhanVien.chuyenBoLocVaiTro('PHUC_VU')">
                            🏃 Phục vụ (${this.danhSachNhanVien.filter(nv => nv.vaiTro === 'PHUC_VU').length})
                        </button>
                    </div>

                    <div class="nhom-loc-tim-kiem">
                        <select class="select-loc" onchange="window.quanLyNhanVien.chuyenBoLocTrangThai(this.value)">
                            <option value="ALL" ${this.boLocTrangThai === 'ALL' ? 'selected' : ''}>-- Trạng thái: Tất cả --</option>
                            <option value="DANG_LAM_VIEC" ${this.boLocTrangThai === 'DANG_LAM_VIEC' ? 'selected' : ''}>Đang làm việc</option>
                            <option value="DA_KHOA" ${this.boLocTrangThai === 'DA_KHOA' ? 'selected' : ''}>Đã khóa / Nghỉ việc</option>
                        </select>
                        <div class="hop-tim-kiem">
                            <input 
                                type="text" 
                                placeholder="🔍 Tìm tên, username, SĐT, email..." 
                                value="${window.DinhDang ? window.DinhDang.thoatHtml(this.tuKhoaTimKiem) : this.tuKhoaTimKiem}"
                                oninput="window.quanLyNhanVien.timKiem(this.value)"
                            />
                        </div>
                    </div>
                </div>

                <!-- Bảng danh sách nhân viên (US-012) -->
                <div class="hop-bang-du-lieu">
                    <table class="bang-du-lieu">
                        <thead>
                            <tr>
                                <th style="width: 50px; text-align: center;">STT</th>
                                <th>Nhân viên</th>
                                <th>Tên đăng nhập</th>
                                <th>Vai trò</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th style="text-align: center;">Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th style="text-align: right; width: 220px;">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${danhSachHienThi.length === 0 ? `
                                <tr>
                                    <td colspan="9" style="text-align: center; padding: 40px; color: var(--mau-chu-phu);">
                                        Không tìm thấy nhân viên nào phù hợp với bộ lọc tìm kiếm.
                                    </td>
                                </tr>
                            ` : danhSachHienThi.map((nv, idx) => {
                                const tenVaiTro = {
                                    'QUAN_LY': '👑 Quản lý',
                                    'THU_NGAN': '💵 Thu ngân',
                                    'BEP': '👨‍🍳 Đầu bếp',
                                    'PHUC_VU': '🏃 Phục vụ'
                                }[nv.vaiTro] || nv.vaiTro;

                                const lopBadgeVaiTro = {
                                    'QUAN_LY': 'badge-cam',
                                    'THU_NGAN': 'badge-xanh-duong',
                                    'BEP': 'badge-vang',
                                    'PHUC_VU': 'badge-xanh-la'
                                }[nv.vaiTro] || 'badge-xam';

                                const laDangKhoa = nv.trangThai === 'DA_KHOA';

                                return `
                                    <tr class="${laDangKhoa ? 'hang-da-khoa' : ''}">
                                        <td style="text-align: center; font-weight: 600; color: var(--mau-chu-phu);">${idx + 1}</td>
                                        <td>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div class="avatar-nho ${laDangKhoa ? 'avatar-khoa' : ''}">
                                                    ${(nv.hoTen || nv.tenDangNhap || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style="font-weight: 700; color: #2C1810;">${window.DinhDang ? window.DinhDang.thoatHtml(nv.hoTen) : nv.hoTen}</div>
                                                    <div style="font-size: 11px; color: var(--mau-chu-phu);">ID: #${nv.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><code style="background: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-weight: 600;">@${window.DinhDang ? window.DinhDang.thoatHtml(nv.tenDangNhap) : nv.tenDangNhap}</code></td>
                                        <td><span class="badge ${lopBadgeVaiTro}">${tenVaiTro}</span></td>
                                        <td>${nv.soDienThoai ? (window.DinhDang ? window.DinhDang.thoatHtml(nv.soDienThoai) : nv.soDienThoai) : '---'}</td>
                                        <td>${nv.email ? (window.DinhDang ? window.DinhDang.thoatHtml(nv.email) : nv.email) : '---'}</td>
                                        <td style="text-align: center;">
                                            ${laDangKhoa 
                                                ? `<span class="badge badge-xam">🔒 Đã khóa</span>` 
                                                : `<span class="badge badge-xanh-la">✔ Hoạt động</span>`
                                            }
                                        </td>
                                        <td style="font-size: 12px; color: var(--mau-chu-phu);">${nv.ngayTao ? (window.DinhDang ? window.DinhDang.chiNgay(nv.ngayTao) : nv.ngayTao) : '10/2026'}</td>
                                        <td style="text-align: right;">
                                            <div style="display: inline-flex; gap: 6px;">
                                                <!-- Sửa thông tin (US-013) -->
                                                <button class="nut nut-phu nut-nho" onclick="window.quanLyNhanVien.moModalSuaNhanVien(${nv.id})" title="Chỉnh sửa thông tin nhân viên">
                                                    ✏️ Sửa
                                                </button>
                                                <!-- Đặt lại mật khẩu (US-013) -->
                                                <button class="nut nut-phu nut-nho" onclick="window.quanLyNhanVien.moModalDatLaiMatKhau(${nv.id})" title="Đặt lại mật khẩu">
                                                    🔑 Reset MK
                                                </button>
                                                <!-- Khóa / Mở khóa (US-014) -->
                                                ${laDangKhoa ? `
                                                    <button class="nut nut-phu nut-nho nut-mo-khoa" onclick="window.quanLyNhanVien.thayDoiTrangThai(${nv.id}, 'DANG_LAM_VIEC')" title="Mở khóa tài khoản">
                                                        🔓 Mở
                                                    </button>
                                                ` : `
                                                    <button class="nut nut-canh-bao nut-nho" onclick="window.quanLyNhanVien.thayDoiTrangThai(${nv.id}, 'DA_KHOA')" title="Khóa tài khoản nghỉ việc">
                                                        🔒 Khóa
                                                    </button>
                                                `}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    chuyenBoLocVaiTro(vaiTro) {
        this.boLocVaiTro = vaiTro;
        this.veGiaoDien();
    }

    chuyenBoLocTrangThai(trangThai) {
        this.boLocTrangThai = trangThai;
        this.veGiaoDien();
    }

    timKiem(tuKhoa) {
        this.tuKhoaTimKiem = tuKhoa;
        this.veGiaoDien();
    }

    /**
     * Mở modal thêm nhân viên mới (US-011)
     */
    moModalThemNhanVien() {
        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        khungModal.innerHTML = `
            <div class="hop-modal">
                <div class="dau-modal">
                    <h3>➕ Thêm tài khoản nhân viên mới (US-011)</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyNhanVien.dongModal()">✕</button>
                </div>
                <form id="form-them-nhan-vien" onsubmit="window.quanLyNhanVien.xuLyThemNhanVien(event)">
                    <div class="than-modal">
                        <div class="nhom-nhap-lieu">
                            <label>Họ và tên nhân viên <span class="bat-buoc">*</span></label>
                            <input type="text" id="them-nv-ho-ten" placeholder="Ví dụ: Hoàng Minh Đức" required autofocus />
                        </div>
                        <div class="hang-nhap-doi">
                            <div class="nhom-nhap-lieu">
                                <label>Tên đăng nhập <span class="bat-buoc">*</span></label>
                                <input type="text" id="them-nv-username" placeholder="Ví dụ: minhduc" required pattern="[a-zA-Z0-9_]{3,30}" title="Ít nhất 3 ký tự, không dấu, không khoảng trắng" />
                            </div>
                            <div class="nhom-nhap-lieu">
                                <label>Vai trò làm việc <span class="bat-buoc">*</span></label>
                                <select id="them-nv-vai-tro" required>
                                    <option value="PHUC_VU">🏃 Nhân viên Phục vụ bàn</option>
                                    <option value="BEP">👨‍🍳 Đầu bếp (KDS)</option>
                                    <option value="THU_NGAN">💵 Nhân viên Thu ngân (POS)</option>
                                    <option value="QUAN_LY">👑 Quản lý / Giám sát quán</option>
                                </select>
                            </div>
                        </div>
                        <div class="hang-nhap-doi">
                            <div class="nhom-nhap-lieu">
                                <label>Số điện thoại</label>
                                <input type="tel" id="them-nv-sdt" placeholder="Ví dụ: 0912345678" />
                            </div>
                            <div class="nhom-nhap-lieu">
                                <label>Email liên hệ</label>
                                <input type="email" id="them-nv-email" placeholder="Ví dụ: duc@quanmoc.com" />
                            </div>
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Mật khẩu ban đầu <span class="bat-buoc">*</span></label>
                            <input type="text" id="them-nv-mat-khau" value="123456" required minlength="6" />
                            <small style="color: var(--mau-chu-phu); font-size: 11px;">Mặc định là 123456. Nhân viên có thể tự đổi mật khẩu sau khi đăng nhập.</small>
                        </div>
                    </div>
                    <div class="duoi-modal">
                        <button type="button" class="nut nut-phu" onclick="window.quanLyNhanVien.dongModal()">Hủy</button>
                        <button type="submit" class="nut nut-chinh">💾 Lưu nhân viên</button>
                    </div>
                </form>
            </div>
        `;
        khungModal.classList.add('mo');
    }

    async xuLyThemNhanVien(e) {
        e.preventDefault();
        const hoTen = document.getElementById('them-nv-ho-ten').value.trim();
        const tenDangNhap = document.getElementById('them-nv-username').value.trim();
        const vaiTro = document.getElementById('them-nv-vai-tro').value;
        const soDienThoai = document.getElementById('them-nv-sdt').value.trim();
        const email = document.getElementById('them-nv-email').value.trim();
        const matKhau = document.getElementById('them-nv-mat-khau').value;

        const kq = await window.api.themNhanVien({
            hoTen,
            tenDangNhap,
            vaiTro,
            soDienThoai,
            email,
            matKhau
        });

        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Tạo nhân viên thành công', kq.msg);
            this.dongModal();
            await this.taiDuLieu();
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Thất bại', kq ? kq.msg : 'Có lỗi khi tạo nhân viên.');
        }
    }

    /**
     * Mở modal sửa thông tin nhân viên (US-013)
     */
    moModalSuaNhanVien(id) {
        const nv = this.danhSachNhanVien.find(item => item.id === Number(id));
        if (!nv) return;

        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        khungModal.innerHTML = `
            <div class="hop-modal">
                <div class="dau-modal">
                    <h3>✏️ Cập nhật thông tin nhân viên #${nv.id}</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyNhanVien.dongModal()">✕</button>
                </div>
                <form id="form-sua-nhan-vien" onsubmit="window.quanLyNhanVien.xuLySuaNhanVien(event, ${nv.id})">
                    <div class="than-modal">
                        <div class="nhom-nhap-lieu">
                            <label>Tên đăng nhập (Cố định)</label>
                            <input type="text" value="@${window.DinhDang ? window.DinhDang.thoatHtml(nv.tenDangNhap) : nv.tenDangNhap}" disabled style="background: #F3F4F6;" />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Họ và tên nhân viên <span class="bat-buoc">*</span></label>
                            <input type="text" id="sua-nv-ho-ten" value="${window.DinhDang ? window.DinhDang.thoatHtml(nv.hoTen) : nv.hoTen}" required />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Vai trò làm việc <span class="bat-buoc">*</span></label>
                            <select id="sua-nv-vai-tro" required>
                                <option value="PHUC_VU" ${nv.vaiTro === 'PHUC_VU' ? 'selected' : ''}>🏃 Nhân viên Phục vụ bàn</option>
                                <option value="BEP" ${nv.vaiTro === 'BEP' ? 'selected' : ''}>👨‍🍳 Đầu bếp (KDS)</option>
                                <option value="THU_NGAN" ${nv.vaiTro === 'THU_NGAN' ? 'selected' : ''}>💵 Nhân viên Thu ngân (POS)</option>
                                <option value="QUAN_LY" ${nv.vaiTro === 'QUAN_LY' ? 'selected' : ''}>👑 Quản lý / Giám sát quán</option>
                            </select>
                        </div>
                        <div class="hang-nhap-doi">
                            <div class="nhom-nhap-lieu">
                                <label>Số điện thoại</label>
                                <input type="tel" id="sua-nv-sdt" value="${window.DinhDang ? window.DinhDang.thoatHtml(nv.soDienThoai || '') : (nv.soDienThoai || '')}" />
                            </div>
                            <div class="nhom-nhap-lieu">
                                <label>Email liên hệ</label>
                                <input type="email" id="sua-nv-email" value="${window.DinhDang ? window.DinhDang.thoatHtml(nv.email || '') : (nv.email || '')}" />
                            </div>
                        </div>
                    </div>
                    <div class="duoi-modal">
                        <button type="button" class="nut nut-phu" onclick="window.quanLyNhanVien.dongModal()">Hủy</button>
                        <button type="submit" class="nut nut-chinh">💾 Cập nhật</button>
                    </div>
                </form>
            </div>
        `;
        khungModal.classList.add('mo');
    }

    async xuLySuaNhanVien(e, id) {
        e.preventDefault();
        const hoTen = document.getElementById('sua-nv-ho-ten').value.trim();
        const vaiTro = document.getElementById('sua-nv-vai-tro').value;
        const soDienThoai = document.getElementById('sua-nv-sdt').value.trim();
        const email = document.getElementById('sua-nv-email').value.trim();

        const kq = await window.api.capNhatNhanVien(id, { hoTen, vaiTro, soDienThoai, email });
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Thành công', kq.msg);
            this.dongModal();
            await this.taiDuLieu();
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Thất bại', kq ? kq.msg : 'Lỗi cập nhật nhân viên.');
        }
    }

    /**
     * Mở modal đặt lại mật khẩu cho nhân viên (US-013)
     */
    moModalDatLaiMatKhau(id) {
        const nv = this.danhSachNhanVien.find(item => item.id === Number(id));
        if (!nv) return;

        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        const mkNgauNhien = Math.floor(100000 + Math.random() * 900000).toString();

        khungModal.innerHTML = `
            <div class="hop-modal" style="max-width: 440px;">
                <div class="dau-modal">
                    <h3>🔑 Đặt lại mật khẩu (Reset Password)</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyNhanVien.dongModal()">✕</button>
                </div>
                <form id="form-reset-mat-khau" onsubmit="window.quanLyNhanVien.xuLyDatLaiMatKhau(event, ${nv.id})">
                    <div class="than-modal">
                        <p style="font-size: 13px; color: var(--mau-chu-phu); margin-bottom: 16px;">
                            Bạn đang chuẩn bị đặt lại mật khẩu cho nhân viên <strong>${window.DinhDang ? window.DinhDang.thoatHtml(nv.hoTen) : nv.hoTen}</strong> (<code>@${nv.tenDangNhap}</code>).
                        </p>
                        <div class="nhom-nhap-lieu">
                            <label>Mật khẩu mới <span class="bat-buoc">*</span></label>
                            <input type="text" id="reset-mat-khau-moi" value="${mkNgauNhien}" required minlength="6" />
                        </div>
                    </div>
                    <div class="duoi-modal">
                        <button type="button" class="nut nut-phu" onclick="window.quanLyNhanVien.dongModal()">Hủy</button>
                        <button type="submit" class="nut nut-canh-bao" style="background: var(--mau-chinh); color: #FFF; border: none;">
                            🔄 Xác nhận đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        `;
        khungModal.classList.add('mo');
    }

    async xuLyDatLaiMatKhau(e, id) {
        e.preventDefault();
        const matKhauMoi = document.getElementById('reset-mat-khau-moi').value.trim();
        if (!matKhauMoi || matKhauMoi.length < 6) {
            if (window.thongBao) window.thongBao.canhBao('Mật khẩu quá ngắn', 'Mật khẩu phải từ 6 ký tự trở lên.');
            return;
        }

        const kq = await window.api.datLaiMatKhau(id, matKhauMoi);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Reset thành công', kq.msg);
            this.dongModal();
            await this.taiDuLieu();
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Thất bại', kq ? kq.msg : 'Lỗi đặt lại mật khẩu.');
        }
    }

    /**
     * Khóa / Mở khóa tài khoản (US-014)
     */
    async thayDoiTrangThai(id, trangThaiMoi) {
        const nv = this.danhSachNhanVien.find(item => item.id === Number(id));
        if (!nv) return;

        const hanhDong = trangThaiMoi === 'DA_KHOA' ? 'KHÓA' : 'MỞ KHÓA';
        const xacNhan = confirm(`Bạn có chắc chắn muốn ${hanhDong} tài khoản của nhân viên "${nv.hoTen}" (@${nv.tenDangNhap})?`);
        if (!xacNhan) return;

        const kq = await window.api.doiTrangThaiNhanVien(id, trangThaiMoi);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Cập nhật trạng thái thành công', kq.msg);
            await this.taiDuLieu();
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Không thể thay đổi', kq ? kq.msg : 'Có lỗi xảy ra.');
        }
    }

    dongModal() {
        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (khungModal) {
            khungModal.classList.remove('mo');
            khungModal.innerHTML = '';
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.quanLyNhanVien = new QuanLyNhanVienModule();
