/**
 * PHÂN HỆ SƠ ĐỒ BÀN POS & VẬN HÀNH PHỤC VỤ (soDoBanPos.js)
 * Phụ trách: Quân (Frontend Table QR & POS Lead)
 * Đáp ứng các User Story trong Sprint 3:
 * - US-089: Thu ngân / Quản lý hủy món theo yêu cầu của khách (khi chưa nấu)
 * - US-090: Xử lý đổi trả món kèm ghi nhận lý do
 * - US-091: Lưu nhật ký hủy / trả món để đối soát thất thoát
 * - US-092: Sơ đồ bàn trực quan theo khu vực với màu sắc phân biệt trạng thái
 * - US-093: Hiển thị thời gian khách ngồi và tổng tiền tạm tính trên từng thẻ bàn
 * - US-094: Mở bàn trực tiếp cho khách tại chỗ
 * - US-095: Nhân viên gọi món hộ khách trực tiếp tại bàn
 * - US-096: Xác nhận món ăn đã được bưng lên bàn ("Đã phục vụ")
 * - US-097: Chuyển toàn bộ đơn hàng sang bàn trống khác (Chuyển bàn)
 * - US-098: Ghép đơn hàng của 2 hoặc nhiều bàn vào chung một hóa đơn (Ghép bàn)
 */

class SoDoBanPosModule {
    constructor() {
        this.khoiTaoDuLieuKho();
        this.boLocKhuVuc = 'TAT_CA';
        this.boLocTrangThai = 'TAT_CA';
        this.tuKhoaTimKiem = '';
        this.banDangChon = null;
    }

    /**
     * Khởi tạo kho dữ liệu lưu trữ phiên bàn & đơn gọi món trong LocalStorage
     */
    khoiTaoDuLieuKho() {
        const KHOA_PHIEN = 'quanmoc_pos_phien_ban';
        let phien = {};
        try {
            const raw = localStorage.getItem(KHOA_PHIEN);
            if (raw) phien = JSON.parse(raw);
            if (typeof phien !== 'object' || phien === null || Array.isArray(phien)) phien = {};
        } catch { phien = {}; }

        // Dọn dẹp triệt để mọi phiên ảo/dữ liệu mẫu cũ sót lại trong trình duyệt
        let daThayDoi = false;
        Object.keys(phien).forEach(bId => {
            const p = phien[bId];
            if (!p) { delete phien[bId]; daThayDoi = true; return; }
            // Phiên chứa món mẫu cũ của Quán Mộc hoặc thời gian ngồi quá 180 phút
            const coMonMockCu = (p.danhSachMon || []).some(m => 
                (m.tenMon && (m.tenMon.includes('Bò Tơ') || m.tenMon.includes('Cơm Cháy Kho Quẹt') || m.tenMon.includes('Lẩu Nấm') || m.tenMon.includes('Rau Rừng')))
            );
            const phutNgoi = p.thoiGianBatDau ? (Date.now() - new Date(p.thoiGianBatDau).getTime()) / 60000 : 999;
            if (coMonMockCu || phutNgoi > 180) {
                delete phien[bId];
                daThayDoi = true;
            }
        });
        if (daThayDoi || !localStorage.getItem(KHOA_PHIEN)) {
            localStorage.setItem(KHOA_PHIEN, JSON.stringify(phien));
        }

        // 2. Khởi tạo nhật ký hủy / trả món (US-091)
        const KHOA_NHAT_KY = 'quanmoc_pos_nhat_ky_huy_tra';
        if (!localStorage.getItem(KHOA_NHAT_KY)) {
            localStorage.setItem(KHOA_NHAT_KY, JSON.stringify([]));
        }
    }

    layTatCaPhienBan() {
        const raw = localStorage.getItem('quanmoc_pos_phien_ban');
        return raw ? JSON.parse(raw) : {};
    }

    luuTatCaPhienBan(ds) {
        localStorage.setItem('quanmoc_pos_phien_ban', JSON.stringify(ds));
    }

    layNhatKyHuyTra() {
        const raw = localStorage.getItem('quanmoc_pos_nhat_ky_huy_tra');
        return raw ? JSON.parse(raw) : [];
    }

    ghiNhatKyHuyTra(ban, tenMon, soLuong, loai, lyDo) {
        const ds = this.layNhatKyHuyTra();
        const user = window.api ? window.api.layThongTinNguoiDung() : null;
        const tenNhanVien = user ? `${user.hoTen} (${user.vaiTro})` : 'Nhân viên POS';

        ds.unshift({
            id: Date.now(),
            thoiGian: new Date().toISOString(),
            soBan: ban.soBan || `Bàn ${ban.id}`,
            tenMon: tenMon,
            soLuong: soLuong,
            loai: loai, // 'HUY' hoặc 'TRA'
            lyDo: lyDo,
            nhanVien: tenNhanVien
        });
        localStorage.setItem('quanmoc_pos_nhat_ky_huy_tra', JSON.stringify(ds));
    }

    async khoiTao() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        vungChua.innerHTML = `
            <div class="trang-so-do-ban-pos">
                <!-- Header phân hệ -->
                <div class="thanh-tieu-de-pos">
                    <div class="nhom-tieu-de">
                        <h2>🗺️ Sơ Đồ Bàn POS & Vận Hành Phục Vụ</h2>
                        <p class="mo-ta-phu">Quản lý trạng thái bàn theo thời gian thực, mở bàn, gọi món hộ khách, chuyển và ghép bàn</p>
                    </div>
                    <div class="nhom-nut-hanh-dong-pos">
                        <button class="nut nut-phu" style="color: #dc2626; border-color: #dc2626; font-weight: 600;" onclick="window.tienIchTest.resetSoDoBan()" title="Giải phóng toàn bộ 12 bàn về Bàn trống và xóa phiên hoạt động">
                            🧹 Reset toàn bộ bàn
                        </button>
                        <button class="nut nut-phu" onclick="window.soDoBanPos.moModalNhatKyHuyTra()">
                            📜 Nhật ký hủy/trả món
                        </button>
                        <button class="nut nut-phu" onclick="window.ungDung.chuyenTab('thanhToanPos')">
                            💵 Chuyển sang Quầy Thu Ngân
                        </button>
                        <button class="nut nut-chinh" onclick="window.soDoBanPos.taiLaiDuLieu()">
                            🔄 Làm mới sơ đồ
                        </button>
                    </div>
                </div>

                <!-- Thống kê nhanh tổng quan -->
                <div class="thanh-thong-ke-pos" id="thong-ke-nhanh-pos"></div>

                <!-- Thanh công cụ tìm kiếm và bộ lọc -->
                <div class="thanh-bo-loc-pos">
                    <div class="nhom-tim-kiem">
                        <input type="text" id="tim-kiem-ban-pos" placeholder="🔍 Tìm kiếm bàn theo tên, mã (ví dụ: Bàn 01, T1-02)..." oninput="window.soDoBanPos.xuLyTimKiem(this.value)">
                    </div>
                    <div class="nhom-nut-loc-khu-vuc" id="danh-sach-tab-khu-vuc"></div>
                    <div class="nhom-nut-loc-trang-thai" id="danh-sach-nut-trang-thai"></div>
                </div>

                <!-- Lưới hiển thị sơ đồ bàn -->
                <div class="luoi-so-do-ban-pos" id="luoi-ban-pos">
                    <div class="dang-tai-du-lieu">Đang tải sơ đồ bàn...</div>
                </div>
            </div>
        `;

