/**
 * PHÂN HỆ ĐÁNH GIÁ KHÁCH HÀNG & QUẢN TRỊ PHẢN HỒI (quanLyDanhGia.js)
 * Phụ trách: Quân (Frontend Table QR & POS Lead)
 * Đáp ứng các User Story trong Sprint 4:
 * - US-111: Khách hàng chấm điểm sao (1-5 sao) cho chất lượng dịch vụ sau bữa ăn
 * - US-112: Khách hàng gửi nhận xét chi tiết và đánh giá từng món ăn đã thưởng thức
 * - US-113: Quản lý xem danh sách toàn bộ đánh giá và phản hồi của khách hàng
 * - US-114: Bộ lọc đánh giá theo số sao, theo ngày hoặc lọc đánh giá tiêu cực (1-2 sao) cần xử lý gấp
 * - US-115: Quản lý ghi chú xử lý hoặc gửi phản hồi hồi âm ý kiến đóng góp của khách hàng
 * - US-116: Thống kê điểm đánh giá trung bình của nhà hàng và của từng món ăn
 */

class QuanLyDanhGiaModule {
    constructor() {
        this.khoiTaoDuLieuKho();
        this.boLocSao = 'TAT_CA';
        this.boLocTieuCuc = false;
        this.tuKhoaTimKiem = '';
    }

    /**
     * Khởi tạo kho dữ liệu đánh giá trong LocalStorage
     */
    khoiTaoDuLieuKho() {
        const KHOA_DG = 'quanmoc_danh_sach_danh_gia';
        if (!localStorage.getItem(KHOA_DG)) {
            const dsDanhGiaMau = [
                {
                    id: 1,
                    maHoaDon: 'HD-20261028-T1-02',
                    soBan: 'Bàn 02',
                    tenKhach: 'Anh Tuấn (Bàn VIP)',
                    thoiGian: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    soSaoTongQuan: 5,
                    nhanXetDichVu: 'Nhà hàng không gian mộc mạc ấm cúng, nhân viên Quân phục vụ chu đáo, món Lẩu nấm bò tơ ăn thanh ngọt tuyệt hảo. Sẽ quay lại thường xuyên!',
                    danhGiaMon: [
                        { monAnId: 2, tenMon: 'Lẩu Nấm Bò Tơ Quán Mộc', soSao: 5, nhanXet: 'Nước dùng ngọt thanh, bò tơ mềm tan.' },
                        { monAnId: 3, tenMon: 'Bò Tơ Nướng Tảng Sốt Tiêu Rừng', soSao: 5, nhanXet: 'Sốt tiêu thơm nồng, thịt nướng than hoa mọng nước.' },
                        { monAnId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soSao: 5, nhanXet: 'Trà đậm vị sen, củ năng giòn rụm.' }
                    ],
                    trangThai: 'DA_PHAN_HOI',
                    phanHoiQuanLy: 'Quán Mộc chân thành cảm ơn gia đình anh Tuấn đã ghé thăm và gửi lời khen! Hẹn gặp lại anh trong dịp gần nhất.',
                    nguoiPhanHoi: 'Quản lý Nhật',
                    thoiGianPhanHoi: new Date(Date.now() - 15 * 60 * 1000).toISOString()
                },
                {
                    id: 2,
                    maHoaDon: 'HD-20261028-SV-11',
                    soBan: 'Bàn 11',
                    tenKhach: 'Chị Mai Lan',
                    thoiGian: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
                    soSaoTongQuan: 5,
                    nhanXetDichVu: 'Đặt tiệc sinh nhật ngoài sân vườn rất chill và thoáng đãng. Quét QR thanh toán VietQR hiển thị đúng số tiền trong 2 giây cực tiện.',
                    danhGiaMon: [
                        { monAnId: 3, tenMon: 'Bò Tơ Nướng Tảng Sốt Tiêu Rừng', soSao: 5, nhanXet: 'Ngon xuất sắc.' },
                        { monAnId: 4, tenMon: 'Cơm Cháy Kho Quẹt Nam Bộ', soSao: 4, nhanXet: 'Kho quẹt tôm thịt đậm vị.' }
                    ],
                    trangThai: 'DA_PHAN_HOI',
                    phanHoiQuanLy: 'Cảm ơn chị Mai Lan đã chọn Quán Mộc làm nơi tổ chức tiệc sinh nhật ý nghĩa!',
                    nguoiPhanHoi: 'Quân (Chăm sóc khách hàng)',
                    thoiGianPhanHoi: new Date(Date.now() - 90 * 60 * 1000).toISOString()
                },
                {
                    id: 3,
                    maHoaDon: 'HD-20261028-T1-04',
                    soBan: 'Bàn 04',
                    tenKhach: 'Khách hàng ẩn danh',
                    thoiGian: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
                    soSaoTongQuan: 2,
                    nhanXetDichVu: 'Món Cơm Cháy lúc mang ra hơi nguội một chút, tóp mỡ chưa giòn. Mong quán chú ý giữ nóng niêu kho quẹt khi bưng lên tầng.',
                    danhGiaMon: [
                        { monAnId: 4, tenMon: 'Cơm Cháy Kho Quẹt Nam Bộ', soSao: 2, nhanXet: 'Món bị nguội khi mang ra.' }
                    ],
                    trangThai: 'CHO_XU_LY',
                    phanHoiQuanLy: '',
                    nguoiPhanHoi: '',
                    thoiGianPhanHoi: null
                },
                {
                    id: 4,
                    maHoaDon: 'HD-20261028-T2-08',
                    soBan: 'Bàn 08',
                    tenKhach: 'Anh Hoàng Nam',
                    thoiGian: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
                    soSaoTongQuan: 4,
                    nhanXetDichVu: 'Đồ ăn ngon, giá cả hợp lý với chất lượng. Quán cuối tuần hơi đông nên thời gian đợi món khoảng 15 phút.',
                    danhGiaMon: [
                        { monAnId: 2, tenMon: 'Lẩu Nấm Bò Tơ Quán Mộc', soSao: 5, nhanXet: 'Rất nhiều nấm tươi và bò ngon.' }
                    ],
                    trangThai: 'DA_GIAI_QUYET',
                    phanHoiQuanLy: 'Quán Mộc đã tiếp thu và bố trí thêm 1 đầu bếp hỗ trợ ca cuối tuần để đẩy nhanh tốc độ lên món. Cảm ơn anh Nam!',
                    nguoiPhanHoi: 'Quản lý Nhật',
                    thoiGianPhanHoi: new Date(Date.now() - 200 * 60 * 1000).toISOString()
                },
                {
                    id: 5,
                    maHoaDon: 'HD-20261028-T1-01',
                    soBan: 'Bàn 01',
                    tenKhach: 'Cô Thanh Thủy',
                    thoiGian: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
                    soSaoTongQuan: 5,
                    nhanXetDichVu: 'Trà sen vàng ngọt thanh vừa phải, hạt sen bùi. Menu trên điện thoại có hình ảnh rõ ràng, người lớn tuổi quét QR cũng chọn món rất dễ.',
                    danhGiaMon: [
                        { monAnId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soSao: 5, nhanXet: 'Ngon tuyệt vời.' }
                    ],
                    trangThai: 'DA_PHAN_HOI',
                    phanHoiQuanLy: 'Dạ Quán Mộc rất vui vì cô Thủy hài lòng với món trà thanh mát và trải nghiệm gọi món QR của quán!',
                    nguoiPhanHoi: 'Quân (Frontend Lead)',
                    thoiGianPhanHoi: new Date(Date.now() - 400 * 60 * 1000).toISOString()
                }
            ];
            localStorage.setItem(KHOA_DG, JSON.stringify(dsDanhGiaMau));
        }
    }

