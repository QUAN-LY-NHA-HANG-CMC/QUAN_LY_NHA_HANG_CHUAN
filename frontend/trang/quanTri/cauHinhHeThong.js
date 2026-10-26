/**
 * MODULE CẤU HÌNH NHÀ HÀNG & NHẬT KÝ HỆ THỐNG SYSTEM LOGS (cauHinhHeThong.js)
 * Phụ trách: Phong (Frontend Admin & Auth Lead)
 * Đáp ứng các User Story trong Sprint 1:
 * - US-041: Cấu hình thông tin chung của nhà hàng (tên quán, địa chỉ, hotline, wifi)
 * - US-042: Cấu hình tỷ lệ thuế VAT hoặc phí phục vụ mặc định
 * - US-043: Cấu hình thông tin tài khoản ngân hàng nhận thanh toán VietQR
 * - US-044: Xem nhật ký hoạt động hệ thống (System Logs)
 */

class CauHinhHeThongModule {
    constructor() {
        this.cauHinh = null;
        this.danhSachLogs = [];
        this.tabHienTai = 'thongTinChung'; // 'thongTinChung', 'thuePhi', 'vietQr', 'systemLogs'
        this.boLocLog = { loai: 'ALL', tuKhoa: '' };
    }

    async khoiTao() {
        await this.taiDuLieu();
        this.veGiaoDien();
    }

    async taiDuLieu() {
        this.cauHinh = await window.api.layCauHinhHeThong();
        this.danhSachLogs = await window.api.layNhatKyHeThong(this.boLocLog);
    }

