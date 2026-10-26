/**
 * MODULE WEB GỌI MÓN E-MENU QR (thucDonQr.js)
 * Phụ trách: Quân (Frontend Lead - Client & POS)
 * Tuân thủ 100% Đặc tả API Sprint 2 của Backend (Minh)
 *
 * Chức năng:
 * - US-045 -> US-049: Khởi tạo E-Menu qua QR, nhận diện bàn & token bảo mật
 * - US-050 -> US-056: Duyệt thực đơn Mobile-first, món bán chạy, tìm kiếm, lọc giá, khóa món tạm hết
 * - US-071 -> US-073: Nút nổi yêu cầu hỗ trợ tại bàn (Gọi nhân viên / Yêu cầu thanh toán)
 */

class ThucDonQrManager {
    constructor() {
        // Thông tin bàn & token mặc định (theo quy định của Minh để kiểm thử)
        this.banId = 1;
        this.token = 'a405d1729525dfb8e91350df4e32b0da';
        
        this.thongTinBan = null;
        this.thongTinNhaHang = null;
        this.dsDanhMuc = [];
        this.dsMonBanChay = [];
        this.dsMonAnHienTai = [];
        
        this.danhMucDangChon = 'TAT_CA';
        this.tuKhoaTimKiem = '';
        this.khoangGiaDangChon = 'TAT_CA';
        this.cheDoXemMobile = true; // Khung điện thoại hoặc toàn màn hình
    }

    /**
     * Khởi tạo giao diện E-Menu
     */
    async khoiTao(banIdChiDinh = null, tokenChiDinh = null) {
        console.log('📱 Khởi tạo E-Menu Gọi món QR theo đặc tả Sprint 2...');

        // 1. Nhận diện banId và token từ URL hoặc tham số
        this.nhanDienThamSoUrl(banIdChiDinh, tokenChiDinh);

        // 2. Gọi API khởi tạo trang chủ E-Menu (US-050)
        await this.taiThongTinTrangChu();

        // 3. Tải danh sách món ăn ban đầu
        await this.taiDanhSachMonAn();

        // 4. Render giao diện
        this.veGiaoDien();
    }

    /**
     * Nhận diện tham số banId & token từ URL (US-045, US-046, US-049)
     */
    nhanDienThamSoUrl(banIdChiDinh, tokenChiDinh) {
        if (banIdChiDinh && tokenChiDinh) {
            this.banId = banIdChiDinh;
            this.token = tokenChiDinh;
            return;
        }

        // Đọc từ URL query string (?banId=1&token=...)
        const urlParams = new URLSearchParams(window.location.search);
        const banIdUrl = urlParams.get('banId') || urlParams.get('ban');
        const tokenUrl = urlParams.get('token');

        // Hoặc đọc từ URL Hash (#e-menu?banId=1&token=...)
        let banIdHash = null, tokenHash = null;
        if (window.location.hash.includes('?')) {
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
            banIdHash = hashParams.get('banId') || hashParams.get('ban');
            tokenHash = hashParams.get('token');
        }

        this.banId = banIdUrl || banIdHash || localStorage.getItem('quanmoc_ban_id_hien_tai') || 1;
        this.token = tokenUrl || tokenHash || localStorage.getItem('quanmoc_token_hien_tai') || 'a405d1729525dfb8e91350df4e32b0da';

        // Lưu phiên bàn (US-049)
        localStorage.setItem('quanmoc_ban_id_hien_tai', this.banId);
        localStorage.setItem('quanmoc_token_hien_tai', this.token);
    }

    /**
     * Tải thông tin trang chủ E-Menu từ Backend (US-050)
     * Endpoint: GET /api/public/e-menu?banId=...&token=...
     */
    async taiThongTinTrangChu() {
        try {
            const res = await window.api.layThongTinEMenu(this.banId, this.token);
            if (res && res.ok && res.data) {
                this.thongTinNhaHang = res.data.nhaHang;
                this.thongTinBan = res.data.thongTinBan;
                this.dsDanhMuc = res.data.danhMuc || [];
                this.dsMonBanChay = res.data.monBanChay || [];

                // Đồng bộ bàn với Giỏ hàng
                if (window.gioHangManager) {
                    window.gioHangManager.ganThongTinBan(this.thongTinBan, this.token);
                }
            }
        } catch (loi) {
            console.error('Lỗi khi tải trang chủ E-Menu:', loi);
        }
    }