        await this.taiVaHienThi();
    }

    async dongBoPhienVoiServer() {
        let phienLocal = this.layTatCaPhienBan() || {};
        try {
            if (window.api && window.api.layTatCaDonGoiMon) {
                const dsDonServer = await window.api.layTatCaDonGoiMon();
                if (Array.isArray(dsDonServer)) {
                    const phienKetHop = { ...phienLocal };

                    dsDonServer.forEach(don => {
                        const bId = Number(don.banId);
                        if (!bId) return;

                        // KHÔNG phục hồi phiên từ các đơn đã hoàn tất, đã thanh toán, hoặc đã hủy
                        if (don.trangThai === 'HOAN_THANH' || don.trangThai === 'DA_THANH_TOAN' || don.trangThai === 'DA_HUY' || don.daThanhToan) {
                            return;
                        }

                        // Nếu đơn đã cũ hơn 6 tiếng -> bỏ qua để tránh hồi sinh đơn rác
                        const tgDon = don.thoiGianTao || don.thoiGianDat;
                        if (tgDon && (Date.now() - new Date(tgDon).getTime()) > 6 * 3600 * 1000) {
                            return;
                        }

                        // Chỉ nhận đơn nếu còn ít nhất một món hợp lệ đang cần phục vụ
                        const cacMonHopLe = (don.danhSachMon || []).filter(m => 
                            m.trangThai !== 'DA_HUY' && m.trangThai !== 'TU_CHOI'
                        );
                        if (cacMonHopLe.length === 0) return;

                        if (!phienKetHop[bId]) {
                            phienKetHop[bId] = {
                                id: bId,
                                banId: bId,
                                thoiGianBatDau: don.thoiGianDat || don.thoiGianTao || new Date().toISOString(),
                                soKhach: don.soKhach || 2,
                                danhSachMon: []
                            };
                        }

                        cacMonHopLe.forEach(m => {
                            const monDaCo = phienKetHop[bId].danhSachMon.find(ex => 
                                (m.id && Number(ex.id) === Number(m.id)) || (m.id && String(ex.id) === String(m.id))
                            );
                            if (monDaCo) {
                                if (m.trangThai) monDaCo.trangThai = m.trangThai;
                                if (m.soLuong && m.soLuong > monDaCo.soLuong) monDaCo.soLuong = m.soLuong;
                                if (!monDaCo.donGia && (m.donGia || m.giaBan)) monDaCo.donGia = m.donGia || m.giaBan;
                                monDaCo.thanhTien = Number(m.thanhTien) || (Number(monDaCo.donGia || 0) * Number(monDaCo.soLuong || 1));
                            } else {
                                phienKetHop[bId].danhSachMon.push({
                                    id: m.id || Date.now() + Math.floor(Math.random() * 1000),
                                    monAnId: m.monAnId || m.monId,
                                    tenMon: m.tenMon,
                                    soLuong: m.soLuong || 1,
                                    donGia: m.donGia || m.giaBan || 0,
                                    thanhTien: Number(m.thanhTien) || (Number(m.donGia || m.giaBan || 0) * Number(m.soLuong || 1)),
                                    tuyChon: m.tuyChon || '',
                                    ghiChu: m.ghiChu || '',
                                    trangThai: m.trangThai || 'CHO_CHE_BIEN',
                                    thoiGianTao: m.thoiGianTao,
                                    thoiGianCapNhat: m.thoiGianCapNhat
                                });
                            }
                        });
                    });

                    this.luuTatCaPhienBan(phienKetHop);
                    return phienKetHop;
                }
            }
        } catch (e) {
            console.warn('Lỗi đồng bộ đơn đặt món từ server sang phiên POS:', e);
        }
        return phienLocal;
    }

    async taiVaHienThi() {
        const dsBan = await window.api.layDanhSachBan();
        const dsKhuVuc = await window.api.layDanhSachKhuVuc();
        const dsPhien = await this.dongBoPhienVoiServer();

        // Đồng bộ trạng thái Bàn: Server database là nguồn chuẩn
        dsBan.forEach(ban => {
            const isServerTrong = (ban.trangThai === 'TRONG' || ban.trangThai === 'Trong' || !ban.trangThai);
            const p = dsPhien[ban.id];

            if (isServerTrong) {
                // Nếu bàn đang TRỐNG trên hệ thống:
                // Nếu có phiên rác sót lại nhưng không có món đang nấu mới phát sinh, xóa triệt để phiên rác
                if (p) {
                    const coMonDangCheBienMoi = (p.danhSachMon || []).some(m => 
                        (m.trangThai === 'CHO_CHE_BIEN' || m.trangThai === 'DANG_CHE_BIEN' || m.trangThai === 'CHO_XAC_NHAN')
                    );
                    const soPhutNgoi = this.tinhSoPhutNgoi(p.thoiGianBatDau);
                    if (!coMonDangCheBienMoi || soPhutNgoi > 15) {
                        delete dsPhien[ban.id];
                        ban.trangThai = 'TRONG';
                    } else {
                        // Khách vừa mới đặt đơn qua QR trong vòng 15 phút
                        ban.trangThai = 'DANG_DUNG';
                        window.api.capNhatTrangThaiBan(ban.id, 'DANG_DUNG').catch(() => {});
                    }
                } else {
                    ban.trangThai = 'TRONG';
                }
            } else {
                // Bàn đang dùng / chờ thanh toán / cần hỗ trợ trên hệ thống
                if (!p) {
                    dsPhien[ban.id] = {
                        id: ban.id,
                        banId: ban.id,
                        thoiGianBatDau: ban.ngayCapNhat || new Date().toISOString(),
                        soKhach: ban.sucChua || 4,
                        danhSachMon: []
                    };
                }
            }
        });
        this.luuTatCaPhienBan(dsPhien);

        this.veThongKeNhanh(dsBan, dsPhien);
        this.veBoLocKhuVuc(dsKhuVuc);
        this.veBoLocTrangThai(dsBan);
        this.veDanhSachBan(dsBan, dsKhuVuc, dsPhien);
    }

    async taiLaiDuLieu() {
        if (window.thongBao) window.thongBao.thongTin('Đang đồng bộ', 'Cập nhật lại trạng thái các bàn thời gian thực.');
        await this.taiVaHienThi();
    }

    /**
     * Tính tổng tiền tạm tính của một bàn
     */
    tinhTongTienBan(phien) {
        if (!phien || !Array.isArray(phien.danhSachMon)) return 0;
        return phien.danhSachMon.reduce((tong, m) => {
            if (m.trangThai === 'DA_HUY' || m.trangThai === 'TU_CHOI') return tong;
            const gia = Number(m.donGia) || 0;
            const sl = Number(m.soLuong) || 1;
            const thanhTien = (m.thanhTien !== undefined && m.thanhTien !== null && !isNaN(Number(m.thanhTien)))
                ? Number(m.thanhTien)
                : (gia * sl);
            return tong + thanhTien;
        }, 0);
    }

    /**
     * Tính số phút khách đã ngồi
     */
    tinhSoPhutNgoi(thoiGianBatDau) {
        if (!thoiGianBatDau) return 0;
        const diffMs = Date.now() - new Date(thoiGianBatDau).getTime();
        return Math.max(0, Math.floor(diffMs / (1000 * 60)));
    }

    veThongKeNhanh(dsBan, dsPhien) {
        const el = document.getElementById('thong-ke-nhanh-pos');
        if (!el) return;

        const tongBan = dsBan.length;
        const banTrong = dsBan.filter(b => b.trangThai === 'TRONG').length;
        const banDangDung = dsBan.filter(b => b.trangThai === 'DANG_DUNG').length;
        const banChoThanhToan = dsBan.filter(b => b.trangThai === 'CHO_THANH_TOAN').length;
        const banCanHoTro = dsBan.filter(b => b.trangThai === 'CAN_HO_TRO').length;

        // Tính tổng doanh thu đang phục vụ tại chỗ
        let tongDoanhThuTamTinh = 0;
        Object.values(dsPhien).forEach(p => {
            tongDoanhThuTamTinh += this.tinhTongTienBan(p);
        });

        const tyLeLapDay = tongBan > 0 ? Math.round(((tongBan - banTrong) / tongBan) * 100) : 0;

        el.innerHTML = `
            <div class="the-thong-ke-nho">
                <div class="so-luong-thong-ke">${tongBan}</div>
                <div class="nhan-thong-ke">Tổng số bàn</div>
            </div>
            <div class="the-thong-ke-nho the-xanh-la">
                <div class="so-luong-thong-ke">${banTrong}</div>
                <div class="nhan-thong-ke">Bàn trống sẵn sàng</div>
            </div>
            <div class="the-thong-ke-nho the-xanh-duong">
                <div class="so-luong-thong-ke">${banDangDung}</div>
                <div class="nhan-thong-ke">Đang phục vụ ăn uống</div>
            </div>
            <div class="the-thong-ke-nho the-vang">
                <div class="so-luong-thong-ke">${banChoThanhToan}</div>
                <div class="nhan-thong-ke">Chờ thanh toán</div>
            </div>
            <div class="the-thong-ke-nho the-do">
                <div class="so-luong-thong-ke">${banCanHoTro}</div>
                <div class="nhan-thong-ke">Có yêu cầu hỗ trợ 🚨</div>
            </div>
            <div class="the-thong-ke-nho the-tong-tien">
                <div class="so-luong-thong-ke">${window.DinhDang && window.DinhDang.tienVnd ? window.DinhDang.tienVnd(tongDoanhThuTamTinh) : tongDoanhThuTamTinh.toLocaleString() + ' đ'}</div>
                <div class="nhan-thong-ke">Tổng tiền tạm tính (${tyLeLapDay}% công suất)</div>
            </div>
        `;
    }

    veBoLocKhuVuc(dsKhuVuc) {
        const el = document.getElementById('danh-sach-tab-khu-vuc');
        if (!el) return;

        let html = `
            <button class="nut-tab-khu-vuc ${this.boLocKhuVuc === 'TAT_CA' ? 'kich-hoat' : ''}" onclick="window.soDoBanPos.chuyenLocKhuVuc('TAT_CA')">
                Tất cả khu vực
            </button>
        `;

        dsKhuVuc.forEach(kv => {
            const tenKv = kv.ten || kv.tenKhuVuc || `Khu vực ${kv.id}`;
            html += `
                <button class="nut-tab-khu-vuc ${this.boLocKhuVuc == kv.id ? 'kich-hoat' : ''}" onclick="window.soDoBanPos.chuyenLocKhuVuc(${kv.id})">
                    ${tenKv}
                </button>
            `;
        });

        el.innerHTML = html;
    }

    veBoLocTrangThai(dsBan) {
        const el = document.getElementById('danh-sach-nut-trang-thai');
        if (!el) return;

        const dsPhien = this.layTatCaPhienBan() || {};
        const soBanChoBung = dsBan.filter(b => {
            const phien = dsPhien[b.id];
            return phien && Array.isArray(phien.danhSachMon) && phien.danhSachMon.some(m => 
                m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG' || m.trangThai === 'DA_CHE_BIEN'
            );
        }).length;

        const cacTrangThai = [
            { ma: 'TAT_CA', ten: 'Tất cả trạng thái' },
            { ma: 'CHO_BUNG', ten: `🔔 Chờ bưng món (${soBanChoBung})`, noiBat: soBanChoBung > 0 },
            { ma: 'TRONG', ten: '🟢 Trống' },
            { ma: 'DANG_DUNG', ten: '🔵 Đang phục vụ' },
            { ma: 'CHO_THANH_TOAN', ten: '🟡 Chờ thanh toán' },
            { ma: 'CAN_HO_TRO', ten: '🔴 Cần hỗ trợ' }
        ];

        let html = '';
        cacTrangThai.forEach(tt => {
            const noiBatStyle = tt.noiBat ? 'background: #dcfce7; color: #15803d; border-color: #86efac; font-weight: 700;' : '';
            html += `
                <button class="nut-pill-trang-thai ${this.boLocTrangThai === tt.ma ? 'kich-hoat' : ''}" style="${noiBatStyle}" onclick="window.soDoBanPos.chuyenLocTrangThai('${tt.ma}')">
                    ${tt.ten}
                </button>
            `;
        });
        el.innerHTML = html;
    }

    chuyenLocKhuVuc(kvId) {
        this.boLocKhuVuc = kvId;
        this.taiVaHienThi();
    }

    chuyenLocTrangThai(trangThai) {
        this.boLocTrangThai = trangThai;
        this.taiVaHienThi();
    }

    xuLyTimKiem(tuKhoa) {
        this.tuKhoaTimKiem = (tuKhoa || '').trim().toLowerCase();
        this.taiVaHienThi();
    }

    veDanhSachBan(dsBan, dsKhuVuc, dsPhien) {
        const el = document.getElementById('luoi-ban-pos');
        if (!el) return;

        // Lọc theo khu vực
        let ds = dsBan;
        if (this.boLocKhuVuc !== 'TAT_CA') {
            ds = ds.filter(b => b.khuVucId == this.boLocKhuVuc);
        }

        // Lọc theo trạng thái
        if (this.boLocTrangThai === 'CHO_BUNG') {
            ds = ds.filter(b => {
                const phien = dsPhien[b.id];
                return phien && Array.isArray(phien.danhSachMon) && phien.danhSachMon.some(m => 
                    m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG' || m.trangThai === 'DA_CHE_BIEN'
                );
            });
        } else if (this.boLocTrangThai !== 'TAT_CA') {
            ds = ds.filter(b => b.trangThai === this.boLocTrangThai);
        }

        // Lọc theo từ khóa
        if (this.tuKhoaTimKiem) {
            ds = ds.filter(b => 
                (b.soBan && b.soBan.toLowerCase().includes(this.tuKhoaTimKiem)) ||
                (b.maBan && b.maBan.toLowerCase().includes(this.tuKhoaTimKiem))
            );
        }

        if (ds.length === 0) {
            el.innerHTML = `
                <div class="khung-trong-pos">
                    <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
                    <h3>Không tìm thấy bàn nào phù hợp</h3>
                    <p style="color: var(--mau-chu-phu); margin-top: 6px;">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }

        const mapKhuVuc = {};
        dsKhuVuc.forEach(kv => mapKhuVuc[kv.id] = kv.ten || kv.tenKhuVuc || `Khu vực ${kv.id}`);

        let html = '';
        ds.forEach(ban => {
            const phien = dsPhien[ban.id];
            const tenKhuVuc = mapKhuVuc[ban.khuVucId] || 'Chung';
            const soPhut = phien ? this.tinhSoPhutNgoi(phien.thoiGianBatDau) : 0;
            const tongTien = phien ? this.tinhTongTienBan(phien) : 0;
            const soLuongMon = (phien && phien.danhSachMon) 
                ? phien.danhSachMon.filter(m => m.trangThai !== 'DA_HUY').reduce((sum, m) => sum + m.soLuong, 0)
                : 0;

            const monChuaRa = (phien && phien.danhSachMon)
                ? phien.danhSachMon.filter(m => m.trangThai === 'CHO_XAC_NHAN' || m.trangThai === 'DANG_CHE_BIEN').length
                : 0;

            // Kiểm tra các món bếp đã nấu xong đang chờ nhân viên bưng lên bàn
            const cacMonChoBung = (phien && Array.isArray(phien.danhSachMon))
                ? phien.danhSachMon.filter(m => m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG' || m.trangThai === 'DA_CHE_BIEN')
                : [];
            const soMonChoBung = cacMonChoBung.reduce((sum, m) => sum + (m.soLuong || 1), 0);
            const coMonChoBung = soMonChoBung > 0;

            // Xác định class và nhãn trạng thái
            const laDangDung = (ban.trangThai === 'DANG_DUNG' || ban.trangThai === 'DangDung' || ban.trangThai === 'DangPhucVu');
            const laChoThanhToan = (ban.trangThai === 'CHO_THANH_TOAN' || ban.trangThai === 'ChoThanhToan');
            const laCanHoTro = (ban.trangThai === 'CAN_HO_TRO' || ban.trangThai === 'CanHoTro');
            const laTamKhoa = (ban.trangThai === 'TAM_KHOA' || ban.trangThai === 'TamKhoa');

            let lopTrangThai = 'ban-trong';
            let nhanTrangThai = 'Bàn trống';
            if (laDangDung) {
                lopTrangThai = 'ban-dang-dung';
                nhanTrangThai = 'Đang phục vụ';
            } else if (laChoThanhToan) {
                lopTrangThai = 'ban-cho-thanh-toan';
                nhanTrangThai = 'Chờ thanh toán';
            } else if (laCanHoTro) {
                lopTrangThai = 'ban-can-ho-tro';
                nhanTrangThai = 'Cần hỗ trợ 🚨';
            } else if (laTamKhoa) {
                lopTrangThai = 'ban-tam-khoa';
                nhanTrangThai = 'Tạm khóa';
            }

            if (coMonChoBung) {
                lopTrangThai += ' the-ban-cho-bung';
            }

            const laBanDangPhucVu = laDangDung || laChoThanhToan || laCanHoTro;

            html += `
                <div class="the-ban-pos ${lopTrangThai}">
                    <div class="dau-the-ban">
                        <div>
                            <span class="ma-ban-badge">${ban.maBan || 'B' + ban.id}</span>
                            <span class="khu-vuc-badge">${tenKhuVuc}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            ${coMonChoBung ? `<span class="badge-cho-bung-pulse" title="Bếp đã nấu xong, chờ nhân viên bưng lên bàn">🔔 Xong ${soMonChoBung} món!</span>` : ''}
                            <span class="badge-trang-thai-ban">${nhanTrangThai}</span>
                        </div>
                    </div>

                    <div class="than-the-ban">
                        <div class="ten-ban-lon">${ban.soBan}</div>
                        <div class="thong-tin-phu-ban">
                            <span>👥 ${ban.sucChua || 4} chỗ</span>
                            ${laBanDangPhucVu ? `<span class="dong-ho-ngoi">⏱️ ${soPhut} phút</span>` : '<span>✨ Sẵn sàng đón khách</span>'}
                        </div>

                        ${laBanDangPhucVu ? `
                            ${coMonChoBung ? `
                                <div class="canh-bao-cho-bung-nhanh">
                                    🔔 <strong>Có ${soMonChoBung} món nấu xong!</strong> Chờ bưng lên bàn
                                </div>
                            ` : ''}
                            <div class="hop-chi-tiet-gia-ban">
                                <div class="so-tien-tam-tinh">${window.DinhDang && window.DinhDang.tienVnd ? window.DinhDang.tienVnd(tongTien) : tongTien.toLocaleString() + ' đ'}</div>
                                <div class="so-mon-badge">
                                    <span>📦 ${soLuongMon} món</span>
                                    ${monChuaRa > 0 ? `<span class="mon-bep-cho">⏳ Bếp nợ: ${monChuaRa}</span>` : '<span class="mon-du">✓ Đã đủ món</span>'}
                                </div>
                            </div>
                        ` : `
                            <div class="hop-ban-trong-goi-y">
                                <span>Bàn sạch đã sẵn sàng đón khách vào dùng bữa</span>
                            </div>
                        `}
                    </div>

                    <div class="chan-the-ban">
                        ${!laBanDangPhucVu ? `
                            <button class="nut-thao-tac-ban nut-mo-ban-nhanh" onclick="window.soDoBanPos.moModalMoBan(${ban.id})">
                                ✨ Mở Bàn Mới
                            </button>
                        ` : `
                            ${coMonChoBung ? `
                                <button class="nut-thao-tac-ban nut-bung-mon-nhanh" onclick="window.soDoBanPos.bungTatCaMonDaXong(${ban.id})" title="Xác nhận nhân viên bưng các món nấu xong lên bàn cho khách">
                                    🚶 BƯNG LÊN BÀN (${soMonChoBung})
                                </button>
                            ` : ''}
                            <button class="nut-thao-tac-ban nut-xem-don" onclick="window.soDoBanPos.moModalChiTietDon(${ban.id})" title="Xem chi tiết đơn, đổi trả món (US-089 -> US-091, US-096)">
                                📋 Xem Đơn
                            </button>
                            <button class="nut-thao-tac-ban nut-goi-them" onclick="window.soDoBanPos.moModalGoiMonHo(${ban.id})" title="Gọi món hộ khách (US-095)">
                                🍲 Thêm món
                            </button>
                            <button class="nut-thao-tac-ban nut-chuyen-ghep" onclick="window.soDoBanPos.moModalChuyenGhep(${ban.id})" title="Chuyển bàn hoặc ghép bàn (US-097, US-098)">
                                🔄 Đổi/Ghép
                            </button>
                            <button class="nut-thao-tac-ban nut-thanh-toan-nhanh" onclick="window.soDoBanPos.chuyenSangThanhToan(${ban.id})" title="Thanh toán hóa đơn (US-099 -> US-110)">
                                💵 Tính tiền
                            </button>
                        `}
                    </div>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    // =========================================================================
    // US-094: MỞ BÀN TRỰC TIẾP
    // =========================================================================
    async moModalMoBan(banId) {
        const dsBan = await window.api.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId);
        if (!ban) return;

        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-modal hop-modal-vua">
                <div class="dau-modal">
                    <h3>✨ Mở Bàn Phục Vụ Mới — ${ban.soBan}</h3>
                    <button class="nut-dong-modal" onclick="window.soDoBanPos.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <p style="color: var(--mau-chu-phu); margin-bottom: 16px;">
                        Khởi tạo phiên phục vụ mới tại <strong>${ban.soBan}</strong> (Sức chứa tiêu chuẩn: ${ban.sucChua || 4} khách).
                    </p>
                    <div class="nhom-form">
                        <label>Số lượng khách vào bàn (*):</label>
                        <input type="number" id="mo-ban-so-khach" class="o-nhap-lieu" min="1" max="50" value="${ban.sucChua || 4}">
                    </div>
                    <div class="nhom-form" style="margin-top: 14px;">
                        <label>Ghi chú ban đầu (nếu có):</label>
                        <input type="text" id="mo-ban-ghi-chu" class="o-nhap-lieu" placeholder="Ví dụ: Khách đặt trước, có ghế trẻ em, bàn ngoài trời...">
                    </div>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.soDoBanPos.dongModal()">Hủy bỏ</button>
                    <button class="nut nut-chinh" onclick="window.soDoBanPos.xacNhanMoBan(${ban.id})">
                        Xác nhận mở bàn
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    async xacNhanMoBan(banId) {
        const soKhach = parseInt(document.getElementById('mo-ban-so-khach')?.value || '4');
        const ghiChu = document.getElementById('mo-ban-ghi-chu')?.value || '';

        // 1. Cập nhật trạng thái bàn trong dsBan và Server
        const dsBan = await window.api.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId);
        if (ban) {
            ban.trangThai = 'DANG_DUNG';
            await window.api.capNhatTrangThaiBan(banId, 'DANG_DUNG');
        }

        // 2. Tạo phiên bàn mới
        const dsPhien = this.layTatCaPhienBan() || {};
        dsPhien[banId] = {
            id: banId,
            banId: banId,
            soKhach: soKhach,
            thoiGianBatDau: new Date().toISOString(),
            ghiChu: ghiChu,
            danhSachMon: []
        };
        this.luuTatCaPhienBan(dsPhien);

        this.dongModal();
        if (window.thongBao) window.thongBao.thanhCong('Mở bàn thành công', `${ban ? ban.soBan : 'Bàn ' + banId} đã chuyển sang trạng thái Đang phục vụ.`);
        await this.taiVaHienThi();
    }

    // =========================================================================
    // US-089, US-090, US-091, US-096: XEM CHI TIẾT ĐƠN, ĐÁNH DẤU PHỤC VỤ, HỦY TRẢ MÓN
    // =========================================================================
    async moModalChiTietDon(banId) {
        const dsBan = await window.api.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId);
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];

        if (!ban || !phien) {
            if (window.thongBao) window.thongBao.canhBao('Không tìm thấy phiên', 'Bàn này chưa có phiên hoạt động.');
            return;
        }

        this.banDangChon = ban;
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        const tongTien = this.tinhTongTienBan(phien);
        const soPhut = this.tinhSoPhutNgoi(phien.thoiGianBatDau);

        // Lọc các món bếp đã xong đang chờ bưng
        const cacMonChoBung = (phien.danhSachMon || []).filter(m => 
            m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG' || m.trangThai === 'DA_CHE_BIEN'
        );
        const soMonChoBung = cacMonChoBung.reduce((sum, m) => sum + (m.soLuong || 1), 0);

        let danhSachMonHtml = '';
        if (phien.danhSachMon.length === 0) {
            danhSachMonHtml = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 24px; color: var(--mau-chu-phu);">
                        Chưa có món nào được gọi. Hãy bấm nút <strong>"Gọi thêm món"</strong> bên dưới.
                    </td>
                </tr>
            `;
        } else {
            phien.danhSachMon.forEach((m, idx) => {
                let badgeStatus = '';
                const laMonChoBung = (m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG' || m.trangThai === 'DA_CHE_BIEN');
                if (m.trangThai === 'CHO_XAC_NHAN') badgeStatus = '<span class="badge badge-xam">Chờ xác nhận</span>';
                else if (m.trangThai === 'DANG_CHE_BIEN') badgeStatus = '<span class="badge badge-vang">👨‍🍳 Đang chế biến</span>';
                else if (laMonChoBung) badgeStatus = '<span class="badge badge-xanh-la badge-cho-bung-pulse">🔔 Bếp đã nấu xong</span>';
                else if (m.trangThai === 'DA_PHUC_VU' || m.trangThai === 'DA_LEN_MON') badgeStatus = '<span class="badge badge-xanh-duong">✓ Đã phục vụ</span>';
                else if (m.trangThai === 'DA_HUY') badgeStatus = '<span class="badge badge-do">✕ Đã hủy</span>';

                const thanhTien = m.donGia * m.soLuong;

                danhSachMonHtml += `
                    <tr class="${m.trangThai === 'DA_HUY' ? 'dong-mon-da-huy' : ''} ${laMonChoBung ? 'dong-mon-cho-bung' : ''}">
                        <td style="text-align: center;">${idx + 1}</td>
                        <td>
                            <strong>${m.tenMon}</strong>
                            ${m.tuyChon ? `<div style="font-size: 12px; color: var(--mau-chinh);">${m.tuyChon}</div>` : ''}
                            ${m.ghiChu ? `<div style="font-size: 11.5px; color: var(--mau-chu-phu); font-style: italic;">📝 ${m.ghiChu}</div>` : ''}
                        </td>
                        <td style="text-align: center; font-weight: 700;">${m.soLuong}</td>
                        <td style="text-align: right;">${(m.donGia || 0).toLocaleString()} đ</td>
                        <td style="text-align: right; font-weight: 700; color: var(--mau-chinh);">${thanhTien.toLocaleString()} đ</td>
                        <td style="text-align: center;">
                            <div style="margin-bottom: 6px;">${badgeStatus}</div>
                            ${m.trangThai !== 'DA_HUY' ? `
                                <div class="nhom-nut-thao-tac-mon">
                                    ${(m.trangThai !== 'DA_PHUC_VU' && m.trangThai !== 'DA_LEN_MON') ? `
                                        <button class="nut-mini ${laMonChoBung ? 'nut-mini-xanh nut-bung-nhanh-mini' : 'nut-mini-xam'}" onclick="window.soDoBanPos.xacNhanDaPhucVu(${banId}, ${m.id})" title="Xác nhận đã bưng lên bàn cho khách (US-096)">
                                            ${laMonChoBung ? '🚶 Đã bưng lên' : '✓ Đã lên'}
                                        </button>
                                    ` : ''}
                                    <button class="nut-mini nut-mini-do" onclick="window.soDoBanPos.moModalHuyTraMon(${banId}, ${m.id})" title="Hủy món hoặc đổi trả món (US-089, US-090)">
                                        ✕ Hủy/Trả
                                    </button>
                                </div>
                            ` : ''}
                        </td>
                    </tr>
                `;
            });
        }

        modal.innerHTML = `
            <div class="hop-modal hop-modal-lon">
                <div class="dau-modal">
                    <div>
                        <h3>📋 Chi Tiết Đơn Hàng & Món Ăn — ${ban.soBan}</h3>
                        <span style="font-size: 13px; color: var(--mau-chu-phu);">
                            Thời gian ngồi: <strong>${soPhut} phút</strong> | Số khách: <strong>${phien.soKhach} người</strong>
                        </span>
                    </div>
                    <button class="nut-dong-modal" onclick="window.soDoBanPos.dongModal()">✕</button>
                </div>
                <div class="than-modal" style="max-height: 70vh; overflow-y: auto;">
                    ${soMonChoBung > 0 ? `
                        <div class="banner-thong-bao-cho-bung">
                            <div>
                                <strong>🔔 Bếp đã nấu xong ${soMonChoBung} món!</strong>
                                <div style="font-size: 12.5px; margin-top: 2px;">Món đã sẵn sàng tại quầy ra món, vui lòng bưng lên bàn cho khách.</div>
                            </div>
                            <button class="nut nut-xanh nut-nho" onclick="window.soDoBanPos.bungTatCaMonDaXong(${banId})">
                                🚶 BƯNG TẤT CẢ MÓN ĐÃ XONG (${soMonChoBung})
                            </button>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-weight: 700;">Danh sách món ăn của bàn:</span>
                        <button class="nut nut-phu nut-nho" onclick="window.soDoBanPos.dongModal(); window.soDoBanPos.moModalGoiMonHo(${banId})">
                            ➕ Thêm món hộ khách (US-095)
                        </button>
                    </div>
                    <table class="bang-du-lieu">
                        <thead>
                            <tr>
                                <th style="width: 40px; text-align: center;">#</th>
                                <th>Món ăn / Tùy chọn / Ghi chú</th>
                                <th style="width: 60px; text-align: center;">SL</th>
                                <th style="width: 100px; text-align: right;">Đơn giá</th>
                                <th style="width: 110px; text-align: right;">Thành tiền</th>
                                <th style="width: 150px; text-align: center;">Trạng thái & Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${danhSachMonHtml}
                        </tbody>
                    </table>

                    <div class="tong-ket-don-pos">
                        <div>
                            <span>Ghi chú bàn: <strong>${phien.ghiChu || 'Không có ghi chú'}</strong></span>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 14px; color: var(--mau-chu-phu);">Tổng tiền tạm tính:</span>
                            <div style="font-size: 22px; font-weight: 800; color: var(--mau-chinh);">
                                ${tongTien.toLocaleString()} đ
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" style="color: #dc2626; border-color: #dc2626;" onclick="window.tienIchTest.xoaDonBan(${banId})" title="Hủy toàn bộ đơn và giải phóng bàn này về Trống">
                        🗑️ Hủy/Xóa đơn bàn này
                    </button>
                    <button class="nut nut-phu" onclick="window.soDoBanPos.dongModal()">Đóng cửa sổ</button>
                    <button class="nut nut-phu" onclick="window.soDoBanPos.dongModal(); window.soDoBanPos.moModalChuyenGhep(${banId})">
                        🔄 Chuyển / Ghép bàn
                    </button>
                    <button class="nut nut-chinh" onclick="window.soDoBanPos.dongModal(); window.soDoBanPos.chuyenSangThanhToan(${banId})">
                        💵 Chuyển sang Thanh toán
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    /**
     * Bưng tất cả các món bếp đã nấu xong lên bàn cho khách
     */
    async bungTatCaMonDaXong(banId) {
        const dsBan = await window.api.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId);
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien || !Array.isArray(phien.danhSachMon)) return;

        const cacMon = phien.danhSachMon.filter(m => 
            m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG' || m.trangThai === 'DA_CHE_BIEN'
        );
        if (cacMon.length === 0) {
            if (window.thongBao) window.thongBao.thongTin('Thông báo', 'Bàn này hiện không có món nào đang chờ bưng.');
            return;
        }

        for (const m of cacMon) {
            m.trangThai = 'DA_PHUC_VU';
            try {
                await window.api.capNhatTrangThaiMonAn(m.id, banId, 'DA_LEN_MON');
            } catch (e) {
                console.warn('Lỗi cập nhật trạng thái món lên server:', e);
            }
        }

        this.luuTatCaPhienBan(dsPhien);

        if (window.thongBao) {
            window.thongBao.thanhCong(
                'Đã bưng món lên bàn! 🎉',
                `Đã phục vụ thành công ${cacMon.length} món lên ${ban ? ban.soBan : 'Bàn ' + banId}.`
            );
        }

        // Tải lại modal chi tiết đơn nếu đang mở
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (modal && modal.classList.contains('mo')) {
            const tieuDeModal = modal.querySelector('.dau-modal h3');
            if (tieuDeModal && tieuDeModal.textContent.includes('Chi Tiết Đơn Hàng')) {
                this.moModalChiTietDon(banId);
            }
        }

        await this.taiVaHienThi();
    }

    /**
     * US-096: Xác nhận món ăn đã phục vụ lên bàn
     */
    async xacNhanDaPhucVu(banId, monId) {
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien) return;

        const mon = phien.danhSachMon.find(m => m.id == monId);
        if (mon) {
            mon.trangThai = 'DA_PHUC_VU';
            this.luuTatCaPhienBan(dsPhien);
            try {
                await window.api.capNhatTrangThaiMonAn(mon.id, banId, 'DA_LEN_MON');
            } catch (e) {
                console.warn('Lỗi cập nhật trạng thái món lên server:', e);
            }
            if (window.thongBao) window.thongBao.thanhCong('Đã lên món', `Đã đánh dấu "${mon.tenMon}" là ĐÃ PHỤC VỤ.`);
            this.moModalChiTietDon(banId); // Tải lại modal
            this.taiVaHienThi(); // Tải lại lưới
        }
    }

    /**
     * US-089, US-090, US-091: Hủy món hoặc đổi trả món kèm lý do
     */
    moModalHuyTraMon(banId, monId) {
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien) return;

        const mon = phien.danhSachMon.find(m => m.id == monId);
        if (!mon) return;

        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-modal hop-modal-vua">
                <div class="dau-modal">
                    <h3 style="color: var(--mau-canh-bao);">⚠️ Hủy Món / Đổi Trả — ${mon.tenMon}</h3>
                    <button class="nut-dong-modal" onclick="window.soDoBanPos.moModalChiTietDon(${banId})">✕</button>
                </div>
                <div class="than-modal">
                    <p style="margin-bottom: 14px; font-size: 13.5px; line-height: 1.5;">
                        Bạn đang thao tác hủy/trả món <strong>${mon.tenMon}</strong> (Số lượng: ${mon.soLuong}). 
                        Hệ thống sẽ ghi nhật ký để đối soát thất thoát nguyên liệu theo quy chuẩn <strong>US-091</strong>.
                    </p>
                    <div class="nhom-form">
                        <label>Phân loại thao tác (*):</label>
                        <select id="loai-huy-tra" class="o-nhap-lieu">
                            <option value="HUY">Hủy món (Khách đổi ý khi bếp chưa nấu / Hết nguyên liệu)</option>
                            <option value="TRA">Đổi trả món (Món bị lỗi chế biến / nguội / khách phàn nàn)</option>
                        </select>
                    </div>
                    <div class="nhom-form" style="margin-top: 14px;">
                        <label>Lý do hủy / đổi trả chi tiết (*):</label>
                        <textarea id="ly-do-huy-tra" class="o-nhap-lieu" rows="3" placeholder="Ghi rõ lý do (ví dụ: Khách chờ quá 30p, Bếp báo hết rau nấm, Khách báo món mặn cần đổi...)" required></textarea>
                    </div>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.soDoBanPos.moModalChiTietDon(${banId})">Quay lại</button>
                    <button class="nut nut-canh-bao" onclick="window.soDoBanPos.xacNhanHuyTraMon(${banId}, ${mon.id})">
                        Xác nhận Hủy/Trả Món
                    </button>
                </div>
            </div>
        `;
    }

    xacNhanHuyTraMon(banId, monId) {
        const loai = document.getElementById('loai-huy-tra')?.value || 'HUY';
        const lyDo = (document.getElementById('ly-do-huy-tra')?.value || '').trim();

        if (!lyDo) {
            alert('Vui lòng nhập lý do hủy/đổi trả để phục vụ việc đối soát quản lý!');
            return;
        }

        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien) return;

        const mon = phien.danhSachMon.find(m => m.id == monId);
        if (mon) {
            mon.trangThai = 'DA_HUY';
            mon.lyDoHuy = lyDo;
            this.luuTatCaPhienBan(dsPhien);

            // Ghi nhật ký thất thoát
            this.ghiNhatKyHuyTra(this.banDangChon || { id: banId, soBan: `Bàn ${banId}` }, mon.tenMon, mon.soLuong, loai, lyDo);

            if (window.thongBao) window.thongBao.canhBao('Đã hủy món', `Đã ghi nhận hủy món "${mon.tenMon}" và lưu nhật ký đối soát.`);
            this.moModalChiTietDon(banId);
            this.taiVaHienThi();
        }
    }

    // =========================================================================
    // US-095: GỌI MÓN HỘ KHÁCH (NHÂN VIÊN ĐẶT MÓN TẠI BÀN - GIAO DIỆN CHUẨN POS)
    // =========================================================================
    async moModalGoiMonHo(banId) {
        const dsBan = await window.api.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId);
        const dsMon = await window.api.layDanhSachMonAn();
        const dsDanhMuc = await window.api.layDanhSachDanhMuc();

        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal || !ban) return;

        const dsPhien = this.layTatCaPhienBan() || {};
        const phien = dsPhien[banId] || { danhSachMon: [] };
        const mapSoLuong = {};
        (phien.danhSachMon || []).forEach(m => {
            if (m.trangThai !== 'DA_HUY') {
                mapSoLuong[m.monAnId] = (mapSoLuong[m.monAnId] || 0) + (m.soLuong || 1);
            }
        });

        let danhSachDanhMucHtml = '<button class="nut-tab-dm kich-hoat" onclick="window.soDoBanPos.locMonGoiHo(\'TAT_CA\')">🍽️ Tất cả</button>';
        dsDanhMuc.forEach(dm => {
            danhSachDanhMucHtml += `<button class="nut-tab-dm" onclick="window.soDoBanPos.locMonGoiHo(${dm.id})">${dm.bieuTuong || '🏷️'} ${dm.ten || dm.tenDanhMuc}</button>`;
        });

        let danhSachMonHtml = '';
        dsMon.forEach(m => {
            const tamHet = (m.trangThai === 0 || m.trangThai === 'TamHet');
            const soLuong = mapSoLuong[m.id] || 0;
            danhSachMonHtml += `
                <div class="the-mon-goi-ho ${tamHet ? 'mon-tam-het' : ''}" id="the-mon-gh-${m.id}" data-danh-muc="${m.danhMucId}" data-ten="${(m.tenMon || '').toLowerCase()}">
                    <div class="anh-mon-wrap-gh">
                        <img src="${m.hinhAnh || ''}" alt="${m.tenMon}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'">
                        <span class="badge-da-chon-gh" id="badge-mon-gh-${m.id}" style="${soLuong > 0 ? '' : 'display:none;'}">x${soLuong}</span>
                    </div>
                    <div class="thong-tin-mon-goi-ho">
                        <div class="ten-mon-gh" title="${window.DinhDang ? window.DinhDang.thoatHtml(m.tenMon) : m.tenMon}">${window.DinhDang ? window.DinhDang.thoatHtml(m.tenMon) : m.tenMon}</div>
                        <div class="gia-mon-gh">${(m.giaBan || 0).toLocaleString()} đ</div>
                        ${tamHet ? '<span class="badge badge-do" style="text-align:center; padding: 4px;">Tạm hết</span>' : `
                            <button class="nut-them-mon-gh" onclick="window.soDoBanPos.themMonVaoBan(${banId}, ${m.id})">
                                ➕ Thêm vào bàn
                            </button>
                        `}
                    </div>
                </div>
            `;
        });

        const tongMon = (phien.danhSachMon || []).filter(m => m.trangThai !== 'DA_HUY').reduce((s, m) => s + (m.soLuong || 1), 0);
        const tongTien = (phien.danhSachMon || []).filter(m => m.trangThai !== 'DA_HUY').reduce((s, m) => s + (m.donGia * (m.soLuong || 1)), 0);

        modal.innerHTML = `
            <div class="hop-modal hop-modal-lon modal-goi-mon-ho">
                <div class="dau-modal">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 26px;">🍲</span>
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1e293b;">Gọi Món Hộ Khách — ${ban.soBan}</h3>
                            <span style="font-size: 12.5px; color: #64748b;">Mã bàn: <strong>${ban.maBan}</strong> • Sức chứa: <strong>${ban.sucChua} chỗ</strong> • Trạng thái: <strong style="color: ${ban.trangThai === 'DANG_DUNG' ? '#c2410c' : '#16a34a'};">${ban.trangThai === 'DANG_DUNG' ? 'Đang phục vụ' : 'Bàn trống'}</strong></span>
                        </div>
                    </div>
                    <button class="nut-dong-modal" onclick="window.soDoBanPos.dongModal()">✕</button>
                </div>

                <div class="than-modal khung-goi-mon-chia-doi">
                    <!-- Cột trái: Tìm kiếm + Danh mục + Danh sách món ăn -->
                    <div class="cot-thuc-don-goi-ho">
                        <div class="hop-tim-mon-gh">
                            <span style="color: #94a3b8; font-size: 16px;">🔍</span>
                            <input type="text" id="tim-mon-goi-ho" class="o-nhap-tim-gh" placeholder="Nhập tên món ăn để tìm nhanh..." oninput="window.soDoBanPos.timMonGoiHo(this.value)">
                        </div>

                        <div class="thanh-cuon-dm-goi-ho">
                            ${danhSachDanhMucHtml}
                        </div>

                        <div class="luoi-mon-goi-ho" id="luoi-mon-goi-ho">
                            ${danhSachMonHtml}
                        </div>
                    </div>

                    <!-- Cột phải: Đơn hàng hiện tại của bàn -->
                    <div class="cot-don-hang-goi-ho" id="cot-don-hang-goi-ho">
                        ${this.veCotDonHangGoiHo(banId)}
                    </div>
                </div>

                <div class="chan-modal chan-modal-goi-ho">
                    <div class="tom-tat-nhanh-don">
                        <span>Đã chọn: <strong id="tong-so-luong-gh" style="color: #0f172a;">${tongMon} món</strong></span>
                        <span style="color: #cbd5e1;">|</span>
                        <span>Tổng tạm tính: <strong class="gia-tong-gh" id="tong-tien-gh">${tongTien.toLocaleString()} đ</strong></span>
                    </div>
                    <div class="nhom-nut-chan-gh">
                        <button class="nut nut-phu" onclick="window.soDoBanPos.moModalChiTietDon(${banId})">📋 Xem chi tiết đơn</button>
                        <button class="nut nut-chinh" onclick="window.soDoBanPos.hoanTatGoiMonHo(${banId})">✓ Hoàn tất & Đóng</button>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    veCotDonHangGoiHo(banId) {
        const dsPhien = this.layTatCaPhienBan() || {};
        const phien = dsPhien[banId] || { danhSachMon: [] };
        const dsMon = (phien.danhSachMon || []).filter(m => m.trangThai !== 'DA_HUY');

        const tongTien = dsMon.reduce((s, m) => s + (Number(m.thanhTien) || (Number(m.donGia || 0) * Number(m.soLuong || 1))), 0);
        const tongMon = dsMon.reduce((s, m) => s + (m.soLuong || 1), 0);

        return `
            <div class="dau-cot-don-gh">
                <h4>📋 Món Đang Chọn (${tongMon})</h4>
                <span style="font-size: 12px; color: #64748b;">${dsMon.length} loại món</span>
            </div>

            <div class="danh-sach-mon-da-chon-gh">
                ${dsMon.length === 0 ? `
                    <div class="khung-don-trong-gh">
                        <div style="font-size: 32px; margin-bottom: 8px;">🍽️</div>
                        <strong>Bàn chưa có món nào</strong>
                        <p style="font-size: 12px; margin-top: 4px; color: #94a3b8;">Bấm "➕ Thêm vào bàn" ở thực đơn bên trái để chọn món</p>
                    </div>
                ` : dsMon.map(m => `
                    <div class="hang-mon-da-chon-gh">
                        <div class="ten-va-gia-mon-chon">
                            <div class="ten-mon-chon" title="${m.tenMon}">${m.tenMon}</div>
                            <div class="gia-mon-chon">${(m.donGia || 0).toLocaleString()} đ</div>
                        </div>

                        <div class="bo-dem-so-luong-gh">
                            <button class="nut-tang-giam-gh" onclick="window.soDoBanPos.giamSoLuongMonGoiHo(${banId}, ${m.monAnId})" title="Giảm">−</button>
                            <span class="so-luong-hien-tai-gh">${m.soLuong}</span>
                            <button class="nut-tang-giam-gh" onclick="window.soDoBanPos.tangSoLuongMonGoiHo(${banId}, ${m.monAnId})" title="Thêm">+</button>
                        </div>

                        <div class="thanh-tien-mon-chon">
                            ${(Number(m.thanhTien) || ((m.donGia || 0) * (m.soLuong || 1))).toLocaleString()} đ
                        </div>

                        <button class="nut-xoa-mon-gh" onclick="window.soDoBanPos.xoaMonKhoiGoiHo(${banId}, ${m.monAnId})" title="Xóa món này">🗑️</button>
                    </div>
                `).join('')}
            </div>

            <div class="chan-cot-don-gh">
                <div class="hang-tong-cong-gh">
                    <span>Tổng tạm tính:</span>
                    <strong>${tongTien.toLocaleString()} đ</strong>
                </div>
            </div>
        `;
    }

    capNhatCotDonHangGoiHo(banId) {
        const cot = document.getElementById('cot-don-hang-goi-ho');
        if (cot) {
            cot.innerHTML = this.veCotDonHangGoiHo(banId);
        }

        const dsPhien = this.layTatCaPhienBan() || {};
        const phien = dsPhien[banId] || { danhSachMon: [] };
        const dsMon = (phien.danhSachMon || []).filter(m => m.trangThai !== 'DA_HUY');

        const tongMon = dsMon.reduce((s, m) => s + (m.soLuong || 1), 0);
        const tongTien = dsMon.reduce((s, m) => s + (Number(m.thanhTien) || (Number(m.donGia || 0) * Number(m.soLuong || 1))), 0);

        const elSl = document.getElementById('tong-so-luong-gh');
        if (elSl) elSl.innerText = `${tongMon} món`;
        const elTien = document.getElementById('tong-tien-gh');
        if (elTien) elTien.innerText = `${tongTien.toLocaleString()} đ`;

        // Cập nhật lại badge số lượng trên từng thẻ món bên trái
        const mapSoLuong = {};
        dsMon.forEach(m => {
            mapSoLuong[m.monAnId] = (mapSoLuong[m.monAnId] || 0) + (m.soLuong || 1);
        });

        document.querySelectorAll('.the-mon-goi-ho').forEach(el => {
            const idStr = el.id.replace('the-mon-gh-', '');
            const monId = Number(idStr);
            const badge = document.getElementById(`badge-mon-gh-${monId}`);
            if (badge) {
                const sl = mapSoLuong[monId] || 0;
                if (sl > 0) {
                    badge.innerText = `x${sl}`;
                    badge.style.display = '';
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    }

    timMonGoiHo(tuKhoa) {
        tuKhoa = (tuKhoa || '').trim().toLowerCase();
        document.querySelectorAll('.the-mon-goi-ho').forEach(el => {
            const ten = el.getAttribute('data-ten') || '';
            el.style.display = ten.includes(tuKhoa) ? 'flex' : 'none';
        });
    }

    locMonGoiHo(dmId) {
        document.querySelectorAll('.nut-tab-dm').forEach(b => b.classList.remove('kich-hoat'));
        if (window.event && window.event.target) {
            window.event.target.closest('.nut-tab-dm').classList.add('kich-hoat');
        }

        document.querySelectorAll('.the-mon-goi-ho').forEach(el => {
            const dm = el.getAttribute('data-danh-muc');
            if (dmId === 'TAT_CA' || dm == dmId) {
                el.style.display = 'flex';
            } else {
                el.style.display = 'none';
            }
        });
    }

    async themMonVaoBan(banId, monId) {
        const dsMon = await window.api.layDanhSachMonAn();
        const mon = dsMon.find(m => m.id == monId);
        if (!mon) return;

        const dsPhien = this.layTatCaPhienBan();
        let phien = dsPhien[banId];
        if (!phien) {
            phien = {
                id: banId,
                banId: banId,
                soKhach: 4,
                thoiGianBatDau: new Date().toISOString(),
                ghiChu: '',
                danhSachMon: []
            };
            dsPhien[banId] = phien;
        }

        const thoiGianHienTai = new Date().toISOString();
        // Kiểm tra xem món đã có trong đơn chưa, nếu có thì tăng số lượng
        const monDaCo = phien.danhSachMon.find(m => m.monAnId == monId && m.trangThai !== 'DA_HUY');
        if (monDaCo) {
            monDaCo.soLuong += 1;
            monDaCo.thanhTien = (monDaCo.donGia || mon.giaBan) * monDaCo.soLuong;
            monDaCo.thoiGianCapNhat = thoiGianHienTai;
            monDaCo.lanGoiMoi = true;
            if (monDaCo.trangThai === 'DA_PHUC_VU' || monDaCo.trangThai === 'DA_LEN_MON') {
                monDaCo.trangThai = 'CHO_XAC_NHAN';
            }
        } else {
            phien.danhSachMon.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                monAnId: mon.id,
                tenMon: mon.tenMon,
                soLuong: 1,
                donGia: mon.giaBan,
                thanhTien: mon.giaBan,
                tuyChon: '',
                ghiChu: 'Nhân viên gọi hộ',
                trangThai: 'CHO_XAC_NHAN',
                thoiGianTao: thoiGianHienTai,
                thoiGianCapNhat: thoiGianHienTai,
                lanGoiMoi: true
            });
        }
        phien.thoiGianGoiMoiNhat = thoiGianHienTai;
        phien.soLuotGoi = (phien.soLuotGoi || 1) + 1;

        this.luuTatCaPhienBan(dsPhien);

        // Cập nhật trạng thái bàn sang DANG_DUNG nếu đang trống
        const dsBan = await window.api.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId);
        if (ban && ban.trangThai === 'TRONG') {
            ban.trangThai = 'DANG_DUNG';
            await window.api.capNhatTrangThaiBan(banId, 'DANG_DUNG');
        }

        this.capNhatCotDonHangGoiHo(banId);
        this.taiVaHienThi();
    }

    tangSoLuongMonGoiHo(banId, monId) {
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien) return;

        const mon = (phien.danhSachMon || []).find(m => m.monAnId == monId && m.trangThai !== 'DA_HUY');
        if (mon) {
            mon.soLuong += 1;
            mon.thanhTien = (mon.donGia || 0) * mon.soLuong;
            mon.thoiGianCapNhat = new Date().toISOString();
            this.luuTatCaPhienBan(dsPhien);
            this.capNhatCotDonHangGoiHo(banId);
            this.taiVaHienThi();
        }
    }

    giamSoLuongMonGoiHo(banId, monId) {
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien) return;

        const mon = (phien.danhSachMon || []).find(m => m.monAnId == monId && m.trangThai !== 'DA_HUY');
        if (mon) {
            if (mon.soLuong > 1) {
                mon.soLuong -= 1;
                mon.thanhTien = (mon.donGia || 0) * mon.soLuong;
                mon.thoiGianCapNhat = new Date().toISOString();
            } else {
                phien.danhSachMon = phien.danhSachMon.filter(m => !(m.monAnId == monId && m.trangThai !== 'DA_HUY'));
            }
            this.luuTatCaPhienBan(dsPhien);
            this.capNhatCotDonHangGoiHo(banId);
            this.taiVaHienThi();
        }
    }

    xoaMonKhoiGoiHo(banId, monId) {
        const dsPhien = this.layTatCaPhienBan();
        const phien = dsPhien[banId];
        if (!phien) return;

        phien.danhSachMon = (phien.danhSachMon || []).filter(m => !(m.monAnId == monId && m.trangThai !== 'DA_HUY'));
        this.luuTatCaPhienBan(dsPhien);
        this.capNhatCotDonHangGoiHo(banId);
        this.taiVaHienThi();
    }

    hoanTatGoiMonHo(banId) {
        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Đã lưu gọi món', 'Đơn của bàn đã được cập nhật thành công!');
        }
        this.taiVaHienThi();
    }

    // =========================================================================
    // US-097 & US-098: CHUYỂN BÀN & GHÉP BÀN
    // =========================================================================
    async moModalChuyenGhep(banId) {
        const dsBan = await window.api.layDanhSachBan();
        const banHienTai = dsBan.find(b => b.id == banId);
        if (!banHienTai) return;

        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        const dsBanTrong = dsBan.filter(b => b.trangThai === 'TRONG' && b.id != banId);
        const dsBanDangDung = dsBan.filter(b => (b.trangThai === 'DANG_DUNG' || b.trangThai === 'CHO_THANH_TOAN') && b.id != banId);

        let optBanTrongHtml = '';
        dsBanTrong.forEach(b => {
            optBanTrongHtml += `<option value="${b.id}">${b.soBan} (${b.maBan}) — Sức chứa: ${b.sucChua} chỗ</option>`;
        });

        let checkboxBanGhep = '';
        dsBanDangDung.forEach(b => {
            checkboxBanGhep += `
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: #f8fafc; border-radius: 8px; cursor: pointer;">
                    <input type="checkbox" name="ban-ghep-chon" value="${b.id}">
                    <span><strong>${b.soBan}</strong> (${b.maBan} - ${b.sucChua} chỗ)</span>
                </label>
            `;
        });

        modal.innerHTML = `
            <div class="hop-modal hop-modal-vua">
                <div class="dau-modal">
                    <h3>🔄 Chuyển Bàn hoặc Ghép Bàn — ${banHienTai.soBan}</h3>
                    <button class="nut-dong-modal" onclick="window.soDoBanPos.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <!-- Tab chọn tính năng Chuyển hoặc Ghép -->
                    <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid var(--mau-vien); padding-bottom: 12px;">
                        <button id="tab-nut-chuyen" class="nut nut-chinh nut-nho" onclick="window.soDoBanPos.chuyenTabChuyenGhep('CHUYEN')">
                            1. Chuyển sang Bàn Trống (US-097)
                        </button>
                        <button id="tab-nut-ghep" class="nut nut-phu nut-nho" onclick="window.soDoBanPos.chuyenTabChuyenGhep('GHEP')">
                            2. Ghép vào Bàn Khác (US-098)
                        </button>
                    </div>

                    <!-- Khung chuyển bàn -->
                    <div id="khung-chuyen-ban">
                        <div class="nhom-form">
                            <label>Chọn bàn trống chuyển đến (*):</label>
                            ${dsBanTrong.length > 0 ? `
                                <select id="ban-dich-chuyen" class="o-nhap-lieu">
                                    ${optBanTrongHtml}
                                </select>
                            ` : '<p style="color: var(--mau-canh-bao);">Hiện tại không còn bàn trống nào trong nhà hàng!</p>'}
                        </div>
                        <div class="nhom-form" style="margin-top: 14px;">
                            <label>Lý do chuyển bàn:</label>
                            <input type="text" id="ly-do-chuyen" class="o-nhap-lieu" placeholder="Ví dụ: Khách muốn đổi bàn có máy lạnh, bàn rộng hơn...">
                        </div>
                        <div style="margin-top: 20px;">
                            <button class="nut nut-chinh" style="width: 100%;" ${dsBanTrong.length === 0 ? 'disabled' : ''} onclick="window.soDoBanPos.xacNhanChuyenBan(${banId})">
                                Xác nhận chuyển bàn ngay
                            </button>
                        </div>
                    </div>

                    <!-- Khung ghép bàn -->
                    <div id="khung-ghep-ban" style="display: none;">
                        <p style="font-size: 13.5px; color: var(--mau-chu-phu); margin-bottom: 12px;">
                            Gộp toàn bộ món ăn và hóa đơn từ các bàn được chọn vào chung <strong>${banHienTai.soBan}</strong> (các bàn phụ sau khi ghép sẽ tự động được trả về trạng thái "Bàn trống").
                        </p>
                        <div class="nhom-form">
                            <label>Chọn bàn đang phục vụ để ghép vào ${banHienTai.soBan}:</label>
                            <div style="max-height: 200px; overflow-y: auto; margin-top: 6px;">
                                ${checkboxBanGhep || '<p style="color: var(--mau-chu-phu);">Không có bàn nào khác đang dùng để ghép.</p>'}
                            </div>
                        </div>
                        <div style="margin-top: 20px;">
                            <button class="nut nut-chinh" style="width: 100%;" ${dsBanDangDung.length === 0 ? 'disabled' : ''} onclick="window.soDoBanPos.xacNhanGhepBan(${banId})">
                                Xác nhận ghép các bàn đã chọn
                            </button>
                        </div>
                    </div>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.soDoBanPos.dongModal()">Hủy bỏ</button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    chuyenTabChuyenGhep(loai) {
        const kChuyen = document.getElementById('khung-chuyen-ban');
        const kGhep = document.getElementById('khung-ghep-ban');
        const nChuyen = document.getElementById('tab-nut-chuyen');
        const nGhep = document.getElementById('tab-nut-ghep');

        if (loai === 'CHUYEN') {
            kChuyen.style.display = 'block';
            kGhep.style.display = 'none';
            nChuyen.className = 'nut nut-chinh nut-nho';
            nGhep.className = 'nut nut-phu nut-nho';
        } else {
            kChuyen.style.display = 'none';
            kGhep.style.display = 'block';
            nChuyen.className = 'nut nut-phu nut-nho';
            nGhep.className = 'nut nut-chinh nut-nho';
        }
    }

    /**
     * US-097: Thực hiện chuyển bàn
     */
    async xacNhanChuyenBan(banNguonId) {
        const banDichId = parseInt(document.getElementById('ban-dich-chuyen')?.value);
        const lyDo = document.getElementById('ly-do-chuyen')?.value || 'Khách yêu cầu chuyển bàn';

        if (!banDichId) return;

        const dsBan = await window.api.layDanhSachBan();
        const banNguon = dsBan.find(b => b.id == banNguonId);
        const banDich = dsBan.find(b => b.id == banDichId);

        const dsPhien = this.layTatCaPhienBan();
        const phienNguon = dsPhien[banNguonId];

        if (!banNguon || !banDich || !phienNguon) return;

        // Chuyển phiên sang bàn đích
        phienNguon.banId = banDichId;
        phienNguon.ghiChu = `${phienNguon.ghiChu || ''} (Chuyển từ ${banNguon.soBan}: ${lyDo})`.trim();
        dsPhien[banDichId] = phienNguon;
        delete dsPhien[banNguonId];
        this.luuTatCaPhienBan(dsPhien);

        // Cập nhật trạng thái bàn
        banDich.trangThai = banNguon.trangThai;
        banNguon.trangThai = 'TRONG';
        await window.api.capNhatTrangThaiBan(banDichId, banNguon.trangThai);
        await window.api.capNhatTrangThaiBan(banNguonId, 'TRONG');
        await window.api.luuDanhSachBan(dsBan);

        this.dongModal();
        if (window.thongBao) window.thongBao.thanhCong('Chuyển bàn thành công', `Đã chuyển toàn bộ đơn từ ${banNguon.soBan} sang ${banDich.soBan}.`);
        await this.taiVaHienThi();
    }

    /**
     * US-098: Thực hiện ghép bàn
     */
    async xacNhanGhepBan(banChinhId) {
        const cacBanPhu = Array.from(document.querySelectorAll('input[name="ban-ghep-chon"]:checked')).map(cb => parseInt(cb.value));

        if (cacBanPhu.length === 0) {
            alert('Vui lòng chọn ít nhất 1 bàn để ghép!');
            return;
        }

        const dsBan = await window.api.layDanhSachBan();
        const banChinh = dsBan.find(b => b.id == banChinhId);
        const dsPhien = this.layTatCaPhienBan();
        let phienChinh = dsPhien[banChinhId];

        if (!banChinh || !phienChinh) return;

        let tenCacBanGhep = [];
        cacBanPhu.forEach(banPhuId => {
            const banPhu = dsBan.find(b => b.id == banPhuId);
            const phienPhu = dsPhien[banPhuId];
            if (banPhu && phienPhu) {
                tenCacBanGhep.push(banPhu.soBan);
                // Gộp món ăn
                phienPhu.danhSachMon.forEach(m => {
                    m.ghiChu = `${m.ghiChu ? m.ghiChu + ' ' : ''}[Ghép từ ${banPhu.soBan}]`;
                    phienChinh.danhSachMon.push(m);
                });
                phienChinh.soKhach += (phienPhu.soKhach || 2);

                // Xóa phiên bàn phụ và trả bàn phụ về TRONG
                delete dsPhien[banPhuId];
                banPhu.trangThai = 'TRONG';
                window.api.capNhatTrangThaiBan(banPhuId, 'TRONG');
            }
        });

        this.luuTatCaPhienBan(dsPhien);
        await window.api.luuDanhSachBan(dsBan);

        this.dongModal();
        if (window.thongBao) {
            window.thongBao.thanhCong('Ghép bàn thành công', `Đã gộp đơn của (${tenCacBanGhep.join(', ')}) vào ${banChinh.soBan}.`);
        }
        await this.taiVaHienThi();
    }

    /**
     * Dẫn thẳng sang tab thanh toán với bàn đã chọn
     */
    chuyenSangThanhToan(banId) {
        localStorage.setItem('quanmoc_pos_ban_thanh_toan_chon', banId);
        if (window.ungDung) {
            window.ungDung.chuyenTab('thanhToanPos');
        }
    }

    /**
     * Hiển thị modal nhật ký hủy/trả món
     */
    moModalNhatKyHuyTra() {
        const ds = this.layNhatKyHuyTra();
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        let rowHtml = '';
        if (ds.length === 0) {
            rowHtml = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Chưa có lượt hủy hoặc đổi trả món nào.</td></tr>';
        } else {
            ds.forEach((item, idx) => {
                const thoiGianStr = new Date(item.thoiGian).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
                rowHtml += `
                    <tr>
                        <td style="text-align: center;">${idx + 1}</td>
                        <td>${thoiGianStr}</td>
                        <td><strong>${item.soBan}</strong></td>
                        <td>${item.tenMon} (x${item.soLuong})</td>
                        <td><span class="badge ${item.loai === 'HUY' ? 'badge-do' : 'badge-vang'}">${item.loai === 'HUY' ? 'HỦY MÓN' : 'ĐỔI TRẢ'}</span></td>
                        <td>${item.lyDo} <br><small style="color: var(--mau-chu-phu);">Bởi: ${item.nhanVien}</small></td>
                    </tr>
                `;
            });
        }

        modal.innerHTML = `
            <div class="hop-modal hop-modal-lon">
                <div class="dau-modal">
                    <h3>📜 Nhật Ký Hủy / Đổi Trả Món Ăn (US-091 Đối Soát Thất Thoát)</h3>
                    <button class="nut-dong-modal" onclick="window.soDoBanPos.dongModal()">✕</button>
                </div>
                <div class="than-modal" style="max-height: 65vh; overflow-y: auto;">
                    <table class="bang-du-lieu">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Thời gian</th>
                                <th>Bàn</th>
                                <th>Món ăn</th>
                                <th>Phân loại</th>
                                <th>Lý do & Nhân viên thực hiện</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowHtml}
                        </tbody>
                    </table>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.soDoBanPos.dongModal()">Đóng</button>
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

// Khởi tạo toàn cục
if (typeof window !== 'undefined') {
    window.soDoBanPos = new SoDoBanPosModule();
}