    layTatCaDanhGia() {
        const raw = localStorage.getItem('quanmoc_danh_sach_danh_gia');
        return raw ? JSON.parse(raw) : [];
    }

    luuTatCaDanhGia(ds) {
        localStorage.setItem('quanmoc_danh_sach_danh_gia', JSON.stringify(ds));
    }

    async khoiTao() {
        const vungChua = document.getElementById('noi-dung-chinh');
        if (!vungChua) return;

        vungChua.innerHTML = `
            <div class="trang-quan-ly-danh-gia">
                <!-- Header phân hệ -->
                <div class="thanh-tieu-de-pos">
                    <div class="nhom-tieu-de">
                        <h2>⭐ Đánh Giá Khách Hàng & Quản Trị Phản Hồi</h2>
                        <p class="mo-ta-phu">Phân hệ Sprint 4 (US-111 → US-116) • Điểm sao trung bình, Phản hồi khách hàng, Lọc đánh giá tiêu cực & Thống kê món ăn</p>
                    </div>
                    <div class="nhom-nut-hanh-dong-pos">
                        <button class="nut nut-chinh" onclick="window.quanLyDanhGia.moModalKhachDanhGia()">
                            ✍️ Giả lập Khách Chấm Điểm & Đánh Giá (US-111, US-112)
                        </button>
                        <button class="nut nut-phu" onclick="window.quanLyDanhGia.moModalThongKeMon()">
                            📊 Thống kê điểm từng món (US-116)
                        </button>
                    </div>
                </div>

                <!-- Thống kê điểm sao tổng quan (US-116) -->
                <div class="thanh-thong-ke-danh-gia" id="thong-ke-sao-tong-quan"></div>

                <!-- Thanh tìm kiếm & bộ lọc thông minh (US-114) -->
                <div class="thanh-bo-loc-pos">
                    <div class="nhom-tim-kiem">
                        <input type="text" id="tim-kiem-danh-gia" placeholder="🔍 Tìm kiếm phản hồi theo tên khách, số bàn, nội dung nhận xét..." oninput="window.quanLyDanhGia.xuLyTimKiem(this.value)">
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div class="nhom-nut-loc-trang-thai" id="danh-sach-nut-loc-sao"></div>
                        <div>
                            <button id="nut-loc-tieu-cuc" class="nut-pill-tieu-cuc ${this.boLocTieuCuc ? 'kich-hoat' : ''}" onclick="window.quanLyDanhGia.toggleLocTieuCuc()">
                                🚨 Chỉ xem đánh giá tiêu cực (1-2 sao) cần xử lý gấp (US-114)
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Danh sách các thẻ phản hồi (US-113) -->
                <div class="danh-sach-the-danh-gia" id="danh-sach-the-danh-gia">
                    <div class="dang-tai-du-lieu">Đang tải đánh giá...</div>
                </div>
            </div>
        `;

        await this.taiVaHienThi();
    }

