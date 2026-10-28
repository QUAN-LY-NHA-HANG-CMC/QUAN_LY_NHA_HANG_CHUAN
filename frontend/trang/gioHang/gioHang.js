/**
 * MODULE GIỎ HÀNG & TÙY BIẾN MÓN ĂN (gioHang.js)
 * Phụ trách: Quân (Frontend Lead - Client & POS)
 * Tuân thủ 100% Đặc tả API Sprint 2 của Backend (Minh)
 *
 * Chức năng:
 * - US-057: Modal tùy chỉnh món ăn (Size ChonMot, Topping ChonNhieu, Ghi chú)
 * - US-058: Floating Cart Bar nổi cố định ở đáy màn hình
 * - US-059: Bottom Sheet Giỏ hàng chi tiết (Tăng/giảm số lượng, xóa món, ghi chú chung)
 * - US-060: Tự động kiểm tra tính hợp lệ & tính tiền Server-side (POST /api/gio-hang/kiem-tra-va-tinh-tien)
 * - US-061: Lưu giỏ hàng LocalStorage theo từng bàn (không mất khi reload)
 * - US-062: Xác nhận gửi đơn đặt món
 */

class GioHangManager {
    constructor() {
        this.thongTinBan = null;
        this.token = 'a405d1729525dfb8e91350df4e32b0da';
        this.cacMonTrongGio = [];
        this.ghiChuChung = '';
        this.monDangTuyChinh = null;
    }

    /**
     * Gán thông tin bàn và nạp giỏ hàng từ LocalStorage (US-061)
     */
    ganThongTinBan(ban, token) {
        this.thongTinBan = ban;
        if (token) this.token = token;

        const maBanKey = ban ? (ban.banId || ban.maBan || '1') : '1';
        const data = localStorage.getItem(`quanmoc_gio_hang_ban_${maBanKey}`);
        this.cacMonTrongGio = data ? JSON.parse(data) : [];
        this.veThanhGioHangNoi();
    }

    /**
     * Lưu giỏ hàng vào LocalStorage (US-061)
     */
    luuGioHang() {
        const maBanKey = this.thongTinBan ? (this.thongTinBan.banId || this.thongTinBan.maBan || '1') : '1';
        localStorage.setItem(`quanmoc_gio_hang_ban_${maBanKey}`, JSON.stringify(this.cacMonTrongGio));
        this.veThanhGioHangNoi();
    }

    /**
     * Tính tổng số lượng món trong giỏ
     */
    tinhTongSoLuong() {
        return this.cacMonTrongGio.reduce((tong, item) => tong + (Number(item.soLuong) || 1), 0);
    }

    /**
     * Tính tổng tiền tạm tính client-side
     */
    tinhTongTienClient() {
        return this.cacMonTrongGio.reduce((tong, item) => tong + (Number(item.thanhTien) || 0), 0);
    }

    // =========================================================================
    // 1. MODAL TÙY CHỈNH MÓN ĂN (US-057) - GỌI API CHI TIẾT MÓN CỦA MINH
    // =========================================================================