    /**
     * Tải danh sách món ăn có lọc & tìm kiếm (US-051, US-054)
     * Endpoint: GET /api/public/e-menu/mon-an
     */
    async taiDanhSachMonAn() {
        try {
            let giaMin = null, giaMax = null;
            if (this.khoangGiaDangChon === 'DUOI_50') { giaMax = 50000; }
            else if (this.khoangGiaDangChon === '50_100') { giaMin = 50000; giaMax = 100000; }
            else if (this.khoangGiaDangChon === '100_200') { giaMin = 100000; giaMax = 200000; }
            else if (this.khoangGiaDangChon === 'TREN_200') { giaMin = 200000; }

            const res = await window.api.layDanhSachMonAnEMenu({
                danhMucId: this.danhMucDangChon,
                tuKhoa: this.tuKhoaTimKiem,
                giaMin: giaMin,
                giaMax: giaMax
            });

            if (res && res.ok) {
                this.dsMonAnHienTai = res.data || [];
            }
        } catch (loi) {
            console.error('Lỗi khi tải danh sách món ăn:', loi);
            this.dsMonAnHienTai = [];
        }
    }

    /**
     * Render toàn bộ giao diện E-Menu
     */
    veGiaoDien() {
        if (typeof document === 'undefined') return;
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        const ban = this.thongTinBan || { banId: 1, maBan: 'B101', tenBan: 'Bàn 01', tenKhuVuc: 'Tầng 1 - Sảnh chính' };
        const quan = this.thongTinNhaHang || { tenQuan: 'Nhà Hàng Quán Mộc', hotline: '1900 6868', diaChi: '123 Đường Ẩm Thực' };

        vungChua.innerHTML = `
            <div class="khung-emenu-wrapper">
                
                <!-- Thanh điều khiển Demo kiểm thử (Theo cấu hình Minh gửi) -->
                <div class="thanh-dieu-khien-emenu">
                    <div class="nhom-chon-ban-demo">
                        <label for="select-ban-demo">🪑 <strong>Mô phỏng Bàn:</strong></label>
                        <select id="select-ban-demo" class="select-chon-ban-emenu" onchange="window.thucDonQr.chuyenBanDemo(this.value)">
                            <option value="1" ${this.banId == 1 ? 'selected' : ''}>Bàn 01 (ID: 1) - Token test mẫu của Minh</option>
                            <option value="2" ${this.banId == 2 ? 'selected' : ''}>Bàn 02 (ID: 2) - Tầng 1</option>
                            <option value="7" ${this.banId == 7 ? 'selected' : ''}>Bàn 07 (ID: 7) - Tầng 2</option>
                            <option value="10" ${this.banId == 10 ? 'selected' : ''}>Bàn 10 (ID: 10) - Sân vườn</option>
                        </select>
                    </div>

                    <div class="nhom-chuyen-che-do">
                        <button class="nut ${this.cheDoXemMobile ? 'nut-chinh' : 'nut-phu'}" onclick="window.thucDonQr.doiCheDoXem(true)">
                            📱 Khung điện thoại
                        </button>
                        <button class="nut ${!this.cheDoXemMobile ? 'nut-chinh' : 'nut-phu'}" onclick="window.thucDonQr.doiCheDoXem(false)">
                            💻 Toàn màn hình
                        </button>
                    </div>
                </div>

                <!-- KHUNG CHÍNH E-MENU MOBILE -->
                <div class="khung-dien-thoai-ngoai ${this.cheDoXemMobile ? 'che-do-mobile-phone' : 'che-do-full-screen'}">
                    <div class="man-hinh-dien-thoai">
                        
                        <!-- 1. Header E-Menu Quán Mộc (US-050) -->
                        <header class="header-emenu">
                            <div class="hang-dau-header">
                                <div class="logo-emenu">🍽️</div>
                                <div class="thong-tin-quan-emenu">
                                    <h2 class="ten-quan-emenu">${window.DinhDang.thoatHtml(quan.tenQuan)}</h2>
                                    <p class="khau-hieu-emenu">Hương vị dân dã - Đậm đà tình thân</p>
                                </div>
                                <div class="the-ban-hien-tai">
                                    <div class="chu-ban">${window.DinhDang.thoatHtml(ban.tenBan)}</div>
                                    <div class="chu-khu-vuc">${window.DinhDang.thoatHtml(ban.tenKhuVuc)}</div>
                                </div>
                            </div>

                            <div class="hang-phu-header">
                                <span>📶 Wi-Fi: <strong>QuanMoc_KhachHang</strong></span>
                                <span>📞 Hotline: <strong>${window.DinhDang.thoatHtml(quan.hotline)}</strong></span>
                            </div>
                        </header>

                        <!-- 2. Thanh tìm kiếm & Bộ lọc khoảng giá (US-054) -->
                        <div class="khung-tim-kiem-emenu">
                            <div class="hop-tim-kiem-emenu">
                                <span class="icon-tim-kiem">🔍</span>
                                <input type="text" id="input-tim-mon-emenu" placeholder="Tìm tên món (Bò, Lẩu, Gỏi...)" 
                                       value="${window.DinhDang.thoatHtml(this.tuKhoaTimKiem)}" 
                                       oninput="window.thucDonQr.xuLyTimKiem(this.value)">
                                ${this.tuKhoaTimKiem ? `<button class="nut-xoa-tim-kiem" onclick="window.thucDonQr.xoaTimKiem()">✕</button>` : ''}
                            </div>

                            <div class="hang-loc-gia-emenu">
                                <span class="nhan-loc-gia">Khoảng giá:</span>
                                <div class="cac-muc-loc-gia">
                                    <button class="chip-gia ${this.khoangGiaDangChon === 'TAT_CA' ? 'chon' : ''}" 
                                            onclick="window.thucDonQr.locKhoangGia('TAT_CA')">Tất cả</button>
                                    <button class="chip-gia ${this.khoangGiaDangChon === 'DUOI_50' ? 'chon' : ''}" 
                                            onclick="window.thucDonQr.locKhoangGia('DUOI_50')">&lt; 50k</button>
                                    <button class="chip-gia ${this.khoangGiaDangChon === '50_100' ? 'chon' : ''}" 
                                            onclick="window.thucDonQr.locKhoangGia('50_100')">50k - 100k</button>
                                    <button class="chip-gia ${this.khoangGiaDangChon === '100_200' ? 'chon' : ''}" 
                                            onclick="window.thucDonQr.locKhoangGia('100_200')">100k - 200k</button>
                                    <button class="chip-gia ${this.khoangGiaDangChon === 'TREN_200' ? 'chon' : ''}" 
                                            onclick="window.thucDonQr.locKhoangGia('TREN_200')">&gt; 200k</button>
                                </div>
                            </div>
                        </div>

                        <!-- 3. Thanh danh mục cuộn ngang (US-052) -->
                        <nav class="thanh-danh-muc-ngang">
                            <button class="item-danh-muc ${this.danhMucDangChon === 'TAT_CA' ? 'kich-hoat' : ''}" 
                                    onclick="window.thucDonQr.chonDanhMuc('TAT_CA')">
                                <span class="icon-dm">🌟</span>
                                <span class="ten-dm">Tất cả</span>
                            </button>
                            ${this.dsDanhMuc.map(dm => `
                                <button class="item-danh-muc ${this.danhMucDangChon == dm.id ? 'kich-hoat' : ''}" 
                                        onclick="window.thucDonQr.chonDanhMuc('${dm.id}')">
                                    <span class="icon-dm">${this.layIconDanhMuc(dm.tenDanhMuc)}</span>
                                    <span class="ten-dm">${window.DinhDang.thoatHtml(dm.tenDanhMuc)}</span>
                                </button>
                            `).join('')}
                        </nav>

                        <!-- 4. Danh sách món ăn E-Menu (US-053, US-055, US-056) -->
                        <div class="than-danh-sach-emenu" id="danh-sach-mon-emenu">
                            ${this.taoDanhSachMonAnHtml()}
                        </div>

                        <!-- 5. Nút Hỗ Trợ Tại Bàn Nổi (US-071 -> US-073) -->
                        <div class="nut-ho-tro-noi-emenu" onclick="window.thucDonQr.moModalYeuCauHoTro()">
                            <span>🔔 Gọi phục vụ / Tính tiền</span>
                        </div>

                        <!-- 6. Floating Cart Bar Nổi (US-058) -->
                        <div id="vung-floating-cart"></div>

                    </div>
                </div>
            </div>
        `;

        // Vẽ Floating Cart Bar
        if (window.gioHangManager) {
            window.gioHangManager.veThanhGioHangNoi();
        }
    }