    async taiVaHienThi() {
        const ds = this.layTatCaDanhGia();
        this.veThongKeTongQuan(ds);
        this.veBoLocSao(ds);
        this.veDanhSachDanhGia(ds);
    }

    // =========================================================================
    // US-116: TÍNH ĐIỂM SAO TRUNG BÌNH & THỐNG KÊ TỔNG QUAN
    // =========================================================================
    veThongKeTongQuan(ds) {
        const el = document.getElementById('thong-ke-sao-tong-quan');
        if (!el) return;

        const tongSo = ds.length;
        if (tongSo === 0) {
            el.innerHTML = '<div class="the-thong-ke-nho">Chưa có đánh giá nào.</div>';
            return;
        }

        const tongDiem = ds.reduce((sum, d) => sum + (d.soSaoTongQuan || 5), 0);
        const diemTb = (tongDiem / tongSo).toFixed(1);

        // Số đánh giá 5 sao, 4 sao, 3 sao, 1-2 sao
        const dem5 = ds.filter(d => d.soSaoTongQuan === 5).length;
        const dem4 = ds.filter(d => d.soSaoTongQuan === 4).length;
        const dem3 = ds.filter(d => d.soSaoTongQuan === 3).length;
        const demTieuCuc = ds.filter(d => d.soSaoTongQuan <= 2).length;
        const tyLeHaiLong = Math.round(((dem5 + dem4) / tongSo) * 100);

        el.innerHTML = `
            <div class="the-diem-trung-binh-lon">
                <div class="so-diem-to">${diemTb}</div>
                <div class="hang-ngoi-sao-vang">${'⭐'.repeat(Math.round(diemTb))}</div>
                <div class="nhan-diem-tb">ĐIỂM TRUNG BÌNH QUÁN MỘC</div>
                <div style="font-size: 12px; color: var(--mau-chu-phu); margin-top: 4px;">Dựa trên <strong>${tongSo}</strong> lượt đánh giá thực tế</div>
            </div>

            <div class="luoi-chi-so-danh-gia">
                <div class="the-thong-ke-nho the-xanh-la">
                    <div class="so-luong-thong-ke">${tyLeHaiLong}%</div>
                    <div class="nhan-thong-ke">Tỷ lệ khách hài lòng (4-5 ⭐)</div>
                </div>
                <div class="the-thong-ke-nho the-xanh-duong">
                    <div class="so-luong-thong-ke">${dem5}</div>
                    <div class="nhan-thong-ke">Đánh giá 5 sao tuyệt đối</div>
                </div>
                <div class="the-thong-ke-nho the-vang">
                    <div class="so-luong-thong-ke">${dem4 + dem3}</div>
                    <div class="nhan-thong-ke">Đánh giá khá & bình thường (3-4 ⭐)</div>
                </div>
                <div class="the-thong-ke-nho ${demTieuCuc > 0 ? 'the-do' : ''}">
                    <div class="so-luong-thong-ke" style="${demTieuCuc > 0 ? 'color: #DC2626;' : ''}">${demTieuCuc}</div>
                    <div class="nhan-thong-ke">${demTieuCuc > 0 ? '⚠️ Cần xử lý gấp (1-2 ⭐)' : 'Không có phản hồi xấu'}</div>
                </div>
            </div>
        `;
    }

