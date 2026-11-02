/**
 * PHÂN HỆ QUẢN LÝ CA LÀM VIỆC & KẾT CA THU NGÂN (caLamViec.js)
 * Phụ trách: Phong (Sprint 4 Lead - US-117 -> US-122)
 * 
 * Đáp ứng đầy đủ các User Story của Sprint 4:
 * - US-117: Thiết lập danh sách ca làm việc trong ngày (Ca sáng, Ca tối, Ca đêm).
 * - US-118: Thu ngân thực hiện mở ca làm việc và nhập số tiền mặt đầu ca trong két.
 * - US-119: Ghi nhận các khoản thu/chi tiền mặt phát sinh trong ca làm việc.
 * - US-120: Tổng hợp doanh thu tiền mặt và chuyển khoản phát sinh trong ca hiện tại.
 * - US-121: Thu ngân thực hiện đóng ca, nhập tiền kiểm đếm thực tế và đối soát chênh lệch.
 * - US-122: Quản lý xem lịch sử bàn giao ca và biên bản kết ca của thu ngân.
 */

class CaLamViecModule {
    constructor() {
        this.tabHienTai = 'CA_HIEN_TAI'; // 'CA_HIEN_TAI' | 'LICH_SU' | 'CAU_HINH'
        this.caHienTai = null;
        this.tongKetCa = null;
        this.danhSachCa = [];
        this.lichSuKetCa = [];
        this.menhGiaTien = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];
        this.demTienMat = {};
    }

    /**
     * Khởi tạo giao diện ca làm việc
     */
    async khoiTao() {
        await this.taiDuLieu();
        this.render();
    }

    async taiDuLieu() {
        if (!window.api) return;
        this.caHienTai = await window.api.layCaHienTai();
        this.danhSachCa = await window.api.layDanhSachCaLamViec();
        this.lichSuKetCa = await window.api.layLichSuKetCa();
        if (this.caHienTai) {
            this.tongKetCa = await window.api.tinhTongKetCa(this.caHienTai.id);
        } else {
            this.tongKetCa = null;
        }
    }

    async taiLaiVaRender() {
        await this.taiDuLieu();
        this.render();
    }

    chuyenTab(tab) {
        this.tabHienTai = tab;
        this.render();
    }

    render() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        vungChua.innerHTML = `
            <div class="trang-ca-lam-viec">
                <!-- THANH TIÊU ĐỀ PHÂN HỆ -->
                <div class="dau-trang-s4">
                    <div class="tieu-de-khu-vuc-s4">
                        <div class="bieu-tuong-s4">⏱️</div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h2>QUẢN LÝ CA LÀM VIỆC & KẾT CA THU NGÂN</h2>
                                <span class="badge badge-cam">Sprint 4 • Phong</span>
                            </div>
                            <p class="mo-ta-s4">
                                Quản lý ca trực, kiểm đếm tiền mặt đầu/cuối ca, ghi nhận thu chi phát sinh và đối soát chênh lệch két (US-117 ➔ US-122)
                            </p>
                        </div>
                    </div>

                    <div class="thao-tac-dau-trang-s4">
                        ${this.caHienTai ? `
                            <button type="button" class="nut nut-phu" onclick="window.caLamViecModule.moModalThuChi()">
                                💸 Phiếu thu/chi tiền mặt (US-119)
                            </button>
                            <button type="button" class="nut nut-nguy-hiem" onclick="window.caLamViecModule.moModalDongCa()">
                                🔒 Đóng ca & Đối soát (US-121)
                            </button>
                        ` : `
                            <button type="button" class="nut nut-chinh" onclick="window.caLamViecModule.moModalMoCa()">
                                🔑 Mở ca làm việc mới (US-118)
                            </button>
                        `}
                    </div>
                </div>

                <!-- THANH CHUYỂN TAB CHỨC NĂNG -->
                <div class="thanh-chuyen-tab-s4">
                    <button type="button" class="tab-btn-s4 ${this.tabHienTai === 'CA_HIEN_TAI' ? 'kich-hoat' : ''}" onclick="window.caLamViecModule.chuyenTab('CA_HIEN_TAI')">
                        📋 Ca Hiện Tại & Quỹ Tiền Mặt
                    </button>
                    <button type="button" class="tab-btn-s4 ${this.tabHienTai === 'LICH_SU' ? 'kich-hoat' : ''}" onclick="window.caLamViecModule.chuyenTab('LICH_SU')">
                        📜 Lịch Sử Biên Bản Kết Ca (${this.lichSuKetCa.length})
                    </button>
                    <button type="button" class="tab-btn-s4 ${this.tabHienTai === 'CAU_HINH' ? 'kich-hoat' : ''}" onclick="window.caLamViecModule.chuyenTab('CAU_HINH')">
                        ⚙️ Cấu Hình Ca Trong Ngày (${this.danhSachCa.length})
                    </button>
                </div>

                <!-- NỘI DUNG TỪNG TAB -->
                <div class="vung-noi-dung-tab-s4">
                    ${this.tabHienTai === 'CA_HIEN_TAI' ? this.veTabCaHienTai() : ''}
                    ${this.tabHienTai === 'LICH_SU' ? this.veTabLichSu() : ''}
                    ${this.tabHienTai === 'CAU_HINH' ? this.veTabCauHinh() : ''}
                </div>
            </div>
        `;
    }

    /**
     * TAB 1: CA HIỆN TẠI & BẢNG ĐỐI SOÁT QUỸ
     */
    veTabCaHienTai() {
        if (!this.caHienTai) {
            return `
                <div class="khung-trong">
                    <div style="font-size: 54px; margin-bottom: 12px;">🚪</div>
                    <h3>Hiện Chưa Có Ca Làm Việc Nào Đang Mở</h3>
                    <p style="color: var(--mau-chu-phu); max-width: 480px; margin: 8px auto 20px; line-height: 1.6;">
                        Thu ngân bắt đầu phiên làm việc cần bấm "Mở ca làm việc mới", kiểm đếm tiền lẻ thối ban đầu và nhập vào két để phục vụ đối soát lệch quỹ cuối ca.
                    </p>
                    <button type="button" class="nut nut-chinh" onclick="window.caLamViecModule.moModalMoCa()">
                        🔑 Bắt đầu Mở ca làm việc (US-118)
                    </button>
                </div>
            `;
        }

        const ca = this.caHienTai;
        const tk = this.tongKetCa || {
            tienDauCa: ca.tienDauCa,
            tongDoanhThu: 0,
            doanhThuTienMat: 0,
            doanhThuChuyenKhoan: 0,
            tongThuPhatSinh: 0,
            tongChiPhatSinh: 0,
            tienMatLyThuyet: ca.tienDauCa,
            soHoaDon: 0,
            dsPhieu: []
        };

        return `
            <!-- THÔNG TIN TỔNG QUAN CA HIỆN TẠI -->
            <div class="the-thong-tin-ca-hien-tai">
                <div class="dong-dau-the-ca">
                    <div class="thong-tin-ca-ten">
                        <span class="badge-trang-thai-ca-mo">● ĐANG HOẠT ĐỘNG</span>
                        <h3>${ca.tenCa}</h3>
                        <span class="ma-ca-txt">Mã: <strong>${ca.maCa}</strong> • Thu ngân: <strong>${ca.thuNganTen}</strong></span>
                    </div>
                    <div class="thoi-gian-mo-ca">
                        <span>🕒 Bắt đầu ca: <strong>${ca.thoiGianMo}</strong></span>
                    </div>
                </div>

                <!-- 4 CHỈ SỐ QUỸ TIỀN & DOANH THU CA (US-120) -->
                <div class="luoi-chi-so-ca">
                    <div class="the-cs-ca">
                        <span class="cs-nhan">Tiền mặt đầu ca (US-118)</span>
                        <h4 class="cs-gia-tri gia-tri-vang">${Number(ca.tienDauCa || 0).toLocaleString('vi-VN')} đ</h4>
                        <small class="cs-ghi-chu">Tiền lẻ thối có sẵn trong két</small>
                    </div>

                    <div class="the-cs-ca">
                        <span class="cs-nhan">Doanh thu bán hàng (Ca)</span>
                        <h4 class="cs-gia-tri gia-tri-xanh">${Number(tk.tongDoanhThu || 0).toLocaleString('vi-VN')} đ</h4>
                        <small class="cs-ghi-chu">${tk.soHoaDon} đơn (TM: ${Number(tk.doanhThuTienMat).toLocaleString('vi-VN')}đ | CK: ${Number(tk.doanhThuChuyenKhoan).toLocaleString('vi-VN')}đ)</small>
                    </div>

                    <div class="the-cs-ca">
                        <span class="cs-nhan">Thu/Chi phát sinh (US-119)</span>
                        <h4 class="cs-gia-tri ${tk.tongThuPhatSinh >= tk.tongChiPhatSinh ? 'gia-tri-xanh' : 'gia-tri-do'}">
                            +${Number(tk.tongThuPhatSinh).toLocaleString('vi-VN')} / -${Number(tk.tongChiPhatSinh).toLocaleString('vi-VN')} đ
                        </h4>
                        <small class="cs-ghi-chu">${(tk.dsPhieu || []).length} phiếu phát sinh trong ca</small>
                    </div>

                    <div class="the-cs-ca the-cs-noi-bat">
                        <span class="cs-nhan">Tiền mặt lý thuyết trong két (US-120)</span>
                        <h4 class="cs-gia-tri gia-tri-chinh">${Number(tk.tienMatLyThuyet || 0).toLocaleString('vi-VN')} đ</h4>
                        <small class="cs-ghi-chu">Đầu ca + Thu TM + Thu ngoài - Chi ngoài</small>
                    </div>
                </div>
            </div>

            <!-- BẢNG DANH SÁCH PHIẾU THU / CHI PHÁT SINH (US-119) -->
            <div class="khung-danh-sach-thu-chi-ca">
                <div class="dau-khung-thu-chi">
                    <h4>💸 Danh sách phiếu thu/chi tiền mặt phát sinh trong ca (${(tk.dsPhieu || []).length})</h4>
                    <button type="button" class="nut nut-phu nut-nho" onclick="window.caLamViecModule.moModalThuChi()">
                        ➕ Thêm phiếu thu/chi mới
                    </button>
                </div>

                ${(!tk.dsPhieu || tk.dsPhieu.length === 0) ? `
                    <div style="text-align: center; padding: 24px; color: var(--mau-chu-phu); background: #FAF9F6; border-radius: 8px;">
                        Chưa phát sinh khoản thu/chi tiền mặt nào trong ca này.
                    </div>
                ` : `
                    <div class="bang-du-lieu-bap-wrapper">
                        <table class="bang-du-lieu-chuan">
                            <thead>
                                <tr>
                                    <th>Mã phiếu</th>
                                    <th>Thời gian</th>
                                    <th>Loại phiếu</th>
                                    <th>Số tiền</th>
                                    <th>Lý do chi tiết</th>
                                    <th>Người thực hiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tk.dsPhieu.map(p => `
                                    <tr>
                                        <td><strong>${p.maPhieu}</strong></td>
                                        <td>${p.thoiGian}</td>
                                        <td>
                                            <span class="badge ${p.loai === 'THU' ? 'badge-xanh-la' : 'badge-do'}">
                                                ${p.loai === 'THU' ? '📥 PHIẾU THU' : '📤 PHIẾU CHI'}
                                            </span>
                                        </td>
                                        <td>
                                            <strong style="color: ${p.loai === 'THU' ? '#16A34A' : '#DC2626'};">
                                                ${p.loai === 'THU' ? '+' : '-'}${Number(p.soTien || 0).toLocaleString('vi-VN')} đ
                                            </strong>
                                        </td>
                                        <td>${p.lyDo}</td>
                                        <td>${p.nguoiThucHien}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    }

    /**
     * TAB 2: LỊCH SỬ BIÊN BẢN KẾT CA (US-122)
     */
    veTabLichSu() {
        if (!this.lichSuKetCa || this.lichSuKetCa.length === 0) {
            return `
                <div class="khung-trong">
                    <div style="font-size: 48px; margin-bottom: 12px;">📑</div>
                    <h3>Chưa có biên bản kết ca nào được lưu</h3>
                    <p style="color: var(--mau-chu-phu); max-width: 440px; margin: 8px auto 16px;">
                        Các biên bản đối soát (Z-Reports) sau khi thu ngân đóng ca sẽ tự động lưu trữ tại đây để quản lý kiểm tra.
                    </p>
                </div>
            `;
        }

        return `
            <div class="khung-lich-su-ket-ca">
                <div class="bang-du-lieu-bap-wrapper">
                    <table class="bang-du-lieu-chuan">
                        <thead>
                            <tr>
                                <th>Mã biên bản</th>
                                <th>Ca làm việc</th>
                                <th>Ngày</th>
                                <th>Thu ngân đóng ca</th>
                                <th>Tổng doanh thu</th>
                                <th>Tiền mặt trong két</th>
                                <th>Chênh lệch quỹ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.lichSuKetCa.map(bb => {
                                const chenhLech = Number(bb.chenhLech || 0);
                                let badgeCls = 'badge-xanh-la';
                                let textCls = 'Khớp chuẩn 100%';
                                if (chenhLech > 0) {
                                    badgeCls = 'badge-vang';
                                    textCls = `Thừa +${chenhLech.toLocaleString('vi-VN')}đ`;
                                } else if (chenhLech < 0) {
                                    badgeCls = 'badge-do';
                                    textCls = `Thiếu ${chenhLech.toLocaleString('vi-VN')}đ`;
                                }

                                return `
                                    <tr>
                                        <td><strong>${bb.maBienBan}</strong></td>
                                        <td>${bb.tenCa}</td>
                                        <td>${bb.ngay}</td>
                                        <td>${bb.thuNganDong}</td>
                                        <td><strong>${Number(bb.tongDoanhThu || 0).toLocaleString('vi-VN')} đ</strong></td>
                                        <td>${Number(bb.tienMatThucTe || 0).toLocaleString('vi-VN')} đ</td>
                                        <td>
                                            <span style="font-weight: 600; color: ${chenhLech === 0 ? '#16A34A' : (chenhLech > 0 ? '#D97706' : '#DC2626')};">
                                                ${chenhLech === 0 ? '0 đ' : (chenhLech > 0 ? '+' : '') + chenhLech.toLocaleString('vi-VN') + ' đ'}
                                            </span>
                                        </td>
                                        <td><span class="badge ${badgeCls}">${textCls}</span></td>
                                        <td>
                                            <button type="button" class="nut nut-phu nut-nho" onclick="window.caLamViecModule.xemChiTietBienBan('${bb.maBienBan}')">
                                                👁️ Xem chi tiết
                                            </button>
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

    /**
     * TAB 3: CẤU HÌNH DANH SÁCH CA (US-117)
     */
    veTabCauHinh() {
        return `
            <div class="khung-cau-hinh-ca">
                <div style="margin-bottom: 16px;">
                    <h4>⚙️ Danh sách ca làm việc chuẩn của nhà hàng (US-117)</h4>
                    <p style="color: var(--mau-chu-phu); font-size: 13px;">Thiết lập khung giờ phân ca phục vụ điểm tâm, bữa trưa và bữa tối.</p>
                </div>

                <div class="luoi-the-ca-chuan">
                    ${this.danhSachCa.map(ca => `
                        <div class="the-ca-chuan-item">
                            <div class="dau-the-ca-item">
                                <span class="icon-ca">⏰</span>
                                <div>
                                    <h5>${ca.tenCa}</h5>
                                    <span class="gio-ca-badge">${ca.gioBatDau} ➔ ${ca.gioKetThuc}</span>
                                </div>
                            </div>
                            <p class="mo-ta-ca-item">${ca.moTa}</p>
                            <div class="chan-the-ca-item">
                                <span class="badge badge-xanh-la">Đang áp dụng</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // =========================================================================
    // CÁC MODAL THAO TÁC (US-118, US-119, US-121, US-122)
    // =========================================================================

    /**
     * US-118: Modal mở ca làm việc
     */
    moModalMoCa() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        const user = window.api ? window.api.layThongTinNguoiDung() : null;
        const tenThuNgan = user ? user.hoTen : 'Trần Thị Thu Ngân';

        modal.innerHTML = `
            <div class="hop-thoai-modal" style="max-width: 520px;">
                <div class="dau-modal">
                    <h3>🔑 Mở Ca Làm Việc Mới (US-118)</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.caLamViecModule.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <p style="font-size: 13px; color: var(--mau-chu-phu); margin-bottom: 16px;">
                        Thu ngân kiểm tra két tiền mặt, đếm đủ số tiền lẻ ban đầu và bắt đầu phiên nhận ca.
                    </p>

                    <div class="nhom-form">
                        <label class="nhan-form">Chọn ca làm việc *</label>
                        <select id="chon-ca-mo" class="nhap-du-lieu">
                            ${this.danhSachCa.map(c => `
                                <option value="${c.id}">${c.tenCa}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="nhom-form">
                        <label class="nhan-form">Thu ngân trực ca *</label>
                        <input type="text" id="ten-thu-ngan-mo" class="nhap-du-lieu" value="${tenThuNgan}" readonly style="background: #F3F4F6;">
                    </div>

                    <div class="nhom-form">
                        <label class="nhan-form">Tiền mặt đầu ca trong két (VNĐ) *</label>
                        <input type="number" id="tien-dau-ca-nhap" class="nhap-du-lieu" value="1500000" step="50000" min="0" placeholder="1500000">
                        <small style="color: var(--mau-chu-phu); font-size: 11px;">Mặc định chuẩn bị 1.500.000đ tiền lẻ để thối cho khách đầu ca</small>
                    </div>

                    <div class="nhom-form">
                        <label class="nhan-form">Ghi chú khi nhận ca:</label>
                        <textarea id="ghi-chu-mo-ca" class="nhap-du-lieu" rows="2" placeholder="Tình trạng bàn giao bàn ghế, két tiền..."></textarea>
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.caLamViecModule.dongModal()">Hủy</button>
                    <button type="button" class="nut nut-chinh" onclick="window.caLamViecModule.xacNhanMoCa()">
                        🚀 Xác nhận mở ca
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    async xacNhanMoCa() {
        const selectCa = document.getElementById('chon-ca-mo');
        const caId = selectCa ? selectCa.value : 1;
        const timCa = this.danhSachCa.find(c => Number(c.id) === Number(caId));
        const tenCa = timCa ? timCa.tenCa : 'Ca Sáng';
        const thuNganTen = document.getElementById('ten-thu-ngan-mo')?.value || 'Thu ngân';
        const tienDauCa = Number(document.getElementById('tien-dau-ca-nhap')?.value || 0);
        const ghiChuMo = document.getElementById('ghi-chu-mo-ca')?.value || '';

        const kq = await window.api.moCaLamViec({
            caId,
            tenCa,
            thuNganTen,
            tienDauCa,
            ghiChuMo
        });

        this.dongModal();
        if (kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Mở ca thành công', kq.msg);
            await this.taiLaiVaRender();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Không thể mở ca', kq.msg);
        }
    }

    /**
     * US-119: Modal tạo phiếu thu / chi tiền mặt phát sinh
     */
    moModalThuChi() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-thoai-modal" style="max-width: 500px;">
                <div class="dau-modal">
                    <h3>💸 Lập Phiếu Thu / Chi Tiền Mặt (US-119)</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.caLamViecModule.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <div class="nhom-form">
                        <label class="nhan-form">Loại phiếu *</label>
                        <div style="display: flex; gap: 16px; margin-top: 6px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <input type="radio" name="loai-phieu-tc" value="CHI" checked>
                                <span style="font-weight: 600; color: #DC2626;">📤 Phiếu Chi (Tiền ra khỏi két)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <input type="radio" name="loai-phieu-tc" value="THU">
                                <span style="font-weight: 600; color: #16A34A;">📥 Phiếu Thu (Tiền vào két)</span>
                            </label>
                        </div>
                    </div>

                    <div class="nhom-form">
                        <label class="nhan-form">Số tiền (VNĐ) *</label>
                        <input type="number" id="so-tien-thu-chi" class="nhap-du-lieu" step="10000" min="1000" placeholder="Ví dụ: 80000">
                    </div>

                    <div class="nhom-form">
                        <label class="nhan-form">Lý do nhanh:</label>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                            <button type="button" class="chip-gia" onclick="document.getElementById('ly-do-thu-chi').value = 'Mua thêm 2 bao đá lạnh khẩn cấp'">🧊 Mua đá lạnh</button>
                            <button type="button" class="chip-gia" onclick="document.getElementById('ly-do-thu-chi').value = 'Mua gia vị gấp (ớt, chanh, tỏi)'">🌶️ Mua gia vị gấp</button>
                            <button type="button" class="chip-gia" onclick="document.getElementById('ly-do-thu-chi').value = 'Nạp thêm tiền lẻ thối 20k, 50k'">💵 Nạp thêm tiền lẻ</button>
                            <button type="button" class="chip-gia" onclick="document.getElementById('ly-do-thu-chi').value = 'Chi tiếp khách / trà nước ngoài'">🍵 Trà nước ngoài</button>
                        </div>
                        <input type="text" id="ly-do-thu-chi" class="nhap-du-lieu" placeholder="Nhập chi tiết lý do thu/chi...">
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.caLamViecModule.dongModal()">Hủy</button>
                    <button type="button" class="nut nut-chinh" onclick="window.caLamViecModule.xacNhanThuChi()">
                        💾 Lưu phiếu thu/chi
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    async xacNhanThuChi() {
        const loai = document.querySelector('input[name="loai-phieu-tc"]:checked')?.value || 'CHI';
        const soTien = Number(document.getElementById('so-tien-thu-chi')?.value || 0);
        const lyDo = document.getElementById('ly-do-thu-chi')?.value.trim();

        if (soTien <= 0 || !lyDo) {
            alert('Vui lòng nhập số tiền hợp lệ và lý do thu/chi!');
            return;
        }

        const user = window.api ? window.api.layThongTinNguoiDung() : null;
        const nguoiThucHien = user ? user.hoTen : 'Thu ngân';

        const kq = await window.api.taoPhieuThuChi({
            loai,
            soTien,
            lyDo,
            nguoiThucHien,
            caId: this.caHienTai ? this.caHienTai.id : null
        });

        this.dongModal();
        if (kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Đã lập phiếu thu/chi', kq.msg);
            await this.taiLaiVaRender();
        }
    }

    /**
     * US-121: Modal Đóng ca & Kiểm đếm tiền thực tế
     */
    async moModalDongCa() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal || !this.caHienTai) return;

        const tk = await window.api.tinhTongKetCa(this.caHienTai.id);
        this.tongKetCa = tk;
        this.demTienMat = {};

        modal.innerHTML = `
            <div class="hop-thoai-modal hop-thoai-dong-ca" style="max-width: 620px;">
                <div class="dau-modal">
                    <h3>🔒 Đóng Ca & Đối Soát Quỹ Tiền Mặt (US-121)</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.caLamViecModule.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <!-- KHUNG ĐỐI SOÁT LÝ THUYẾT -->
                    <div class="khung-tong-hop-dong-ca">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>Đầu ca: <strong>${Number(tk.tienDauCa).toLocaleString('vi-VN')}đ</strong></span>
                            <span>Thu bán hàng (TM): <strong>+${Number(tk.doanhThuTienMat).toLocaleString('vi-VN')}đ</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Thu ngoài: <strong>+${Number(tk.tongThuPhatSinh).toLocaleString('vi-VN')}đ</strong></span>
                            <span>Chi ngoài: <strong style="color:#DC2626;">-${Number(tk.tongChiPhatSinh).toLocaleString('vi-VN')}đ</strong></span>
                        </div>
                        <div style="border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 8px; display: flex; justify-content: space-between; font-size: 15px;">
                            <span>💰 Tiền mặt lý thuyết trong két:</span>
                            <strong id="so-tien-ly-thuyet-val">${Number(tk.tienMatLyThuyet).toLocaleString('vi-VN')} đ</strong>
                        </div>
                    </div>

                    <!-- BẢNG KIỂM ĐẾM MỆNH GIÁ NHANH -->
                    <div style="margin-top: 14px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                            <label class="nhan-form" style="margin:0;">Bảng đếm tiền mặt theo tờ (Tùy chọn):</label>
                            <small style="color:var(--mau-chu-phu);">Hoặc nhập thẳng tổng tiền vào ô dưới</small>
                        </div>
                        <div class="luoi-menh-gia-tien">
                            ${this.menhGiaTien.slice(0, 6).map(mg => `
                                <div class="item-menh-gia">
                                    <span>${(mg/1000).toLocaleString('vi-VN')}k:</span>
                                    <input type="number" min="0" placeholder="0 tờ" class="nhap-to-tien" data-mg="${mg}" oninput="window.caLamViecModule.tinhTongTienDem()">
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="nhom-form" style="margin-top: 14px;">
                        <label class="nhan-form">Tiền mặt kiểm đếm thực tế (VNĐ) *</label>
                        <input type="number" id="tien-mat-thuc-te-input" class="nhap-du-lieu" value="${tk.tienMatLyThuyet}" oninput="window.caLamViecModule.tinhChenhLechTrucTiep()">
                    </div>

                    <!-- BÁO CÁO CHÊNH LỆCH -->
                    <div id="khung-bao-chenh-lech" class="khung-bao-chenh-lech khop">
                        <span>Chênh lệch: <strong id="so-chenh-lech-txt">0 đ</strong> (<span id="trang-thai-chenh-lech-txt">Khớp chuẩn 100%</span>)</span>
                    </div>

                    <div class="nhom-form" style="margin-top: 12px;">
                        <label class="nhan-form">Ghi chú kết ca / Giải trình lệch quỹ (nếu có):</label>
                        <input type="text" id="ghi-chu-ket-ca" class="nhap-du-lieu" placeholder="Ví dụ: Khớp két 100%, đã nộp tiền mặt cho quản lý">
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.caLamViecModule.dongModal()">Hủy</button>
                    <button type="button" class="nut nut-nguy-hiem" onclick="window.caLamViecModule.xacNhanDongCa()">
                        🔒 Lập biên bản & Đóng ca
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
        this.tinhChenhLechTrucTiep();
    }

    tinhTongTienDem() {
        let tong = 0;
        document.querySelectorAll('.nhap-to-tien[data-mg]').forEach(input => {
            const mg = Number(input.getAttribute('data-mg'));
            const soTo = Number(input.value || 0);
            tong += (mg * soTo);
        });

        if (tong > 0) {
            const inputThucTe = document.getElementById('tien-mat-thuc-te-input');
            if (inputThucTe) {
                inputThucTe.value = tong;
                this.tinhChenhLechTrucTiep();
            }
        }
    }

    tinhChenhLechTrucTiep() {
        const inputThucTe = document.getElementById('tien-mat-thuc-te-input');
        const lyThuyet = this.tongKetCa ? this.tongKetCa.tienMatLyThuyet : 0;
        const thucTe = inputThucTe ? Number(inputThucTe.value || 0) : lyThuyet;
        const diff = thucTe - lyThuyet;

        const box = document.getElementById('khung-bao-chenh-lech');
        const txtVal = document.getElementById('so-chenh-lech-txt');
        const txtStatus = document.getElementById('trang-thai-chenh-lech-txt');

        if (!box || !txtVal || !txtStatus) return;

        if (diff === 0) {
            box.className = 'khung-bao-chenh-lech khop';
            txtVal.textContent = '0 đ';
            txtStatus.textContent = 'Khớp chuẩn 100% ✅';
        } else if (diff > 0) {
            box.className = 'khung-bao-chenh-lech thua';
            txtVal.textContent = `+${diff.toLocaleString('vi-VN')} đ`;
            txtStatus.textContent = 'Thừa quỹ ⚠️';
        } else {
            box.className = 'khung-bao-chenh-lech thieu';
            txtVal.textContent = `${diff.toLocaleString('vi-VN')} đ`;
            txtStatus.textContent = 'Thâm hụt / Lệch quỹ ❌';
        }
    }

    async xacNhanDongCa() {
        const inputThucTe = document.getElementById('tien-mat-thuc-te-input');
        const tienMatThucTe = Number(inputThucTe?.value || 0);
        const ghiChu = document.getElementById('ghi-chu-ket-ca')?.value.trim() || '';

        const user = window.api ? window.api.layThongTinNguoiDung() : null;
        const thuNganDongTen = user ? user.hoTen : 'Thu ngân';

        const kq = await window.api.dongCaLamViec({
            tienMatThucTe,
            ghiChu,
            thuNganDongTen
        });

        this.dongModal();
        if (kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Kết ca thành công (US-121)', kq.msg);
            this.tabHienTai = 'LICH_SU';
            await this.taiLaiVaRender();
        } else {
            if (window.thongBao) window.thongBao.thatBai('Lỗi', kq.msg);
        }
    }

    /**
     * US-122: Xem chi tiết biên bản kết ca
     */
    xemChiTietBienBan(maBienBan) {
        const bb = (this.lichSuKetCa || []).find(b => b.maBienBan === maBienBan);
        if (!bb) return;

        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        const chenhLech = Number(bb.chenhLech || 0);

        modal.innerHTML = `
            <div class="hop-thoai-modal hop-thoai-phieu-in" style="max-width: 480px;">
                <div class="dau-modal">
                    <h3>📑 BIÊN BẢN KẾT CA (Z-REPORT)</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.caLamViecModule.dongModal()">✕</button>
                </div>
                <div class="than-modal noi-dung-in-bill" style="font-family: monospace; font-size: 13px; line-height: 1.5;">
                    <div style="text-align: center; border-bottom: 1px dashed #CCC; padding-bottom: 8px; margin-bottom: 10px;">
                        <h4 style="font-size: 16px; margin: 0;">NHÀ HÀNG QUÁN MỘC</h4>
                        <p style="margin: 2px 0;">BIÊN BẢN BÀN GIAO & KẾT CA THU NGÂN</p>
                        <small>Mã: <strong>${bb.maBienBan}</strong> • Ngày: ${bb.ngay}</small>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <div>Ca làm việc: <strong>${bb.tenCa}</strong></div>
                        <div>Thu ngân mở ca: ${bb.thuNganMo} (${bb.thoiGianMo.substring(11, 16)})</div>
                        <div>Thu ngân kết ca: ${bb.thuNganDong} (${bb.thoiGianDong.substring(11, 16)})</div>
                        <div>Số hóa đơn hoàn tất: <strong>${bb.soHoaDon} đơn</strong></div>
                    </div>

                    <div style="border-top: 1px dashed #CCC; border-bottom: 1px dashed #CCC; padding: 8px 0; margin-bottom: 10px;">
                        <div style="display:flex; justify-content:space-between;">
                            <span>1. Tiền mặt đầu ca:</span>
                            <strong>${Number(bb.tienDauCa || 0).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>2. Doanh thu Tiền mặt:</span>
                            <strong>${Number(bb.doanhThuTienMat || 0).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>3. Doanh thu Chuyển khoản:</span>
                            <strong>${Number(bb.doanhThuChuyenKhoan || 0).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; color: #16A34A;">
                            <span>4. Tổng thu phát sinh:</span>
                            <span>+${Number(bb.tongThuPhatSinh || 0).toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; color: #DC2626;">
                            <span>5. Tổng chi phát sinh:</span>
                            <span>-${Number(bb.tongChiPhatSinh || 0).toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <div style="display:flex; justify-content:space-between; font-size: 14px;">
                            <span>TỔNG DOANH THU CA:</span>
                            <strong style="color: #B85D19;">${Number(bb.tongDoanhThu || 0).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-top: 4px;">
                            <span>Tiền mặt lý thuyết két:</span>
                            <strong>${Number(bb.tienMatLyThuyet || 0).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Tiền mặt thực tế đếm:</span>
                            <strong>${Number(bb.tienMatThucTe || 0).toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size: 14px; margin-top: 4px; color: ${chenhLech === 0 ? '#16A34A' : '#DC2626'};">
                            <span>CHÊNH LỆCH ĐỐI SOÁT:</span>
                            <strong>${chenhLech === 0 ? '0 đ (KHỚP CHUẨN)' : (chenhLech > 0 ? '+' : '') + chenhLech.toLocaleString('vi-VN') + ' đ'}</strong>
                        </div>
                    </div>

                    ${bb.ghiChu ? `
                        <div style="background: #F9FAFB; padding: 6px; border-radius: 4px; font-size: 11px; margin-top: 8px;">
                            📝 <strong>Ghi chú:</strong> ${bb.ghiChu}
                        </div>
                    ` : ''}

                    <div style="display:flex; justify-content:space-around; text-align:center; margin-top: 24px; padding-top: 8px; border-top: 1px dashed #CCC;">
                        <div>
                            <strong>Thu ngân bàn giao</strong><br>
                            <small>(Ký ghi rõ họ tên)</small><br><br>
                            <span>${bb.thuNganDong}</span>
                        </div>
                        <div>
                            <strong>Quản lý tiếp nhận</strong><br>
                            <small>(Ký ghi rõ họ tên)</small><br><br>
                            <span>Phong (Quản lý)</span>
                        </div>
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.print()">🖨️ In biên bản</button>
                    <button type="button" class="nut nut-chinh" onclick="window.caLamViecModule.dongModal()">Đóng</button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    dongModal() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (modal) {
            modal.classList.remove('mo');
            modal.innerHTML = '';
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.caLamViecModule = new CaLamViecModule();