    async moModalTuyChinhMon(monId) {
        if (typeof document === 'undefined') return;

        // Gọi API chi tiết món ăn theo đặc tả của Minh (GET /api/public/e-menu/mon-an/:id)
        let chiTietMon = null;
        try {
            const res = await window.api.layChiTietMonAnEMenu(monId);
            if (res && res.ok && res.data) {
                chiTietMon = res.data;
            }
        } catch (e) {
            console.warn('Lỗi gọi API chi tiết món:', e);
        }

        if (!chiTietMon) {
            if (window.thongBao) window.thongBao.canhBao('Không tìm thấy thông tin món ăn');
            return;
        }

        if (chiTietMon.trangThai === 'TamHet') {
            if (window.thongBao) window.thongBao.canhBao('Món ăn đã hết hàng', 'Quý khách vui lòng chọn món khác nhé!');
            return;
        }

        this.monDangTuyChinh = chiTietMon;

        const urlAnh = window.DinhDang.chuanHoaUrlHinhAnh(chiTietMon.hinhAnh, chiTietMon.tenMon);
        const giaGocFmt = window.DinhDang.tienVnd(chiTietMon.giaBan);
        const dsTuyChon = chiTietMon.tuyChon || [];

        const nhomSize = dsTuyChon.find(tc => tc.loai === 'ChonMot') || {
            tenNhom: 'Kích cỡ',
            danhSach: [{ ten: 'Tiêu chuẩn', giaThem: 0 }]
        };

        const nhomTopping = dsTuyChon.find(tc => tc.loai === 'ChonNhieu') || {
            tenNhom: 'Món thêm',
            danhSach: []
        };

        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        khungModal.innerHTML = `
            <div class="hop-modal-lop-phu" onclick="if(event.target === this) window.gioHangManager.dongModal()">
                <div class="hop-modal-noi-dung modal-tuy-chinh-mon">
                    
                    <!-- Header món -->
                    <div class="dau-modal-mon">
                        <div class="hop-anh-modal-mon">
                            <img src="${urlAnh}" alt="${window.DinhDang.thoatHtml(chiTietMon.tenMon)}"
                                 onerror="this.src='${window.DinhDang.layAnhMacDinh(chiTietMon.tenMon)}'">
                        </div>
                        <div class="thong-tin-dau-modal">
                            <h3 class="ten-mon-modal">${window.DinhDang.thoatHtml(chiTietMon.tenMon)}</h3>
                            <p class="mo-ta-modal">${window.DinhDang.thoatHtml(chiTietMon.moTa || 'Món ngon chuẩn vị Quán Mộc')}</p>
                            <div class="gia-goc-modal">Đơn giá: <strong>${giaGocFmt}</strong></div>
                        </div>
                        <button class="nut-dong-modal-goc" onclick="window.gioHangManager.dongModal()">✕</button>
                    </div>

                    <!-- Thân chọn tùy chọn -->
                    <div class="than-modal-tuy-chinh">
                        
                        <!-- 1. Chọn Kích cỡ (ChonMot - Bắt buộc) -->
                        <div class="nhom-tuy-chinh">
                            <div class="tieu-de-nhom-tc">
                                <span>${window.DinhDang.thoatHtml(nhomSize.tenNhom.toUpperCase())}</span>
                                <span class="badge badge-xanh-la" style="font-size: 11px;">Bắt buộc</span>
                            </div>
                            <div class="danh-sach-lua-chon-size">
                                ${nhomSize.danhSach.map((sz, idx) => `
                                    <label class="item-radio-size">
                                        <input type="radio" name="radio-size-mon" value="${idx}" 
                                               data-ten-nhom="${window.DinhDang.thoatHtml(nhomSize.tenNhom)}"
                                               data-ten="${window.DinhDang.thoatHtml(sz.ten)}"
                                               data-gia-them="${sz.giaThem || 0}"
                                               ${idx === 0 ? 'checked' : ''} 
                                               onchange="window.gioHangManager.capNhatGiaTamTinhModal()">
                                        <div class="khung-the-size">
                                            <div class="ten-size">${window.DinhDang.thoatHtml(sz.ten)}</div>
                                            <div class="gia-size">
                                                ${sz.giaThem > 0 ? `+${window.DinhDang.tienVnd(sz.giaThem)}` : 'Giá gốc'}
                                            </div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 2. Chọn Món thêm (ChonNhieu - Tùy chọn) -->
                        ${nhomTopping.danhSach.length > 0 ? `
                            <div class="nhom-tuy-chinh">
                                <div class="tieu-de-nhom-tc">
                                    <span>${window.DinhDang.thoatHtml(nhomTopping.tenNhom.toUpperCase())}</span>
                                    <span class="badge badge-xam" style="font-size: 11px;">Chọn thêm</span>
                                </div>
                                <div class="danh-sach-lua-chon-topping">
                                    ${nhomTopping.danhSach.map((tp, idx) => `
                                        <label class="item-checkbox-topping">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <input type="checkbox" name="chk-topping-mon" value="${idx}"
                                                       data-ten-nhom="${window.DinhDang.thoatHtml(nhomTopping.tenNhom)}"
                                                       data-ten="${window.DinhDang.thoatHtml(tp.ten)}"
                                                       data-gia-them="${tp.giaThem || 0}"
                                                       onchange="window.gioHangManager.capNhatGiaTamTinhModal()">
                                                <span class="ten-topping">${window.DinhDang.thoatHtml(tp.ten)}</span>
                                            </div>
                                            <span class="gia-topping">+${window.DinhDang.tienVnd(tp.giaThem)}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- 3. Ghi chú khẩu vị riêng cho món -->
                        <div class="nhom-tuy-chinh">
                            <div class="tieu-de-nhom-tc">
                                <span>GHI CHÚ KHẨU VỊ RIÊNG</span>
                            </div>
                            <input type="text" id="input-ghi-chu-rieng-mon" class="input-ghi-chu-mon" 
                                   placeholder="Ví dụ: Ít cay, không hành, nước lèo nóng, mang ra trước...">
                        </div>

                        <!-- 4. Số lượng món -->
                        <div class="nhom-so-luong-modal">
                            <span>Số lượng:</span>
                            <div class="bo-dem-so-luong">
                                <button type="button" class="nut-tang-giam" onclick="window.gioHangManager.thayDoiSoLuongModal(-1)">-</button>
                                <input type="number" id="input-so-luong-modal" value="1" min="1" max="99" readonly>
                                <button type="button" class="nut-tang-giam" onclick="window.gioHangManager.thayDoiSoLuongModal(1)">+</button>
                            </div>
                        </div>

                    </div>

                    <!-- Footer: Nút Thêm vào giỏ hàng -->
                    <div class="duoi-modal-tuy-chinh">
                        <div class="tong-tien-tam-tinh-modal">
                            <span class="nhan-tt">Tạm tính:</span>
                            <strong id="hien-thi-tong-tien-modal">${giaGocFmt}</strong>
                        </div>
                        <button class="nut nut-chinh nut-xac-nhan-them-gio" onclick="window.gioHangManager.xacNhanThemVaoGio()">
                            <span>🛒 Thêm vào giỏ</span>
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.capNhatGiaTamTinhModal();
    }

    thayDoiSoLuongModal(delta) {
        const input = document.getElementById('input-so-luong-modal');
        if (!input) return;
        let sl = (parseInt(input.value) || 1) + delta;
        if (sl < 1) sl = 1;
        if (sl > 99) sl = 99;
        input.value = sl;
        this.capNhatGiaTamTinhModal();
    }

    capNhatGiaTamTinhModal() {
        if (!this.monDangTuyChinh) return;
        const mon = this.monDangTuyChinh;

        // Tiền size
        const radioSize = document.querySelector('input[name="radio-size-mon"]:checked');
        const giaThemSize = radioSize ? Number(radioSize.dataset.giaThem) || 0 : 0;

        // Tiền topping
        let tongTienTopping = 0;
        document.querySelectorAll('input[name="chk-topping-mon"]:checked').forEach(chk => {
            tongTienTopping += Number(chk.dataset.giaThem) || 0;
        });

        // Số lượng
        const inputSl = document.getElementById('input-so-luong-modal');
        const soLuong = inputSl ? parseInt(inputSl.value) || 1 : 1;

        const donGia = Number(mon.giaBan) + giaThemSize + tongTienTopping;
        const tongTien = donGia * soLuong;

        const spanTongTien = document.getElementById('hien-thi-tong-tien-modal');
        if (spanTongTien) {
            spanTongTien.textContent = window.DinhDang.tienVnd(tongTien);
        }
    }

    xacNhanThemVaoGio() {
        if (!this.monDangTuyChinh) return;
        const mon = this.monDangTuyChinh;

        // Thu thập tùy chọn đã chọn theo cấu trúc Request Body của Minh
        const tuyChonChon = [];
        const radioSize = document.querySelector('input[name="radio-size-mon"]:checked');
        if (radioSize) {
            tuyChonChon.push({
                tenNhom: radioSize.dataset.tenNhom || 'Kích cỡ',
                ten: radioSize.dataset.ten || 'Tiêu chuẩn',
                giaThem: Number(radioSize.dataset.giaThem) || 0
            });
        }

        document.querySelectorAll('input[name="chk-topping-mon"]:checked').forEach(chk => {
            tuyChonChon.push({
                tenNhom: chk.dataset.tenNhom || 'Món thêm',
                ten: chk.dataset.ten,
                giaThem: Number(chk.dataset.giaThem) || 0
            });
        });

        // Ghi chú
        const inputGhiChu = document.getElementById('input-ghi-chu-rieng-mon');
        const ghiChu = inputGhiChu ? inputGhiChu.value.trim() : '';

        // Số lượng
        const inputSl = document.getElementById('input-so-luong-modal');
        const soLuong = inputSl ? parseInt(inputSl.value) || 1 : 1;

        // Tính tiền client
        const giaThem = tuyChonChon.reduce((t, c) => t + (Number(c.giaThem) || 0), 0);
        const donGia = Number(mon.giaBan) + giaThem;
        const thanhTien = donGia * soLuong;

        const itemMoi = {
            idTam: Date.now() + Math.random().toString(36).substr(2, 4),
            monAnId: mon.id,
            tenMon: mon.tenMon,
            hinhAnh: mon.hinhAnh,
            donViTinh: mon.donViTinh || 'Đĩa',
            soLuong: soLuong,
            donGia: donGia,
            thanhTien: thanhTien,
            tuyChonChon: tuyChonChon,
            ghiChu: ghiChu
        };

        this.cacMonTrongGio.push(itemMoi);
        this.luuGioHang();
        this.dongModal();

        if (window.thongBao) {
            window.thongBao.thanhCong('Đã thêm vào giỏ hàng', `${soLuong}x ${mon.tenMon} (${window.DinhDang.tienVnd(thanhTien)})`);
        }
    }

    dongModal() {
        if (typeof document === 'undefined') return;
        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (khungModal) khungModal.innerHTML = '';
        this.monDangTuyChinh = null;
    }

    // =========================================================================
    // 2. FLOATING CART BAR NỔI (US-058)
    // =========================================================================

    veThanhGioHangNoi() {
        if (typeof document === 'undefined') return;
        const vungChua = document.getElementById('vung-floating-cart');
        if (!vungChua) return;

        const tongSl = this.tinhTongSoLuong();
        const tongTien = this.tinhTongTienClient();

        if (tongSl === 0) {
            vungChua.innerHTML = '';
            return;
        }

        const tongTienFmt = window.DinhDang.tienVnd(tongTien);

        vungChua.innerHTML = `
            <div class="thanh-gio-hang-noi-fixed" onclick="window.gioHangManager.moBottomSheetGioHang()">
                <div class="ben-trai-gio-noi">
                    <div class="icon-gio-co-badge">
                        <span>🛒</span>
                        <span class="badge-so-luong-noi">${tongSl}</span>
                    </div>
                    <div class="chu-thanh-tien-noi">
                        <div class="nhan-tam-tinh">Tạm tính (${tongSl} món)</div>
                        <div class="so-tien-tam-tinh">${tongTienFmt}</div>
                    </div>
                </div>

                <div class="ben-phai-gio-noi">
                    <span class="chu-xem-gio">Xem giỏ hàng</span>
                    <span class="mui-ten-gio">➔</span>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 3. BOTTOM SHEET GIỎ HÀNG (US-059 -> US-062)
    // =========================================================================

    async moBottomSheetGioHang() {
        if (typeof document === 'undefined') return;

        const tongSl = this.tinhTongSoLuong();
        const tenBan = this.thongTinBan ? `${this.thongTinBan.tenBan} (${this.thongTinBan.tenKhuVuc})` : 'Bàn 01';

        // Gọi API kiểm tra tính tiền Server-side (US-060 theo đặc tả của Minh)
        let thongTinServer = null;
        let coLoiHetHang = false;
        let thongBaoLoi = '';

        if (this.cacMonTrongGio.length > 0) {
            try {
                const reqBody = {
                    banId: this.thongTinBan ? this.thongTinBan.banId : 1,
                    token: this.token,
                    danhSachMon: this.cacMonTrongGio.map(item => ({
                        monAnId: item.monAnId,
                        soLuong: item.soLuong,
                        tuyChonChon: (item.tuyChonChon || []).map(tc => ({
                            tenNhom: tc.tenNhom,
                            ten: tc.ten
                        })),
                        ghiChu: item.ghiChu || ''
                    }))
                };

                const resKiemTra = await window.api.kiemTraVaTinhTienGioHang(reqBody);
                if (resKiemTra && resKiemTra.ok && resKiemTra.data) {
                    thongTinServer = resKiemTra.data;
                } else if (resKiemTra && !resKiemTra.ok) {
                    coLoiHetHang = true;
                    thongBaoLoi = resKiemTra.msg || 'Có món trong giỏ hàng đã hết';
                }
            } catch (err) {
                console.warn('Lỗi kiểm tra giỏ hàng server-side:', err);
            }
        }

        const tongTien = thongTinServer ? thongTinServer.tongTienTamTinh : this.tinhTongTienClient();
        const tongTienFmt = window.DinhDang.tienVnd(tongTien);

        const khungModal = document.getElementById('khung-modal-toan-cuc');
        if (!khungModal) return;

        khungModal.innerHTML = `
            <div class="hop-modal-lop-phu lop-phu-bottom-sheet" onclick="if(event.target === this) window.gioHangManager.dongModal()">
                <div class="hop-bottom-sheet-gio-hang">
                    
                    <!-- Header Drawer Giỏ hàng -->
                    <div class="header-bottom-sheet">
                        <div class="thanh-nam-keo-bottom-sheet"></div>
                        <div class="hang-tieu-de-gio-hang">
                            <div>
                                <h3 class="tieu-de-gio-hang">🛒 Giỏ Hàng Món Ăn</h3>
                                <p class="chu-ban-gio-hang">Đang phục vụ tại: <strong>${tenBan}</strong></p>
                            </div>
                            <button class="nut-dong-gio-hang" onclick="window.gioHangManager.dongModal()">✕</button>
                        </div>
                    </div>

                    <!-- Cảnh báo nếu có món hết hàng (400 Bad Request từ server) -->
                    ${coLoiHetHang ? `
                        <div style="background: #FEE2E2; color: #991B1B; padding: 10px 18px; font-size: 12px; font-weight: 600; border-bottom: 1px solid #FCA5A5;">
                            ⚠️ ${window.DinhDang.thoatHtml(thongBaoLoi)}
                        </div>
                    ` : ''}

                    <!-- Danh sách món trong giỏ (US-059) -->
                    <div class="danh-sach-mon-trong-gio">
                        ${this.cacMonTrongGio.length === 0 ? `
                            <div class="khung-gio-trong">
                                <div style="font-size: 44px; margin-bottom: 8px;">🛒</div>
                                <h4>Giỏ hàng của bạn đang trống</h4>
                                <p style="color: var(--mau-chu-phu); font-size: 13px;">Hãy chọn những món ăn ngon từ thực đơn nhé!</p>
                            </div>
                        ` : this.cacMonTrongGio.map((item, idx) => `
                            <div class="item-mon-gio-hang">
                                <div class="thong-tin-item-gio">
                                    <h4 class="ten-item-gio">${window.DinhDang.thoatHtml(item.tenMon)}</h4>
                                    
                                    <div class="cac-tuy-chon-da-chon">
                                        ${(item.tuyChonChon || []).map(tc => `
                                            <span class="chip-tc">${window.DinhDang.thoatHtml(tc.ten)}</span>
                                        `).join('')}
                                    </div>

                                    ${item.ghiChu ? `
                                        <div class="ghi-chu-item-gio">📝 <i>${window.DinhDang.thoatHtml(item.ghiChu)}</i></div>
                                    ` : ''}

                                    <div class="don-gia-item-gio">
                                        ${window.DinhDang.tienVnd(item.donGia)} / ${window.DinhDang.thoatHtml(item.donViTinh || 'phần')}
                                    </div>
                                </div>

                                <div class="thao-tac-item-gio">
                                    <div class="thanh-tien-item-gio">
                                        ${window.DinhDang.tienVnd(item.thanhTien)}
                                    </div>
                                    <div class="bo-dem-so-luong bo-dem-nho">
                                        <button class="nut-tang-giam" onclick="window.gioHangManager.thayDoiSoLuongItem(${idx}, -1)">-</button>
                                        <span class="so-luong-hien-tai">${item.soLuong}</span>
                                        <button class="nut-tang-giam" onclick="window.gioHangManager.thayDoiSoLuongItem(${idx}, 1)">+</button>
                                    </div>
                                    <button class="nut-xoa-item-gio" onclick="window.gioHangManager.xoaItem(${idx})" title="Xóa món này">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Ghi chú chung toàn đơn -->
                    ${this.cacMonTrongGio.length > 0 ? `
                        <div class="khung-ghi-chu-chung-don">
                            <label for="input-ghi-chu-chung">📝 Ghi chú chung cho nhà bếp:</label>
                            <textarea id="input-ghi-chu-chung" rows="2" placeholder="Ví dụ: Lên món khai vị trước, mang đá lạnh...">${window.DinhDang.thoatHtml(this.ghiChuChung)}</textarea>
                        </div>
                    ` : ''}

                    <!-- Footer tính tiền & Gửi đơn (US-060, US-062) -->
                    ${this.cacMonTrongGio.length > 0 ? `
                        <div class="footer-bottom-sheet">
                            <div class="dong-tong-cong-gio">
                                <span>Tổng tạm tính (${tongSl} món):</span>
                                <strong class="tong-tien-lon">${tongTienFmt}</strong>
                            </div>

                            <div class="hang-nut-gui-don">
                                <button class="nut nut-phu" onclick="window.gioHangManager.dongModal()">
                                    + Chọn thêm món
                                </button>
                                <button class="nut nut-chinh nut-gui-don-hang-to" 
                                        ${coLoiHetHang ? 'disabled style="opacity: 0.5;"' : ''}
                                        onclick="window.gioHangManager.xacNhanGuiDonHang()">
                                    🚀 Gửi Đơn Đặt Món
                                </button>
                            </div>
                        </div>
                    ` : ''}

                </div>
            </div>
        `;
    }

    thayDoiSoLuongItem(idx, delta) {
        if (!this.cacMonTrongGio[idx]) return;
        const item = this.cacMonTrongGio[idx];
        item.soLuong += delta;

        if (item.soLuong <= 0) {
            this.xoaItem(idx);
            return;
        }

        item.thanhTien = item.donGia * item.soLuong;
        this.luuGioHang();
        this.moBottomSheetGioHang();
    }

    xoaItem(idx) {
        if (!this.cacMonTrongGio[idx]) return;
        const tenMon = this.cacMonTrongGio[idx].tenMon;
        this.cacMonTrongGio.splice(idx, 1);
        this.luuGioHang();
        this.moBottomSheetGioHang();

        if (window.thongBao) {
            window.thongBao.thongTin('Đã xóa món', `Đã xóa "${tenMon}" khỏi giỏ hàng.`);
        }
    }

    // =========================================================================
    // 4. XÁC NHẬN GỬI ĐƠN HÀNG (US-062)
    // =========================================================================

    async xacNhanGuiDonHang() {
        if (this.cacMonTrongGio.length === 0) return;

        const inputGhiChuChung = document.getElementById('input-ghi-chu-chung');
        if (inputGhiChuChung) {
            this.ghiChuChung = inputGhiChuChung.value.trim();
        }

        const tongSl = this.tinhTongSoLuong();
        const tongTienFmt = window.DinhDang.tienVnd(this.tinhTongTienClient());
        const tenBan = this.thongTinBan ? this.thongTinBan.tenBan : 'Bàn 01';

        const dongY = confirm(`XÁC NHẬN GỬI ĐƠN ĐẶT MÓN:\n- Bàn: ${tenBan}\n- Số lượng: ${tongSl} món\n- Tổng tiền tạm tính: ${tongTienFmt}\n\nBạn có chắc chắn muốn gửi đơn để Bếp bắt đầu chế biến?`);
        if (!dongY) return;

        // Lưu đơn hàng qua API
        try {
            const donHang = {
                banId: this.thongTinBan ? this.thongTinBan.banId : 1,
                maBan: this.thongTinBan ? this.thongTinBan.maBan : 'B101',
                tenBan: tenBan,
                danhSachMon: [...this.cacMonTrongGio],
                tongSoLuong: tongSl,
                tongTien: this.tinhTongTienClient(),
                ghiChuChung: this.ghiChuChung
            };

            const kq = await window.api.guiDonDatMon(donHang);

            // Làm sạch giỏ hàng
            this.cacMonTrongGio = [];
            this.ghiChuChung = '';
            this.luuGioHang();
            this.dongModal();

            if (window.thongBao) {
                window.thongBao.thanhCong('GỬI ĐƠN THÀNH CÔNG! 🎉', `Đơn hàng mã ${kq.data.maDon} đã được chuyển tới Bếp.`);
            }

            alert(`🎉 ĐẶT MÓN THÀNH CÔNG!\n\nĐơn hàng của bạn đã được chuyển tới Bếp Quán Mộc.\n- Mã đơn: ${kq.data.maDon}\n- Bàn: ${tenBan}\n- Tổng tiền: ${tongTienFmt}\n\nBếp sẽ chuẩn bị món ngay cho quý khách. Chúc quý khách ngon miệng!`);

            this.veThanhGioHangNoi();
        } catch (loi) {
            console.error('Lỗi gửi đơn hàng:', loi);
            if (window.thongBao) window.thongBao.loi('Không thể gửi đơn hàng');
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.gioHangManager = new GioHangManager();