    veBoLocSao(ds) {
        const el = document.getElementById('danh-sach-nut-loc-sao');
        if (!el) return;

        const cacMuc = [
            { ma: 'TAT_CA', ten: `Tất cả (${ds.length})` },
            { ma: '5', ten: `5 ⭐ (${ds.filter(d => d.soSaoTongQuan === 5).length})` },
            { ma: '4', ten: `4 ⭐ (${ds.filter(d => d.soSaoTongQuan === 4).length})` },
            { ma: '3', ten: `3 ⭐ (${ds.filter(d => d.soSaoTongQuan === 3).length})` },
            { ma: '2', ten: `2 ⭐ (${ds.filter(d => d.soSaoTongQuan === 2).length})` },
            { ma: '1', ten: `1 ⭐ (${ds.filter(d => d.soSaoTongQuan === 1).length})` }
        ];

        let html = '';
        cacMuc.forEach(m => {
            html += `
                <button class="nut-pill-trang-thai ${this.boLocSao === m.ma && !this.boLocTieuCuc ? 'kich-hoat' : ''}" onclick="window.quanLyDanhGia.chuyenLocSao('${m.ma}')">
                    ${m.ten}
                </button>
            `;
        });
        el.innerHTML = html;
    }

    chuyenLocSao(ma) {
        this.boLocSao = ma;
        this.boLocTieuCuc = false;
        this.taiVaHienThi();
    }

    toggleLocTieuCuc() {
        this.boLocTieuCuc = !this.boLocTieuCuc;
        if (this.boLocTieuCuc) this.boLocSao = 'TAT_CA';
        this.taiVaHienThi();
    }

    xuLyTimKiem(val) {
        this.tuKhoaTimKiem = (val || '').trim().toLowerCase();
        this.taiVaHienThi();
    }