    veGiaoDien() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua || !this.cauHinh) return;

        vungChua.innerHTML = `
            <div class="trang-cau-hinh-he-thong">
                <!-- Tiêu đề trang -->
                <div class="thanh-tieu-de-trang">
                    <div>
                        <h2>⚙️ Quản trị Nền tảng & Cấu hình Hệ thống</h2>
                        <p class="mo-ta-phu">Thiết lập thông tin thương hiệu Quán Mộc, thuế VAT, tài khoản nhận tiền VietQR và kiểm tra nhật ký an ninh (US-041 -> US-044)</p>
                    </div>
                </div>

                <!-- Thanh điều hướng Tab Cấu hình -->
                <div class="thanh-bo-loc" style="margin-bottom: 24px;">
                    <div class="cac-tab-khu-vuc">
                        <button class="tab-khu-vuc ${this.tabHienTai === 'thongTinChung' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.chuyenTab('thongTinChung')">
                            🏢 Thông tin nhà hàng & Wi-Fi (US-041)
                        </button>
                        <button class="tab-khu-vuc ${this.tabHienTai === 'thuePhi' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.chuyenTab('thuePhi')">
                            🧾 Thuế VAT & Phí phục vụ (US-042)
                        </button>
                        <button class="tab-khu-vuc ${this.tabHienTai === 'vietQr' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.chuyenTab('vietQr')">
                            💳 Tài khoản VietQR Napas (US-043)
                        </button>
                        <button class="tab-khu-vuc ${this.tabHienTai === 'systemLogs' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.chuyenTab('systemLogs')">
                            📋 Nhật ký hệ thống (${this.danhSachLogs.length} Logs - US-044)
                        </button>
                    </div>
                </div>

                <!-- Vùng nội dung theo tab -->
                <div class="vung-noi-dung-cau-hinh">
                    ${this.renderNoiDungTab()}
                </div>
            </div>
        `;

        if (this.tabHienTai === 'vietQr') {
            this.taoXemTruocVietQr();
        }
    }

    chuyenTab(tab) {
        this.tabHienTai = tab;
        this.veGiaoDien();
    }

    renderNoiDungTab() {
        if (this.tabHienTai === 'thongTinChung') {
            return this.renderTabThongTinChung();
        } else if (this.tabHienTai === 'thuePhi') {
            return this.renderTabThuePhi();
        } else if (this.tabHienTai === 'vietQr') {
            return this.renderTabVietQr();
        } else if (this.tabHienTai === 'systemLogs') {
            return this.renderTabSystemLogs();
        }
        return '';
    }

    /**
     * TAB 1: Cấu hình thông tin chung & Wi-Fi (US-041)
     */
    renderTabThongTinChung() {
        const ch = this.cauHinh;
        return `
            <div class="the-the-noi-dung-cau-hinh">
                <div class="dau-the-cau-hinh">
                    <h3>🏢 Thông tin thương hiệu & Hạ tầng Wi-Fi Quán (US-041)</h3>
                    <p>Thông tin này được hiển thị trên Header toàn hệ thống, chân trang Standee để bàn và Web E-Menu của khách hàng.</p>
                </div>
                <form id="form-cau-hinh-chung" onsubmit="window.cauHinhHeThongModule.luuThongTinChung(event)">
                    <div class="hang-nhap-doi">
                        <div class="nhom-nhap-lieu">
                            <label>Tên nhà hàng <span class="bat-buoc">*</span></label>
                            <input type="text" id="ch-ten" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.ten) : ch.ten}" required />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Tên chi nhánh</label>
                            <input type="text" id="ch-chi-nhanh" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.chiNhanh || '') : (ch.chiNhanh || '')}" />
                        </div>
                    </div>

                    <div class="hang-nhap-doi">
                        <div class="nhom-nhap-lieu">
                            <label>Hotline đặt bàn / Khiếu nại <span class="bat-buoc">*</span></label>
                            <input type="text" id="ch-hotline" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.hotline) : ch.hotline}" required />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Email liên hệ</label>
                            <input type="email" id="ch-email" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.email || '') : (ch.email || '')}" />
                        </div>
                    </div>

                    <div class="nhom-nhap-lieu">
                        <label>Địa chỉ nhà hàng <span class="bat-buoc">*</span></label>
                        <input type="text" id="ch-dia-chi" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.diaChi) : ch.diaChi}" required />
                    </div>

                    <div class="hang-nhap-doi">
                        <div class="nhom-nhap-lieu">
                            <label>Khẩu hiệu (Slogan)</label>
                            <input type="text" id="ch-khau-hieu" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.khauHieu || '') : (ch.khauHieu || '')}" />
                        </div>
                        <div class="nhom-nhap-lieu">
                            <label>Giờ hoạt động đón khách</label>
                            <input type="text" id="ch-gio-hoat-dong" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.gioHoatDong || '09:00 - 22:30') : (ch.gioHoatDong || '')}" />
                        </div>
                    </div>

                    <div style="background: #FDF8F3; padding: 18px; border-radius: var(--bo-goc); border: 1px dashed var(--mau-chinh); margin: 18px 0;">
                        <h4 style="color: var(--mau-chinh-dam); margin-bottom: 12px;">📶 Thông tin Mạng Wi-Fi phục vụ Khách quét QR</h4>
                        <div class="hang-nhap-doi">
                            <div class="nhom-nhap-lieu">
                                <label>Tên sóng Wi-Fi (SSID)</label>
                                <input type="text" id="ch-wifi-ten" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.wifiTen) : ch.wifiTen}" />
                            </div>
                            <div class="nhom-nhap-lieu">
                                <label>Mật khẩu Wi-Fi</label>
                                <input type="text" id="ch-wifi-mk" value="${window.DinhDang ? window.DinhDang.thoatHtml(ch.wifiMatKhau) : ch.wifiMatKhau}" />
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="nut nut-chinh">
                            💾 Lưu cấu hình thông tin chung
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * TAB 2: Cấu hình thuế VAT & Phí phục vụ (US-042)
     */
    renderTabThuePhi() {
        const ch = this.cauHinh;
        return `
            <div class="the-the-noi-dung-cau-hinh" style="max-width: 640px;">
                <div class="dau-the-cau-hinh">
                    <h3>🧾 Cấu hình Tỷ lệ Thuế VAT & Phí dịch vụ (US-042)</h3>
                    <p>Hệ thống tự động áp dụng các tỷ lệ này khi POS xuất phiếu tạm tính và tính tổng hóa đơn.</p>
                </div>
                <form id="form-cau-hinh-thue" onsubmit="window.cauHinhHeThongModule.luuThuePhi(event)">
                    <div class="nhom-nhap-lieu">
                        <label>Tỷ lệ thuế VAT (%) <span class="bat-buoc">*</span></label>
                        <input type="number" id="ch-thue-vat" min="0" max="100" step="1" value="${ch.thueVat || 8}" required />
                        <small style="color: var(--mau-chu-phu); font-size: 11px;">Mặc định áp dụng mức 8% theo nghị định hỗ trợ kinh doanh ẩm thực.</small>
                    </div>

                    <div class="nhom-nhap-lieu" style="margin-top: 16px;">
                        <label>Phí phục vụ / Dịch vụ quán (%)</label>
                        <input type="number" id="ch-phi-phuc-vu" min="0" max="50" step="1" value="${ch.phiPhucVu || 0}" />
                        <small style="color: var(--mau-chu-phu); font-size: 11px;">Mức 0% nếu nhà hàng không thu phụ phí dịch vụ.</small>
                    </div>

                    <div style="background: #F9FAFB; padding: 16px; border-radius: var(--bo-goc); border: 1px solid var(--mau-vien); margin: 20px 0;">
                        <h4 style="margin-bottom: 8px;">Ví dụ minh họa tính bill tạm tính:</h4>
                        <div style="font-size: 13px; line-height: 1.8; color: var(--mau-chu);">
                            <div>• Tiền món ăn trong đơn: <strong>500.000 đ</strong></div>
                            <div>• Phí phục vụ (${ch.phiPhucVu || 0}%): <strong>${window.DinhDang.tienVnd(500000 * ((ch.phiPhucVu || 0) / 100))}</strong></div>
                            <div>• Thuế VAT (${ch.thueVat || 8}%): <strong>${window.DinhDang.tienVnd(500000 * ((ch.thueVat || 8) / 100))}</strong></div>
                            <div style="border-top: 1px dashed #D1D5DB; margin-top: 6px; padding-top: 6px; font-weight: 700; color: var(--mau-chinh);">
                                ➔ Tổng tiền thanh toán: ${window.DinhDang.tienVnd(500000 * (1 + ((ch.thueVat || 8) + (ch.phiPhucVu || 0)) / 100))}
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="nut nut-chinh">
                            💾 Lưu thiết lập thuế & phí
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * TAB 3: Cấu hình tài khoản VietQR Napas (US-043)
     */
    renderTabVietQr() {
        const ch = this.cauHinh;
        const nh = ch.nganHang || {};

        return `
            <div class="luoi-hai-cot" style="grid-template-columns: 1.3fr 1fr; gap: 24px;">
                <!-- Form nhập tài khoản ngân hàng -->
                <div class="the-the-noi-dung-cau-hinh">
                    <div class="dau-the-cau-hinh">
                        <h3>💳 Cấu hình Tài khoản Ngân hàng nhận VietQR (US-043)</h3>
                        <p>Thông tin để tự động sinh mã VietQR Napas 247 động cho từng hóa đơn bàn thanh toán.</p>
                    </div>
                    <form id="form-cau-hinh-vietqr" onsubmit="window.cauHinhHeThongModule.luuVietQr(event)">
                        <div class="nhom-nhap-lieu">
                            <label>Ngân hàng thụ hưởng <span class="bat-buoc">*</span></label>
                            <select id="ch-nh-ma" onchange="window.cauHinhHeThongModule.thayDoiNganHang(this.value)">
                                <option value="VCB" ${nh.maNganHang === 'VCB' ? 'selected' : ''}>Vietcombank (Ngoại Thương Việt Nam)</option>
                                <option value="MB" ${nh.maNganHang === 'MB' ? 'selected' : ''}>MBBank (Quân Đội)</option>
                                <option value="TCB" ${nh.maNganHang === 'TCB' ? 'selected' : ''}>Techcombank (Kỹ Thương)</option>
                                <option value="ACB" ${nh.maNganHang === 'ACB' ? 'selected' : ''}>ACB (Á Châu)</option>
                                <option value="BIDV" ${nh.maNganHang === 'BIDV' ? 'selected' : ''}>BIDV (Đầu Tư & Phát Triển)</option>
                                <option value="CTG" ${nh.maNganHang === 'CTG' ? 'selected' : ''}>VietinBank (Công Thương)</option>
                                <option value="VPB" ${nh.maNganHang === 'VPB' ? 'selected' : ''}>VPBank (Việt Nam Thịnh Vượng)</option>
                                <option value="TPB" ${nh.maNganHang === 'TPB' ? 'selected' : ''}>TPBank (Tiên Phong)</option>
                            </select>
                        </div>

                        <div class="nhom-nhap-lieu">
                            <label>Số tài khoản ngân hàng <span class="bat-buoc">*</span></label>
                            <input type="text" id="ch-nh-stk" value="${nh.soTaiKhoan || '9988776655'}" required oninput="window.cauHinhHeThongModule.taoXemTruocVietQr()" />
                        </div>

                        <div class="nhom-nhap-lieu">
                            <label>Tên chủ tài khoản (In hoa không dấu) <span class="bat-buoc">*</span></label>
                            <input type="text" id="ch-nh-chu-tk" value="${nh.chuTaiKhoan || 'NHA HANG QUAN MOC'}" required style="text-transform: uppercase;" oninput="window.cauHinhHeThongModule.taoXemTruocVietQr()" />
                        </div>

                        <div class="nhom-nhap-lieu">
                            <label>Cú pháp nội dung chuyển khoản mẫu</label>
                            <input type="text" id="ch-nh-cu-phap" value="${nh.cuPhapChuyenKhoan || 'QUANMOC {SO_BAN}'}" oninput="window.cauHinhHeThongModule.taoXemTruocVietQr()" />
                            <small style="color: var(--mau-chu-phu); font-size: 11px;">Hệ thống sẽ tự thay thế <code>{SO_BAN}</code> bằng số bàn thực tế khi thanh toán.</small>
                        </div>

                        <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
                            <button type="submit" class="nut nut-chinh">
                                💾 Lưu thông tin VietQR
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Cột xem trước mã VietQR -->
                <div class="the-the-noi-dung-cau-hinh" style="text-align: center;">
                    <div class="dau-the-cau-hinh" style="border-bottom: none; margin-bottom: 0;">
                        <h4>Xem trước mã thanh toán VietQR Napas</h4>
                    </div>
                    <div id="vung-xem-truoc-vietqr" style="margin: 16px auto; width: 220px; height: 220px; border: 2px dashed #D1D5DB; border-radius: 12px; padding: 10px; display: flex; align-items: center; justify-content: center; background: #FFF;">
                        <!-- QR render động -->
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #2C1810;" id="preview-ten-chu-tk">
                        ${nh.chuTaiKhoan || 'NHA HANG QUAN MOC'}
                    </div>
                    <div style="font-size: 12px; color: var(--mau-chu-phu); margin-top: 4px;" id="preview-stk-nh">
                        STK: ${nh.soTaiKhoan || '9988776655'} (${nh.maNganHang || 'VCB'})
                    </div>
                    <div class="badge badge-xanh-la" style="margin-top: 12px;">
                        ✔ Đạt chuẩn Napas 247 QuickPay
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * TAB 4: Tra cứu Nhật ký hệ thống System Logs (US-044)
     */
    renderTabSystemLogs() {
        return `
            <div>
                <!-- Bộ lọc logs (US-044) -->
                <div class="thanh-bo-loc">
                    <div class="cac-tab-khu-vuc">
                        <button class="tab-khu-vuc ${this.boLocLog.loai === 'ALL' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.locLogLoai('ALL')">
                            Tất cả mức độ (${this.danhSachLogs.length})
                        </button>
                        <button class="tab-khu-vuc ${this.boLocLog.loai === 'INFO' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.locLogLoai('INFO')">
                            ℹ️ Thông tin (Info)
                        </button>
                        <button class="tab-khu-vuc ${this.boLocLog.loai === 'WARN' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.locLogLoai('WARN')">
                            ⚠️ Cảnh báo (Warning)
                        </button>
                        <button class="tab-khu-vuc ${this.boLocLog.loai === 'ERROR' ? 'kich-hoat' : ''}" onclick="window.cauHinhHeThongModule.locLogLoai('ERROR')">
                            ⛔ Lỗi (Error)
                        </button>
                    </div>

                    <div class="hop-tim-kiem">
                        <input 
                            type="text" 
                            placeholder="🔍 Tìm hành vi, nhân viên, IP..." 
                            value="${window.DinhDang ? window.DinhDang.thoatHtml(this.boLocLog.tuKhoa) : this.boLocLog.tuKhoa}"
                            oninput="window.cauHinhHeThongModule.timKiemLog(this.value)"
                        />
                    </div>
                </div>

                <!-- Bảng tra cứu Logs (US-044) -->
                <div class="hop-bang-du-lieu">
                    <table class="bang-du-lieu">
                        <thead>
                            <tr>
                                <th style="width: 50px; text-align: center;">ID</th>
                                <th style="width: 170px;">Thời gian ghi</th>
                                <th style="width: 90px; text-align: center;">Mức độ</th>
                                <th>Hành động</th>
                                <th>Người thực hiện</th>
                                <th>Địa chỉ IP</th>
                                <th>Chi tiết hành vi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.danhSachLogs.length === 0 ? `
                                <tr>
                                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--mau-chu-phu);">
                                        Không có nhật ký nào phù hợp với bộ lọc tra cứu.
                                    </td>
                                </tr>
                            ` : this.danhSachLogs.map(l => {
                                const lopBadgeLoai = {
                                    'INFO': 'badge-xanh-duong',
                                    'WARN': 'badge-vang',
                                    'ERROR': 'badge-do'
                                }[l.loai] || 'badge-xam';

                                return `
                                    <tr>
                                        <td style="text-align: center; font-weight: 600; color: var(--mau-chu-phu);">#${l.id}</td>
                                        <td style="font-size: 12px; color: var(--mau-chu-phu);">
                                            ${window.DinhDang ? window.DinhDang.ngayGio(l.thoiGian) : l.thoiGian}
                                        </td>
                                        <td style="text-align: center;"><span class="badge ${lopBadgeLoai}">${l.loai}</span></td>
                                        <td style="font-weight: 700; color: #2C1810;">${window.DinhDang ? window.DinhDang.thoatHtml(l.hanhDong) : l.hanhDong}</td>
                                        <td>${window.DinhDang ? window.DinhDang.thoatHtml(l.nguoiThucHien) : l.nguoiThucHien}</td>
                                        <td><code>${window.DinhDang ? window.DinhDang.thoatHtml(l.diaChiIp || '127.0.0.1') : '127.0.0.1'}</code></td>
                                        <td style="font-size: 13px; line-height: 1.5; color: #2C1810;">${window.DinhDang ? window.DinhDang.thoatHtml(l.chiTiet) : l.chiTiet}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async locLogLoai(loai) {
        this.boLocLog.loai = loai;
        this.danhSachLogs = await window.api.layNhatKyHeThong(this.boLocLog);
        this.veGiaoDien();
    }

    async timKiemLog(tuKhoa) {
        this.boLocLog.tuKhoa = tuKhoa;
        this.danhSachLogs = await window.api.layNhatKyHeThong(this.boLocLog);
        this.veGiaoDien();
    }

    taoXemTruocVietQr() {
        const vungQr = document.getElementById('vung-xem-truoc-vietqr');
        if (!vungQr) return;

        const maNh = document.getElementById('ch-nh-ma') ? document.getElementById('ch-nh-ma').value : (this.cauHinh?.nganHang?.maNganHang || 'VCB');
        const stk = document.getElementById('ch-nh-stk') ? document.getElementById('ch-nh-stk').value.trim() : (this.cauHinh?.nganHang?.soTaiKhoan || '9988776655');
        const chuTk = document.getElementById('ch-nh-chu-tk') ? document.getElementById('ch-nh-chu-tk').value.trim().toUpperCase() : (this.cauHinh?.nganHang?.chuTaiKhoan || 'NHA HANG QUAN MOC');

        const prevChuTk = document.getElementById('preview-ten-chu-tk');
        const prevStk = document.getElementById('preview-stk-nh');
        if (prevChuTk) prevChuTk.textContent = chuTk;
        if (prevStk) prevStk.textContent = `STK: ${stk} (${maNh})`;

        // Chuỗi payload VietQR Napas
        const payloadVietQr = `https://img.vietqr.io/image/${maNh}-${stk}-compact2.png?amount=0&addInfo=QUANMOC%20DEMO&accountName=${encodeURIComponent(chuTk)}`;

        // Sử dụng taoQrClient nếu có hoặc ảnh img
        if (window.taoQrClient && typeof window.taoQrClient.taoQrSvg === 'function') {
            vungQr.innerHTML = window.taoQrClient.taoQrSvg(`vietqr://pay?bank=${maNh}&acc=${stk}&name=${encodeURIComponent(chuTk)}`, 200);
        } else {
            vungQr.innerHTML = `<img src="${payloadVietQr}" alt="VietQR" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=QUANMOC'" />`;
        }
    }

    thayDoiNganHang() {
        this.taoXemTruocVietQr();
    }

    async luuThongTinChung(e) {
        e.preventDefault();
        const ten = document.getElementById('ch-ten').value.trim();
        const chiNhanh = document.getElementById('ch-chi-nhanh').value.trim();
        const hotline = document.getElementById('ch-hotline').value.trim();
        const email = document.getElementById('ch-email').value.trim();
        const diaChi = document.getElementById('ch-dia-chi').value.trim();
        const khauHieu = document.getElementById('ch-khau-hieu').value.trim();
        const gioHoatDong = document.getElementById('ch-gio-hoat-dong').value.trim();
        const wifiTen = document.getElementById('ch-wifi-ten').value.trim();
        const wifiMatKhau = document.getElementById('ch-wifi-mk').value.trim();

        this.cauHinh = {
            ...this.cauHinh,
            ten,
            chiNhanh,
            hotline,
            email,
            diaChi,
            khauHieu,
            gioHoatDong,
            wifiTen,
            wifiMatKhau
        };

        const kq = await window.api.luuCauHinhHeThong(this.cauHinh);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Thành công', 'Lưu thông tin nhà hàng thành công!');
            // Cập nhật Header
            this.capNhatHeaderTrang();
        }
    }

    async luuThuePhi(e) {
        e.preventDefault();
        const thueVat = Number(document.getElementById('ch-thue-vat').value) || 0;
        const phiPhucVu = Number(document.getElementById('ch-phi-phuc-vu').value) || 0;

        this.cauHinh = {
            ...this.cauHinh,
            thueVat,
            phiPhucVu
        };

        const kq = await window.api.luuCauHinhHeThong(this.cauHinh);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Thành công', 'Lưu thiết lập thuế VAT và phí dịch vụ thành công!');
            this.veGiaoDien();
        }
    }

    async luuVietQr(e) {
        e.preventDefault();
        const maNganHang = document.getElementById('ch-nh-ma').value;
        const soTaiKhoan = document.getElementById('ch-nh-stk').value.trim();
        const chuTaiKhoan = document.getElementById('ch-nh-chu-tk').value.trim().toUpperCase();
        const cuPhapChuyenKhoan = document.getElementById('ch-nh-cu-phap').value.trim();

        this.cauHinh = {
            ...this.cauHinh,
            nganHang: {
                maNganHang,
                soTaiKhoan,
                chuTaiKhoan,
                cuPhapChuyenKhoan
            }
        };

        const kq = await window.api.luuCauHinhHeThong(this.cauHinh);
        if (kq && kq.ok) {
            if (window.thongBao) window.thongBao.thanhCong('Thành công', 'Lưu cấu hình tài khoản VietQR thành công!');
            this.veGiaoDien();
        }
    }

    capNhatHeaderTrang() {
        const head = document.querySelector('.thong-tin-nha-hang-head');
        if (head && this.cauHinh) {
            head.innerHTML = `
                <span>🏢 <strong>${window.DinhDang.thoatHtml(this.cauHinh.ten)} - ${window.DinhDang.thoatHtml(this.cauHinh.chiNhanh || '')}</strong> (${window.DinhDang.thoatHtml(this.cauHinh.diaChi)})</span>
                <span>📞 Hotline: <strong>${window.DinhDang.thoatHtml(this.cauHinh.hotline)}</strong></span>
                <span>📶 Wi-Fi: <strong>${window.DinhDang.thoatHtml(this.cauHinh.wifiTen)}</strong> (${window.DinhDang.thoatHtml(this.cauHinh.wifiMatKhau)})</span>
            `;
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.cauHinhHeThongModule = new CauHinhHeThongModule();