    /**
     * Tạo HTML danh sách món ăn
     */
    taoDanhSachMonAnHtml() {
        if (!this.dsMonAnHienTai || this.dsMonAnHienTai.length === 0) {
            return `
                <div class="khung-trong-emenu">
                    <div style="font-size: 40px; margin-bottom: 8px;">🍽️</div>
                    <h3>Không tìm thấy món ăn phù hợp</h3>
                    <p style="color: var(--mau-chu-phu); font-size: 13px; margin-top: 4px;">
                        Vui lòng thử tìm từ khóa khác hoặc xóa bộ lọc khoảng giá.
                    </p>
                    <button class="nut nut-phu" style="margin-top: 12px;" onclick="window.thucDonQr.datLaiBoLoc()">
                        🔄 Xem tất cả thực đơn
                    </button>
                </div>
            `;
        }

        // Món bán chạy Carousel (US-053)
        let htmlMonBanChay = '';
        if (this.danhMucDangChon === 'TAT_CA' && !this.tuKhoaTimKiem && this.khoangGiaDangChon === 'TAT_CA') {
            const dsHot = this.dsMonBanChay.length > 0 
                ? this.dsMonBanChay 
                : this.dsMonAnHienTai.filter(m => m.laMonBanChay && m.trangThai !== 'TamHet');

            if (dsHot.length > 0) {
                htmlMonBanChay = `
                    <div class="phan-muc-emenu">
                        <div class="tieu-de-phan-muc">
                            <span>🔥 MÓN BÁN CHẠY NHẤT</span>
                            <span class="badge badge-do" style="font-size: 11px;">Gợi ý từ Quán Mộc</span>
                        </div>
                        <div class="danh-sach-ban-chay-carousel">
                            ${dsHot.map(mon => this.taoCardMonBanChay(mon)).join('')}
                        </div>
                    </div>
                `;
            }
        }

        // Danh sách thẻ món ăn (US-055, US-056)
        const htmlDanhSachChinh = `
            <div class="phan-muc-emenu">
                <div class="tieu-de-phan-muc">
                    <span>${this.layTieuDeDanhMucHienTai()}</span>
                    <span class="so-luong-mon-dm">${this.dsMonAnHienTai.length} món</span>
                </div>
                <div class="luoi-mon-an-emenu">
                    ${this.dsMonAnHienTai.map(mon => this.taoCardMonAn(mon)).join('')}
                </div>
            </div>
        `;

        return `
            ${htmlMonBanChay}
            ${htmlDanhSachChinh}
        `;
    }