    // =========================================================================
    // US-113, US-114: HIỂN THỊ DANH SÁCH ĐÁNH GIÁ & BỘ LỌC TIÊU CỰC
    // =========================================================================
    veDanhSachDanhGia(ds) {
        const el = document.getElementById('danh-sach-the-danh-gia');
        if (!el) return;

        let danhSach = ds;

        // Lọc tiêu cực 1-2 sao (US-114)
        if (this.boLocTieuCuc) {
            danhSach = danhSach.filter(d => d.soSaoTongQuan <= 2);
        } else if (this.boLocSao !== 'TAT_CA') {
            const sao = parseInt(this.boLocSao);
            danhSach = danhSach.filter(d => d.soSaoTongQuan === sao);
        }

        // Lọc tìm kiếm
        if (this.tuKhoaTimKiem) {
            danhSach = danhSach.filter(d => 
                (d.tenKhach && d.tenKhach.toLowerCase().includes(this.tuKhoaTimKiem)) ||
                (d.soBan && d.soBan.toLowerCase().includes(this.tuKhoaTimKiem)) ||
                (d.nhanXetDichVu && d.nhanXetDichVu.toLowerCase().includes(this.tuKhoaTimKiem)) ||
                (d.maHoaDon && d.maHoaDon.toLowerCase().includes(this.tuKhoaTimKiem))
            );
        }

        if (danhSach.length === 0) {
            el.innerHTML = `
                <div class="khung-trong-pos" style="background: #FFF; padding: 40px; border-radius: var(--bo-goc); border: 1px solid var(--mau-vien); text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
                    <h3>Không có đánh giá nào phù hợp</h3>
                    <p style="color: var(--mau-chu-phu); margin-top: 6px;">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            `;
            return;
        }

        let html = '';
        danhSach.forEach(item => {
            const thoiGianStr = new Date(item.thoiGian).toLocaleString('vi-VN');
            const laTieuCuc = (item.soSaoTongQuan <= 2);

            // Danh sách đánh giá chi tiết từng món (US-112)
            let danhSachMonHtml = '';
            if (item.danhGiaMon && item.danhGiaMon.length > 0) {
                danhSachMonHtml = '<div class="hop-danh-gia-mon-kem">';
                item.danhGiaMon.forEach(m => {
                    danhSachMonHtml += `
                        <div class="dong-danh-gia-mon-item">
                            <span>🍲 <strong>${m.tenMon}</strong>:</span>
                            <span style="color: #F59E0B; margin: 0 6px;">${'★'.repeat(m.soSao)}${'☆'.repeat(5 - m.soSao)}</span>
                            <span style="color: var(--mau-chu-phu); font-style: italic;">"${m.nhanXet || 'Không có nhận xét'}"</span>
                        </div>
                    `;
                });
                danhSachMonHtml += '</div>';
            }

            // Trạng thái xử lý
            let badgeTrangThai = '<span class="badge badge-vang">Chờ xử lý</span>';
            if (item.trangThai === 'DA_PHAN_HOI') badgeTrangThai = '<span class="badge badge-xanh-duong">Đã phản hồi</span>';
            else if (item.trangThai === 'DA_GIAI_QUYET') badgeTrangThai = '<span class="badge badge-xanh-la">Đã giải quyết</span>';

            html += `
                <div class="the-danh-gia-item ${laTieuCuc ? 'the-danh-gia-tieu-cuc' : ''}">
                    <div class="dau-the-danh-gia">
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <strong style="font-size: 16px;">${item.tenKhach}</strong>
                                <span class="badge-ban-dg">${item.soBan}</span>
                                <span style="font-size: 12px; color: var(--mau-chu-phu);">${item.maHoaDon}</span>
                            </div>
                            <div style="font-size: 12px; color: var(--mau-chu-phu); margin-top: 3px;">
                                Đánh giá lúc: ${thoiGianStr}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="sao-danh-gia-hang" style="font-size: 20px; color: #F59E0B;">
                                ${'★'.repeat(item.soSaoTongQuan)}${'☆'.repeat(5 - item.soSaoTongQuan)}
                            </div>
                            <div style="margin-top: 4px;">${badgeTrangThai}</div>
                        </div>
                    </div>

                    <div class="than-the-danh-gia">
                        <div class="noi-dung-nhan-xet-chinh">
                            "${item.nhanXetDichVu || 'Khách không để lại nhận xét bằng lời.'}"
                        </div>
                        ${danhSachMonHtml}
                    </div>

                    <!-- Phần phản hồi của Quản lý (US-115) -->
                    ${item.phanHoiQuanLy ? `
                        <div class="hop-phan-hoi-quan-ly-da-gui">
                            <div style="font-weight: 700; color: #1E40AF; margin-bottom: 4px; display: flex; justify-content: space-between;">
                                <span>💬 Phản hồi từ ${item.nguoiPhanHoi || 'Quán Mộc'}:</span>
                                <span style="font-size: 11.5px; font-weight: 400; color: var(--mau-chu-phu);">${new Date(item.thoiGianPhanHoi).toLocaleString('vi-VN')}</span>
                            </div>
                            <p style="font-size: 13.5px; color: #1E3A8A; line-height: 1.5;">${item.phanHoiQuanLy}</p>
                        </div>
                    ` : ''}

                    <div class="chan-the-danh-gia">
                        <button class="nut nut-phu nut-nho" onclick="window.quanLyDanhGia.moModalPhanHoi(${item.id})">
                            ✍️ ${item.phanHoiQuanLy ? 'Chỉnh sửa phản hồi' : 'Gửi phản hồi cho khách (US-115)'}
                        </button>
                    </div>
                </div>
            `;
        });

        el.innerHTML = html;
    }

