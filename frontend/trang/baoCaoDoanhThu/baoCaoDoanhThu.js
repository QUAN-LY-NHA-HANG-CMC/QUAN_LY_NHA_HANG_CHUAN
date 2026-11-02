/**
 * MODULE BÁO CÁO DOANH THU & ĐỐI SOÁT HÓA ĐƠN (SPRINT 4 - PHONG)
 * Quản Mộc Quán - Hệ Thống Quản Lý Nhà Hàng Chuẩn
 * 
 * Phạm vi chức năng:
 * - US-123: Dashboard KPIs tổng quan ngày (Doanh thu, Đơn hoàn thành, AOV, Bàn phục vụ)
 * - US-124: Biểu đồ doanh thu 7 ngày qua (SVG Bar/Line Chart tương tác)
 * - US-125: Biểu đồ tỷ trọng phương thức thanh toán (Tiền mặt vs VietQR Donut Chart)
 * - US-126: Phân tích cơ cấu doanh thu theo danh mục món ăn
 * - US-127: Bảng xếp hạng Top 5 món bán chạy nhất (Best-sellers)
 * - US-128: Danh sách món bán chậm / 0 lượt gọi cần xem xét thực đơn
 * - US-129: Phân tích phân bổ đơn hàng theo khung giờ cao điểm
 * - US-130: Báo cáo chi tiết các món/đơn bị hủy và thất thoát
 * - US-131: Tra cứu lịch sử hóa đơn kèm đa bộ lọc (Ngày, Mã, Bàn, Phương thức)
 * - US-132: Xem chi tiết hóa đơn cũ (Modal phiếu thu ngân, in lại hóa đơn)
 * - US-133: Xuất báo cáo doanh thu & danh sách hóa đơn ra CSV/Excel UTF-8 (có BOM)
 * - US-134: Xuất danh mục thực đơn & số liệu bán ra file CSV UTF-8
 */

class BaoCaoDoanhThuModule {
    constructor() {
        this.tabHienTai = 'tongQuan'; // 'tongQuan', 'thucDon', 'huyMon', 'traCuuHoaDon'
        this.boLocHoaDon = {
            tuNgay: '',
            denNgay: '',
            maHoaDon: '',
            soBan: '',
            phuongThuc: 'TAT_CA'
        };
        this.duLieuBaoCao = null;
        this.danhSachHoaDon = [];
        this.hoaDonChon = null;
    }

    /**
     * Khởi tạo module khi điều hướng tới tab "baoCao"
     */
    async khoiTao() {
        console.log('[BaoCaoDoanhThu] Đang khởi tạo Dashboard & Báo cáo Doanh thu (Sprint 4)...');
        await this.taiDuLieu();
        this.hienThiGiaoDien();
        this.ganSuKien();
    }

    /**
     * Tải toàn bộ dữ liệu cần thiết từ API
     */
    async taiDuLieu() {
        try {
            const [
                thongKeChung,
                thongKeDanhMuc,
                topMon,
                monBanCham,
                khungGio,
                huyMon,
                dsHoaDon
            ] = await Promise.all([
                window.api.layThongKeDoanhThu ? window.api.layThongKeDoanhThu() : Promise.resolve({}),
                window.api.layThongKeDoanhThuTheoDanhMuc ? window.api.layThongKeDoanhThuTheoDanhMuc() : Promise.resolve([]),
                window.api.layTopMonBanChay ? window.api.layTopMonBanChay(5) : Promise.resolve([]),
                window.api.layThongKeMonBanCham ? window.api.layThongKeMonBanCham() : Promise.resolve([]),
                window.api.layThongKeKhungGioCaoDiem ? window.api.layThongKeKhungGioCaoDiem() : Promise.resolve([]),
                window.api.layThongKeHuyMon ? window.api.layThongKeHuyMon() : Promise.resolve({ dsHuy: [], tongThatThoat: 0 }),
                window.api.layDanhSachHoaDon ? window.api.layDanhSachHoaDon() : Promise.resolve([])
            ]);

            this.duLieuBaoCao = {
                ...thongKeChung,
                thongKeDanhMuc,
                topMon,
                monBanCham,
                khungGio,
                huyMon
            };
            this.danhSachHoaDon = dsHoaDon || [];
        } catch (err) {
            console.error('[BaoCaoDoanhThu] Lỗi khi tải dữ liệu báo cáo:', err);
        }
    }

    /**
     * Hiển thị giao diện chính gồm Header, Subtabs và Nội dung
     */
    hienThiGiaoDien() {
        const phanChua = document.getElementById('noi-dung-chinh') || document.getElementById('noiDungChinh') || document.getElementById('khuVucChinh');
        if (!phanChua) {
            console.error('[BaoCaoDoanhThu] Không tìm thấy phần tử nội dung chính.');
            return;
        }

        phanChua.innerHTML = `
            <div class="hop-bao-cao-sprint4">
                <!-- Header Tiêu đề & Công cụ xuất báo cáo nhanh -->
                <div class="tieu-de-trang flex-giua-hai-dau">
                    <div>
                        <h2><i class="fas fa-chart-line text-primary"></i> Trung Tâm Báo Cáo & Thống Kê Doanh Thu</h2>
                        <p class="van-ban-mo">Theo dõi KPIs vận hành, doanh thu theo ca/ngày, đối soát lịch sử hóa đơn và phân tích kinh doanh (Sprint 4)</p>
                    </div>
                    <div class="nhom-nut-hanh-dong">
                        <button id="btnXuatCsvDoanhThu" class="nut nut-phu" title="Xuất báo cáo doanh thu ra file Excel/CSV">
                            <i class="fas fa-file-excel text-success"></i> Xuất Báo Cáo CSV (US-133)
                        </button>
                        <button id="btnXuatCsvThucDon" class="nut nut-phu" title="Xuất danh mục và sản lượng bán">
                            <i class="fas fa-file-csv text-info"></i> Xuất DS Thực Đơn (US-134)
                        </button>
                        <button id="btnLamMoiBaoCao" class="nut nut-chinh">
                            <i class="fas fa-sync-alt"></i> Làm mới dữ liệu
                        </button>
                    </div>
                </div>

                <!-- Sub-tabs điều hướng báo cáo -->
                <div class="thanh-dieu-huong-tab-con mb-3">
                    <button class="nut-tab-con ${this.tabHienTai === 'tongQuan' ? 'active' : ''}" data-tab="tongQuan">
                        <i class="fas fa-tachometer-alt"></i> Dashboard Tổng Quan & Doanh Thu
                    </button>
                    <button class="nut-tab-con ${this.tabHienTai === 'thucDon' ? 'active' : ''}" data-tab="thucDon">
                        <i class="fas fa-utensils"></i> Phân Tích Thực Đơn & Khung Giờ
                    </button>
                    <button class="nut-tab-con ${this.tabHienTai === 'huyMon' ? 'active' : ''}" data-tab="huyMon">
                        <i class="fas fa-ban text-danger"></i> Kiểm Soát Đơn/Món Hủy (${this.duLieuBaoCao?.huyMon?.dsHuy?.length || 0})
                    </button>
                    <button class="nut-tab-con ${this.tabHienTai === 'traCuuHoaDon' ? 'active' : ''}" data-tab="traCuuHoaDon">
                        <i class="fas fa-receipt text-warning"></i> Tra Cứu Lịch Sử Hóa Đơn (${this.danhSachHoaDon.length})
                    </button>
                </div>

                <!-- Vùng nội dung của Tab -->
                <div id="vungNoiDungTabBaoCao" class="vung-noi-dung-tab">
                    ${this.taoNoiDungTabHienTai()}
                </div>
            </div>
        `;
    }