    /**
     * Card Món bán chạy
     */
    taoCardMonBanChay(mon) {
        const urlAnh = window.DinhDang.chuanHoaUrlHinhAnh(mon.hinhAnh, mon.tenMon);
        const giaFmt = window.DinhDang.tienVnd(mon.giaBan);

        return `
            <div class="card-mon-ban-chay" onclick="window.gioHangManager.moModalTuyChinhMon(${mon.id})">
                <div class="hop-anh-ban-chay">
                    <img src="${urlAnh}" alt="${window.DinhDang.thoatHtml(mon.tenMon)}" loading="lazy"
                         onerror="this.src='${window.DinhDang.layAnhMacDinh(mon.tenMon)}'">
                    <span class="badge-hot">⭐ Bán chạy</span>
                </div>
                <div class="thong-tin-ban-chay">
                    <div class="ten-mon-ban-chay">${window.DinhDang.thoatHtml(mon.tenMon)}</div>
                    <div class="gia-mon-ban-chay">${giaFmt}</div>
                    <button class="nut-them-nhanh-ban-chay" title="Chọn món này">
                        <span>+ Thêm</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Card Món ăn thông thường (Xử lý US-056: Món Tạm hết khóa nút và làm mờ)
     */
    taoCardMonAn(mon) {
        const laTamHet = (mon.trangThai === 'TamHet' || mon.trangThai === 0);
        const urlAnh = window.DinhDang.chuanHoaUrlHinhAnh(mon.hinhAnh, mon.tenMon);
        const giaFmt = window.DinhDang.tienVnd(mon.giaBan);

        return `
            <div class="card-mon-emenu ${laTamHet ? 'mon-tam-het-emenu' : ''}"
                 onclick="${laTamHet ? `window.thucDonQr.thongBaoTamHet('${window.DinhDang.thoatHtml(mon.tenMon)}')` : `window.gioHangManager.moModalTuyChinhMon(${mon.id})`}">
                
                <div class="hop-anh-mon-emenu">
                    <img src="${urlAnh}" alt="${window.DinhDang.thoatHtml(mon.tenMon)}" loading="lazy"
                         onerror="this.src='${window.DinhDang.layAnhMacDinh(mon.tenMon)}'">
                    
                    ${laTamHet ? `
                        <div class="lop-phu-tam-het">
                            <span class="badge-tam-het">TẠM HẾT HÀNG</span>
                        </div>
                    ` : ''}

                    ${mon.laMonBanChay && !laTamHet ? `
                        <span class="badge-best-seller">⭐ Best Seller</span>
                    ` : ''}
                </div>

                <div class="thong-tin-mon-emenu">
                    <h4 class="ten-mon-chinh">${window.DinhDang.thoatHtml(mon.tenMon)}</h4>
                    <p class="mo-ta-mon-emenu">${window.DinhDang.thoatHtml(mon.moTa || 'Món ngon chuẩn vị Quán Mộc')}</p>
                    
                    <div class="hang-gia-va-nut">
                        <div class="gia-tien-emenu">
                            <strong>${giaFmt}</strong>
                            <span class="dvt-emenu">/${window.DinhDang.thoatHtml(mon.donViTinh || 'phần')}</span>
                        </div>

                        ${laTamHet ? `
                            <button class="nut-chon-mon nut-khoa" disabled title="Món đã tạm hết">
                                Đã hết
                            </button>
                        ` : `
                            <button class="nut-chon-mon nut-hoat-dong" title="Bấm để chọn món">
                                <span>+ Chọn</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // CÁC HÀM XỬ LÝ BỘ LỌC & TÌM KIẾM
    // =========================================================================

    async chonDanhMuc(dmId) {
        this.danhMucDangChon = dmId;
        await this.taiDanhSachMonAn();
        const vungMon = document.getElementById('danh-sach-mon-emenu');
        if (vungMon) vungMon.innerHTML = this.taoDanhSachMonAnHtml();

        document.querySelectorAll('.item-danh-muc').forEach(el => {
            if (el.getAttribute('onclick')) {
                el.classList.toggle('kich-hoat', el.getAttribute('onclick').includes(`'${dmId}'`));
            }
        });
    }

    xuLyTimKiem(tuKhoa) {
        this.tuKhoaTimKiem = tuKhoa;
        clearTimeout(this._timeoutTimKiem);
        this._timeoutTimKiem = setTimeout(async () => {
            await this.taiDanhSachMonAn();
            const vungMon = document.getElementById('danh-sach-mon-emenu');
            if (vungMon) vungMon.innerHTML = this.taoDanhSachMonAnHtml();
        }, 250);
    }

    async xoaTimKiem() {
        this.tuKhoaTimKiem = '';
        const input = document.getElementById('input-tim-mon-emenu');
        if (input) input.value = '';
        await this.taiDanhSachMonAn();
        const vungMon = document.getElementById('danh-sach-mon-emenu');
        if (vungMon) vungMon.innerHTML = this.taoDanhSachMonAnHtml();
    }

    async locKhoangGia(khoangGia) {
        this.khoangGiaDangChon = khoangGia;
        await this.taiDanhSachMonAn();
        const vungMon = document.getElementById('danh-sach-mon-emenu');
        if (vungMon) vungMon.innerHTML = this.taoDanhSachMonAnHtml();

        document.querySelectorAll('.chip-gia').forEach(chip => {
            if (chip.getAttribute('onclick')) {
                chip.classList.toggle('chon', chip.getAttribute('onclick').includes(`'${khoangGia}'`));
            }
        });
    }

    async datLaiBoLoc() {
        this.danhMucDangChon = 'TAT_CA';
        this.tuKhoaTimKiem = '';
        this.khoangGiaDangChon = 'TAT_CA';
        await this.taiDanhSachMonAn();
        this.veGiaoDien();
    }

    doiCheDoXem(laMobile) {
        this.cheDoXemMobile = laMobile;
        this.veGiaoDien();
    }

    async chuyenBanDemo(banId) {
        this.banId = banId;
        await this.taiThongTinTrangChu();
        await this.taiDanhSachMonAn();
        this.veGiaoDien();

        if (window.thongBao) {
            window.thongBao.thanhCong(`Đã chuyển sang ${this.thongTinBan.tenBan}`, `Khu vực: ${this.thongTinBan.tenKhuVuc}`);
        }
    }

    thongBaoTamHet(tenMon) {
        if (window.thongBao) {
            window.thongBao.canhBao('Món ăn tạm hết hàng', `Rất tiếc, món "${tenMon}" vừa hết nguyên liệu. Quý khách vui lòng chọn món khác nhé!`);
        }
    }

    layTieuDeDanhMucHienTai() {
        if (this.danhMucDangChon === 'TAT_CA') return '🍲 TẤT CẢ MÓN ĂN';
        const dm = this.dsDanhMuc.find(d => d.id == this.danhMucDangChon);
        return dm ? `${this.layIconDanhMuc(dm.tenDanhMuc)} ${dm.tenDanhMuc.toUpperCase()}` : '🍲 THỰC ĐƠN';
    }

    layIconDanhMuc(tenDanhMuc) {
        const ten = (tenDanhMuc || '').toLowerCase();
        if (ten.includes('khai vị')) return '🥗';
        if (ten.includes('chính')) return '🍲';
        if (ten.includes('lẩu') || ten.includes('nướng')) return '🔥';
        if (ten.includes('hải sản')) return '🦐';
        if (ten.includes('cơm') || ten.includes('mì')) return '🍚';
        if (ten.includes('uống') || ten.includes('nước')) return '🍹';
        if (ten.includes('tráng miệng')) return '🍨';
        return '🍛';
    }

    // =========================================================================
    // NÚT HỖ TRỢ TẠI BÀN (US-071 -> US-073)
    // =========================================================================

    moModalYeuCauHoTro() {
        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        const tenBan = this.thongTinBan ? `${this.thongTinBan.tenBan} (${this.thongTinBan.tenKhuVuc})` : 'Bàn của bạn';

        khungModal.innerHTML = `
            <div class="hop-modal-lop-phu lop-phu-bottom-sheet" onclick="if(event.target === this) window.thucDonQr.dongModal()">
                <div class="hop-bottom-sheet-gio-hang">
                    <div class="header-bottom-sheet">
                        <div class="thanh-nam-keo-bottom-sheet"></div>
                        <div class="hang-tieu-de-gio-hang">
                            <div>
                                <h3 class="tieu-de-gio-hang">🔔 Yêu Cầu Hỗ Trợ Tại Bàn</h3>
                                <p class="chu-ban-gio-hang">Đang phục vụ tại: <strong>${tenBan}</strong></p>
                            </div>
                            <button class="nut-dong-gio-hang" onclick="window.thucDonQr.dongModal()">✕</button>
                        </div>
                    </div>

                    <div style="padding: 16px 20px; display: flex; flex-direction: column; gap: 14px;">
                        
                        <!-- 1. Gọi nhân viên phục vụ -->
                        <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 12px; padding: 14px;">
                            <h4 style="color: #92400E; margin: 0 0 8px; font-size: 14px;">🙋‍♂️ Gọi nhân viên phục vụ</h4>
                            <p style="font-size: 11.5px; color: #78350F; margin: 0 0 10px;">Chọn lý do để nhân viên hỗ trợ nhanh nhất:</p>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
                                <button class="chip-gia" onclick="window.thucDonQr.chonNhanhLyDo('Xin thêm chén bát, đũa muỗng')">+ Chén đũa</button>
                                <button class="chip-gia" onclick="window.thucDonQr.chonNhanhLyDo('Xin thêm đá và khăn lạnh')">+ Đá & khăn</button>
                                <button class="chip-gia" onclick="window.thucDonQr.chonNhanhLyDo('Xin thêm nước lẩu / gia vị chấm')">+ Nước lẩu / sốt</button>
                                <button class="chip-gia" onclick="window.thucDonQr.chonNhanhLyDo('Hỗ trợ tư vấn món')">+ Tư vấn món</button>
                            </div>
                            <input type="text" id="input-ly-do-goi-nv" class="input-ghi-chu-mon" 
                                   placeholder="Nhập lý do cụ thể..." value="Xin thêm khăn giấy và đá">
                            <button class="nut nut-chinh" style="width: 100%; margin-top: 10px;" onclick="window.thucDonQr.guiYeuCauGoiNhanVien()">
                                🚀 Gửi Yêu Cầu Phục Vụ
                            </button>
                        </div>

                        <!-- 2. Yêu cầu thanh toán -->
                        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 14px;">
                            <h4 style="color: #166534; margin: 0 0 8px; font-size: 14px;">💳 Yêu cầu thanh toán hóa đơn</h4>
                            <p style="font-size: 11.5px; color: #15803D; margin: 0 0 10px;">Chọn hình thức thanh toán thuận tiện:</p>
                            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                                    <input type="radio" name="radio-pt-thanhtoan" value="ChuyenKhoan" checked>
                                    <span>📲 Quét mã VietQR</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                                    <input type="radio" name="radio-pt-thanhtoan" value="TienMat">
                                    <span>💵 Tiền mặt</span>
                                </label>
                            </div>
                            <button class="nut" style="width: 100%; background: #16A34A; color: #FFF;" onclick="window.thucDonQr.guiYeuCauThanhToan()">
                                🧾 Báo Thu Ngân Thanh Toán
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }

    chonNhanhLyDo(lyDo) {
        const input = document.getElementById('input-ly-do-goi-nv');
        if (input) input.value = lyDo;
    }

    async guiYeuCauGoiNhanVien() {
        const input = document.getElementById('input-ly-do-goi-nv');
        const lyDo = input ? input.value.trim() : 'Xin hỗ trợ';

        try {
            const res = await window.api.guiYeuCauHoTro({
                banId: this.banId,
                token: this.token,
                loaiYeuCau: 'GoiNhanVien',
                lyDo: lyDo
            });

            this.dongModal();
            if (window.thongBao) {
                window.thongBao.thanhCong('Đã gửi yêu cầu phục vụ!', `Nhân viên sẽ đến bàn "${this.thongTinBan?.tenBan || 'bạn'}" ngay.`);
            }
        } catch (loi) {
            console.error(loi);
            if (window.thongBao) window.thongBao.loi('Không thể gửi yêu cầu');
        }
    }

    async guiYeuCauThanhToan() {
        const radio = document.querySelector('input[name="radio-pt-thanhtoan"]:checked');
        const phuongThuc = radio ? radio.value : 'ChuyenKhoan';

        try {
            const res = await window.api.guiYeuCauHoTro({
                banId: this.banId,
                token: this.token,
                loaiYeuCau: 'YeuCauThanhToan',
                phuongThucThanhToan: phuongThuc,
                ghiChu: phuongThuc === 'ChuyenKhoan' ? 'Cho xin mã VietQR' : 'Thanh toán tiền mặt'
            });

            this.dongModal();
            if (window.thongBao) {
                window.thongBao.thanhCong('Đã báo thu ngân!', 'Thu ngân đang chuẩn bị hóa đơn thanh toán cho bàn của bạn.');
            }
        } catch (loi) {
            console.error(loi);
            if (window.thongBao) window.thongBao.loi('Không thể gửi yêu cầu');
        }
    }

    dongModal() {
        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (khungModal) khungModal.innerHTML = '';
    }
}

// Khởi tạo đối tượng toàn cục
window.thucDonQr = new ThucDonQrManager();
