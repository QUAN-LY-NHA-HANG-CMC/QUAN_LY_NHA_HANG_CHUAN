/**
 * MODULE MA TRẬN PHÂN QUYỀN & QUẢN LÝ VAI TRÒ RBAC (phanQuyen.js)
 * Phụ trách: Phong (Frontend Admin & Auth Lead)
 * Đáp ứng các User Story trong Sprint 1:
 * - US-015: Xem danh sách các vai trò trong nhà hàng
 * - US-016: Tạo mới hoặc chỉnh sửa mô tả vai trò
 * - US-017 & US-018: Cấu hình ma trận quyền truy cập chức năng chi tiết cho từng vai trò
 * - US-022: Ghi nhận và hiển thị lịch sử thay đổi quyền hạn nhân sự (Audit Log)
 */

class PhanQuyenModule {
    constructor() {
        this.danhSachVaiTro = [];
        this.danhSachNhanVien = [];
        this.lichSuPhanQuyen = [];
        this.vaiTroDangChon = 'QUAN_LY'; // Mặc định hiển thị Quản lý
        this.tabHienThi = 'maTran'; // 'maTran' hoặc 'lichSu'
    }

    async khoiTao() {
        await this.taiDuLieu();
        this.veGiaoDien();
    }

    async taiDuLieu() {
        this.danhSachVaiTro = await window.api.layDanhSachVaiTro();
        this.danhSachNhanVien = await window.api.layDanhSachNhanVien();
        this.lichSuPhanQuyen = await window.api.layLichSuPhanQuyen();
    }

    veGiaoDien() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        const vtHienTai = this.danhSachVaiTro.find(v => v.ma === this.vaiTroDangChon) || this.danhSachVaiTro[0];
        const danhMucQuyen = window.HANG_SO ? window.HANG_SO.DANH_MUC_QUYEN : [];

        vungChua.innerHTML = `
            <div class="trang-phan-quyen-rbac">
                <!-- Tiêu đề trang -->
                <div class="thanh-tieu-de-trang">
                    <div>
                        <h2>🛡️ Quản lý Vai trò & Ma trận Phân quyền RBAC</h2>
                        <p class="mo-ta-phu">Thiết lập quyền truy cập chức năng chi tiết cho từng vị trí làm việc và theo dõi lịch sử phân quyền (US-015 -> US-022)</p>
                    </div>
                    <div class="nhom-nut-hanh-dong">
                        <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('quanLyNhanVien')">
                            👥 Danh sách Nhân sự (${this.danhSachNhanVien.length})
                        </button>
                        <button class="nut nut-chinh" onclick="window.phanQuyenModule.moModalThemVaiTro()">
                            ➕ Thêm vai trò mới
                        </button>
                    </div>
                </div>

                <!-- Thẻ danh sách các vai trò (US-015) -->
                <div class="luoi-danh-sach-vai-tro">
                    ${this.danhSachVaiTro.map(vt => {
                        const soNhanVien = this.danhSachNhanVien.filter(nv => nv.vaiTro === vt.ma).length;
                        const soQuyen = (vt.danhSachQuyen || []).length;
                        const laDangChon = vt.ma === this.vaiTroDangChon;

                        const bieuTuong = {
                            'QUAN_LY': '👑',
                            'THU_NGAN': '💵',
                            'BEP': '👨‍🍳',
                            'PHUC_VU': '🏃'
                        }[vt.ma] || '🛡️';

                        return `
                            <div class="the-vai-tro ${laDangChon ? 'the-vai-tro-dang-chon' : ''}" onclick="window.phanQuyenModule.chuyenVaiTro('${vt.ma}')">
                                <div class="dau-the-vai-tro">
                                    <span class="bieu-tuong-vt">${bieuTuong}</span>
                                    <div>
                                        <div class="ten-vt">${window.DinhDang ? window.DinhDang.thoatHtml(vt.ten) : vt.ten}</div>
                                        <div class="ma-vt">Mã: <code>${vt.ma}</code></div>
                                    </div>
                                </div>
                                <div class="mo-ta-vt">${window.DinhDang ? window.DinhDang.thoatHtml(vt.moTa || 'Chưa có mô tả') : (vt.moTa || '---')}</div>
                                <div class="chan-the-vai-tro">
                                    <span class="badge badge-xanh-duong">${soNhanVien} nhân sự</span>
                                    <span class="badge badge-cam">${soQuyen} quyền được cấp</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Chuyển tab giữa Ma trận quyền & Lịch sử phân quyền -->
                <div class="thanh-bo-loc" style="margin-top: 24px; margin-bottom: 20px;">
                    <div class="cac-tab-khu-vuc">
                        <button class="tab-khu-vuc ${this.tabHienThi === 'maTran' ? 'kich-hoat' : ''}" onclick="window.phanQuyenModule.chuyenTabCheDo('maTran')">
                            🔒 Ma trận cấu hình quyền: <strong>${vtHienTai ? vtHienTai.ten : ''}</strong>
                        </button>
                        <button class="tab-khu-vuc ${this.tabHienThi === 'lichSu' ? 'kich-hoat' : ''}" onclick="window.phanQuyenModule.chuyenTabCheDo('lichSu')">
                            📜 Lịch sử thay đổi quyền (${this.lichSuPhanQuyen.length} bản ghi - US-022)
                        </button>
                    </div>