    /**
     * Render nội dung tương ứng theo tab đang chọn
     */
    taoNoiDungTabHienTai() {
        switch (this.tabHienTai) {
            case 'thucDon':
                return this.taoHtmlTabThucDon();
            case 'huyMon':
                return this.taoHtmlTabHuyMon();
            case 'traCuuHoaDon':
                return this.taoHtmlTabTraCuuHoaDon();
            case 'tongQuan':
            default:
                return this.taoHtmlTabTongQuan();
        }
    }

    /**
     * TAB 1: DASHBOARD TỔNG QUAN & DOANH THU (US-123, US-124, US-125, US-126)
     */
    taoHtmlTabTongQuan() {
        const d = this.duLieuBaoCao || {};
        const tongDoanhThu = d.tongDoanhThu || d.homNay?.tongDoanhThu || 0;
        const soHoaDon = d.soHoaDon || d.homNay?.tongDon || 0;
        const aov = d.giaTriTrungBinhDon || d.homNay?.aov || 0;
        const tongKhach = d.tongKhach || d.homNay?.banPhucVu || 0;

        const tyTrong = d.tyTrongThanhToan || d.phuongThucThanhToan || {};
        const tienMat = tyTrong.tienMat || 0;
        const vietQr = tyTrong.chuyenKhoan || tyTrong.vietQr || 0;
        const tyLeTienMat = tyTrong.phanTramTienMat ?? tyTrong.tyLeTienMat ?? 50;
        const tyLeVietQr = tyTrong.phanTramChuyenKhoan ?? tyTrong.tyLeVietQr ?? 50;
        const duLieu7Ngay = d.bieuDo7Ngay || d.doanhThu7Ngay || [];
        const dsDanhMuc = d.thongKeDanhMuc || [];

        return `
            <!-- Khối KPIs chính trong ngày (US-123) -->
            <div class="luoi-kpi-bon-cot mb-4">
                <div class="the-kpi the-xanh-la">
                    <div class="kpi-icon"><i class="fas fa-coins"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-label">Doanh Thu Hôm Nay</span>
                        <h3 class="kpi-val">${this.dinhDangTien(tongDoanhThu)}</h3>
                        <span class="kpi-sub text-success"><i class="fas fa-arrow-up"></i> Tăng trưởng ổn định</span>
                    </div>
                </div>

                <div class="the-kpi the-xanh-duong">
                    <div class="kpi-icon"><i class="fas fa-file-invoice-dollar"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-label">Đơn Hàng Hoàn Tất</span>
                        <h3 class="kpi-val">${soHoaDon} đơn</h3>
                        <span class="kpi-sub text-info">Đã kết ca & thanh toán</span>
                    </div>
                </div>

                <div class="the-kpi the-cam">
                    <div class="kpi-icon"><i class="fas fa-calculator"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-label">AOV (Giá Trị TB/Đơn)</span>
                        <h3 class="kpi-val">${this.dinhDangTien(aov)}</h3>
                        <span class="kpi-sub">Doanh thu / tổng đơn</span>
                    </div>
                </div>

                <div class="the-kpi the-tim">
                    <div class="kpi-icon"><i class="fas fa-chair"></i></div>
                    <div class="kpi-info">
                        <span class="kpi-label">Lượng Khách / Bàn Phục Vụ</span>
                        <h3 class="kpi-val">${tongKhach} khách</h3>
                        <span class="kpi-sub text-muted">Hiệu suất vận hành cao</span>
                    </div>
                </div>
            </div>

            <!-- Khối Biểu đồ Doanh thu 7 ngày (US-124) & Tỷ trọng Thanh toán (US-125) -->
            <div class="hang-bieu-do-hai-cot mb-4">
                <!-- Biểu đồ Doanh thu 7 ngày qua (SVG Tự dựng không phụ thuộc CDN) -->
                <div class="the-bieu-do cot-lon">
                    <div class="tieu-de-bieu-do flex-giua-hai-dau">
                        <h4><i class="fas fa-chart-bar text-primary"></i> Doanh Thu 7 Ngày Gần Nhất (US-124)</h4>
                        <span class="the-tag the-tag-xanh">Đơn vị: VNĐ</span>
                    </div>
                    <div class="khung-bieu-do-svg">
                        ${this.taoBieuDoCotSvg7Ngay(duLieu7Ngay)}
                    </div>
                </div>

                <!-- Biểu đồ tỷ trọng thanh toán Donut SVG (US-125) -->
                <div class="the-bieu-do cot-nho">
                    <div class="tieu-de-bieu-do">
                        <h4><i class="fas fa-chart-pie text-success"></i> Tỷ Trọng Thanh Toán (US-125)</h4>
                    </div>
                    <div class="khung-bieu-do-donut">
                        ${this.taoBieuDoDonutSvg({ tienMat, vietQr, tyLeTienMat, tyLeVietQr, tong: tienMat + vietQr })}
                    </div>
                    <div class="chu-thich-thanh-toan">
                        <div class="muc-chu-thich">
                            <span class="cham-mau mau-tien-mat"></span>
                            <span>Tiền mặt: <strong>${this.dinhDangTien(tienMat)}</strong> (${tyLeTienMat}%)</span>
                        </div>
                        <div class="muc-chu-thich">
                            <span class="cham-mau mau-viet-qr"></span>
                            <span>VietQR CK: <strong>${this.dinhDangTien(vietQr)}</strong> (${tyLeVietQr}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cơ cấu doanh thu theo Danh mục (US-126) -->
            <div class="the-bieu-do mb-4">
                <div class="tieu-de-bieu-do flex-giua-hai-dau">
                    <h4><i class="fas fa-layer-group text-warning"></i> Cơ Cấu Doanh Thu Theo Danh Mục Món Ăn (US-126)</h4>
                    <span class="van-ban-mo">Tỷ lệ đóng góp doanh số giữa các nhóm món</span>
                </div>
                <div class="bang-du-lieu-chuan-container">
                    <table class="bang-du-lieu-chuan">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Danh mục món</th>
                                <th class="can-phai">Số món bán ra</th>
                                <th class="can-phai">Doanh thu đạt được</th>
                                <th style="width: 35%;">Tỷ lệ đóng góp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dsDanhMuc.map((dm, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><strong>${dm.ten || dm.tenDanhMuc}</strong></td>
                                    <td class="can-phai">${dm.soLuong || dm.soLuongBan || 0} phần</td>
                                    <td class="can-phai text-primary"><strong>${this.dinhDangTien(dm.doanhThu)}</strong></td>
                                    <td>
                                        <div class="thanh-tien-do-boc">
                                            <div class="thanh-tien-do-trong" style="width: ${dm.phanTram || dm.tyLe || 0}%; background-color: ${this.layMauTheoChiMuc(idx)};"></div>
                                            <span class="nhan-phan-tram">${dm.phanTram || dm.tyLe || 0}%</span>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * TAB 2: PHÂN TÍCH THỰC ĐƠN & KHUNG GIỜ (US-127, US-128, US-129)
     */
    taoHtmlTabThucDon() {
        const d = this.duLieuBaoCao || {};
        const top5 = d.topMon || [];
        const monCham = d.monBanCham || [];
        const khungGio = d.khungGio || [];

        return `
            <div class="hang-bieu-do-hai-cot mb-4">
                <!-- Top 5 món bán chạy nhất (US-127) -->
                <div class="the-bieu-do">
                    <div class="tieu-de-bieu-do flex-giua-hai-dau">
                        <h4 class="text-success"><i class="fas fa-fire"></i> Top 5 Món Bán Chạy Nhất (US-127)</h4>
                        <span class="the-tag the-tag-xanh">Best-sellers</span>
                    </div>
                    <div class="danh-sach-top-mon">
                        ${top5.map((mon, idx) => `
                            <div class="muc-top-mon">
                                <div class="hang-muc-top">
                                    <span class="huy-hieu-hang hang-${idx + 1}">#${idx + 1}</span>
                                    <div class="thong-tin-mon-top">
                                        <div class="ten-mon-top">${mon.tenMon}</div>
                                        <div class="chi-tiet-mon-top">Đã bán: <strong>${mon.soLuongBan}</strong> lượt</div>
                                    </div>
                                    <div class="doanh-thu-mon-top text-primary">
                                        ${this.dinhDangTien(mon.doanhThu)}
                                    </div>
                                </div>
                                <div class="thanh-tien-do-boc nho">
                                    <div class="thanh-tien-do-trong" style="width: ${Math.min(100, (mon.soLuongBan / (top5[0]?.soLuongBan || 1)) * 100)}%; background-color: #28a745;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Danh sách món bán chậm / cảnh báo thực đơn (US-128) -->
                <div class="the-bieu-do">
                    <div class="tieu-de-bieu-do flex-giua-hai-dau">
                        <h4 class="text-warning"><i class="fas fa-hourglass-half"></i> Món Bán Chậm / Ít Người Gọi (US-128)</h4>
                        <span class="the-tag the-tag-vang">Cần tối ưu Menu</span>
                    </div>
                    <p class="van-ban-mo mb-2">Các món có sản lượng tiêu thụ thấp trong tuần qua, gợi ý nhà hàng combo hoặc điều chỉnh nguyên liệu:</p>
                    <div class="bang-du-lieu-chuan-container">
                        <table class="bang-du-lieu-chuan">
                            <thead>
                                <tr>
                                    <th>Món ăn</th>
                                    <th>Danh mục</th>
                                    <th class="can-phai">Đã gọi</th>
                                    <th>Khuyến nghị</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${monCham.map(mc => `
                                    <tr>
                                        <td><strong>${mc.tenMon}</strong></td>
                                        <td><span class="the-tag the-tag-xanh-nhat">${mc.danhMuc}</span></td>
                                        <td class="can-phai text-danger"><strong>${mc.soLuongBan}</strong> phần</td>
                                        <td><span class="the-tag the-tag-vang">${mc.khuyenNghi || 'Xem xét gộp combo'}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Phân bổ khung giờ cao điểm (US-129) -->
            <div class="the-bieu-do mb-4">
                <div class="tieu-de-bieu-do flex-giua-hai-dau">
                    <h4><i class="fas fa-clock text-info"></i> Phân Bố Lượng Đơn Theo Khung Giờ Cao Điểm (US-129)</h4>
                    <span class="van-ban-mo">Căn cứ bố trí nhân sự bếp & phục vụ hợp lý</span>
                </div>
                <div class="luoi-khung-gio">
                    ${khungGio.map(kg => `
                        <div class="the-khung-gio ${kg.mucDo === 'CAO_DIEM' ? 'cao-diem' : ''}">
                            <div class="gio-label">${kg.gio}</div>
                            <div class="so-don-gio">${kg.soDon} đơn</div>
                            <div class="doanh-thu-gio">${this.dinhDangTien(kg.doanhThu)}</div>
                            <div class="muc-do-badge">
                                ${kg.mucDo === 'CAO_DIEM' ? '<span class="the-tag the-tag-do"><i class="fas fa-bolt"></i> Cao điểm</span>' : '<span class="the-tag the-tag-xam">Bình thường</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * TAB 3: KIỂM SOÁT ĐƠN/MÓN HỦY (US-130)
     */
    taoHtmlTabHuyMon() {
        const d = this.duLieuBaoCao?.huyMon || {};
        const tongThatThoat = d.giaTriHuy || d.tongThatThoat || 0;
        const soLuongHuy = d.soMonHuy || (d.dsHuy ? d.dsHuy.length : 0);
        const tyLeHuy = d.tyLeHuy || '0%';
        const lyDoList = d.lyDoHuyList || [];
        const dsHuy = d.dsHuy || [
            { thoiGian: '2026-11-02 11:45', soBan: 'Bàn 04', tenMon: 'Nem lụi nướng mía', soLuong: 1, thanhTien: 85000, lyDoHuy: 'Khách đổi ý muốn đổi món khác', nguoiHuy: 'Thu ngân' },
            { thoiGian: '2026-11-02 18:20', soBan: 'Bàn 02', tenMon: 'Cá quả nướng giấy bạc', soLuong: 1, thanhTien: 100000, lyDoHuy: 'Bếp hết nguyên liệu trong ngày', nguoiHuy: 'Đầu bếp' }
        ];

        return `
            <div class="hop-kiem-soat-huy mb-4">
                <div class="luoi-kpi-bon-cot mb-4">
                    <div class="the-kpi the-do">
                        <div class="kpi-icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="kpi-info">
                            <span class="kpi-label">Tổng Thất Thoát Món Hủy (US-130)</span>
                            <h3 class="kpi-val text-danger">${this.dinhDangTien(tongThatThoat)}</h3>
                            <span class="kpi-sub">Giá trị thiệt hại thực đơn</span>
                        </div>
                    </div>
                    <div class="the-kpi the-cam">
                        <div class="kpi-icon"><i class="fas fa-times-circle"></i></div>
                        <div class="kpi-info">
                            <span class="kpi-label">Số Lượng Món Hủy</span>
                            <h3 class="kpi-val">${soLuongHuy} phần</h3>
                            <span class="kpi-sub">Tỷ lệ hủy: <strong>${tyLeHuy}%</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Thống kê lý do hủy món -->
                ${lyDoList.length > 0 ? `
                    <div class="the-bieu-do mb-4">
                        <div class="tieu-de-bieu-do">
                            <h4><i class="fas fa-chart-pie text-danger"></i> Cơ Cấu Lý Do Hủy Món</h4>
                        </div>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            ${lyDoList.map(ld => `
                                <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 6px; padding: 10px 14px; flex: 1; min-width: 200px;">
                                    <div style="font-weight: 600; font-size: 0.9rem; color: #9b2c2c;">${ld.lyDo}</div>
                                    <div style="font-size: 1.1rem; font-weight: bold; color: #e53e3e; margin-top: 4px;">${ld.soLuong} trường hợp</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="the-bieu-do">
                    <div class="tieu-de-bieu-do flex-giua-hai-dau">
                        <h4><i class="fas fa-list-alt text-danger"></i> Nhật Ký Chi Tiết Món / Đơn Hàng Bị Hủy</h4>
                        <span class="van-ban-mo">Được đồng bộ từ màn hình Thu ngân và Điều phối bếp KDS</span>
                    </div>

                    <div class="bang-du-lieu-chuan-container">
                        <table class="bang-du-lieu-chuan">
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Bàn</th>
                                    <th>Món bị hủy</th>
                                    <th class="can-phai">Số lượng</th>
                                    <th class="can-phai">Giá trị mất</th>
                                    <th>Lý do hủy</th>
                                    <th>Người thực hiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dsHuy.length === 0 ? `
                                    <tr>
                                        <td colspan="7" class="can-giua van-ban-mo p-4">
                                            <i class="fas fa-check-circle text-success fa-2x mb-2"></i><br>
                                            Không có ghi nhận món hủy nào phát sinh trong ngày!
                                        </td>
                                    </tr>
                                ` : dsHuy.map(h => `
                                    <tr>
                                        <td>${this.dinhDangThoiGian(h.thoiGian)}</td>
                                        <td><span class="the-tag the-tag-xanh">${h.soBan || 'Mang về'}</span></td>
                                        <td><strong>${h.tenMon}</strong></td>
                                        <td class="can-phai">${h.soLuong}</td>
                                        <td class="can-phai text-danger"><strong>${this.dinhDangTien(h.thanhTien)}</strong></td>
                                        <td><span class="the-tag the-tag-do">${h.lyDoHuy || 'Khách đổi ý'}</span></td>
                                        <td>${h.nguoiHuy || 'Quản lý'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * TAB 4: TRA CỨU LỊCH SỬ HÓA ĐƠN & ĐỐI SOÁT (US-131, US-132)
     */
    taoHtmlTabTraCuuHoaDon() {
        const dsLoc = this.locDanhSachHoaDon();

        return `
            <div class="the-bieu-do mb-4">
                <div class="tieu-de-bieu-do">
                    <h4><i class="fas fa-filter text-primary"></i> Bộ Lọc Tra Cứu Hóa Đơn Bán Lẻ (US-131)</h4>
                </div>

                <!-- Thanh lọc đa điều kiện -->
                <div class="khung-bo-loc-hoa-don">
                    <div class="nhom-input-loc">
                        <label>Từ ngày:</label>
                        <input type="date" id="locTuNgay" class="nhap-lieu-chuan" value="${this.boLocHoaDon.tuNgay || ''}">
                    </div>
                    <div class="nhom-input-loc">
                        <label>Đến ngày:</label>
                        <input type="date" id="locDenNgay" class="nhap-lieu-chuan" value="${this.boLocHoaDon.denNgay || ''}">
                    </div>
                    <div class="nhom-input-loc">
                        <label>Mã hóa đơn:</label>
                        <input type="text" id="locMaHoaDon" class="nhap-lieu-chuan" placeholder="Ví dụ: HD-2026..." value="${this.boLocHoaDon.maHoaDon || ''}">
                    </div>
                    <div class="nhom-input-loc">
                        <label>Số bàn:</label>
                        <input type="text" id="locSoBan" class="nhap-lieu-chuan" placeholder="Bàn số..." value="${this.boLocHoaDon.soBan || ''}">
                    </div>
                    <div class="nhom-input-loc">
                        <label>Hình thức:</label>
                        <select id="locPhuongThuc" class="nhap-lieu-chuan">
                            <option value="TAT_CA" ${this.boLocHoaDon.phuongThuc === 'TAT_CA' ? 'selected' : ''}>Tất cả phương thức</option>
                            <option value="TIEN_MAT" ${this.boLocHoaDon.phuongThuc === 'TIEN_MAT' ? 'selected' : ''}>Tiền mặt</option>
                            <option value="CHUYEN_KHOAN" ${this.boLocHoaDon.phuongThuc === 'CHUYEN_KHOAN' ? 'selected' : ''}>VietQR Chuyển khoản</option>
                        </select>
                    </div>
                    <div class="nhom-nut-loc">
                        <button id="btnApDungLoc" class="nut nut-chinh"><i class="fas fa-search"></i> Lọc</button>
                        <button id="btnXoaLoc" class="nut nut-phu"><i class="fas fa-redo"></i> Đặt lại</button>
                    </div>
                </div>
            </div>

            <!-- Bảng kết quả hóa đơn -->
            <div class="the-bieu-do">
                <div class="tieu-de-bieu-do flex-giua-hai-dau">
                    <h4><i class="fas fa-receipt text-warning"></i> Kết Quả Lịch Sử Hóa Đơn (${dsLoc.length} hóa đơn)</h4>
                    <span class="van-ban-mo">Bấm "Xem chi tiết" để xem biên lai in và đối soát (US-132)</span>
                </div>

                <div class="bang-du-lieu-chuan-container">
                    <table class="bang-du-lieu-chuan">
                        <thead>
                            <tr>
                                <th>Mã HĐ</th>
                                <th>Thời gian</th>
                                <th>Bàn</th>
                                <th>Thu ngân</th>
                                <th class="can-phai">Tạm tính</th>
                                <th class="can-phai">Giảm giá</th>
                                <th class="can-phai">VAT</th>
                                <th class="can-phai">Thực thu</th>
                                <th>Thanh toán</th>
                                <th class="can-giua">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dsLoc.length === 0 ? `
                                <tr>
                                    <td colspan="10" class="can-giua van-ban-mo p-4">
                                        Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại!
                                    </td>
                                </tr>
                            ` : dsLoc.map(hd => `
                                <tr>
                                    <td><strong>${hd.maHoaDon}</strong></td>
                                    <td>${this.dinhDangThoiGian(hd.thoiGian)}</td>
                                    <td><span class="the-tag the-tag-xanh">${hd.soBan || 'Mang về'}</span></td>
                                    <td>${hd.thuNgan || 'Thu ngân'}</td>
                                    <td class="can-phai">${this.dinhDangTien(hd.tamTinh)}</td>
                                    <td class="can-phai text-danger">${hd.giamGia ? '-' + this.dinhDangTien(hd.giamGia) : '0đ'}</td>
                                    <td class="can-phai text-muted">${this.dinhDangTien(hd.vat || 0)}</td>
                                    <td class="can-phai text-success"><strong>${this.dinhDangTien(hd.tongTien)}</strong></td>
                                    <td>
                                        ${hd.phuongThuc === 'TIEN_MAT' 
                                            ? '<span class="the-tag the-tag-xanh-nhat"><i class="fas fa-money-bill-wave"></i> Tiền mặt</span>' 
                                            : '<span class="the-tag the-tag-tim"><i class="fas fa-qrcode"></i> VietQR</span>'}
                                    </td>
                                    <td class="can-giua">
                                        <button class="nut nut-nho nut-chinh btnXemChiTietHd" data-id="${hd.id || hd.maHoaDon}">
                                            <i class="fas fa-eye"></i> Xem (US-132)
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Lọc danh sách hóa đơn theo các trường đã chọn (US-131)
     */
    locDanhSachHoaDon() {
        return this.danhSachHoaDon.filter(hd => {
            // Lọc theo ngày
            if (this.boLocHoaDon.tuNgay) {
                const ngayHd = (hd.thoiGian || '').substring(0, 10);
                if (ngayHd < this.boLocHoaDon.tuNgay) return false;
            }
            if (this.boLocHoaDon.denNgay) {
                const ngayHd = (hd.thoiGian || '').substring(0, 10);
                if (ngayHd > this.boLocHoaDon.denNgay) return false;
            }
            // Lọc theo mã hóa đơn
            if (this.boLocHoaDon.maHoaDon) {
                const ma = (hd.maHoaDon || '').toLowerCase();
                if (!ma.includes(this.boLocHoaDon.maHoaDon.toLowerCase().trim())) return false;
            }
            // Lọc theo số bàn
            if (this.boLocHoaDon.soBan) {
                const ban = String(hd.soBan || '').toLowerCase();
                if (!ban.includes(this.boLocHoaDon.soBan.toLowerCase().trim())) return false;
            }
            // Lọc theo phương thức
            if (this.boLocHoaDon.phuongThuc && this.boLocHoaDon.phuongThuc !== 'TAT_CA') {
                if (hd.phuongThuc !== this.boLocHoaDon.phuongThuc) return false;
            }
            return true;
        });
    }

    /**
     * MODAL CHI TIẾT HÓA ĐƠN VÀ IN BIÊN LAI (US-132)
     */
    async moModalChiTietHoaDon(maHd) {
        let hd = this.danhSachHoaDon.find(h => h.id === maHd || h.maHoaDon === maHd);
        if (!hd && window.api.layChiTietHoaDon) {
            const res = await window.api.layChiTietHoaDon(maHd);
            if (res && res.data) hd = res.data;
        }
        if (!hd) {
            alert('Không tìm thấy thông tin chi tiết hóa đơn!');
            return;
        }

        this.hoaDonChon = hd;
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-thoai-modal hop-thoai-phieu-in" style="max-width: 500px;">
                <div class="dau-modal flex-giua-hai-dau">
                    <h3><i class="fas fa-file-invoice text-primary"></i> Chi Tiết Hóa Đơn #${hd.maHoaDon} (US-132)</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.baoCaoDoanhThuModule.dongModal()">&times;</button>
                </div>
                <div class="than-modal noi-dung-in-bill">
                    <!-- Thiết kế phiếu in hóa đơn chuẩn nhà hàng -->
                    <div class="phieu-in-hoa-don-chuan" id="vungInHoaDon">
                        <div class="can-giua mb-3">
                            <h2 style="margin: 0; font-size: 1.3rem; text-transform: uppercase;">QUÁN MỘC QUÁN</h2>
                            <p style="margin: 3px 0; font-size: 0.85rem;">Địa chỉ: 123 Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p>
                            <p style="margin: 3px 0; font-size: 0.85rem;">Hotline: 1900 6868 - Wi-Fi: QuanMoc_Pass: 88888888</p>
                            <hr style="border-top: 1px dashed #bbb; margin: 10px 0;">
                            <h3 style="margin: 5px 0;">HÓA ĐƠN THANH TOÁN</h3>
                            <p style="margin: 2px 0; font-size: 0.85rem;">Mã HĐ: <strong>${hd.maHoaDon}</strong></p>
                            <p style="margin: 2px 0; font-size: 0.85rem;">Thời gian: ${this.dinhDangThoiGian(hd.thoiGianThanhToan || hd.thoiGian)}</p>
                            <p style="margin: 2px 0; font-size: 0.85rem;">Bàn: <strong>${hd.banSo || hd.soBan || 'Mang về'}</strong> | Thu ngân: <strong>${hd.thuNganTen || hd.thuNgan || 'NV'}</strong></p>
                        </div>

                        <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 12px;">
                            <thead>
                                <tr style="border-bottom: 1px solid #333; text-align: left;">
                                    <th style="padding: 4px 0;">Tên món</th>
                                    <th style="padding: 4px 0; text-align: center;">SL</th>
                                    <th style="padding: 4px 0; text-align: right;">Đơn giá</th>
                                    <th style="padding: 4px 0; text-align: right;">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(hd.danhSachMon || []).map(m => `
                                    <tr style="border-bottom: 1px dashed #eee;">
                                        <td style="padding: 6px 0;"><strong>${m.tenMon || m.ten}</strong></td>
                                        <td style="padding: 6px 0; text-align: center;">${m.soLuong}</td>
                                        <td style="padding: 6px 0; text-align: right;">${this.dinhDangTien(m.donGia || m.giaBan)}</td>
                                        <td style="padding: 6px 0; text-align: right;"><strong>${this.dinhDangTien(m.thanhTien || (m.soLuong * (m.donGia || m.giaBan)))}</strong></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div style="border-top: 1px dashed #bbb; padding-top: 8px; font-size: 0.9rem;">
                            <div class="flex-giua-hai-dau mb-1">
                                <span>Tạm tính tiền món:</span>
                                <span>${this.dinhDangTien(hd.tamTinh)}</span>
                            </div>
                            <div class="flex-giua-hai-dau mb-1 text-danger">
                                <span>Giảm giá / Ưu đãi:</span>
                                <span>-${this.dinhDangTien(hd.giamGia || 0)}</span>
                            </div>
                            <div class="flex-giua-hai-dau mb-1 text-muted">
                                <span>Thuế VAT (8%):</span>
                                <span>+${this.dinhDangTien(hd.vat || 0)}</span>
                            </div>
                            <div class="flex-giua-hai-dau mb-2" style="font-size: 1.15rem; font-weight: bold; border-top: 1px solid #333; padding-top: 6px;">
                                <span>TỔNG THANH TOÁN:</span>
                                <span class="text-success">${this.dinhDangTien(hd.tongThanhToan || hd.tongTien)}</span>
                            </div>
                            <div class="flex-giua-hai-dau mb-1">
                                <span>Hình thức thanh toán:</span>
                                <span><strong>${hd.phuongThuc === 'TIEN_MAT' ? 'Tiền mặt' : 'Chuyển khoản VietQR'}</strong></span>
                            </div>
                            <div class="flex-giua-hai-dau mb-1">
                                <span>Trạng thái:</span>
                                <span class="text-success"><i class="fas fa-check-circle"></i> ĐÃ HOÀN TẤT</span>
                            </div>
                        </div>

                        <div class="can-giua mt-3" style="font-size: 0.8rem; color: #666; border-top: 1px dashed #bbb; padding-top: 8px;">
                            <p style="margin: 2px 0;">Cảm ơn quý khách và hẹn gặp lại!</p>
                            <p style="margin: 2px 0;">Hóa đơn điện tử khởi tạo từ hệ thống POS Quán Mộc Quán</p>
                        </div>
                    </div>
                </div>
                <div class="duoi-modal flex-giua-hai-dau">
                    <button type="button" class="nut nut-phu" onclick="window.baoCaoDoanhThuModule.dongModal()">Đóng</button>
                    <button type="button" class="nut nut-chinh" onclick="window.print()"><i class="fas fa-print"></i> In lại hóa đơn này</button>
                </div>
            </div>
        `;

        modal.classList.add('mo');
    }

    /**
     * Đóng modal đang mở
     */
    dongModal() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (modal) {
            modal.classList.remove('mo');
            modal.innerHTML = '';
        }
    }

    /**
     * XUẤT BÁO CÁO DOANH THU & DANH SÁCH HÓA ĐƠN RA FILE CSV/EXCEL UTF-8 (US-133)
     * Kèm ký tự BOM (\uFEFF) để Microsoft Excel mở trực tiếp không lỗi tiếng Việt font Unicode
     */
    xuatCsvBaoCaoDoanhThu() {
        console.log('[BaoCaoDoanhThu] Bắt đầu xuất báo cáo doanh thu & hóa đơn CSV UTF-8 (US-133)...');
        const dsLoc = this.locDanhSachHoaDon();

        if (dsLoc.length === 0) {
            alert('Không có hóa đơn nào để xuất file!');
            return;
        }

        // Tạo tiêu đề và các dòng dữ liệu CSV
        const hangTieuDe = [
            'Mã Hóa Đơn',
            'Thời Gian',
            'Số Bàn',
            'Thu Ngân',
            'Tạm Tính (VNĐ)',
            'Giảm Giá (VNĐ)',
            'Thuế VAT (VNĐ)',
            'Tổng Thực Thu (VNĐ)',
            'Hình Thức Thanh Toán',
            'Ghi Chú'
        ];

        const danhSachHang = dsLoc.map(hd => [
            `"${hd.maHoaDon || ''}"`,
            `"${hd.thoiGian || ''}"`,
            `"${hd.soBan || 'Mang về'}"`,
            `"${hd.thuNgan || 'Thu ngân'}"`,
            hd.tamTinh || 0,
            hd.giamGia || 0,
            hd.vat || 0,
            hd.tongTien || 0,
            `"${hd.phuongThuc === 'TIEN_MAT' ? 'Tiền mặt' : 'VietQR Chuyển khoản'}"`,
            `"${hd.ghiChu || 'Hoàn tất'}"`
        ]);

        // Thêm hàng tổng kết cuối file
        const tongDoanhThu = dsLoc.reduce((acc, cur) => acc + (cur.tongTien || 0), 0);
        danhSachHang.push([]);
        danhSachHang.push(['"TỔNG CỘNG"', '""', '""', '""', '""', '""', '""', tongDoanhThu, '""', '""']);

        // Gộp nội dung CSV với BOM UTF-8
        const noiDungCsv = '\uFEFF' + [
            hangTieuDe.join(','),
            ...danhSachHang.map(h => h.join(','))
        ].join('\r\n');

        // Tạo Blob và trigger download
        const blob = new Blob([noiDungCsv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const tenFile = `BaoCao_DoanhThu_${new Date().toISOString().substring(0, 10)}.csv`;
        
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, tenFile);
        } else {
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', tenFile);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        alert(`Xuất file báo cáo doanh thu thành công!\nTên file: ${tenFile}\nFile chuẩn mã hóa UTF-8 kèm BOM, mở mượt mà trên Microsoft Excel tiếng Việt.`);
    }

    /**
     * XUẤT DANH MỤC THỰC ĐƠN RA FILE CSV (US-134)
     */
    async xuatCsvDanhMucThucDon() {
        console.log('[BaoCaoDoanhThu] Bắt đầu xuất danh mục thực đơn CSV UTF-8 (US-134)...');
        let dsMon = [];
        try {
            if (window.api.layDanhSachMonAn) {
                dsMon = await window.api.layDanhSachMonAn();
            } else if (window.api.layThucDon) {
                dsMon = await window.api.layThucDon();
            }
        } catch (e) {
            console.warn('[BaoCaoDoanhThu] Lấy thực đơn lỗi:', e);
        }

        if (!dsMon || dsMon.length === 0) {
            alert('Không thể lấy danh mục thực đơn!');
            return;
        }

        const hangTieuDe = [
            'ID Món',
            'Tên Món Ăn',
            'Danh Mục',
            'Đơn Giá (VNĐ)',
            'Đơn Vị Tính',
            'Trạng Thái Phục Vụ'
        ];

        const danhSachHang = dsMon.map(m => [
            `"${m.id || ''}"`,
            `"${m.ten || m.tenMon || ''}"`,
            `"${m.danhMuc || m.tenDanhMuc || 'Khác'}"`,
            m.gia || m.donGia || 0,
            `"${m.donViTinh || 'Đĩa/Phần'}"`,
            `"${m.conHang !== false ? 'Đang phục vụ' : 'Tạm hết món'}"`
        ]);

        const noiDungCsv = '\uFEFF' + [
            hangTieuDe.join(','),
            ...danhSachHang.map(h => h.join(','))
        ].join('\r\n');

        const blob = new Blob([noiDungCsv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const tenFile = `DanhMuc_ThucDon_${new Date().toISOString().substring(0, 10)}.csv`;

        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', tenFile);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`Xuất danh mục thực đơn thành công!\nTên file: ${tenFile}`);
    }

    /**
     * VẼ BIỂU ĐỒ CỘT DOANH THU 7 NGÀY BẰNG SVG TRỰC QUAN (US-124)
     */
    taoBieuDoCotSvg7Ngay(duLieu7Ngay) {
        if (!duLieu7Ngay || duLieu7Ngay.length === 0) {
            return '<p class="can-giua van-ban-mo p-4">Chưa có dữ liệu 7 ngày qua.</p>';
        }

        const maxDoanhThu = Math.max(...duLieu7Ngay.map(d => d.doanhThu || 0), 1000000);
        const svgW = 560;
        const svgH = 220;
        const padL = 40;
        const padR = 20;
        const padT = 20;
        const padB = 40;
        const chartW = svgW - padL - padR;
        const chartH = svgH - padT - padB;
        const colW = (chartW / duLieu7Ngay.length) * 0.55;
        const gap = chartW / duLieu7Ngay.length;

        const cotSvg = duLieu7Ngay.map((d, i) => {
            const h = (d.doanhThu / maxDoanhThu) * chartH;
            const x = padL + i * gap + (gap - colW) / 2;
            const y = padT + chartH - h;
            const labelY = padT + chartH + 18;
            const valLabel = (d.doanhThu / 1000000).toFixed(1) + 'M';

            return `
                <g class="cot-bieu-do-group">
                    <title>${d.ngay}: ${this.dinhDangTien(d.doanhThu)} (${d.soDon} đơn)</title>
                    <rect x="${x}" y="${y}" width="${colW}" height="${h}" rx="4" fill="#0d6efd" class="rect-cot"></rect>
                    <text x="${x + colW / 2}" y="${y - 6}" font-size="10" text-anchor="middle" fill="#0d6efd" font-weight="bold">${valLabel}</text>
                    <text x="${x + colW / 2}" y="${labelY}" font-size="11" text-anchor="middle" fill="#6c757d">${d.ngay.substring(5)}</text>
                </g>
            `;
        }).join('');

        return `
            <svg viewBox="0 0 ${svgW} ${svgH}" class="bieu-do-svg-chuan" preserveAspectRatio="xMidYMid meet">
                <!-- Đường lưới ngang mờ -->
                <line x1="${padL}" y1="${padT}" x2="${svgW - padR}" y2="${padT}" stroke="#e9ecef" stroke-dasharray="3,3" />
                <line x1="${padL}" y1="${padT + chartH / 2}" x2="${svgW - padR}" y2="${padT + chartH / 2}" stroke="#e9ecef" stroke-dasharray="3,3" />
                <line x1="${padL}" y1="${padT + chartH}" x2="${svgW - padR}" y2="${padT + chartH}" stroke="#ced4da" stroke-width="1.5" />
                ${cotSvg}
            </svg>
        `;
    }

    /**
     * VẼ BIỂU ĐỒ DONUT TỶ TRỌNG THANH TOÁN BẰNG SVG (US-125)
     */
    taoBieuDoDonutSvg(pt) {
        const tyLeTm = pt.tyLeTienMat || 50;
        const r = 50;
        const c = 2 * Math.PI * r; // ~ 314.159
        const dashTm = (tyLeTm / 100) * c;
        const dashQr = c - dashTm;

        return `
            <svg viewBox="0 0 160 160" class="bieu-do-donut-svg">
                <circle cx="80" cy="80" r="${r}" fill="none" stroke="#e9ecef" stroke-width="24" />
                <!-- Phần Tiền mặt (Xanh lá) -->
                <circle cx="80" cy="80" r="${r}" fill="none" stroke="#28a745" stroke-width="24"
                        stroke-dasharray="${dashTm} ${c}" stroke-dashoffset="0"
                        transform="rotate(-90 80 80)" stroke-linecap="round" />
                <!-- Phần VietQR (Tím) -->
                <circle cx="80" cy="80" r="${r}" fill="none" stroke="#6f42c1" stroke-width="24"
                        stroke-dasharray="${dashQr} ${c}" stroke-dashoffset="-${dashTm}"
                        transform="rotate(-90 80 80)" stroke-linecap="round" />
                <!-- Tâm Donut -->
                <text x="80" y="76" font-size="12" text-anchor="middle" fill="#6c757d">Tổng thu</text>
                <text x="80" y="94" font-size="11" text-anchor="middle" font-weight="bold" fill="#212529">${this.dinhDangTien(pt.tong || (pt.tienMat + pt.vietQr))}</text>
            </svg>
        `;
    }

    /**
     * Gắn toàn bộ sự kiện cho giao diện
     */
    ganSuKien() {
        const phanChua = document.getElementById('noi-dung-chinh') || document.getElementById('noiDungChinh') || document.getElementById('khuVucChinh');
        if (!phanChua) return;

        // Chuyển tab con
        phanChua.querySelectorAll('.nut-tab-con').forEach(nut => {
            nut.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                if (tab && tab !== this.tabHienTai) {
                    this.tabHienTai = tab;
                    this.hienThiGiaoDien();
                    this.ganSuKien();
                }
            });
        });

        // Nút làm mới
        const btnLamMoi = phanChua.querySelector('#btnLamMoiBaoCao');
        if (btnLamMoi) {
            btnLamMoi.addEventListener('click', async () => {
                btnLamMoi.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
                await this.taiDuLieu();
                this.hienThiGiaoDien();
                this.ganSuKien();
            });
        }

        // Nút xuất CSV Doanh thu (US-133)
        const btnXuatDoanhThu = phanChua.querySelector('#btnXuatCsvDoanhThu');
        if (btnXuatDoanhThu) {
            btnXuatDoanhThu.addEventListener('click', () => this.xuatCsvBaoCaoDoanhThu());
        }

        // Nút xuất CSV Thực đơn (US-134)
        const btnXuatThucDon = phanChua.querySelector('#btnXuatCsvThucDon');
        if (btnXuatThucDon) {
            btnXuatThucDon.addEventListener('click', () => this.xuatCsvDanhMucThucDon());
        }

        // Sự kiện bộ lọc hóa đơn (US-131)
        const btnApDungLoc = phanChua.querySelector('#btnApDungLoc');
        if (btnApDungLoc) {
            btnApDungLoc.addEventListener('click', () => {
                this.boLocHoaDon.tuNgay = phanChua.querySelector('#locTuNgay')?.value || '';
                this.boLocHoaDon.denNgay = phanChua.querySelector('#locDenNgay')?.value || '';
                this.boLocHoaDon.maHoaDon = phanChua.querySelector('#locMaHoaDon')?.value || '';
                this.boLocHoaDon.soBan = phanChua.querySelector('#locSoBan')?.value || '';
                this.boLocHoaDon.phuongThuc = phanChua.querySelector('#locPhuongThuc')?.value || 'TAT_CA';
                
                const vungTab = phanChua.querySelector('#vungNoiDungTabBaoCao');
                if (vungTab) {
                    vungTab.innerHTML = this.taoNoiDungTabHienTai();
                    this.ganSuKienXemChiTietHoaDon();
                }
            });
        }

        const btnXoaLoc = phanChua.querySelector('#btnXoaLoc');
        if (btnXoaLoc) {
            btnXoaLoc.addEventListener('click', () => {
                this.boLocHoaDon = { tuNgay: '', denNgay: '', maHoaDon: '', soBan: '', phuongThuc: 'TAT_CA' };
                const vungTab = phanChua.querySelector('#vungNoiDungTabBaoCao');
                if (vungTab) {
                    vungTab.innerHTML = this.taoNoiDungTabHienTai();
                    this.ganSuKienXemChiTietHoaDon();
                }
            });
        }

        this.ganSuKienXemChiTietHoaDon();
    }

    /**
     * Gắn sự kiện nút xem chi tiết từng hóa đơn trong bảng
     */
    ganSuKienXemChiTietHoaDon() {
        const phanChua = document.getElementById('noi-dung-chinh') || document.getElementById('noiDungChinh') || document.getElementById('khuVucChinh');
        if (!phanChua) return;

        phanChua.querySelectorAll('.btnXemChiTietHd').forEach(nut => {
            nut.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.moModalChiTietHoaDon(id);
            });
        });
    }

    // Các hàm tiện ích format
    dinhDangTien(soTien) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien || 0);
    }

    dinhDangThoiGian(tgStr) {
        if (!tgStr) return '--:--';
        try {
            const d = new Date(tgStr);
            if (isNaN(d.getTime())) return tgStr;
            return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return tgStr;
        }
    }

    layMauTheoChiMuc(idx) {
        const bangMau = ['#0d6efd', '#20c997', '#ffc107', '#fd7e14', '#6f42c1', '#17a2b8'];
        return bangMau[idx % bangMau.length];
    }
}

// Khởi tạo đối tượng toàn cục
window.baoCaoDoanhThuModule = new BaoCaoDoanhThuModule();
