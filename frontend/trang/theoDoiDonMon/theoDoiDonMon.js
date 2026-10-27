/**
 * PHÂN HỆ THEO DÕI ĐƠN MÓN & ĐẶT MÓN THỜI GIAN THỰC (theoDoiDonMon.js)
 * Phụ trách: Phong (Sprint 2 Lead - US-063 -> US-078)
 * 
 * Đáp ứng đầy đủ các User Story của Sprint 2:
 * - US-063: Xác nhận và gửi yêu cầu đặt món (Order) từ giỏ hàng xuống hệ thống
 * - US-064: Nhận thông báo xác nhận đặt món thành công ngay trên màn hình
 * - US-065: Xem danh sách toàn bộ các món đã gọi trong phiên ngồi tại bàn
 * - US-066: Theo dõi trạng thái từng món ăn (Chờ xác nhận, Đang chế biến, Đã xong, Đã lên món)
 * - US-067: Đặt thêm lượt món mới (Order bổ sung) trong cùng một phiên ăn
 * - US-068: Khách hàng yêu cầu hủy món khi món vẫn đang ở trạng thái "Chờ xác nhận"
 * - US-069: Nhận thông báo trên màn hình nếu Bếp từ chối món do vừa hết nguyên liệu
 * - US-070: Xem tổng chi phí lũy kế của tất cả các lượt gọi món tại bàn
 * - US-071 -> US-074: Tương tác hỗ trợ tại bàn (Gọi nhân viên / Yêu cầu thanh toán)
 * - US-075 -> US-078: Đồng bộ thời gian thực (Real-time Sync) & Chuông báo âm thanh Web Audio
 */

class TheoDoiDonMonModule {
    constructor() {
        this.banIdHienTai = 3; // Mặc định Bàn 03 - Tầng 1
        this.boLocTrangThai = 'TAT_CA'; // 'TAT_CA' | 'CHO_XAC_NHAN' | 'DANG_CHE_BIEN' | 'DA_LEN_MON' | 'DA_HUY'
        this.duLieuDonBan = null;
        this.danhSachBan = [];
        this.dangLangNghe = false;
    }

    /**
     * Khởi tạo giao diện trang theo dõi đơn món
     */
    async khoiTao(banId = null) {
        if (banId) this.banIdHienTai = Number(banId);
        
        // Cập nhật cho widget hỗ trợ tại bàn
        if (window.hoTroTaiBan) {
            window.hoTroTaiBan.datBanHienTai(this.banIdHienTai);
        }

        this.dangKySuKienSocket();
        await this.taiDanhSachBan();
        await this.taiDuLieuVaVe();
    }

    /**
     * Lắng nghe các sự kiện thời gian thực (US-075 -> US-078)
     */
    dangKySuKienSocket() {
        if (this.dangLangNghe || !window.socketClient) return;

        // Khi có đơn mới gửi xuống (US-075)
        window.socketClient.khiCoSuKien('order:moi', (donMoi) => {
            if (Number(donMoi.banId) === Number(this.banIdHienTai)) {
                this.taiDuLieuVaVe();
            }
        });

        // Khi trạng thái món thay đổi từ Bếp (US-076)
        window.socketClient.khiCoSuKien('order:capNhatTrangThai', (data) => {
            if (Number(data.banId) === Number(this.banIdHienTai)) {
                this.taiDuLieuVaVe();
            }
        });

        // Khi Bếp từ chối món do hết nguyên liệu (US-069)
        window.socketClient.khiCoSuKien('order:tuChoiMon', (data) => {
            if (Number(data.banId) === Number(this.banIdHienTai)) {
                this.taiDuLieuVaVe();
            }
        });

        // Khi nhân viên tiếp nhận yêu cầu hỗ trợ (US-074)
        window.socketClient.khiCoSuKien('hoTro:tiepNhan', (data) => {
            if (Number(data.banId) === Number(this.banIdHienTai)) {
                this.taiDuLieuVaVe();
            }
        });

        this.dangLangNghe = true;
    }

    /**
     * Tải danh sách bàn ăn để tạo bộ chuyển đổi bàn nhanh
     */
    async taiDanhSachBan() {
        if (window.api) {
            this.danhSachBan = await window.api.layDanhSachBanAn();
        }
    }

    /**
     * Tải dữ liệu đơn hàng của bàn và render giao diện
     */
    async taiDuLieuVaVe() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        if (!window.api) {
            vungChua.innerHTML = `<div class="khung-loi">Không tìm thấy dịch vụ API.</div>`;
            return;
        }