                    ${this.tabHienThi === 'maTran' ? `
                        <div style="display: flex; gap: 8px;">
                            <button class="nut nut-phu nut-nho" onclick="window.phanQuyenModule.chonTatCaQuyen(true)">
                                ✔ Chọn tất cả
                            </button>
                            <button class="nut nut-phu nut-nho" onclick="window.phanQuyenModule.chonTatCaQuyen(false)">
                                ✕ Bỏ chọn tất cả
                            </button>
                            <button class="nut nut-chinh nut-nho" onclick="window.phanQuyenModule.luuMaTranQuyen()">
                                💾 Lưu cấu hình quyền
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Nội dung hiển thị theo tab -->
                ${this.tabHienThi === 'maTran' ? this.renderMaTranQuyen(vtHienTai, danhMucQuyen) : this.renderLichSuPhanQuyen()}
            </div>
        `;
    }

    renderMaTranQuyen(vtHienTai, danhMucQuyen) {
        if (!vtHienTai) return '<div class="khung-trong">Chưa chọn vai trò</div>';
        const danhSachQuyenDaCap = vtHienTai.danhSachQuyen || [];

        return `
            <div class="khung-bang-ma-tran">
                <form id="form-ma-tran-quyen">
                    ${danhMucQuyen.map((nhom, nhomIdx) => {
                        return `
                            <div class="nhom-quyen-hop">
                                <div class="tieu-de-nhom-quyen">
                                    <h4>📁 ${nhomIdx + 1}. ${nhom.nhom}</h4>
                                </div>
                                <div class="luoi-checkbox-quyen">
                                    ${nhom.quyen.map(q => {
                                        const daChon = danhSachQuyenDaCap.includes(q.ma);
                                        return `
                                            <label class="the-item-quyen ${daChon ? 'quyen-da-bat' : ''}">
                                                <input 
                                                    type="checkbox" 
                                                    name="quyenCheckbox" 
                                                    value="${q.ma}" 
                                                    ${daChon ? 'checked' : ''} 
                                                    onchange="this.closest('.the-item-quyen').classList.toggle('quyen-da-bat', this.checked)"
                                                />
                                                <div class="noi-dung-item-quyen">
                                                    <div class="ten-quyen-item">${q.ten}</div>
                                                    <div class="ma-quyen-item"><code>${q.ma}</code></div>
                                                    <div class="mo-ta-quyen-item">${q.moTa}</div>
                                                </div>
                                            </label>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}

                    <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding: 20px; background: #FFF; border-radius: var(--bo-goc); border: 1px solid var(--mau-vien);">
                        <span style="align-self: center; color: var(--mau-chu-phu); font-size: 13px;">
                            Đang cấu hình quyền cho vai trò: <strong>${vtHienTai.ten}</strong>
                        </span>
                        <button type="button" class="nut nut-chinh" onclick="window.phanQuyenModule.luuMaTranQuyen()">
                            💾 Lưu cấu hình ma trận quyền
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    renderLichSuPhanQuyen() {
        return `
            <div class="hop-bang-du-lieu">
                <table class="bang-du-lieu">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">ID</th>
                            <th style="width: 170px;">Thời gian</th>
                            <th>Người thực hiện</th>
                            <th>Vai trò tác động</th>
                            <th>Hành động</th>
                            <th>Nội dung chi tiết thay đổi quyền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.lichSuPhanQuyen.length === 0 ? `
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 40px; color: var(--mau-chu-phu);">
                                    Chưa có bản ghi nhật ký phân quyền nào được lưu trữ.
                                </td>
                            </tr>
                        ` : this.lichSuPhanQuyen.map(item => `
                            <tr>
                                <td style="text-align: center; font-weight: 600; color: var(--mau-chu-phu);">#${item.id}</td>
                                <td style="font-size: 12px; color: var(--mau-chu-phu);">
                                    ${window.DinhDang ? window.DinhDang.ngayGio(item.thoiGian) : item.thoiGian}
                                </td>
                                <td><strong>${window.DinhDang ? window.DinhDang.thoatHtml(item.nguoiThucHien) : item.nguoiThucHien}</strong></td>
                                <td><span class="badge badge-cam">${item.vaiTro}</span></td>
                                <td><span class="badge badge-xanh-duong">${item.hanhDong}</span></td>
                                <td style="font-size: 13px; line-height: 1.5; color: #2C1810;">
                                    ${window.DinhDang ? window.DinhDang.thoatHtml(item.chiTiet) : item.chiTiet}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    chuyenVaiTro(maVaiTro) {
        this.vaiTroDangChon = maVaiTro;
        this.veGiaoDien();
    }

    chuyenTabCheDo(tab) {
        this.tabHienThi = tab;
        this.veGiaoDien();
    }

    chonTatCaQuyen(trangThai) {
        const checkboxes = document.querySelectorAll('input[name="quyenCheckbox"]');
        checkboxes.forEach(cb => {
            cb.checked = trangThai;
            cb.closest('.the-item-quyen').classList.toggle('quyen-da-bat', trangThai);
        });
    }

    /**
     * Lưu ma trận quyền cho vai trò đang chọn (US-018 & US-022)
     */
    async luuMaTranQuyen() {
        const checkboxes = document.querySelectorAll('input[name="quyenCheckbox"]:checked');
        const dsQuyenDuocChon = Array.from(checkboxes).map(cb => cb.value);

        const user = window.api ? window.api.layThongTinNguoiDung() : null;
        const nguoiThucHien = user ? `${user.hoTen} (${user.vaiTro})` : 'Phong (Quản Lý)';

        const kq = await window.api.capNhatQuyenVaiTro(this.vaiTroDangChon, dsQuyenDuocChon, nguoiThucHien);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Phân quyền thành công', kq.msg);
            await this.taiDuLieu();
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Thất bại', kq ? kq.msg : 'Có lỗi xảy ra.');
        }
    }

    /**
     * Thêm vai trò mới (US-016)
     */
    moModalThemVaiTro() {
        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        khungModal.innerHTML = `
            <div class="hop-modal" style="max-width: 480px;">
                <div class="dau-modal">
                    <h3>➕ Thêm vai trò làm việc mới (US-016)</h3>
                    <button class="nut-dong-modal" onclick="window.phanQuyenModule.dongModal()">✕</button>
                </div>
                <form id="form-them-vai-tro" onsubmit="window.phanQuyenModule.xuLyThemVaiTro(event)">
                    <div class="than-modal">
                        <div class="nhom-nhap-lieu">
                            <label>Mã vai trò (VIẾT HOA KHÔNG DẤU) <span class="bat-buoc">*</span></label>
                            <input type="text" id="them-vt-ma" placeholder="Ví dụ: QUAN_KHO hoặc KE_TOAN" required pattern="[A-Z0-9_]{3,20}" title="Từ 3-20 ký tự, in hoa, không dấu" />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Tên vai trò hiển thị <span class="bat-buoc">*</span></label>
                            <input type="text" id="them-vt-ten" placeholder="Ví dụ: Quản lý Kho hoặc Kế toán nội bộ" required />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Mô tả nhiệm vụ vai trò</label>
                            <textarea id="them-vt-mo-ta" rows="3" placeholder="Mô tả phạm vi trách nhiệm và công việc..."></textarea>
                        </div>
                    </div>
                    <div class="duoi-modal">
                        <button type="button" class="nut nut-phu" onclick="window.phanQuyenModule.dongModal()">Hủy</button>
                        <button type="submit" class="nut nut-chinh">💾 Lưu vai trò</button>
                    </div>
                </form>
            </div>
        `;
        khungModal.classList.add('mo');
    }

    async xuLyThemVaiTro(e) {
        e.preventDefault();
        const ma = document.getElementById('them-vt-ma').value.trim().toUpperCase();
        const ten = document.getElementById('them-vt-ten').value.trim();
        const moTa = document.getElementById('them-vt-mo-ta').value.trim();

        const kq = await window.api.themVaiTro({ ma, ten, moTa, danhSachQuyen: [] });
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Tạo vai trò thành công', kq.msg);
            this.dongModal();
            this.vaiTroDangChon = ma;
            await this.taiDuLieu();
            this.veGiaoDien();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Thất bại', kq ? kq.msg : 'Có lỗi khi tạo vai trò.');
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
window.phanQuyenModule = new PhanQuyenModule();
