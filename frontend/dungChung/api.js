/**
 * LỚP GIAO TIẾP VỚI MÁY CHỦ API & QUẢN LÝ DỮ LIỆU CỤC BỘ (api.js)
 * Cung cấp cơ chế kết nối RESTful API và Kho lưu trữ dữ liệu ngoại tuyến (Offline Repository)
 * Đảm bảo các màn hình của Quân (Sprint 1) hoạt động trơn tru ngay cả khi độc lập hoặc tích hợp Backend.
 */

class ApiService {
    constructor() {
        this.baseUrl = window.HANG_SO ? window.HANG_SO.API_BASE_URL : 'http://localhost:3001/api';
        this.daKiemTraServer = false;
        this.serverDangChay = false;
        this.khoiTaoDuLieuMauBanDau();
    }

    /**
     * Lấy Token truy cập từ LocalStorage
     */
    layAccessToken() {
        return localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.ACCESS_TOKEN || 'quanmoc_access_token');
    }

    /**
     * Lưu Token truy cập
     */
    luuAccessToken(token) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.ACCESS_TOKEN || 'quanmoc_access_token', token);
    }

    /**
     * Kiểm tra trạng thái máy chủ siêu tốc (Timeout 200ms)
     */
    async kiemTraKetNoiServer() {
        // Nếu mở trực tiếp dạng file:/// hoặc protocol không phải http/https -> Chạy offline ngay
        if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
            this.serverDangChay = false;
            this.daKiemTraServer = true;
            return false;
        }

        if (this.daKiemTraServer) {
            return this.serverDangChay;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 200); // 200ms tối đa
            const phanHoi = await fetch(`${this.baseUrl}/kiem-tra-suc-khoe`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            this.serverDangChay = (phanHoi.status === 200);
        } catch {
            this.serverDangChay = false;
        }

        this.daKiemTraServer = true;
        return this.serverDangChay;
    }

    /**
     * Gọi HTTP Request chung (Tự động fallback LocalStorage 0ms nếu server không bật)
     */
    async yeuCau(duongDan, tuyChon = {}) {
        const coServer = await this.kiemTraKetNoiServer();
        if (!coServer) {
            return null; // Không cần chờ timeout, trả về ngay lập tức để đọc LocalStorage
        }

        const url = `${this.baseUrl}${duongDan}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(tuyChon.headers || {})
        };

        const token = this.layAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500);

            const phanHoi = await fetch(url, {
                ...tuyChon,
                headers,
                signal: controller.signal,
                body: tuyChon.body ? JSON.stringify(tuyChon.body) : undefined
            });
            clearTimeout(timeoutId);

            const duLieuJson = await phanHoi.json().catch(() => null);

            if (phanHoi.status === 401) {
                console.warn('Phiên làm việc hết hạn hoặc chưa đăng nhập');
            }

            return duLieuJson || { ok: false, msg: 'Không thể giải mã dữ liệu từ máy chủ' };
        } catch (loi) {
            console.warn(`Không kết nối được tới Backend API (${url}), chuyển sang Kho dữ liệu cục bộ.`);
            return null;
        }
    }

    // =========================================================================
    // KHO DỮ LIỆU CỤC BỘ KHỞI TẠO (SEED DATA REPOSITORY)
    // =========================================================================
    khoiTaoDuLieuMauBanDau() {
        const KHOA = window.HANG_SO ? window.HANG_SO.KHOA_LUU_TRU : {};

        // 1. Dữ liệu Khu Vực mẫu
        if (!localStorage.getItem(KHOA.DANH_SACH_KHU_VUC || 'quanmoc_ds_khu_vuc')) {
            const dsKhuVucMau = [
                { id: 1, ma: 'KV_TANG1', ten: 'Tầng 1 (Máy lạnh)', moTa: 'Không gian ấm cúng, phù hợp gia đình', thuTu: 1, trangThai: 1 },
                { id: 2, ma: 'KV_TANG2', ten: 'Tầng 2 (Ngoài trời)', moTa: 'Thoáng đãng, ngắm phố xá về đêm', thuTu: 2, trangThai: 1 },
                { id: 3, ma: 'KV_SANVUON', ten: 'Khu Sân Vườn', moTa: 'Không gian xanh mát mẻ, tiệc nhóm', thuTu: 3, trangThai: 1 },
                { id: 4, ma: 'KV_VIP', ten: 'Phòng VIP', moTa: 'Không gian riêng tư, tiếp khách sang trọng', thuTu: 4, trangThai: 1 }
            ];
            localStorage.setItem(KHOA.DANH_SACH_KHU_VUC || 'quanmoc_ds_khu_vuc', JSON.stringify(dsKhuVucMau));
        }

        // 2. Dữ liệu Bàn Ăn mẫu
        if (!localStorage.getItem(KHOA.DANH_SACH_BAN || 'quanmoc_ds_ban')) {
            const dsBanMau = [
                // Tầng 1
                { id: 1, khuVucId: 1, soBan: 'Bàn 01', maBan: 'T1-01', sucChua: 4, qrToken: 'tok_t1_b01_998', trangThai: 'TRONG', ghiChu: 'Gần cửa sổ' },
                { id: 2, khuVucId: 1, soBan: 'Bàn 02', maBan: 'T1-02', sucChua: 4, qrToken: 'tok_t1_b02_874', trangThai: 'DANG_DUNG', ghiChu: 'Khách gia đình' },
                { id: 3, khuVucId: 1, soBan: 'Bàn 03', maBan: 'T1-03', sucChua: 6, qrToken: 'tok_t1_b03_321', trangThai: 'TRONG', ghiChu: 'Bàn giữa' },
                { id: 4, khuVucId: 1, soBan: 'Bàn 04', maBan: 'T1-04', sucChua: 8, qrToken: 'tok_t1_b04_552', trangThai: 'CHO_THANH_TOAN', ghiChu: 'Gần quầy bar' },
                { id: 5, khuVucId: 1, soBan: 'Bàn 05', maBan: 'T1-05', sucChua: 4, qrToken: 'tok_t1_b05_641', trangThai: 'TRONG', ghiChu: '' },
                { id: 6, khuVucId: 1, soBan: 'Bàn 06', maBan: 'T1-06', sucChua: 2, qrToken: 'tok_t1_b06_119', trangThai: 'CAN_HO_TRO', ghiChu: 'Bàn đôi' },
                // Tầng 2
                { id: 7, khuVucId: 2, soBan: 'Bàn 07', maBan: 'T2-07', sucChua: 4, qrToken: 'tok_t2_b07_441', trangThai: 'TRONG', ghiChu: 'Ban công' },
                { id: 8, khuVucId: 2, soBan: 'Bàn 08', maBan: 'T2-08', sucChua: 6, qrToken: 'tok_t2_b08_229', trangThai: 'DANG_DUNG', ghiChu: 'Bàn dài' },
                { id: 9, khuVucId: 2, soBan: 'Bàn 09', maBan: 'T2-09', sucChua: 4, qrToken: 'tok_t2_b09_773', trangThai: 'TRONG', ghiChu: '' },
                // Sân vườn
                { id: 10, khuVucId: 3, soBan: 'Bàn 10', maBan: 'SV-10', sucChua: 8, qrToken: 'tok_sv_b10_884', trangThai: 'TRONG', ghiChu: 'Dưới tán cây' },
                { id: 11, khuVucId: 3, soBan: 'Bàn 11', maBan: 'SV-11', sucChua: 10, qrToken: 'tok_sv_b11_332', trangThai: 'DANG_DUNG', ghiChu: 'Tiệc họp mặt' },
                // VIP
                { id: 12, khuVucId: 4, soBan: 'VIP 01', maBan: 'VIP-01', sucChua: 12, qrToken: 'tok_vip01_991', trangThai: 'TRONG', ghiChu: 'Phòng Sen Vàng' },
                { id: 13, khuVucId: 4, soBan: 'VIP 02', maBan: 'VIP-02', sucChua: 16, qrToken: 'tok_vip02_882', trangThai: 'TAM_KHOA', ghiChu: 'Đang bảo dưỡng đèn' }
            ];
            localStorage.setItem(KHOA.DANH_SACH_BAN || 'quanmoc_ds_ban', JSON.stringify(dsBanMau));
        }

        // 3. Dữ liệu Danh Mục Món mẫu
        if (!localStorage.getItem(KHOA.DANH_SACH_DANH_MUC || 'quanmoc_ds_danh_muc')) {
            const dsDanhMucMau = [
                { id: 1, ma: 'DM_KHAI_VI', ten: 'Khai Vị & Món Nhắm', bieuTuong: '🥗', thuTu: 1, trangThai: 1 },
                { id: 2, ma: 'DM_DAC_SAN', ten: 'Đặc Sản Quán Mộc', bieuTuong: '🍗', thuTu: 2, trangThai: 1 },
                { id: 3, ma: 'DM_LAU_NUONG', ten: 'Lẩu & Nướng Than Hoa', bieuTuong: '🍲', thuTu: 3, trangThai: 1 },
                { id: 4, ma: 'DM_HAI_SAN', ten: 'Hải Sản Tươi Sống', bieuTuong: '🦐', thuTu: 4, trangThai: 1 },
                { id: 5, ma: 'DM_COM_MI', ten: 'Cơm, Mì & Rau Rừng', bieuTuong: '🍚', thuTu: 5, trangThai: 1 },
                { id: 6, ma: 'DM_DO_UONG', ten: 'Đồ Uống & Tráng Miệng', bieuTuong: '🍹', thuTu: 6, trangThai: 1 }
            ];
            localStorage.setItem(KHOA.DANH_SACH_DANH_MUC || 'quanmoc_ds_danh_muc', JSON.stringify(dsDanhMucMau));
        }

        // 4. Dữ liệu Món Ăn mẫu
        if (!localStorage.getItem(KHOA.DANH_SACH_MON_AN || 'quanmoc_ds_mon_an')) {
            const dsMonMau = [
                {
                    id: 1,
                    danhMucId: 2,
                    maMon: 'MON-01',
                    tenMon: 'Gà Nướng Ống Tre Tây Bắc',
                    donViTinh: 'Con',
                    giaBan: 245000,
                    hinhAnh: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Gà đồi thả vườn ướp hạt dổi, mắc khén nướng trong ống tre thơm lừng, thịt mềm ngọt đậm vị.',
                    laBanChay: 1,
                    trangThai: 1, // 1: Đang bán, 0: Tạm hết, -1: Ẩn
                    tuyChonSize: [
                        { ten: 'Nửa con', giaCongThem: -100000 },
                        { ten: 'Nguyên con tiêu chuẩn', giaCongThem: 0 },
                        { ten: 'Nguyên con cỡ lớn (2kg)', giaCongThem: 60000 }
                    ],
                    tuyChonTopping: [
                        { ten: 'Xôi nếp nương nướng', gia: 35000 },
                        { ten: 'Muối chấm chẩm chéo đặc biệt', gia: 15000 }
                    ]
                },
                {
                    id: 2,
                    danhMucId: 3,
                    maMon: 'MON-02',
                    tenMon: 'Lẩu Gà Lá É Tao Ngộ',
                    donViTinh: 'Nồi',
                    giaBan: 289000,
                    hinhAnh: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Hương vị chuẩn Đà Lạt, nước dùng thanh ngọt nấu nấm samco và thịt gà ta, dậy mùi thơm lá é.',
                    laBanChay: 1,
                    trangThai: 1,
                    tuyChonSize: [
                        { ten: 'Nồi vừa (2 - 3 người)', giaCongThem: 0 },
                        { ten: 'Nồi lớn (4 - 6 người)', giaCongThem: 90000 }
                    ],
                    tuyChonTopping: [
                        { ten: 'Đĩa lá é tươi thêm', gia: 25000 },
                        { ten: 'Bún tươi thêm', gia: 15000 },
                        { ten: 'Đĩa nấm samco thêm', gia: 35000 }
                    ]
                },
                {
                    id: 3,
                    danhMucId: 2,
                    maMon: 'MON-03',
                    tenMon: 'Bò Tơ Nướng Tảng Sốt Tiêu Rừng',
                    donViTinh: 'Phần',
                    giaBan: 260000,
                    hinhAnh: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Thịt bò tơ tươi nướng trên than hoa giữ trọn độ mọng nước, kèm sốt tiêu rừng cay the dịu dàng.',
                    laBanChay: 1,
                    trangThai: 1,
                    tuyChonSize: [
                        { ten: 'Phần 300g', giaCongThem: 0 },
                        { ten: 'Phần 500g', giaCongThem: 140000 }
                    ],
                    tuyChonTopping: [
                        { ten: 'Bánh mì nướng bơ tỏi', gia: 20000 },
                        { ten: 'Khoai tây múi cau chiên', gia: 35000 }
                    ]
                },
                {
                    id: 4,
                    danhMucId: 1,
                    maMon: 'MON-04',
                    tenMon: 'Cơm Cháy Kho Quẹt Nam Bộ',
                    donViTinh: 'Đĩa',
                    giaBan: 95000,
                    hinhAnh: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Cơm cháy đáy nồi giòn rụm chấm cùng niêu kho quẹt tôm khô tóp mỡ đậm đà, ăn kèm rau củ luộc.',
                    laBanChay: 1,
                    trangThai: 1,
                    tuyChonSize: [],
                    tuyChonTopping: [
                        { ten: 'Tóp mỡ kho quẹt thêm', gia: 30000 },
                        { ten: 'Cơm cháy giòn thêm', gia: 25000 }
                    ]
                },
                {
                    id: 5,
                    danhMucId: 4,
                    maMon: 'MON-05',
                    tenMon: 'Mực Một Nắng Nướng Sa Tế',
                    donViTinh: 'Con',
                    giaBan: 185000,
                    hinhAnh: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Mực câu Phan Thiết phơi một nắng dẻo thơm, tẩm ướp sa tế cay nồng nướng than hồng.',
                    laBanChay: 0,
                    trangThai: 0, // Tạm hết hàng (để test US-038 & US-056)
                    tuyChonSize: [],
                    tuyChonTopping: []
                },
                {
                    id: 6,
                    danhMucId: 1,
                    maMon: 'MON-06',
                    tenMon: 'Gỏi Ngó Sen Tôm Thịt Hoa Chuối',
                    donViTinh: 'Đĩa',
                    giaBan: 110000,
                    hinhAnh: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Ngó sen giòn sần sật, tôm sú bóc nõn, thịt ba chỉ luộc trộn cùng nước mắm chua ngọt và bánh phồng tôm.',
                    laBanChay: 0,
                    trangThai: 1,
                    tuyChonSize: [],
                    tuyChonTopping: [
                        { ten: 'Bánh phồng tôm chiên thêm', gia: 15000 }
                    ]
                },
                {
                    id: 7,
                    danhMucId: 5,
                    maMon: 'MON-07',
                    tenMon: 'Rau Rừng Gia Lai Xào Tỏi',
                    donViTinh: 'Đĩa',
                    giaBan: 75000,
                    hinhAnh: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Rau dớn, rau lủi hái trên nương rẫy xanh mướt, xào thơm nức mũi với tỏi Lý Sơn giã dập.',
                    laBanChay: 0,
                    trangThai: 1,
                    tuyChonSize: [],
                    tuyChonTopping: []
                },
                {
                    id: 8,
                    danhMucId: 6,
                    maMon: 'MON-08',
                    tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen',
                    donViTinh: 'Ly',
                    giaBan: 45000,
                    hinhAnh: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
                    moTa: 'Trà ô long ướp hoa sen thanh nhã, thạch củ năng giòn ngọt và hạt sen bùi béo, phủ lớp kem sữa.',
                    laBanChay: 1,
                    trangThai: 1,
                    tuyChonSize: [
                        { ten: 'Size M (Tiêu chuẩn)', giaCongThem: 0 },
                        { ten: 'Size L (Khổng lồ)', giaCongThem: 10000 }
                    ],
                    tuyChonTopping: [
                        { ten: 'Thạch củ năng thêm', gia: 10000 },
                        { ten: 'Kem cheese béo ngậy', gia: 12000 }
                    ]
                }
            ];
            localStorage.setItem(KHOA.DANH_SACH_MON_AN || 'quanmoc_ds_mon_an', JSON.stringify(dsMonMau));
        }
    }

    // =========================================================================
    // API KHU VỰC & BÀN ĂN (US-023 -> US-030)
    // =========================================================================
    async layDanhSachKhuVuc() {
        const kq = await this.yeuCau('/khu-vuc');
        if (kq && kq.ok) return kq.data;

        // Fallback LocalStorage
        const data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_KHU_VUC || 'quanmoc_ds_khu_vuc');
        return data ? JSON.parse(data) : [];
    }

    async luuDanhSachKhuVuc(ds) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_KHU_VUC || 'quanmoc_ds_khu_vuc', JSON.stringify(ds));
    }

    async layDanhSachBan() {
        const kq = await this.yeuCau('/ban-an');
        if (kq && kq.ok) return kq.data;

        // Fallback LocalStorage
        const data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_BAN || 'quanmoc_ds_ban');
        return data ? JSON.parse(data) : [];
    }

    async luuDanhSachBan(ds) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_BAN || 'quanmoc_ds_ban', JSON.stringify(ds));
    }

    // =========================================================================
    // API DANH MỤC & THỰC ĐƠN (US-031 -> US-040)
    // =========================================================================
    async layDanhSachDanhMuc() {
        const kq = await this.yeuCau('/danh-muc');
        if (kq && kq.ok) return kq.data;

        // Fallback LocalStorage
        const data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DANH_MUC || 'quanmoc_ds_danh_muc');
        return data ? JSON.parse(data) : [];
    }

    async luuDanhSachDanhMuc(ds) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DANH_MUC || 'quanmoc_ds_danh_muc', JSON.stringify(ds));
    }

    async layDanhSachMonAn() {
        const kq = await this.yeuCau('/thuc-don');
        if (kq && kq.ok) return kq.data;

        // Fallback LocalStorage
        const data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_MON_AN || 'quanmoc_ds_mon_an');
        return data ? JSON.parse(data) : [];
    }

    async luuDanhSachMonAn(ds) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_MON_AN || 'quanmoc_ds_mon_an', JSON.stringify(ds));
    }

    // =========================================================================
    // PHẦN 1: BỘ API THỰC ĐƠN ĐIỆN TỬ E-MENU (THEO ĐẶC TẢ SPRINT 2 CỦA MINH)
    // =========================================================================

    /**
     * 1. Khởi tạo / Xem trang chủ E-Menu (US-050)
     * URL: GET /api/public/e-menu?banId=...&token=...
     */
    async layThongTinEMenu(banId = 1, token = 'a405d1729525dfb8e91350df4e32b0da') {
        const kq = await this.yeuCau(`/public/e-menu?banId=${encodeURIComponent(banId)}&token=${encodeURIComponent(token)}`);
        if (kq && kq.ok) return kq;

        // Fallback LocalStorage / Dữ liệu chuẩn theo đặc tả Minh
        const dsBan = await this.layDanhSachBan();
        const ban = dsBan.find(b => b.id == banId || b.maBan == banId) || dsBan[0] || {
            id: 1, maBan: 'B101', soBan: 'Bàn 01', khuVucId: 1
        };

        const dsKhuVuc = await this.layDanhSachKhuVuc();
        const kv = dsKhuVuc.find(k => k.id == ban.khuVucId);
        const tenKhuVuc = ban.tenKhuVuc || (kv ? kv.ten : 'Tầng 1 - Sảnh chính');

        const dsDanhMuc = await this.layDanhSachDanhMuc();
        const dsMon = await this.layDanhSachMonAn();
        const monBanChay = dsMon.filter(m => (m.laBanChay === 1 || m.laMonBanChay === true) && (m.trangThai === 1 || m.trangThai === 'DangBan'));

        return {
            ok: true,
            data: {
                nhaHang: {
                    tenQuan: 'Nhà Hàng Quán Mộc',
                    diaChi: '123 Đường Ẩm Thực, Quận 1, TP.HCM',
                    hotline: '1900 6868',
                    banner: '/tepTaiLen/banner-quanmoc.jpg'
                },
                thongTinBan: {
                    banId: ban.id,
                    maBan: ban.maBan,
                    tenBan: ban.soBan || ban.tenBan || 'Bàn 01',
                    tenKhuVuc: tenKhuVuc
                },
                danhMuc: dsDanhMuc.map(d => ({
                    id: d.id,
                    tenDanhMuc: d.ten || d.tenDanhMuc,
                    thuTuHienThi: d.thuTu || 1
                })),
                monBanChay: monBanChay.map(m => ({
                    id: m.id,
                    tenMon: m.tenMon,
                    giaBan: m.giaBan || m.gia,
                    donViTinh: m.donViTinh || 'Đĩa',
                    hinhAnh: m.hinhAnh,
                    trangThai: (m.trangThai === 0 || m.trangThai === 'TamHet') ? 'TamHet' : 'DangBan',
                    laMonBanChay: true
                }))
            },
            msg: 'Lấy thông tin E-Menu thành công (chế độ dự phòng)'
        };
    }

    /**
     * 2. Danh sách món ăn (Lọc & Tìm kiếm) (US-051, US-053, US-054, US-056)
     * URL: GET /api/public/e-menu/mon-an?danhMucId=...&tuKhoa=...&giaMin=...&giaMax=...
     */
    async layDanhSachMonAnEMenu({ danhMucId, tuKhoa, giaMin, giaMax } = {}) {
        const params = new URLSearchParams();
        if (danhMucId && danhMucId !== 'TAT_CA') params.append('danhMucId', danhMucId);
        if (tuKhoa) params.append('tuKhoa', tuKhoa);
        if (giaMin !== undefined && giaMin !== null && giaMin !== '') params.append('giaMin', giaMin);
        if (giaMax !== undefined && giaMax !== null && giaMax !== '') params.append('giaMax', giaMax);

        const queryStr = params.toString() ? `?${params.toString()}` : '';
        const kq = await this.yeuCau(`/public/e-menu/mon-an${queryStr}`);
        if (kq && kq.ok) return kq;

        // Fallback LocalStorage
        const dsMon = await this.layDanhSachMonAn();
        const dsLoc = dsMon.filter(mon => {
            if (mon.trangThai === -1 || mon.trangThai === 'DaAn') return false;

            if (danhMucId && danhMucId !== 'TAT_CA' && mon.danhMucId != danhMucId) {
                return false;
            }

            if (tuKhoa) {
                const kw = tuKhoa.toLowerCase().trim();
                const ten = (mon.tenMon || '').toLowerCase();
                const moTa = (mon.moTa || '').toLowerCase();
                if (!ten.includes(kw) && !moTa.includes(kw)) return false;
            }

            const gia = Number(mon.giaBan || mon.gia) || 0;
            if (giaMin !== undefined && giaMin !== null && giaMin !== '' && gia < Number(giaMin)) return false;
            if (giaMax !== undefined && giaMax !== null && giaMax !== '' && gia > Number(giaMax)) return false;

            return true;
        }).map(m => ({
            id: m.id,
            tenMon: m.tenMon,
            danhMucId: m.danhMucId,
            giaBan: m.giaBan || m.gia,
            donViTinh: m.donViTinh || 'Phần',
            hinhAnh: m.hinhAnh,
            moTa: m.moTa || 'Món ngon đậm vị Quán Mộc',
            trangThai: (m.trangThai === 0 || m.trangThai === 'TamHet') ? 'TamHet' : 'DangBan',
            laMonBanChay: !!(m.laBanChay === 1 || m.laMonBanChay)
        }));

        return {
            ok: true,
            data: dsLoc,
            msg: 'Lấy danh sách món ăn thành công (chế độ dự phòng)'
        };
    }

    /**
     * 3. Chi tiết món ăn & Tùy chọn (Size / Topping) (US-055, US-057)
     * URL: GET /api/public/e-menu/mon-an/:id
     */
    async layChiTietMonAnEMenu(id) {
        const kq = await this.yeuCau(`/public/e-menu/mon-an/${id}`);
        if (kq && kq.ok) return kq;

        // Fallback LocalStorage
        const dsMon = await this.layDanhSachMonAn();
        const m = dsMon.find(mon => mon.id == id);
        if (!m) return { ok: false, data: null, msg: 'Không tìm thấy món ăn' };

        const tuyChonSize = (m.tuyChonSize && m.tuyChonSize.length > 0) ? m.tuyChonSize.map(s => ({
            ten: s.ten,
            giaThem: s.giaThem !== undefined ? s.giaThem : (s.giaCongThem || 0)
        })) : [
            { ten: 'Phần vừa (tiêu chuẩn)', giaThem: 0 },
            { ten: 'Phần lớn (+30%)', giaThem: Math.round(Number(m.giaBan || m.gia || 0) * 0.3 / 1000) * 1000 }
        ];

        const tuyChonTopping = (m.tuyChonTopping && m.tuyChonTopping.length > 0) ? m.tuyChonTopping.map(t => ({
            ten: t.ten,
            giaThem: Number(t.gia || t.giaThem || 0)
        })) : [
            { ten: 'Thêm rau rừng Tây Ninh', giaThem: 20000 },
            { ten: 'Thêm bánh tráng', giaThem: 10000 }
        ];

        return {
            ok: true,
            data: {
                id: m.id,
                tenMon: m.tenMon,
                danhMucId: m.danhMucId,
                giaBan: m.giaBan || m.gia,
                donViTinh: m.donViTinh || 'Phần',
                hinhAnh: m.hinhAnh,
                moTa: m.moTa || 'Món ngon đậm vị Quán Mộc',
                trangThai: (m.trangThai === 0 || m.trangThai === 'TamHet') ? 'TamHet' : 'DangBan',
                tuyChon: [
                    {
                        tenNhom: 'Kích cỡ',
                        batBuoc: true,
                        loai: 'ChonMot',
                        danhSach: tuyChonSize
                    },
                    {
                        tenNhom: 'Món thêm',
                        batBuoc: false,
                        loai: 'ChonNhieu',
                        danhSach: tuyChonTopping
                    }
                ]
            },
            msg: 'Lấy chi tiết món ăn thành công (chế độ dự phòng)'
        };
    }

    // =========================================================================
    // PHẦN 2: BỘ API KIỂM TRA GIỎ HÀNG & TÍNH TIỀN (THEO ĐẶC TẢ MINH)
    // =========================================================================

    /**
     * 4. Kiểm tra tính hợp lệ & Tính tổng tiền giỏ hàng (Server-side) (US-057 -> US-062)
     * URL: POST /api/gio-hang/kiem-tra-va-tinh-tien
     */
    async kiemTraVaTinhTienGioHang({ banId, token, danhSachMon }) {
        const kq = await this.yeuCau('/gio-hang/kiem-tra-va-tinh-tien', {
            method: 'POST',
            body: { banId, token, danhSachMon }
        });
        if (kq) return kq;

        // Fallback LocalStorage: Kiểm tra và tính toán chuẩn xác
        const dsMon = await this.layDanhSachMonAn();
        const danhSachHopLe = [];
        const danhSachMonHetHang = [];
        let tongSoLuongMon = 0;
        let tongTienTamTinh = 0;

        for (const item of danhSachMon) {
            const mon = dsMon.find(m => m.id == item.monAnId);
            if (!mon || mon.trangThai === 0 || mon.trangThai === 'TamHet') {
                danhSachMonHetHang.push({
                    monAnId: item.monAnId,
                    tenMon: mon ? mon.tenMon : 'Món không tồn tại'
                });
                continue;
            }

            const donGiaGoc = Number(mon.giaBan || mon.gia) || 0;
            let tienTuyChon = 0;

            // Tính tiền tùy chọn size / topping
            if (Array.isArray(item.tuyChonChon)) {
                item.tuyChonChon.forEach(tc => {
                    tienTuyChon += Number(tc.giaThem || tc.giaCongThem || 0);
                });
            }

            const donGiaTong = donGiaGoc + tienTuyChon;
            const sl = Number(item.soLuong) || 1;
            const thanhTien = donGiaTong * sl;

            tongSoLuongMon += sl;
            tongTienTamTinh += thanhTien;

            danhSachHopLe.push({
                monAnId: mon.id,
                tenMon: mon.tenMon,
                donGiaGoc: donGiaGoc,
                tienTuyChon: tienTuyChon,
                donGiaTong: donGiaTong,
                soLuong: sl,
                thanhTien: thanhTien,
                tuyChonChon: item.tuyChonChon || [],
                ghiChu: item.ghiChu || ''
            });
        }

        if (danhSachMonHetHang.length > 0) {
            return {
                ok: false,
                data: { danhSachMonHetHang },
                msg: `Món '${danhSachMonHetHang[0].tenMon}' vừa hết hàng. Vui lòng xóa khỏi giỏ để tiếp tục.`
            };
        }

        return {
            ok: true,
            data: {
                danhSachHopLe,
                tongSoLuongMon,
                tongTienTamTinh
            },
            msg: 'Giỏ hàng hợp lệ'
        };
    }

    // =========================================================================
    // PHẦN 3: BỘ API YÊU CẦU HỖ TRỢ TẠI BÀN (US-071 -> US-073)
    // =========================================================================

    /**
     * 5. Gửi yêu cầu hỗ trợ (Khách gọi phục vụ / gọi tính tiền)
     * URL: POST /api/yeu-cau-ho-tro
     */
    async guiYeuCauHoTro({ banId, token, loaiYeuCau, lyDo, phuongThucThanhToan, ghiChu }) {
        const body = { banId, token, loaiYeuCau, ghiChu };
        if (loaiYeuCau === 'GoiNhanVien') {
            body.lyDo = lyDo || 'Xin hỗ trợ tại bàn';
        } else if (loaiYeuCau === 'YeuCauThanhToan') {
            body.phuongThucThanhToan = phuongThucThanhToan || 'TienMat';
        }

        const kq = await this.yeuCau('/yeu-cau-ho-tro', {
            method: 'POST',
            body: body
        });
        if (kq && kq.ok) return kq;

        // Fallback LocalStorage
        const key = 'quanmoc_yeu_cau_ho_tro';
        const dsCu = JSON.parse(localStorage.getItem(key) || '[]');
        const ycMoi = {
            id: Date.now(),
            banId: banId,
            loaiYeuCau: loaiYeuCau,
            lyDo: body.lyDo || '',
            phuongThucThanhToan: body.phuongThucThanhToan || '',
            ghiChu: ghiChu || '',
            trangThai: 'ChoXuLy',
            thoiGianTao: new Date().toISOString()
        };
        dsCu.push(ycMoi);
        localStorage.setItem(key, JSON.stringify(dsCu));

        return {
            ok: true,
            data: ycMoi,
            msg: 'Yêu cầu của quý khách đã được gửi tới nhân viên! (chế độ dự phòng)'
        };
    }
}

// Khởi tạo đối tượng toàn cục
window.api = new ApiService();
