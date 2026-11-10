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
                            </div>
                            <p class="mo-ta-s4">
                                Quản lý ca trực, kiểm đếm tiền mặt đầu/cuối ca, ghi nhận thu chi phát sinh và đối soát chênh lệch két (US-117 ➔ US-122)
                            </p>
                        </div>
                    </div>

                    <div class="thao-tac-dau-trang-s4">
                        <button type="button" class="nut nut-phu" style="color: #dc2626; border-color: #dc2626; font-weight: 600;" onclick="window.tienIchTest.resetCaLamViec()" title="Reset toàn bộ ca làm việc và lịch sử ca test">
                            🧹 Reset ca test
                        </button>
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
            dsPhieu: [],
            tongTienChuaThu: 0,
            dsBanChuaThu: []
        };

        const coBanChuaThu = (tk.dsBanChuaThu && tk.dsBanChuaThu.length > 0);

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
                        <span>🕒 Bắt đầu ca: <strong>${window.DinhDang ? window.DinhDang.dinhDangGioVN(ca.thoiDiemMo || ca.thoiGianMoIso || ca.thoiGianMo) : ca.thoiGianMo}</strong></span>
                    </div>
                </div>

                <!-- 5 CHỈ SỐ QUỸ TIỀN & DOANH THU CA (US-120) -->
                <div class="luoi-chi-so-ca" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div class="the-cs-ca">
                        <span class="cs-nhan">Tiền mặt đầu ca (US-118)</span>
                        <h4 class="cs-gia-tri gia-tri-vang">${Number(ca.tienDauCa || 0).toLocaleString('vi-VN')} đ</h4>
                        <small class="cs-ghi-chu">Tiền lẻ thối có sẵn trong két</small>
                    </div>

                    <div class="the-cs-ca">
                        <span class="cs-nhan">Doanh thu bán hàng (Đã thu)</span>
                        <h4 class="cs-gia-tri gia-tri-xanh">${Number(tk.tongDoanhThu || 0).toLocaleString('vi-VN')} đ</h4>
                        <small class="cs-ghi-chu">${tk.soHoaDon} đơn (TM: ${Number(tk.doanhThuTienMat).toLocaleString('vi-VN')}đ | CK: ${Number(tk.doanhThuChuyenKhoan).toLocaleString('vi-VN')}đ)</small>
                    </div>

                    <div class="the-cs-ca ${coBanChuaThu ? 'the-cs-canh-bao' : ''}">
                        <span class="cs-nhan">Bàn đang ăn (Tạm tính)</span>
                        <h4 class="cs-gia-tri ${coBanChuaThu ? 'gia-tri-vang' : 'gia-tri-xam'}">${Number(tk.tongTienChuaThu || 0).toLocaleString('vi-VN')} đ</h4>
                        <small class="cs-ghi-chu">${(tk.dsBanChuaThu || []).length} bàn chưa tính tiền</small>
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

                ${coBanChuaThu ? `
                    <div class="hop-canh-bao-ban-chua-thu">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 26px;">🍽️</span>
                            <div>
                                <strong style="font-size: 14px; color: #92400e;">
                                    Đang có ${(tk.dsBanChuaThu || []).length} bàn đang phục vụ chưa thanh toán hóa đơn (Tạm tính: ${Number(tk.tongTienChuaThu || 0).toLocaleString('vi-VN')} đ)
                                </strong>
                                <div style="font-size: 12.5px; color: #78350f; margin-top: 3px;">
                                    Chi tiết: ${(tk.dsBanChuaThu || []).map(b => `<strong>${b.soBan}</strong>: ${Number(b.tienBan).toLocaleString('vi-VN')}đ (${b.soLuongMon} món)`).join(' • ')}
                                </div>
                                <div style="font-size: 11.5px; color: #a16207; margin-top: 2px;">
                                    <em>Lưu ý: Tiền các bàn này sẽ được cộng vào quỹ két ca khi Thu ngân thực hiện "Thanh toán hóa đơn". Vui lòng thanh toán các bàn trước khi kết ca.</em>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="nut nut-chinh nut-nho" onclick="window.ungDung.chuyenTab('thanhToanPos')">
                            💵 Sang Thu Ngân thanh toán ngay
                        </button>
                    </div>
                ` : ''}
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

            <!-- BẢNG DANH SÁCH HÓA ĐƠN ĐÃ THU TIỀN TRONG CA (US-107 & US-120) -->
            <div class="khung-danh-sach-thu-chi-ca" style="margin-top: 24px;">
                <div class="dau-khung-thu-chi">
                    <h4>🧾 Danh sách hóa đơn / Bill đã thanh toán trong ca (${(tk.dsHoaDonCa || []).length} bill)</h4>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="nut nut-phu nut-nho" onclick="window.ungDung.chuyenTab('thanhToanPos')">
                            💵 Mở Quầy Thu Ngân POS
                        </button>
                    </div>
                </div>

                ${(!tk.dsHoaDonCa || tk.dsHoaDonCa.length === 0) ? `
                    <div style="text-align: center; padding: 28px; color: var(--mau-chu-phu); background: #FAF9F6; border-radius: 8px;">
                        <div style="font-size: 32px; margin-bottom: 8px;">🧾</div>
                        <strong style="color: #4b5563;">Chưa có hóa đơn nào được thanh toán trong ca này.</strong>
                        <p style="font-size: 12.5px; color: #6b7280; margin: 4px auto 0; max-width: 480px;">
                            Khi khách hàng hoặc nhân viên thanh toán bàn tại <strong>Quầy Thu Ngân & Hóa Đơn</strong>, bill thanh toán sẽ tự động hiển thị tại đây và cộng vào quỹ ca.
                        </p>
                    </div>
                ` : `
                    <div class="bang-du-lieu-bap-wrapper">
                        <table class="bang-du-lieu-chuan">
                            <thead>
                                <tr>
                                    <th>Mã hóa đơn</th>
                                    <th>Bàn / Phòng</th>
                                    <th>Thời gian thanh toán</th>
                                    <th>Hình thức</th>
                                    <th style="text-align: right;">Tiền món</th>
                                    <th style="text-align: right;">Giảm / VAT</th>
                                    <th style="text-align: right;">Tổng thanh toán</th>
                                    <th>Thu ngân</th>
                                    <th style="text-align: center;">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tk.dsHoaDonCa.map((hd, index) => {
                                    const laTienMat = hd.phuongThuc === 'TIEN_MAT';
                                    const tongTien = Number(hd.tongThanhToan || hd.tongTien || 0);
                                    const tienMon = Number(hd.tienMonAn || hd.tamTinh || hd.tongTienMon || tongTien);
                                    const giamGia = Number(hd.tienGiamGia || hd.giamGia || 0);
                                    const vat = Number(hd.tienVat || hd.vat || 0);
                                    const thoiGian = hd.thoiGianThanhToan || hd.thoiGian || '';
                                    const gioHienThi = window.DinhDang ? window.DinhDang.dinhDangGioVN(hd.thoiDiemThanhToan || thoiGian) : (thoiGian.includes('T') ? thoiGian.replace('T', ' ').substring(0, 19) : thoiGian);

                                    return `
                                        <tr>
                                            <td><strong>${hd.maHoaDon}</strong></td>
                                            <td><span class="badge badge-xam" style="font-weight: 600;">${hd.soBan || hd.banSo || 'Mang về'}</span></td>
                                            <td style="font-size: 12.5px; color: #4B5563;">🕒 ${gioHienThi}</td>
                                            <td>
                                                <span class="badge ${laTienMat ? 'badge-xanh-la' : 'badge-xanh-duong'}">
                                                    ${laTienMat ? '💵 TIỀN MẶT' : '💳 CHUYỂN KHOẢN'}
                                                </span>
                                            </td>
                                            <td style="text-align: right; font-size: 13px;">${tienMon.toLocaleString('vi-VN')} đ</td>
                                            <td style="text-align: right; font-size: 12px; color: #6B7280;">
                                                ${giamGia > 0 ? `<span style="color:#DC2626;">-${giamGia.toLocaleString('vi-VN')}đ</span>` : '0đ'} / 
                                                ${vat > 0 ? `+${vat.toLocaleString('vi-VN')}đ` : '0đ'}
                                            </td>
                                            <td style="text-align: right;">
                                                <strong style="color: ${laTienMat ? '#16A34A' : '#2563EB'}; font-size: 14px;">
                                                    ${tongTien.toLocaleString('vi-VN')} đ
                                                </strong>
                                            </td>
                                            <td style="font-size: 12.5px;">${hd.thuNganTen || hd.thuNgan || 'Thu ngân'}</td>
                                            <td style="text-align: center;">
                                                <button type="button" class="nut nut-phu nut-nho" onclick="window.caLamViecModule.xemChiTietHoaDonTheoIndex(${index})" title="Xem chi tiết hóa đơn">
                                                    👁️ Xem bill
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                            <tfoot>
                                <tr style="background: #FAF9F6; font-weight: 700; border-top: 2px solid #E5E7EB;">
                                    <td colspan="3" style="padding: 10px 12px; text-align: right;">TỔNG DOANH THU CA (${(tk.dsHoaDonCa || []).length} bill):</td>
                                    <td style="padding: 10px 12px; font-size: 12px;">
                                        TM: ${Number(tk.doanhThuTienMat || 0).toLocaleString('vi-VN')}đ<br>
                                        CK: ${Number(tk.doanhThuChuyenKhoan || 0).toLocaleString('vi-VN')}đ
                                    </td>
                                    <td colspan="2"></td>
                                    <td style="padding: 10px 12px; text-align: right; font-size: 15px; color: #16A34A;">
                                        ${Number(tk.tongDoanhThu || 0).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td colspan="2"></td>
                                </tr>
                            </tfoot>
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
    /**
     * Modal Đổi / Chọn ca trực khi đang có ca mở
     */
    async moModalDoiCa() {
        if (!this.danhSachCa || this.danhSachCa.length === 0) {
            this.danhSachCa = await window.api.layDanhSachCaLamViec();
        }
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;
        modal.innerHTML = `
            <div class="hop-thoai-modal" style="max-width: 480px;">
                <div class="dau-modal">
                    <h3>🔄 Đổi / Chọn Ca Trực</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.caLamViecModule.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <p style="font-size: 13px; color: var(--mau-chu-phu); margin-bottom: 14px;">
                        Bạn có thể chuyển ca trực sang khung giờ mới (Ca Sáng, Ca Chiều / Tối, Ca Đêm) mà vẫn giữ nguyên két tiền và doanh thu các hóa đơn đã thanh toán.
                    </p>
                    <div class="nhom-form">
                        <label class="nhan-form">Chọn ca làm việc muốn chuyển đến *</label>
                        <select id="chon-ca-doi" class="nhap-du-lieu" style="font-size: 14px; font-weight: 600;">
                            ${this.danhSachCa.map(c => `
                                <option value="${c.id}" ${this.caHienTai && Number(this.caHienTai.caId) === Number(c.id) ? 'selected' : ''}>${c.tenCa}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.caLamViecModule.dongModal()">Hủy</button>
                    <button type="button" class="nut nut-chinh" onclick="window.caLamViecModule.xacNhanDoiCa()">
                        🚀 Xác nhận đổi ca
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    async xacNhanDoiCa() {
        const selectCa = document.getElementById('chon-ca-doi');
        const caId = selectCa ? selectCa.value : 1;
        const timCa = this.danhSachCa.find(c => Number(c.id) === Number(caId));
        const tenCa = timCa ? timCa.tenCa : 'Ca Sáng';
        const kq = await window.api.doiCaLamViec({ caId, tenCa });
        this.dongModal();
        if (kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Đổi ca thành công', kq.msg);
            await this.taiLaiVaRender();
        } else {
            if (window.thongBao) window.thongBao.loi('Thất bại', kq.msg);
        }
    }

    async chonCaTrucTiep(caId, tenCa) {
        if (this.caHienTai) {
            const kq = await window.api.doiCaLamViec({ caId, tenCa });
            if (kq.ok) {
                if (window.thongBao) window.thongBao.thanhCong('Đổi ca thành công', kq.msg);
                await this.taiLaiVaRender();
            }
        } else {
            this.moModalMoCa(caId);
        }
    }

    moModalMoCa(caMacDinhId = null) {
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
                                <option value="${c.id}" ${(caMacDinhId && Number(caMacDinhId) === Number(c.id)) ? 'selected' : ''}>${c.tenCa}</option>
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
                    ${(tk.tongTienChuaThu > 0) ? `
                        <div class="hop-canh-bao-dong-ca-chua-thu">
                            <div style="font-weight: 700; color: #b45309; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                ⚠️ Cảnh báo: Còn ${(tk.dsBanChuaThu || []).length} bàn chưa thanh toán (${Number(tk.tongTienChuaThu).toLocaleString('vi-VN')} đ)
                            </div>
                            <div style="font-size: 12.5px; color: #78350f; line-height: 1.4;">
                                Các bàn: ${(tk.dsBanChuaThu || []).map(b => `<strong>${b.soBan}</strong> (${Number(b.tienBan).toLocaleString('vi-VN')}đ)`).join(', ')} chưa xuất hóa đơn nên <strong>tiền chưa vào quỹ ca</strong>.
                            </div>
                            <div style="margin-top: 8px;">
                                <button type="button" class="nut nut-phu nut-nho" onclick="window.caLamViecModule.dongModal(); window.ungDung.chuyenTab('thanhToanPos');" style="background: #FEF3C7; border-color: #F59E0B; color: #92400E; font-weight: 600;">
                                    👉 Mở Quầy Thu Ngân thanh toán trước khi đóng ca
                                </button>
                            </div>
                        </div>
                    ` : ''}

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
                            <span>Quản lý tiếp nhận</span>
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

    /**
     * Xem chi tiết hóa đơn / bill thanh toán trong ca
     */
    xemChiTietHoaDonTheoIndex(index) {
        if (this.tongKetCa && Array.isArray(this.tongKetCa.dsHoaDonCa)) {
            const hd = this.tongKetCa.dsHoaDonCa[index];
            if (hd) {
                this.hienThiModalChiTietHoaDon(hd);
                return;
            }
        }
        if (window.thongBao) window.thongBao.loi("Lỗi", "Không tìm thấy hóa đơn tại vị trí " + index);
    }

    async xemChiTietHoaDon(maHoaDon, id = null) {
        try {
            let hd = null;
            const maHdStr = String(maHoaDon || "").trim().toLowerCase();
            const idStr = String(id || "").trim().toLowerCase();

            const khopHoaDon = (h) => {
                if (!h) return false;
                const hId = String(h.id || "").trim().toLowerCase();
                const hMa = String(h.maHoaDon || "").trim().toLowerCase();
                if (idStr && hId === idStr) return true;
                if (hMa && (hMa === maHdStr || maHdStr.includes(hMa) || hMa.includes(maHdStr))) return true;
                if (hId && (hId === maHdStr || String(h.id) === String(maHoaDon))) return true;
                return false;
            };

            // 1. Tìm trong danh sách hóa đơn của ca hiện tại
            if (this.tongKetCa && Array.isArray(this.tongKetCa.dsHoaDonCa)) {
                hd = this.tongKetCa.dsHoaDonCa.find(khopHoaDon);
            }

            // 2. Tìm qua API hệ thống layChiTietHoaDon
            if (!hd && window.api && window.api.layChiTietHoaDon) {
                try {
                    const res = await window.api.layChiTietHoaDon(id || maHoaDon);
                    if (res && res.ok && res.data) hd = res.data;
                } catch (e) {}
            }

            // 3. Tìm trong toàn bộ danh sách hóa đơn API
            if (!hd && window.api && window.api.layDanhSachHoaDon) {
                try {
                    const dsAllApi = await window.api.layDanhSachHoaDon();
                    if (Array.isArray(dsAllApi)) {
                        hd = dsAllApi.find(khopHoaDon);
                    }
                } catch (e) {}
            }

            // 4. Tìm trong kho lịch sử hóa đơn POS (quanmoc_pos_lich_su_hoa_don)
            if (!hd) {
                try {
                    const rawPos = localStorage.getItem("quanmoc_pos_lich_su_hoa_don");
                    if (rawPos) {
                        const dsPos = JSON.parse(rawPos);
                        if (Array.isArray(dsPos)) {
                            hd = dsPos.find(khopHoaDon);
                        }
                    }
                } catch (e) {}
            }

            // 5. Tìm trong kho hóa đơn dùng chung (quanmoc_ds_hoa_don)
            if (!hd) {
                try {
                    const rawAll = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_HOA_DON || "quanmoc_ds_hoa_don");
                    if (rawAll) {
                        const dsAll = JSON.parse(rawAll);
                        if (Array.isArray(dsAll)) {
                            hd = dsAll.find(khopHoaDon);
                        }
                    }
                } catch (e) {}
            }

            if (!hd) {
                if (window.thongBao) window.thongBao.loi("Không tìm thấy", "Không tìm thấy thông tin chi tiết của hóa đơn " + maHoaDon + ".");
                else alert("Không tìm thấy thông tin chi tiết của hóa đơn " + maHoaDon + ".");
                return;
            }

            this.hienThiModalChiTietHoaDon(hd);
        } catch (err) {
            console.error("Lỗi xem chi tiết hóa đơn:", err);
            if (window.thongBao) {
                window.thongBao.loi("Lỗi xem hóa đơn", "Không thể hiển thị chi tiết hóa đơn: " + (err.message || "Lỗi không xác định"));
            } else {
                alert("Không thể hiển thị chi tiết hóa đơn: " + err.message);
            }
        }
    }

    hienThiModalChiTietHoaDon(hd) {
        if (!hd) return;
        const modal = document.getElementById("khung-modal-toan-cuc");
        if (!modal) return;

        const laTienMat = String(hd.phuongThuc || "").toUpperCase() === "TIEN_MAT";
        const tongTien = Number(hd.tongThanhToan || hd.tongTien || 0);
        const tienMon = Number(hd.tongTienMon || hd.tienMonAn || hd.tamTinh || tongTien);
        const giamGia = Number(hd.giamGia || hd.tienGiamGia || 0);
        const vat = Number(hd.vat || hd.tienVat || 0);
        const thoiGian = hd.thoiGianThanhToan || hd.thoiGian || new Date().toISOString();
        const gioHienThi = window.DinhDang ? window.DinhDang.dinhDangGioVN(hd.thoiDiemThanhToan || thoiGian) : (thoiGian.includes("T") ? thoiGian.replace("T", " ").substring(0, 19) : thoiGian);
        const dsMon = Array.isArray(hd.danhSachMon) ? hd.danhSachMon : [];

        modal.innerHTML = `
            <div class="hop-thoai-modal hop-thoai-chi-tiet-hoa-don" style="max-width: 480px; width: 100%; background: #FFF; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
                <div class="dau-modal" style="background: #0f172a; color: #FFF; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #FFF;">🧾 Chi Tiết Hóa Đơn Bán Hàng</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.caLamViecModule.dongModal()" style="color: #FFF; background: transparent; border: none; font-size: 20px; cursor: pointer;">✕</button>
                </div>
                <div class="than-modal" style="padding: 18px; max-height: 75vh; overflow-y: auto;">
                    <!-- Header Hóa Đơn -->
                    <div style="text-align: center; border-bottom: 1px dashed #CCC; padding-bottom: 12px; margin-bottom: 12px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 800; color: #B85D19;">NHÀ HÀNG QUÁN MỘC</h4>
                        <div style="font-size: 12px; color: #64748b;">123 Đường Ẩm Thực, Quận 1, TP.HCM | Hotline: 1900 6868</div>
                        <div style="margin-top: 8px; font-size: 14px; font-weight: 700; color: #0f172a;">
                            PHIẾU THANH TOÁN (BILL)
                        </div>
                        <div style="font-size: 12.5px; color: #475569; margin-top: 2px;">
                            Mã HĐ: <strong style="color: #B85D19;">${hd.maHoaDon || hd.id}</strong>
                        </div>
                    </div>

                    <!-- Thông tin bàn, thu ngân, thời gian -->
                    <div style="font-size: 12.5px; line-height: 1.6; margin-bottom: 12px; background: #f8fafc; padding: 10px 12px; border-radius: 6px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Vị trí: <strong>${hd.soBan || hd.banSo || 'Bàn chưa đặt tên'}</strong></span>
                            <span>Thu ngân: <strong>${hd.thuNganTen || hd.thuNgan || 'Thu ngân'}</strong></span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Thời gian: <strong>${gioHienThi}</strong></span>
                            <span>Hình thức: <span class="badge ${laTienMat ? 'badge-xanh-la' : 'badge-xanh-duong'}">${laTienMat ? 'Tiền mặt' : 'Chuyển khoản'}</span></span>
                        </div>
                    </div>

                    <!-- Danh sách món ăn -->
                    <div style="border-bottom: 1px dashed #CCC; padding-bottom: 10px; margin-bottom: 12px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <thead>
                                <tr style="border-bottom: 1px solid #E2E8F0; text-align: left; color: #64748b;">
                                    <th style="padding-bottom: 4px;">Món</th>
                                    <th style="text-align: center; padding-bottom: 4px; width: 45px;">SL</th>
                                    <th style="text-align: right; padding-bottom: 4px; width: 95px;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dsMon.length === 0 ? `
                                    <tr>
                                        <td colspan="3" style="text-align: center; padding: 12px; color: #64748b; font-style: italic;">
                                            Thanh toán theo bàn (${hd.soBan || hd.banSo || 'Mang về'})<br>
                                            Tổng tiền: ${(tongTien || 0).toLocaleString("vi-VN")} đ
                                        </td>
                                    </tr>
                                ` : dsMon.map(m => {
                                    const sl = Number(m.soLuong) || 1;
                                    const donGia = Number(m.donGia) || 0;
                                    const thanhTien = Number(m.thanhTien) || (donGia * sl);
                                    return `
                                        <tr>
                                            <td style="padding: 4px 0;">
                                                <strong>${m.tenMon || "Món ăn"}</strong>
                                                ${m.tuyChon ? `<div style="font-size: 11px; color: #64748b;">${m.tuyChon}</div>` : ""}
                                            </td>
                                            <td style="text-align: center; padding: 4px 0; font-weight: 700;">x${sl}</td>
                                            <td style="text-align: right; padding: 4px 0; font-weight: 700;">
                                                ${thanhTien.toLocaleString("vi-VN")} đ
                                            </td>
                                        </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>

                    <div style="margin-bottom: 12px; font-size: 13px; line-height: 1.7;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Tạm tính tiền món:</span>
                            <strong>${tienMon.toLocaleString("vi-VN")} đ</strong>
                        </div>
                        ${giamGia > 0 ? `
                        <div style="display: flex; justify-content: space-between; color: #DC2626;">
                            <span>Giảm giá / Voucher:</span>
                            <strong>-${giamGia.toLocaleString("vi-VN")} đ</strong>
                        </div>
                        ` : ""}
                        ${vat > 0 ? `
                        <div style="display: flex; justify-content: space-between; color: #4B5563;">
                            <span>Thuế VAT:</span>
                            <strong>+${vat.toLocaleString("vi-VN")} đ</strong>
                        </div>
                        ` : ""}
                        <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; margin-top: 6px; border-top: 2px solid #0f172a; padding-top: 6px;">
                            <span>TỔNG THANH TOÁN:</span>
                            <span style="color: ${laTienMat ? "#16A34A" : "#2563EB"}; font-size: 16px;">${tongTien.toLocaleString("vi-VN")} đ</span>
                        </div>
                    </div>

                    <div style="text-align: center; font-size: 11.5px; color: #64748b; border-top: 1px dashed #CCC; padding-top: 8px;">
                        Cảm ơn quý khách & Hẹn gặp lại!<br>
                        <em>(Hóa đơn chứng từ ca thu ngân)</em>
                    </div>
                </div>
                <div class="duoi-modal" style="display: flex; justify-content: flex-end; gap: 8px; padding: 12px 18px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
                    <button type="button" class="nut nut-phu" onclick="window.caLamViecModule.dongModal()">Đóng</button>
                    <button type="button" class="nut nut-chinh" onclick="window.print()">🖨️ In lại hóa đơn</button>
                </div>
            </div>
        `;
        modal.classList.add("mo");
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
window.caLamViec = window.caLamViecModule;

window.xemChiTietHoaDon = (maHoaDon) => {
    if (window.caLamViecModule) {
        window.caLamViecModule.xemChiTietHoaDon(maHoaDon);
    }
};