        const phanHoi = await window.api.layDanhSachDonTheoBan(this.banIdHienTai);
        this.duLieuDonBan = phanHoi.ok ? phanHoi.data : { danhSachDon: [], tongTienLuyKe: 0, thongKe: {} };
        const dsYeuCau = await window.api.layDanhSachYeuCauHoTro(this.banIdHienTai);

        this.veGiaoDien(vungChua, this.duLieuDonBan, dsYeuCau);
    }

    /**
     * Render toàn bộ trang
     */
    veGiaoDien(vungChua, data, dsYeuCau) {
        const { soBan, khuVucTen, danhSachDon, tongTienLuyKe, thongKe } = data;
        const yeuCauDangCho = (dsYeuCau || []).filter(y => y.trangThai !== 'DA_XU_LY');

        vungChua.innerHTML = `
            <div class="trang-theo-doi-don-mon">
                <!-- THANH TIÊU ĐỀ & CHỌN BÀN KIỂM THỬ -->
                <div class="thanh-tieu-de-trang-s2">
                    <div class="thong-tin-ban-s2">
                        <div class="bieu-tuong-ban-s2">🍽️</div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <h2 class="ten-ban-tieu-de">${soBan || 'Bàn 03'}</h2>
                                <span class="badge badge-xanh-la">${khuVucTen || 'Tầng 1'}</span>
                                <span class="badge badge-cam">Sprint 2 • Phong</span>
                            </div>
                            <p class="mo-ta-phien-ban">
                                ⏱️ Phiên ngồi tại bàn: Đang hoạt động • Mã phiên: <strong>SES-B${this.banIdHienTai}-LIVE</strong>
                            </p>
                        </div>
                    </div>

                    <div class="nhom-thao-tac-dau-trang-s2">
                        <!-- Chọn chuyển bàn để test -->
                        <div class="hop-chon-ban-test">
                            <label for="chon-ban-theo-doi" style="font-size: 12px; font-weight: 600; color: var(--mau-chu-phu);">Xem đơn bàn:</label>
                            <select id="chon-ban-theo-doi" class="nut-select-ban" onchange="window.theoDoiDonMonModule.chuyenBanTheoDoi(this.value)">
                                ${this.danhSachBan.map(b => `
                                    <option value="${b.id}" ${Number(b.id) === Number(this.banIdHienTai) ? 'selected' : ''}>
                                        ${b.soBan} (${b.khuVucTen || 'KV'}) - ${b.trangThai}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Nút Gọi thêm món mới (US-067) -->
                        <button type="button" class="nut nut-chinh" onclick="window.theoDoiDonMonModule.moModalGoiThemMon()">
                            ➕ Gọi thêm món (Lượt mới)
                        </button>
                    </div>
                </div>

                <!-- BẢNG CÔNG CỤ GIẢ LẬP REAL-TIME (TEST SIMULATOR CHO GIẢNG VIÊN / TESTER) -->
                <div class="bang-dieu-khien-gia-lap-s2">
                    <div class="tieu-de-gia-lap">
                        <span>🧪 <strong>Thanh kiểm thử tương tác Real-time (Sprint 2 - Phong):</strong></span>
                        <small style="color: var(--mau-chu-phu);">Click để mô phỏng tương tác từ Bếp/Thu ngân ngay trên trình duyệt mà không cần Backend thật</small>
                    </div>
                    <div class="cac-nut-gia-lap">
                        <button type="button" class="nut-mini-test nut-test-nau" onclick="window.theoDoiDonMonModule.giaLapBepChuyenTrangThai('DANG_CHE_BIEN')">
                            👨‍🍳 Bếp bắt đầu nấu
                        </button>
                        <button type="button" class="nut-mini-test nut-test-xong" onclick="window.theoDoiDonMonModule.giaLapBepChuyenTrangThai('DA_XONG')">
                            🔔 Bếp nấu xong
                        </button>
                        <button type="button" class="nut-mini-test nut-test-phuc-vu" onclick="window.theoDoiDonMonModule.giaLapBepChuyenTrangThai('DA_LEN_MON')">
                            ✅ Đã bưng lên bàn
                        </button>
                        <button type="button" class="nut-mini-test nut-test-tu-choi" onclick="window.theoDoiDonMonModule.giaLapBepTuChoiMon()">
                            🚫 Bếp từ chối (Hết món - US-069)
                        </button>
                        <button type="button" class="nut-mini-test nut-test-chuong" onclick="window.socketClient && window.socketClient.phatAmThanh('donMoi')">
                            🔊 Thử chuông báo (US-078)
                        </button>
                        <button type="button" class="nut-mini-test nut-test-nhan-vien" onclick="window.theoDoiDonMonModule.giaLapNhanVienTiepNhan()">
                            🏃 NV tiếp nhận hỗ trợ (US-074)
                        </button>
                    </div>
                </div>

                <!-- THÔNG BÁO YÊU CẦU HỖ TRỢ ĐANG CHỜ (US-074) -->
                ${yeuCauDangCho.length > 0 ? `
                    <div class="khung-thong-bao-yeu-cau-ho-tro">
                        <div class="dau-thong-bao-yc">
                            <span>🔔 <strong>Yêu cầu hỗ trợ tại bàn đang được xử lý (${yeuCauDangCho.length})</strong></span>
                        </div>
                        <div class="danh-sach-yc-item">
                            ${yeuCauDangCho.map(yc => `
                                <div class="item-yeu-cau-cho ${yc.trangThai === 'DA_TIEP_NHAN' ? 'da-tiep-nhan' : ''}">
                                    <div class="icon-yc">${yc.loaiYeuCau === 'THANH_TOAN' ? '💳' : '🙋'}</div>
                                    <div class="noi-dung-yc">
                                        <strong>${yc.tenYeuCau}</strong>
                                        <small>${yc.chiTiet || 'Không có ghi chú thêm'} • ${yc.thoiGian.substring(11, 16)}</small>
                                    </div>
                                    <div class="trang-thai-yc-badge">
                                        ${yc.trangThai === 'DA_TIEP_NHAN' 
                                            ? `<span class="badge badge-xanh-la">✅ ${yc.nguoiTiepNhan || 'Nhân viên'} đang tới!</span>` 
                                            : `<span class="badge badge-vang">⏳ Đang gửi tới nhân viên...</span>`}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- THẺ TỔNG QUAN TIẾN ĐỘ & TỔNG TIỀN LŨY KẾ (US-070) -->
                <div class="luoi-the-thong-ke-s2">
                    <div class="the-tk-s2 the-tk-tien">
                        <div class="icon-tk-s2">💵</div>
                        <div>
                            <span class="nhan-tk-s2">Tổng tiền lũy kế (US-070)</span>
                            <h3 class="gia-tri-tk-s2 gia-tri-tien">${tongTienLuyKe.toLocaleString('vi-VN')} đ</h3>
                            <small class="chu-thich-tk">${danhSachDon.length} lượt gọi món trong phiên</small>
                        </div>
                    </div>

                    <div class="the-tk-s2">
                        <div class="icon-tk-s2 icon-cho">⏳</div>
                        <div>
                            <span class="nhan-tk-s2">Chờ Bếp duyệt</span>
                            <h3 class="gia-tri-tk-s2">${thongKe.choXacNhan || 0} <span class="dvt">món</span></h3>
                            <small class="chu-thich-tk">Có thể yêu cầu hủy</small>
                        </div>
                    </div>

                    <div class="the-tk-s2">
                        <div class="icon-tk-s2 icon-nau">👨‍🍳</div>
                        <div>
                            <span class="nhan-tk-s2">Đang chế biến</span>
                            <h3 class="gia-tri-tk-s2">${thongKe.dangCheBien || 0} <span class="dvt">món</span></h3>
                            <small class="chu-thich-tk">Đầu bếp đang nấu</small>
                        </div>
                    </div>

                    <div class="the-tk-s2">
                        <div class="icon-tk-s2 icon-xong">🔔</div>
                        <div>
                            <span class="nhan-tk-s2">Đã nấu xong</span>
                            <h3 class="gia-tri-tk-s2">${thongKe.daXong || 0} <span class="dvt">món</span></h3>
                            <small class="chu-thich-tk">Chờ bưng lên bàn</small>
                        </div>
                    </div>

                    <div class="the-tk-s2">
                        <div class="icon-tk-s2 icon-phuc-vu">✅</div>
                        <div>
                            <span class="nhan-tk-s2">Đã lên món</span>
                            <h3 class="gia-tri-tk-s2">${thongKe.daLenMon || 0} <span class="dvt">món</span></h3>
                            <small class="chu-thich-tk">Khách đang thưởng thức</small>
                        </div>
                    </div>
                </div>

                <!-- THANH TÁC VỤ & BỘ LỌC TRẠNG THÁI -->
                <div class="thanh-loc-trang-thai-s2">
                    <div class="nhom-nut-loc-s2">
                        <button type="button" class="nut-loc-pill ${this.boLocTrangThai === 'TAT_CA' ? 'kich-hoat' : ''}" onclick="window.theoDoiDonMonModule.locTrangThai('TAT_CA')">
                            Tất cả (${thongKe.tongSoMon || 0})
                        </button>
                        <button type="button" class="nut-loc-pill ${this.boLocTrangThai === 'CHO_XAC_NHAN' ? 'kich-hoat' : ''}" onclick="window.theoDoiDonMonModule.locTrangThai('CHO_XAC_NHAN')">
                            ⏳ Chờ duyệt (${thongKe.choXacNhan || 0})
                        </button>
                        <button type="button" class="nut-loc-pill ${this.boLocTrangThai === 'DANG_CHE_BIEN' ? 'kich-hoat' : ''}" onclick="window.theoDoiDonMonModule.locTrangThai('DANG_CHE_BIEN')">
                            👨‍🍳 Đang nấu (${thongKe.dangCheBien || 0})
                        </button>
                        <button type="button" class="nut-loc-pill ${this.boLocTrangThai === 'DA_LEN_MON' ? 'kich-hoat' : ''}" onclick="window.theoDoiDonMonModule.locTrangThai('DA_LEN_MON')">
                            ✅ Đã lên món (${thongKe.daLenMon || 0})
                        </button>
                        <button type="button" class="nut-loc-pill ${this.boLocTrangThai === 'DA_HUY' ? 'kich-hoat' : ''}" onclick="window.theoDoiDonMonModule.locTrangThai('DA_HUY')">
                            ❌ Đã hủy / Từ chối (${(thongKe.daHuy || 0) + (thongKe.tuChoi || 0)})
                        </button>
                    </div>

                    <div class="nhom-nut-ho-tro-nhanh">
                        <button type="button" class="nut nut-phu nut-nho" onclick="window.hoTroTaiBan.moModalGoiNhanVien()">
                            🙋 Gọi phục vụ
                        </button>
                        <button type="button" class="nut nut-phu nut-nho" onclick="window.hoTroTaiBan.moModalYeuCauThanhToan()">
                            💳 Yêu cầu thanh toán
                        </button>
                    </div>
                </div>

                <!-- DANH SÁCH CÁC LƯỢT GỌI MÓN (ROUNDS - US-065 & US-067) -->
                ${danhSachDon.length === 0 ? `
                    <div class="khung-trong">
                        <div style="font-size: 54px; margin-bottom: 12px;">🍲</div>
                        <h3>Bàn này chưa gọi món nào!</h3>
                        <p style="color: var(--mau-chu-phu); max-width: 480px; margin: 8px auto 20px;">
                            Bàn ăn đang trống hoặc vừa mở phiên mới. Hãy bấm "Gọi thêm món" để gửi đơn đặt món đầu tiên nhé!
                        </p>
                        <button type="button" class="nut nut-chinh" onclick="window.theoDoiDonMonModule.moModalGoiThemMon()">
                            ➕ Bắt đầu đặt món ngay
                        </button>
                    </div>
                ` : `
                    <div class="danh-sach-cac-luot-goi-mon">
                        ${danhSachDon.slice().reverse().map((don) => this.veTheLuotGoiMon(don)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    /**
     * Render thẻ một lượt gọi món (Round)
     */
    veTheLuotGoiMon(don) {
        // Áp dụng bộ lọc
        let dsMon = don.danhSachMon;
        if (this.boLocTrangThai === 'CHO_XAC_NHAN') dsMon = dsMon.filter(m => m.trangThai === 'CHO_XAC_NHAN');
        else if (this.boLocTrangThai === 'DANG_CHE_BIEN') dsMon = dsMon.filter(m => m.trangThai === 'DANG_CHE_BIEN' || m.trangThai === 'DA_XONG');
        else if (this.boLocTrangThai === 'DA_LEN_MON') dsMon = dsMon.filter(m => m.trangThai === 'DA_LEN_MON');
        else if (this.boLocTrangThai === 'DA_HUY') dsMon = dsMon.filter(m => m.trangThai === 'DA_HUY' || m.trangThai === 'TU_CHOI');

        if (dsMon.length === 0 && this.boLocTrangThai !== 'TAT_CA') {
            return ''; // Không có món nào thỏa mãn bộ lọc trong lượt này
        }

        return `
            <div class="the-luot-goi-mon">
                <!-- Đầu thẻ lượt gọi -->
                <div class="dau-the-luot-goi">
                    <div class="thong-tin-luot">
                        <span class="badge-luot-goi">Lượt gọi #${don.luotGoi}</span>
                        <span class="ma-don-hang">Mã: <strong>${don.maDon}</strong></span>
                        <span class="thoi-gian-don">🕒 ${don.thoiGianTao}</span>
                    </div>
                    <div class="tong-tien-luot">
                        <span>Lượt này: <strong>${don.tongTien.toLocaleString('vi-VN')} đ</strong></span>
                    </div>
                </div>

                ${don.ghiChuDon ? `
                    <div class="ghi-chu-chung-don">
                        💬 <strong>Ghi chú đơn:</strong> ${don.ghiChuDon}
                    </div>
                ` : ''}

                <!-- Danh sách món ăn trong lượt -->
                <div class="danh-sach-mon-trong-luot">
                    ${dsMon.map(mon => this.veDongMonAn(mon, don)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render từng món ăn kèm thanh Stepper tiến độ 4 bước (US-066) và nút Hủy món (US-068)
     */
    veDongMonAn(mon, don) {
        const laChoXacNhan = mon.trangThai === 'CHO_XAC_NHAN';
        const laDangNau = mon.trangThai === 'DANG_CHE_BIEN';
        const laDaXong = mon.trangThai === 'DA_XONG';
        const laDaLenMon = mon.trangThai === 'DA_LEN_MON';
        const laDaHuy = mon.trangThai === 'DA_HUY';
        const laTuChoi = mon.trangThai === 'TU_CHOI';

        return `
            <div class="dong-mon-an-s2 ${laDaHuy || laTuChoi ? 'mon-bi-huy' : ''}">
                <div class="cot-thong-tin-mon">
                    <div class="ten-va-so-luong">
                        <span class="so-luong-badge">x${mon.soLuong}</span>
                        <strong class="ten-mon-an-txt">${mon.tenMon}</strong>
                        ${mon.size && mon.size !== 'Tiêu chuẩn' ? `<span class="badge-size-topping">${mon.size}</span>` : ''}
                        ${mon.topping ? `<span class="badge-size-topping">${mon.topping}</span>` : ''}
                    </div>

                    ${mon.ghiChu ? `
                        <div class="ghi-chu-khau-vi-s2">
                            📝 <strong>Khẩu vị:</strong> ${mon.ghiChu}
                        </div>
                    ` : ''}

                    ${laTuChoi ? `
                        <div class="canh-bao-bep-tu-choi-box">
                            🚫 <strong>Bếp từ chối món:</strong> ${mon.lyDoTuChoi || 'Hết nguyên liệu trong ngày'} (Đã trừ tiền)
                        </div>
                    ` : ''}

                    ${laDaHuy ? `
                        <div class="canh-bao-huy-box">
                            ❌ <strong>Món đã hủy:</strong> ${mon.lyDoHuy || 'Khách yêu cầu hủy'} (Đã trừ tiền)
                        </div>
                    ` : ''}
                </div>

                <!-- Cột Stepper tiến độ thời gian thực (US-066) -->
                ${!laDaHuy && !laTuChoi ? `
                    <div class="cot-tien-do-stepper">
                        <div class="thanh-stepper-4-buoc">
                            <div class="buoc-stepper ${laChoXacNhan || laDangNau || laDaXong || laDaLenMon ? 'hoan-thanh' : ''} ${laChoXacNhan ? 'hien-tai' : ''}">
                                <div class="dau-cham-buoc">⏳</div>
                                <span class="nhan-buoc">Chờ xác nhận</span>
                            </div>
                            <div class="duong-noi-buoc ${laDangNau || laDaXong || laDaLenMon ? 'da-qua' : ''}"></div>

                            <div class="buoc-stepper ${laDangNau || laDaXong || laDaLenMon ? 'hoan-thanh' : ''} ${laDangNau ? 'hien-tai' : ''}">
                                <div class="dau-cham-buoc">👨‍🍳</div>
                                <span class="nhan-buoc">Đang nấu</span>
                            </div>
                            <div class="duong-noi-buoc ${laDaXong || laDaLenMon ? 'da-qua' : ''}"></div>

                            <div class="buoc-stepper ${laDaXong || laDaLenMon ? 'hoan-thanh' : ''} ${laDaXong ? 'hien-tai' : ''}">
                                <div class="dau-cham-buoc">🔔</div>
                                <span class="nhan-buoc">Đã xong</span>
                            </div>
                            <div class="duong-noi-buoc ${laDaLenMon ? 'da-qua' : ''}"></div>

                            <div class="buoc-stepper ${laDaLenMon ? 'hoan-thanh' : ''} ${laDaLenMon ? 'hien-tai' : ''}">
                                <div class="dau-cham-buoc">✅</div>
                                <span class="nhan-buoc">Đã lên bàn</span>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="cot-tien-do-stepper">
                        <span class="badge badge-do">${laTuChoi ? '🚫 Bếp từ chối' : '❌ Đã hủy món'}</span>
                    </div>
                `}

                <!-- Cột Thành tiền & Nút hủy món (US-068) -->
                <div class="cot-gia-va-thao-tac">
                    <div class="gia-mon-txt ${laDaHuy || laTuChoi ? 'gach-gia' : ''}">
                        ${mon.thanhTien.toLocaleString('vi-VN')} đ
                    </div>

                    ${laChoXacNhan ? `
                        <button type="button" class="nut-huy-mon-mini" onclick="window.theoDoiDonMonModule.xacNhanHuyMon(${mon.id}, '${mon.tenMon}')" title="Hủy món khi Bếp chưa nấu (US-068)">
                            ❌ Hủy món này
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Chuyển đổi bàn theo dõi
     */
    chuyenBanTheoDoi(banId) {
        this.banIdHienTai = Number(banId);
        if (window.hoTroTaiBan) {
            window.hoTroTaiBan.datBanHienTai(this.banIdHienTai);
        }
        this.taiDuLieuVaVe();
    }

    /**
     * Lọc trạng thái món
     */
    locTrangThai(trangThai) {
        this.boLocTrangThai = trangThai;
        this.taiDuLieuVaVe();
    }

    /**
     * US-068: Hộp thoại xác nhận hủy món khi còn chờ xác nhận
     */
    xacNhanHuyMon(idMonChiTiet, tenMon) {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-thoai-modal hop-thoai-xac-nhan" style="max-width: 440px;">
                <div class="dau-modal">
                    <h3 style="color: #DC2626;">❌ Xác Nhận Hủy Món (US-068)</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.theoDoiDonMonModule.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <p style="font-size: 14px; color: #1F2937; margin-bottom: 12px;">
                        Bạn có chắc chắn muốn hủy món: <strong>${tenMon}</strong>?
                    </p>
                    <p style="font-size: 12px; color: var(--mau-chu-phu); margin-bottom: 14px;">
                        Món này đang ở trạng thái <em>Chờ xác nhận</em> nên được phép hủy trực tiếp. Sau khi hủy, hệ thống sẽ tự động trừ số tiền này khỏi hóa đơn.
                    </p>
                    <div class="nhom-form">
                        <label class="nhan-form">Lý do hủy món:</label>
                        <select id="ly-do-huy-select" class="nhap-du-lieu">
                            <option value="Khách đổi ý không muốn ăn nữa">Khách đổi ý không muốn ăn nữa</option>
                            <option value="Khách muốn đổi sang món khác">Khách muốn đổi sang món khác</option>
                            <option value="Bấm nhầm số lượng">Bấm nhầm số lượng</option>
                            <option value="Thời gian chờ lâu">Thời gian chờ lâu</option>
                        </select>
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.theoDoiDonMonModule.dongModal()">Không hủy</button>
                    <button type="button" class="nut nut-nguy-hiem" onclick="window.theoDoiDonMonModule.thucHienHuyMon(${idMonChiTiet})">
                        Xác nhận hủy món
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    async thucHienHuyMon(idMonChiTiet) {
        const select = document.getElementById('ly-do-huy-select');
        const lyDo = select ? select.value : 'Khách yêu cầu hủy';

        const kq = await window.api.huyMonChuaCheBien(idMonChiTiet, this.banIdHienTai, lyDo);
        this.dongModal();

        if (kq && kq.ok) {
            if (window.thongBao) {
                window.thongBao.thanhCong('Hủy món thành công', kq.msg);
            }
            this.taiDuLieuVaVe();
        } else {
            if (window.thongBao) {
                window.thongBao.thatBai('Không thể hủy món', kq ? kq.msg : 'Có lỗi');
            }
        }
    }

    /**
     * US-067: Mở Modal gọi thêm món (Order bổ sung lượt mới)
     */
    async moModalGoiThemMon() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        // Lấy danh sách thực đơn đang bán
        const dsMon = await window.api.layDanhSachMonAn({ trangThai: 1 });

        modal.innerHTML = `
            <div class="hop-thoai-modal hop-thoai-goi-them-mon" style="max-width: 650px;">
                <div class="dau-modal">
                    <h3>➕ Gọi Thêm Món (Lượt Bổ Sung) - Bàn ${this.banIdHienTai}</h3>
                    <button type="button" class="nut-dong-modal" onclick="window.theoDoiDonMonModule.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <p style="font-size: 13px; color: var(--mau-chu-phu); margin-bottom: 14px;">
                        Chọn món ăn để gọi thêm vào phiên ăn hiện tại. Đơn bổ sung sẽ được đánh số lượt tiếp theo (US-067):
                    </p>

                    <!-- Danh sách chọn món nhanh -->
                    <div class="luoi-mon-an-goi-them">
                        ${dsMon.slice(0, 6).map(m => `
                            <div class="the-mon-goi-them-item" data-mon-id="${m.id}">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                    <strong>${m.tenMon}</strong>
                                    <span class="gia-mon-them">${m.giaBan.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div style="font-size:11px; color: var(--mau-chu-phu); margin: 4px 0 8px;">${m.donViTinh}</div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <input type="text" class="ghi-chu-mon-them nhap-du-lieu-mini" placeholder="Ghi chú khẩu vị..." style="width: 65%;">
                                    <button type="button" class="nut nut-chinh nut-nho nut-them-vao-luot" onclick="window.theoDoiDonMonModule.chonMonVaoLuot(${m.id}, '${m.tenMon}', ${m.giaBan})">
                                        + Chọn
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 16px; border-top: 1px solid var(--mau-vien); padding-top: 12px;">
                        <h4 style="font-size: 14px; margin-bottom: 8px;">📋 Món đã chọn cho lượt bổ sung này:</h4>
                        <div id="danh-sach-mon-da-chon-them" style="min-height: 48px; background: #F9FAFB; border-radius: 8px; padding: 10px; font-size: 13px;">
                            <span style="color: #9CA3AF;">Chưa chọn món nào. Hãy bấm nút "+ Chọn" ở các món bên trên.</span>
                        </div>
                    </div>

                    <div class="nhom-form" style="margin-top: 12px;">
                        <label class="nhan-form">Ghi chú chung cho lượt gọi thêm này:</label>
                        <input type="text" id="ghi-chu-luot-moi" class="nhap-du-lieu" placeholder="Ví dụ: Mang kèm nước chấm chanh ớt...">
                    </div>
                </div>
                <div class="duoi-modal">
                    <button type="button" class="nut nut-phu" onclick="window.theoDoiDonMonModule.dongModal()">Hủy</button>
                    <button type="button" class="nut nut-chinh" id="nut-gui-order-bo-sung" onclick="window.theoDoiDonMonModule.guiOrderBoSung()" disabled>
                        🚀 Gửi Bếp lượt gọi thêm
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
        this.gioHangBoSung = [];
    }

    chonMonVaoLuot(idMon, tenMon, donGia) {
        if (!this.gioHangBoSung) this.gioHangBoSung = [];
        
        // Kiểm tra xem đã có chưa
        const tonTai = this.gioHangBoSung.find(m => m.id === idMon);
        if (tonTai) {
            tonTai.soLuong += 1;
        } else {
            this.gioHangBoSung.push({
                id: idMon,
                tenMon,
                donGia,
                soLuong: 1,
                size: 'Tiêu chuẩn',
                topping: '',
                ghiChu: ''
            });
        }

        this.capNhatKhungMonDaChon();
    }

    capNhatKhungMonDaChon() {
        const khung = document.getElementById('danh-sach-mon-da-chon-them');
        const btnGui = document.getElementById('nut-gui-order-bo-sung');
        if (!khung) return;

        if (!this.gioHangBoSung || this.gioHangBoSung.length === 0) {
            khung.innerHTML = `<span style="color: #9CA3AF;">Chưa chọn món nào. Hãy bấm nút "+ Chọn" ở các món bên trên.</span>`;
            if (btnGui) btnGui.disabled = true;
            return;
        }

        let tongTam = 0;
        khung.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${this.gioHangBoSung.map((m, idx) => {
                    const tien = m.donGia * m.soLuong;
                    tongTam += tien;
                    return `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#FFF; padding:6px 10px; border-radius:6px; border:1px solid #E5E7EB;">
                            <div>
                                <strong>${m.tenMon}</strong> x${m.soLuong} 
                                <span style="color:#B85D19;">(${tien.toLocaleString('vi-VN')}đ)</span>
                            </div>
                            <button type="button" onclick="window.theoDoiDonMonModule.xoaMonKhoiGio(${idx})" style="background:none; border:none; color:#EF4444; cursor:pointer; font-weight:bold;">✕</button>
                        </div>
                    `;
                }).join('')}
                <div style="text-align:right; font-weight:bold; margin-top:4px; color:#2C1810;">
                    Tạm tính lượt mới: ${tongTam.toLocaleString('vi-VN')} đ
                </div>
            </div>
        `;
        if (btnGui) btnGui.disabled = false;
    }

    xoaMonKhoiGio(index) {
        if (this.gioHangBoSung) {
            this.gioHangBoSung.splice(index, 1);
            this.capNhatKhungMonDaChon();
        }
    }

    /**
     * Xác nhận gửi Order bổ sung (US-063, US-064, US-067)
     */
    async guiOrderBoSung() {
        if (!this.gioHangBoSung || this.gioHangBoSung.length === 0) return;

        const ghiChuDon = document.getElementById('ghi-chu-luot-moi')?.value.trim() || '';

        const donGoi = {
            banId: this.banIdHienTai,
            ghiChuDon,
            danhSachMon: this.gioHangBoSung
        };

        const kq = await window.api.taoDonGoiMon(donGoi);
        this.dongModal();

        if (kq && kq.ok) {
            if (window.thongBao) {
                window.thongBao.thanhCong('Gửi đơn thành công (US-064)', kq.msg);
            }
            this.taiDuLieuVaVe();
        } else {
            if (window.thongBao) {
                window.thongBao.thatBai('Không thể gửi đơn', kq ? kq.msg : 'Có lỗi');
            }
        }
    }

    // =========================================================================
    // CÁC HÀM GIẢ LẬP REAL-TIME CHO TESTER / GIẢNG VIÊN (US-075 -> US-078)
    // =========================================================================

    /**
     * Giả lập Bếp chuyển trạng thái món ăn đầu tiên còn ở trạng thái trước
     */
    async giaLapBepChuyenTrangThai(trangThaiDich) {
        if (!this.duLieuDonBan || !this.duLieuDonBan.danhSachDon) return;

        // Tìm món phù hợp để chuyển trạng thái
        let monCanChuyen = null;
        for (const don of this.duLieuDonBan.danhSachDon) {
            for (const mon of don.danhSachMon) {
                if (trangThaiDich === 'DANG_CHE_BIEN' && mon.trangThai === 'CHO_XAC_NHAN') {
                    monCanChuyen = mon;
                    break;
                } else if (trangThaiDich === 'DA_XONG' && mon.trangThai === 'DANG_CHE_BIEN') {
                    monCanChuyen = mon;
                    break;
                } else if (trangThaiDich === 'DA_LEN_MON' && (mon.trangThai === 'DA_XONG' || mon.trangThai === 'DANG_CHE_BIEN')) {
                    monCanChuyen = mon;
                    break;
                }
            }
            if (monCanChuyen) break;
        }

        if (!monCanChuyen) {
            if (window.thongBao) {
                window.thongBao.canhBao('Không có món phù hợp', `Hiện không có món nào để chuyển sang trạng thái "${trangThaiDich}".`);
            }
            return;
        }

        const kq = await window.api.capNhatTrangThaiMonAn(monCanChuyen.id, this.banIdHienTai, trangThaiDich);
        if (kq.ok) {
            if (window.thongBao) {
                window.thongBao.thongTin('Real-time Bếp cập nhật', `Món [${monCanChuyen.tenMon}] đã chuyển sang: ${trangThaiDich}`);
            }
            this.taiDuLieuVaVe();
        }
    }

    /**
     * Giả lập Bếp từ chối món do hết nguyên liệu (US-069)
     */
    async giaLapBepTuChoiMon() {
        if (!this.duLieuDonBan || !this.duLieuDonBan.danhSachDon) return;

        // Tìm món đang chờ hoặc đang nấu
        let monCanTuChoi = null;
        for (const don of this.duLieuDonBan.danhSachDon) {
            for (const mon of don.danhSachMon) {
                if (mon.trangThai === 'CHO_XAC_NHAN' || mon.trangThai === 'DANG_CHE_BIEN') {
                    monCanTuChoi = mon;
                    break;
                }
            }
            if (monCanTuChoi) break;
        }

        if (!monCanTuChoi) {
            if (window.thongBao) {
                window.thongBao.canhBao('Không có món', 'Không có món nào đang chờ chế biến để từ chối.');
            }
            return;
        }

        const lyDo = 'Bếp trưởng thông báo vừa hết nguyên liệu tươi của món này trong ngày';
        await window.api.tuChoiMonTuBep(monCanTuChoi.id, this.banIdHienTai, lyDo);
        this.taiDuLieuVaVe();
    }

    /**
     * Giả lập nhân viên tiếp nhận yêu cầu hỗ trợ (US-074)
     */
    async giaLapNhanVienTiepNhan() {
        const ds = await window.api.layDanhSachYeuCauHoTro(this.banIdHienTai);
        const yc = ds.find(y => y.trangThai === 'CHO_TIEP_NHAN');

        if (!yc) {
            if (window.thongBao) {
                window.thongBao.canhBao('Không có yêu cầu chờ', 'Bàn này hiện không có yêu cầu hỗ trợ nào đang chờ tiếp nhận. Hãy bấm "Gọi phục vụ" trước nhé!');
            }
            return;
        }

        await window.api.tiepNhanYeuCauHoTro(yc.id, 'Phạm Văn Phục Vụ (Tầng 1)');
        this.taiDuLieuVaVe();
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
window.theoDoiDonMonModule = new TheoDoiDonMonModule();