    // =========================================================================
    // US-115: FORM QUẢN LÝ PHẢN HỒI Ý KIẾN KHÁCH HÀNG
    // =========================================================================
    moModalPhanHoi(danhGiaId) {
        const ds = this.layTatCaDanhGia();
        const item = ds.find(d => d.id == danhGiaId);
        if (!item) return;

        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        modal.innerHTML = `
            <div class="hop-modal hop-modal-vua">
                <div class="dau-modal">
                    <h3>💬 Phản Hồi Ý Kiến Khách Hàng (US-115)</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyDanhGia.dongModal()">✕</button>
                </div>
                <div class="than-modal">
                    <div style="background: #F8FAFC; padding: 12px 14px; border-radius: 8px; margin-bottom: 14px;">
                        <div><strong>Khách hàng:</strong> ${item.tenKhach} (${item.soBan}) — <strong>${'⭐'.repeat(item.soSaoTongQuan)}</strong></div>
                        <p style="font-style: italic; color: #475569; margin-top: 4px;">"${item.nhanXetDichVu}"</p>
                    </div>

                    <div class="nhom-form">
                        <label>Trạng thái xử lý (*):</label>
                        <select id="phan-hoi-trang-thai" class="o-nhap-lieu">
                            <option value="DA_PHAN_HOI" ${item.trangThai === 'DA_PHAN_HOI' ? 'selected' : ''}>Đã phản hồi (Gửi lời cảm ơn / giải thích)</option>
                            <option value="DA_GIAI_QUYET" ${item.trangThai === 'DA_GIAI_QUYET' ? 'selected' : ''}>Đã giải quyết thỏa đáng (Đã bù món / khắc phục sự cố)</option>
                            <option value="CHO_XU_LY" ${item.trangThai === 'CHO_XU_LY' ? 'selected' : ''}>Chờ xử lý tiếp</option>
                        </select>
                    </div>

                    <div class="nhom-form" style="margin-top: 14px;">
                        <label>Nội dung phản hồi / hồi âm (*):</label>
                        <textarea id="noi-dung-phan-hoi-ql" class="o-nhap-lieu" rows="4" placeholder="Nhập lời cảm ơn hoặc giải pháp xử lý gửi tới khách hàng...">${item.phanHoiQuanLy || ''}</textarea>
                    </div>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.quanLyDanhGia.dongModal()">Hủy bỏ</button>
                    <button class="nut nut-chinh" onclick="window.quanLyDanhGia.xacNhanPhanHoi(${item.id})">
                        Lưu và Gửi Phản Hồi
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    xacNhanPhanHoi(danhGiaId) {
        const noiDung = (document.getElementById('noi-dung-phan-hoi-ql')?.value || '').trim();
        const trangThai = document.getElementById('phan-hoi-trang-thai')?.value || 'DA_PHAN_HOI';

        if (!noiDung) {
            alert('Vui lòng nhập nội dung phản hồi!');
            return;
        }

        const ds = this.layTatCaDanhGia();
        const item = ds.find(d => d.id == danhGiaId);
        if (!item) return;

        const user = window.api ? window.api.layThongTinNguoiDung() : null;
        item.phanHoiQuanLy = noiDung;
        item.trangThai = trangThai;
        item.nguoiPhanHoi = user ? `${user.hoTen} (${user.vaiTro})` : 'Quản lý Quán Mộc';
        item.thoiGianPhanHoi = new Date().toISOString();

        this.luuTatCaDanhGia(ds);
        this.dongModal();

        if (window.thongBao) {
            window.thongBao.thanhCong('Đã lưu phản hồi', `Đã cập nhật phản hồi tới khách hàng ${item.tenKhach}.`);
        }
        this.taiVaHienThi();
    }

    // =========================================================================
    // US-111 & US-112: MODAL GIẢ LẬP KHÁCH HÀNG CHẤM SAO & NHẬN XÉT MÓN ĂN
    // =========================================================================
    async moModalKhachDanhGia() {
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        const dsMon = await window.api.layDanhSachMonAn();
        const dsBan = await window.api.layDanhSachBan();

        // Chọn 3 món ăn tiêu biểu để khách đánh giá
        const baMon = dsMon.slice(0, 3);
        let htmlMon = '';
        baMon.forEach(m => {
            htmlMon += `
                <div class="dong-danh-gia-mon-form" data-mon-id="${m.id}" data-ten-mon="${m.tenMon}">
                    <div style="font-weight: 700; font-size: 13.5px; margin-bottom: 4px;">🍲 ${m.tenMon}</div>
                    <div class="chon-sao-mon" data-sao="5" style="display: flex; gap: 6px; cursor: pointer; font-size: 22px; color: #F59E0B;">
                        <span onclick="window.quanLyDanhGia.datSaoMon(this, 1)">★</span>
                        <span onclick="window.quanLyDanhGia.datSaoMon(this, 2)">★</span>
                        <span onclick="window.quanLyDanhGia.datSaoMon(this, 3)">★</span>
                        <span onclick="window.quanLyDanhGia.datSaoMon(this, 4)">★</span>
                        <span onclick="window.quanLyDanhGia.datSaoMon(this, 5)">★</span>
                    </div>
                    <input type="text" class="o-nhap-lieu o-nhan-xet-mon" placeholder="Nhận xét hương vị món này (tùy chọn)..." style="margin-top: 6px; font-size: 12.5px;">
                </div>
            `;
        });

        let optBan = '';
        dsBan.forEach(b => {
            optBan += `<option value="${b.soBan}">${b.soBan} (${b.maBan})</option>`;
        });

        modal.innerHTML = `
            <div class="hop-modal hop-modal-vua">
                <div class="dau-modal">
                    <h3>✍️ Khách Hàng Đánh Giá Dịch Vụ (US-111 & US-112)</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyDanhGia.dongModal()">✕</button>
                </div>
                <div class="than-modal" style="max-height: 70vh; overflow-y: auto;">
                    <p style="font-size: 13px; color: var(--mau-chu-phu); margin-bottom: 14px;">
                        Màn hình trải nghiệm khi khách quét QR thanh toán xong và gửi đánh giá chất lượng bữa ăn.
                    </p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
                        <div class="nhom-form">
                            <label>Bàn của bạn:</label>
                            <select id="khach-dg-ban" class="o-nhap-lieu">${optBan}</select>
                        </div>
                        <div class="nhom-form">
                            <label>Tên của bạn (*):</label>
                            <input type="text" id="khach-dg-ten" class="o-nhap-lieu" placeholder="Nhập tên của bạn..." value="Khách dùng bữa">
                        </div>
                    </div>

                    <!-- Chấm sao tổng quan (US-111) -->
                    <div style="background: #FFFDF9; border: 1.5px solid #FED7AA; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 16px;">
                        <label style="font-weight: 800; font-size: 15px; color: #9A3412; display: block; margin-bottom: 8px;">
                            BẠN CẢM THẤY BỮA ĂN HÔM NAY THẾ NÀO? (US-111)
                        </label>
                        <div id="chon-sao-tong-quan" data-sao="5" style="display: flex; justify-content: center; gap: 12px; font-size: 36px; color: #F59E0B; cursor: pointer;">
                            <span onclick="window.quanLyDanhGia.datSaoTongQuan(1)" title="1 sao - Rất tệ">★</span>
                            <span onclick="window.quanLyDanhGia.datSaoTongQuan(2)" title="2 sao - Tệ">★</span>
                            <span onclick="window.quanLyDanhGia.datSaoTongQuan(3)" title="3 sao - Bình thường">★</span>
                            <span onclick="window.quanLyDanhGia.datSaoTongQuan(4)" title="4 sao - Tốt">★</span>
                            <span onclick="window.quanLyDanhGia.datSaoTongQuan(5)" title="5 sao - Tuyệt vời">★</span>
                        </div>
                        <div id="nhan-cam-xuc-sao" style="font-weight: 700; color: #D97706; margin-top: 6px; font-size: 14px;">🌟 Tuyệt vời! Rất hài lòng</div>
                    </div>

                    <div class="nhom-form" style="margin-bottom: 16px;">
                        <label>Nhận xét đóng góp chung:</label>
                        <textarea id="khach-dg-nhan-xet" class="o-nhap-lieu" rows="3" placeholder="Không gian, tốc độ phục vụ, thái độ nhân viên..."></textarea>
                    </div>

                    <!-- Đánh giá chi tiết từng món (US-112) -->
                    <div style="margin-top: 16px;">
                        <label style="font-weight: 700; margin-bottom: 8px; display: block;">🍲 Đánh giá chi tiết các món ăn đã dùng (US-112):</label>
                        ${htmlMon}
                    </div>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.quanLyDanhGia.dongModal()">Hủy</button>
                    <button class="nut nut-chinh" onclick="window.quanLyDanhGia.xacNhanGuiDanhGia()">
                        Gửi Đánh Giá Ngay
                    </button>
                </div>
            </div>
        `;
        modal.classList.add('mo');
    }

    datSaoTongQuan(soSao) {
        const el = document.getElementById('chon-sao-tong-quan');
        if (!el) return;
        el.setAttribute('data-sao', soSao);

        const spans = el.querySelectorAll('span');
        spans.forEach((s, idx) => {
            s.textContent = (idx < soSao) ? '★' : '☆';
        });

        const camXuc = {
            1: '😡 Rất tệ - Cần cải thiện gấp',
            2: '🙁 Chưa hài lòng - Món ăn/dịch vụ có lỗi',
            3: '😐 Bình thường - Cần nâng cấp',
            4: '😊 Tốt - Khá hài lòng',
            5: '🌟 Tuyệt vời! Rất hài lòng'
        }[soSao];

        const nhan = document.getElementById('nhan-cam-xuc-sao');
        if (nhan) nhan.textContent = camXuc;
    }

    datSaoMon(theSpan, soSao) {
        const cha = theSpan.closest('.chon-sao-mon');
        if (!cha) return;
        cha.setAttribute('data-sao', soSao);
        const spans = cha.querySelectorAll('span');
        spans.forEach((s, idx) => {
            s.textContent = (idx < soSao) ? '★' : '☆';
        });
    }

    xacNhanGuiDanhGia() {
        const tenKhach = (document.getElementById('khach-dg-ten')?.value || '').trim() || 'Khách dùng bữa';
        const soBan = document.getElementById('khach-dg-ban')?.value || 'Bàn 01';
        const nhanXet = (document.getElementById('khach-dg-nhan-xet')?.value || '').trim();
        const soSaoTongQuan = parseInt(document.getElementById('chon-sao-tong-quan')?.getAttribute('data-sao') || '5');

        // Thu thập đánh giá từng món
        const danhGiaMon = [];
        document.querySelectorAll('.dong-danh-gia-mon-form').forEach(d => {
            const monId = parseInt(d.getAttribute('data-mon-id'));
            const tenMon = d.getAttribute('data-ten-mon');
            const soSao = parseInt(d.querySelector('.chon-sao-mon')?.getAttribute('data-sao') || '5');
            const nx = d.querySelector('.o-nhan-xet-mon')?.value || '';
            danhGiaMon.push({ monAnId: monId, tenMon, soSao, nhanXet: nx });
        });

        const ds = this.layTatCaDanhGia();
        const maHoaDon = `HD-DEMO-${Date.now().toString().slice(-6)}`;

        ds.unshift({
            id: Date.now(),
            maHoaDon: maHoaDon,
            soBan: soBan,
            tenKhach: tenKhach,
            thoiGian: new Date().toISOString(),
            soSaoTongQuan: soSaoTongQuan,
            nhanXetDichVu: nhanXet,
            danhGiaMon: danhGiaMon,
            trangThai: (soSaoTongQuan <= 2) ? 'CHO_XU_LY' : 'CHO_XU_LY',
            phanHoiQuanLy: '',
            nguoiPhanHoi: '',
            thoiGianPhanHoi: null
        });

        this.luuTatCaDanhGia(ds);
        this.dongModal();

        if (window.thongBao) {
            window.thongBao.thanhCong(
                'Cảm ơn bạn đã đánh giá! 🎉',
                `Đã tiếp nhận đánh giá ${soSaoTongQuan} sao từ ${tenKhach} (${soBan}).`
            );
        }
        this.taiVaHienThi();
    }

    // =========================================================================
    // US-116: MODAL THỐNG KÊ ĐIỂM ĐÁNH GIÁ TỪNG MÓN ĂN
    // =========================================================================
    async moModalThongKeMon() {
        const ds = this.layTatCaDanhGia();
        const modal = document.getElementById('khung-modal-toan-cuc');
        if (!modal) return;

        // Tổng hợp điểm từng món
        const mapMon = {};
        ds.forEach(d => {
            if (d.danhGiaMon && Array.isArray(d.danhGiaMon)) {
                d.danhGiaMon.forEach(m => {
                    if (!mapMon[m.tenMon]) {
                        mapMon[m.tenMon] = { tongSao: 0, soLuot: 0 };
                    }
                    mapMon[m.tenMon].tongSao += m.soSao;
                    mapMon[m.tenMon].soLuot += 1;
                });
            }
        });

        let rowHtml = '';
        Object.keys(mapMon).forEach((ten, idx) => {
            const data = mapMon[ten];
            const dtb = (data.tongSao / data.soLuot).toFixed(1);
            rowHtml += `
                <tr>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td><strong>${ten}</strong></td>
                    <td style="text-align: center; color: #F59E0B; font-weight: 700; font-size: 15px;">
                        ${dtb} ⭐
                    </td>
                    <td style="text-align: center;">${data.soLuot} lượt đánh giá</td>
                    <td>
                        <div style="background: #E2E8F0; border-radius: 9999px; height: 8px; width: 100%; overflow: hidden;">
                            <div style="background: #F59E0B; height: 100%; width: ${(dtb / 5) * 100}%;"></div>
                        </div>
                    </td>
                </tr>
            `;
        });

        modal.innerHTML = `
            <div class="hop-modal hop-modal-vua">
                <div class="dau-modal">
                    <h3>📊 Thống Kê Điểm Đánh Giá Từng Món Ăn (US-116)</h3>
                    <button class="nut-dong-modal" onclick="window.quanLyDanhGia.dongModal()">✕</button>
                </div>
                <div class="than-modal" style="max-height: 65vh; overflow-y: auto;">
                    <table class="bang-du-lieu">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên món ăn</th>
                                <th style="text-align: center;">Điểm TB</th>
                                <th style="text-align: center;">Số lượt</th>
                                <th>Mức độ yêu thích</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowHtml || '<tr><td colspan="5" style="text-align: center; padding: 20px;">Chưa có dữ liệu đánh giá món ăn.</td></tr>'}
                        </tbody>
                    </table>
                </div>
                <div class="chan-modal">
                    <button class="nut nut-phu" onclick="window.quanLyDanhGia.dongModal()">Đóng</button>
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
    window.quanLyDanhGia = new QuanLyDanhGiaModule();
}
