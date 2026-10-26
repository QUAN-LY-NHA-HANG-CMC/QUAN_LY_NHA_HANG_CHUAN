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

        // 5. Dữ liệu Vai Trò & Phân Quyền mẫu (Sprint 1 - US-015 -> US-021)
        if (!localStorage.getItem(KHOA.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro')) {
            const dsVaiTroMau = [
                {
                    ma: 'QUAN_LY',
                    ten: 'Quản lý / Chủ nhà hàng',
                    moTa: 'Toàn quyền điều hành hệ thống, nhân sự, thực đơn và tài chính',
                    danhSachQuyen: [
                        'BAN_XEM', 'BAN_SUA', 'BAN_IN_QR',
                        'MON_XEM', 'MON_SUA', 'MON_TRANG_THAI',
                        'THU_NGAN_XEM', 'THU_NGAN_THANH_TOAN', 'THU_NGAN_IN_BILL',
                        'BEP_XEM', 'BEP_CAP_NHAT',
                        'NHAN_VIEN_XEM', 'NHAN_VIEN_SUA', 'PHAN_QUYEN_SUA',
                        'CAU_HINH_XEM', 'CAU_HINH_SUA'
                    ]
                },
                {
                    ma: 'THU_NGAN',
                    ten: 'Thu ngân',
                    moTa: 'Theo dõi sơ đồ bàn, in bill tạm tính và xử lý thanh toán hóa đơn',
                    danhSachQuyen: [
                        'BAN_XEM', 'MON_XEM',
                        'THU_NGAN_XEM', 'THU_NGAN_THANH_TOAN', 'THU_NGAN_IN_BILL'
                    ]
                },
                {
                    ma: 'BEP',
                    ten: 'Đầu bếp (KDS)',
                    moTa: 'Xem danh sách gọi món, điều phối món ăn và bật tắt hết món',
                    danhSachQuyen: [
                        'MON_XEM', 'MON_TRANG_THAI',
                        'BEP_XEM', 'BEP_CAP_NHAT'
                    ]
                },
                {
                    ma: 'PHUC_VU',
                    ten: 'Nhân viên phục vụ',
                    moTa: 'Xem bàn ăn, hỗ trợ khách gọi món và gửi yêu cầu',
                    danhSachQuyen: [
                        'BAN_XEM', 'MON_XEM', 'THU_NGAN_XEM'
                    ]
                }
            ];
            localStorage.setItem(KHOA.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro', JSON.stringify(dsVaiTroMau));
        }

        // 6. Dữ liệu Nhân Viên mẫu (Sprint 1 - US-007 -> US-014)
        if (!localStorage.getItem(KHOA.DANH_SACH_NHAN_VIEN || 'quanmoc_ds_nhan_vien')) {
            const dsNhanVienMau = [
                {
                    id: 1,
                    tenDangNhap: 'quanly',
                    hoTen: 'Phong (Quản Lý Dự Án)',
                    email: 'phong.admin@quanmoc.com',
                    soDienThoai: '0908889999',
                    vaiTro: 'QUAN_LY',
                    matKhau: '123456',
                    trangThai: 'DANG_LAM_VIEC',
                    ngayTao: '2026-10-01 08:00:00'
                },
                {
                    id: 2,
                    tenDangNhap: 'thungan',
                    hoTen: 'Trần Thị Thu Ngân',
                    email: 'thungan@quanmoc.com',
                    soDienThoai: '0912345678',
                    vaiTro: 'THU_NGAN',
                    matKhau: '123456',
                    trangThai: 'DANG_LAM_VIEC',
                    ngayTao: '2026-10-05 09:30:00'
                },
                {
                    id: 3,
                    tenDangNhap: 'bep',
                    hoTen: 'Lê Văn Bếp Trưởng',
                    email: 'bep@quanmoc.com',
                    soDienThoai: '0923456789',
                    vaiTro: 'BEP',
                    matKhau: '123456',
                    trangThai: 'DANG_LAM_VIEC',
                    ngayTao: '2026-10-08 14:15:00'
                },
                {
                    id: 4,
                    tenDangNhap: 'phucvu',
                    hoTen: 'Phạm Văn Phục Vụ',
                    email: 'phucvu@quanmoc.com',
                    soDienThoai: '0934567890',
                    vaiTro: 'PHUC_VU',
                    matKhau: '123456',
                    trangThai: 'DANG_LAM_VIEC',
                    ngayTao: '2026-10-10 10:00:00'
                },
                {
                    id: 5,
                    tenDangNhap: 'nhanvien_cu',
                    hoTen: 'Nguyễn Văn Đã Nghỉ',
                    email: 'nghi.viec@quanmoc.com',
                    soDienThoai: '0945678901',
                    vaiTro: 'PHUC_VU',
                    matKhau: '123456',
                    trangThai: 'DA_KHOA',
                    ngayTao: '2026-09-15 08:30:00'
                }
            ];
            localStorage.setItem(KHOA.DANH_SACH_NHAN_VIEN || 'quanmoc_ds_nhan_vien', JSON.stringify(dsNhanVienMau));
        }

        // 7. Lịch sử thay đổi quyền hạn nhân sự (Sprint 1 - US-022)
        if (!localStorage.getItem(KHOA.LICH_SU_PHAN_QUYEN || 'quanmoc_ls_phan_quyen')) {
            const lsPhanQuyenMau = [
                {
                    id: 1,
                    thoiGian: '2026-10-15 14:30:00',
                    nguoiThucHien: 'Phong (Quản Lý)',
                    vaiTro: 'BEP',
                    hanhDong: 'Cập nhật quyền hạn vai trò',
                    chiTiet: 'Bổ sung quyền [MON_TRANG_THAI] cho phép Đầu bếp bật/tắt trạng thái hết món'
                },
                {
                    id: 2,
                    thoiGian: '2026-10-12 09:10:00',
                    nguoiThucHien: 'Phong (Quản Lý)',
                    vaiTro: 'THU_NGAN',
                    hanhDong: 'Khởi tạo vai trò Thu ngân',
                    chiTiet: 'Gán các quyền xem sơ đồ bàn, thanh toán POS và in hóa đơn tạm tính'
                }
            ];
            localStorage.setItem(KHOA.LICH_SU_PHAN_QUYEN || 'quanmoc_ls_phan_quyen', JSON.stringify(lsPhanQuyenMau));
        }

        // 8. Cấu hình thông tin nhà hàng & VietQR (Sprint 1 - US-041 -> US-043)
        if (!localStorage.getItem(KHOA.CAU_HINH_HE_THONG || 'quanmoc_cau_hinh_he_thong')) {
            const cauHinhMau = window.HANG_SO ? window.HANG_SO.NHA_HANG_MAC_DINH : {
                ten: 'Nhà Hàng Quán Mộc',
                chiNhanh: 'Chi nhánh 1 (Quận 1)',
                diaChi: '123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh',
                hotline: '028 1234 5678',
                email: 'lienhe@quanmoc.com',
                wifiTen: 'QuanMoc_KhachHang',
                wifiMatKhau: 'quanmoc2026',
                khauHieu: 'Hương vị truyền thống, đậm đà tình thân',
                gioHoatDong: '09:00 - 22:30',
                thueVat: 8,
                phiPhucVu: 0,
                nganHang: {
                    maNganHang: 'VCB',
                    tenNganHang: 'Vietcombank - Ngoại Thương Việt Nam',
                    soTaiKhoan: '9988776655',
                    chuTaiKhoan: 'NHA HANG QUAN MOC',
                    cuPhapChuyenKhoan: 'QUANMOC {SO_BAN}'
                }
            };
            localStorage.setItem(KHOA.CAU_HINH_HE_THONG || 'quanmoc_cau_hinh_he_thong', JSON.stringify(cauHinhMau));
        }

        // 9. Nhật ký hoạt động hệ thống (Sprint 1 - US-044)
        if (!localStorage.getItem(KHOA.NHAT_KY_HE_THONG || 'quanmoc_nhat_ky_he_thong')) {
            const nhatKyMau = [
                {
                    id: 1,
                    thoiGian: '2026-10-25 08:30:15',
                    loai: 'INFO',
                    hanhDong: 'Đăng nhập hệ thống',
                    nguoiThucHien: 'Phong (Quản Lý)',
                    diaChiIp: '192.168.1.10',
                    chiTiet: 'Đăng nhập thành công từ trình duyệt Chrome / Windows'
                },
                {
                    id: 2,
                    thoiGian: '2026-10-25 09:12:04',
                    loai: 'INFO',
                    hanhDong: 'Cập nhật sơ đồ bàn',
                    nguoiThucHien: 'Quân (Frontend)',
                    diaChiIp: '192.168.1.15',
                    chiTiet: 'Thêm bàn mới T1-06 sức chứa 2 chỗ tại Tầng 1'
                },
                {
                    id: 3,
                    thoiGian: '2026-10-25 10:05:42',
                    loai: 'WARN',
                    hanhDong: 'Khóa tài khoản nhân viên',
                    nguoiThucHien: 'Phong (Quản Lý)',
                    diaChiIp: '192.168.1.10',
                    chiTiet: 'Khóa tài khoản [nhanvien_cu] do đã nghỉ việc'
                },
                {
                    id: 4,
                    thoiGian: '2026-10-25 10:45:19',
                    loai: 'INFO',
                    hanhDong: 'Cập nhật cấu hình nhà hàng',
                    nguoiThucHien: 'Phong (Quản Lý)',
                    diaChiIp: '192.168.1.10',
                    chiTiet: 'Cập nhật mật khẩu Wi-Fi khách và tỷ lệ thuế VAT 8%'
                }
            ];
            localStorage.setItem(KHOA.NHAT_KY_HE_THONG || 'quanmoc_nhat_ky_he_thong', JSON.stringify(nhatKyMau));
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
        this.ghiNhatKy('Cập nhật khu vực bàn', 'INFO', `Cập nhật danh sách khu vực phục vụ (${ds.length} khu vực).`);
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
        this.ghiNhatKy('Cập nhật sơ đồ bàn', 'INFO', `Cập nhật sơ đồ bàn ăn (${ds.length} bàn).`);
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
        this.ghiNhatKy('Cập nhật danh mục thực đơn', 'INFO', `Cập nhật danh mục thực đơn (${ds.length} danh mục).`);
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
        this.ghiNhatKy('Cập nhật món ăn thực đơn', 'INFO', `Cập nhật danh sách món ăn (${ds.length} món).`);
    }

    // =========================================================================
    // XÁC THỰC & HỒ SƠ CÁ NHÂN (Sprint 1 - US-003, US-007 -> US-010)
    // Phụ trách: Phong (Frontend Admin & Auth)
    // =========================================================================

    /**
     * Đăng nhập hệ thống (US-007)
     */
    async dangNhap(tenDangNhap, matKhau) {
        // Thử kết nối Backend API trước
        const phanHoi = await this.yeuCau('/tai-khoan/dang-nhap', {
            method: 'POST',
            body: { tenDangNhap, matKhau }
        });

        if (phanHoi && phanHoi.ok) {
            this.luuAccessToken(phanHoi.data.token);
            localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.THONG_TIN_NGUOI_DUNG || 'quanmoc_nguoi_dung', JSON.stringify(phanHoi.data.nguoiDung));
            this.ghiNhatKy('Đăng nhập hệ thống (API)', 'INFO', `Người dùng [${phanHoi.data.nguoiDung.hoTen}] đăng nhập thành công.`);
            return phanHoi;
        }

        // Fallback LocalStorage Authentication
        const dsNhanVien = await this.layDanhSachNhanVien();
        const timThay = dsNhanVien.find(nv => 
            (nv.tenDangNhap.toLowerCase() === tenDangNhap.trim().toLowerCase() || 
             nv.email.toLowerCase() === tenDangNhap.trim().toLowerCase()) &&
            nv.matKhau === matKhau
        );

        if (!timThay) {
            return { ok: false, msg: 'Tên đăng nhập hoặc mật khẩu không chính xác.' };
        }

        if (timThay.trangThai === 'DA_KHOA') {
            return { ok: false, msg: 'Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động. Vui lòng liên hệ Quản lý.' };
        }

        const tokenGia = 'jwt_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        const duLieuNguoiDung = {
            id: timThay.id,
            tenDangNhap: timThay.tenDangNhap,
            hoTen: timThay.hoTen,
            email: timThay.email,
            soDienThoai: timThay.soDienThoai,
            vaiTro: timThay.vaiTro,
            ngayTao: timThay.ngayTao,
            thoiGianDangNhap: new Date().toISOString()
        };

        this.luuAccessToken(tokenGia);
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.THONG_TIN_NGUOI_DUNG || 'quanmoc_nguoi_dung', JSON.stringify(duLieuNguoiDung));
        this.ghiNhatKy('Đăng nhập hệ thống', 'INFO', `Người dùng [${timThay.hoTen}] đăng nhập thành công với vai trò ${timThay.vaiTro}.`);

        return {
            ok: true,
            data: {
                token: tokenGia,
                nguoiDung: duLieuNguoiDung
            },
            msg: `Chào mừng ${timThay.hoTen} quay trở lại làm việc!`
        };
    }

    /**
     * Đăng xuất hệ thống (US-008)
     */
    async dangXuat() {
        const user = this.layThongTinNguoiDung();
        if (user) {
            this.ghiNhatKy('Đăng xuất hệ thống', 'INFO', `Người dùng [${user.hoTen}] đã đăng xuất.`);
        }
        localStorage.removeItem(window.HANG_SO?.KHOA_LUU_TRU?.ACCESS_TOKEN || 'quanmoc_access_token');
        localStorage.removeItem(window.HANG_SO?.KHOA_LUU_TRU?.THONG_TIN_NGUOI_DUNG || 'quanmoc_nguoi_dung');
        return { ok: true, msg: 'Đã đăng xuất thành công.' };
    }

    /**
     * Lấy thông tin tài khoản đang đăng nhập
     */
    layThongTinNguoiDung() {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.THONG_TIN_NGUOI_DUNG || 'quanmoc_nguoi_dung');
        try {
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    /**
     * Cập nhật thông tin hồ sơ cá nhân (US-010)
     */
    async capNhatHoSo(thongTin) {
        const user = this.layThongTinNguoiDung();
        if (!user) return { ok: false, msg: 'Chưa đăng nhập.' };

        const ds = await this.layDanhSachNhanVien();
        const index = ds.findIndex(nv => nv.id === user.id);
        if (index === -1) return { ok: false, msg: 'Không tìm thấy hồ sơ nhân viên.' };

        ds[index].hoTen = thongTin.hoTen || ds[index].hoTen;
        ds[index].email = thongTin.email || ds[index].email;
        ds[index].soDienThoai = thongTin.soDienThoai || ds[index].soDienThoai;
        await this.luuDanhSachNhanVien(ds);

        // Đồng bộ lại session người dùng hiện tại
        const userMoi = { ...user, hoTen: ds[index].hoTen, email: ds[index].email, soDienThoai: ds[index].soDienThoai };
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.THONG_TIN_NGUOI_DUNG || 'quanmoc_nguoi_dung', JSON.stringify(userMoi));

        this.ghiNhatKy('Cập nhật hồ sơ cá nhân', 'INFO', `Người dùng [${user.hoTen}] cập nhật thông tin cá nhân.`);
        return { ok: true, data: userMoi, msg: 'Cập nhật thông tin hồ sơ thành công!' };
    }

    /**
     * Đổi mật khẩu cá nhân (US-009)
     */
    async doiMatKhau(matKhauCu, matKhauMoi) {
        const user = this.layThongTinNguoiDung();
        if (!user) return { ok: false, msg: 'Chưa đăng nhập.' };

        const ds = await this.layDanhSachNhanVien();
        const index = ds.findIndex(nv => nv.id === user.id);
        if (index === -1) return { ok: false, msg: 'Không tìm thấy tài khoản.' };

        if (ds[index].matKhau !== matKhauCu) {
            return { ok: false, msg: 'Mật khẩu hiện tại không chính xác.' };
        }

        if (!matKhauMoi || matKhauMoi.length < 6) {
            return { ok: false, msg: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
        }

        ds[index].matKhau = matKhauMoi;
        await this.luuDanhSachNhanVien(ds);

        this.ghiNhatKy('Đổi mật khẩu', 'INFO', `Người dùng [${user.hoTen}] đã thay đổi mật khẩu thành công.`);
        return { ok: true, msg: 'Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.' };
    }

    // =========================================================================
    // QUẢN LÝ NHÂN SỰ (Sprint 1 - US-011 -> US-014)
    // Phụ trách: Phong (Frontend Admin)
    // =========================================================================

    async layDanhSachNhanVien() {
        const kq = await this.yeuCau('/nhan-vien');
        if (kq && kq.ok) return kq.data;

        const data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_NHAN_VIEN || 'quanmoc_ds_nhan_vien');
        return data ? JSON.parse(data) : [];
    }

    async luuDanhSachNhanVien(ds) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_NHAN_VIEN || 'quanmoc_ds_nhan_vien', JSON.stringify(ds));
    }

    /**
     * Thêm nhân viên mới (US-011)
     */
    async themNhanVien(nv) {
        const ds = await this.layDanhSachNhanVien();
        
        // Kiểm tra trùng username hoặc email
        if (ds.some(item => item.tenDangNhap.toLowerCase() === nv.tenDangNhap.trim().toLowerCase())) {
            return { ok: false, msg: `Tên đăng nhập "${nv.tenDangNhap}" đã tồn tại trên hệ thống.` };
        }
        if (nv.email && ds.some(item => item.email.toLowerCase() === nv.email.trim().toLowerCase())) {
            return { ok: false, msg: `Email "${nv.email}" đã được đăng ký cho tài khoản khác.` };
        }

        const idMoi = ds.length > 0 ? Math.max(...ds.map(d => d.id || 0)) + 1 : 1;
        const nhanVienMoi = {
            id: idMoi,
            tenDangNhap: nv.tenDangNhap.trim().toLowerCase(),
            hoTen: nv.hoTen.trim(),
            email: nv.email ? nv.email.trim() : '',
            soDienThoai: nv.soDienThoai ? nv.soDienThoai.trim() : '',
            vaiTro: nv.vaiTro || 'PHUC_VU',
            matKhau: nv.matKhau || '123456',
            trangThai: 'DANG_LAM_VIEC',
            ngayTao: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        ds.push(nhanVienMoi);
        await this.luuDanhSachNhanVien(ds);

        this.ghiNhatKy('Tạo tài khoản nhân viên', 'INFO', `Tạo mới nhân viên [${nhanVienMoi.hoTen}] (${nhanVienMoi.tenDangNhap}) vai trò ${nhanVienMoi.vaiTro}.`);
        return { ok: true, data: nhanVienMoi, msg: `Tạo tài khoản cho nhân viên "${nhanVienMoi.hoTen}" thành công!` };
    }

    /**
     * Cập nhật thông tin nhân viên (US-013)
     */
    async capNhatNhanVien(id, thongTin) {
        const ds = await this.layDanhSachNhanVien();
        const index = ds.findIndex(item => item.id === Number(id));
        if (index === -1) return { ok: false, msg: 'Không tìm thấy nhân viên cần cập nhật.' };

        // Kiểm tra trùng email nếu sửa email
        if (thongTin.email && ds.some(item => item.id !== Number(id) && item.email.toLowerCase() === thongTin.email.trim().toLowerCase())) {
            return { ok: false, msg: `Email "${thongTin.email}" đã được sử dụng bởi nhân viên khác.` };
        }

        ds[index] = {
            ...ds[index],
            hoTen: thongTin.hoTen !== undefined ? thongTin.hoTen.trim() : ds[index].hoTen,
            email: thongTin.email !== undefined ? thongTin.email.trim() : ds[index].email,
            soDienThoai: thongTin.soDienThoai !== undefined ? thongTin.soDienThoai.trim() : ds[index].soDienThoai,
            vaiTro: thongTin.vaiTro !== undefined ? thongTin.vaiTro : ds[index].vaiTro
        };

        await this.luuDanhSachNhanVien(ds);
        this.ghiNhatKy('Cập nhật nhân viên', 'INFO', `Cập nhật thông tin nhân viên [${ds[index].hoTen}].`);
        return { ok: true, data: ds[index], msg: 'Cập nhật thông tin nhân viên thành công!' };
    }

    /**
     * Đổi trạng thái Khóa / Mở khóa tài khoản (US-014)
     */
    async doiTrangThaiNhanVien(id, trangThaiMoi) {
        const ds = await this.layDanhSachNhanVien();
        const index = ds.findIndex(item => item.id === Number(id));
        if (index === -1) return { ok: false, msg: 'Không tìm thấy nhân viên.' };

        // Không cho phép tự khóa tài khoản quản trị chính đang thao tác
        const userHienTai = this.layThongTinNguoiDung();
        if (userHienTai && userHienTai.id === Number(id) && trangThaiMoi === 'DA_KHOA') {
            return { ok: false, msg: 'Bạn không thể tự khóa tài khoản đang đăng nhập của chính mình!' };
        }

        ds[index].trangThai = trangThaiMoi;
        await this.luuDanhSachNhanVien(ds);

        const tenTrangThai = trangThaiMoi === 'DA_KHOA' ? 'Khóa' : 'Kích hoạt mở lại';
        this.ghiNhatKy(`${tenTrangThai} tài khoản`, trangThaiMoi === 'DA_KHOA' ? 'WARN' : 'INFO', `${tenTrangThai} tài khoản nhân viên [${ds[index].hoTen}].`);
        return { ok: true, data: ds[index], msg: `${tenTrangThai} tài khoản "${ds[index].hoTen}" thành công!` };
    }

    /**
     * Đặt lại mật khẩu cho nhân viên (US-013)
     */
    async datLaiMatKhau(id, matKhauMoi) {
        const ds = await this.layDanhSachNhanVien();
        const index = ds.findIndex(item => item.id === Number(id));
        if (index === -1) return { ok: false, msg: 'Không tìm thấy nhân viên.' };

        ds[index].matKhau = matKhauMoi;
        await this.luuDanhSachNhanVien(ds);

        this.ghiNhatKy('Đặt lại mật khẩu', 'WARN', `Đặt lại mật khẩu cho nhân viên [${ds[index].hoTen}].`);
        return { ok: true, msg: `Đặt lại mật khẩu cho "${ds[index].hoTen}" thành công! Mật khẩu mới: ${matKhauMoi}` };
    }

    // =========================================================================
    // VAI TRÒ & PHÂN QUYỀN RBAC (Sprint 1 - US-015 -> US-018, US-022)
    // Phụ trách: Phong (Frontend Admin)
    // =========================================================================

    async layDanhSachVaiTro() {
        const kq = await this.yeuCau('/vai-tro');
        if (kq && kq.ok) return kq.data;

        const data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro');
        return data ? JSON.parse(data) : [];
    }

    async luuDanhSachVaiTro(ds) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro', JSON.stringify(ds));
    }

    /**
     * Cập nhật danh sách quyền cho vai trò (US-018 & US-022)
     */
    async capNhatQuyenVaiTro(maVaiTro, dsQuyenMoi, nguoiThucHien = 'Phong (Quản Lý)') {
        const ds = await this.layDanhSachVaiTro();
        const index = ds.findIndex(item => item.ma === maVaiTro);
        if (index === -1) return { ok: false, msg: 'Không tìm thấy vai trò cần phân quyền.' };

        const soQuyenCu = ds[index].danhSachQuyen ? ds[index].danhSachQuyen.length : 0;
        ds[index].danhSachQuyen = dsQuyenMoi;
        await this.luuDanhSachVaiTro(ds);

        // Ghi nhận nhật ký lịch sử phân quyền (US-022)
        await this.ghiLichSuPhanQuyen({
            nguoiThucHien,
            vaiTro: maVaiTro,
            hanhDong: 'Cập nhật ma trận quyền',
            chiTiet: `Thay đổi cấu hình quyền cho vai trò [${ds[index].ten}]: ${soQuyenCu} quyền -> ${dsQuyenMoi.length} quyền.`
        });

        this.ghiNhatKy('Cập nhật quyền hạn vai trò', 'WARN', `Cập nhật quyền hạn cho vai trò [${ds[index].ten}].`);
        return { ok: true, data: ds[index], msg: `Lưu cấu hình quyền cho vai trò "${ds[index].ten}" thành công!` };
    }

    /**
     * Thêm vai trò mới (US-016)
     */
    async themVaiTro(vt) {
        const ds = await this.layDanhSachVaiTro();
        if (ds.some(item => item.ma.toUpperCase() === vt.ma.trim().toUpperCase())) {
            return { ok: false, msg: `Mã vai trò "${vt.ma}" đã tồn tại.` };
        }

        const vaiTroMoi = {
            ma: vt.ma.trim().toUpperCase(),
            ten: vt.ten.trim(),
            moTa: vt.moTa ? vt.moTa.trim() : '',
            danhSachQuyen: vt.danhSachQuyen || []
        };

        ds.push(vaiTroMoi);
        await this.luuDanhSachVaiTro(ds);

        await this.ghiLichSuPhanQuyen({
            nguoiThucHien: 'Phong (Quản Lý)',
            vaiTro: vaiTroMoi.ma,
            hanhDong: 'Tạo vai trò mới',
            chiTiet: `Khởi tạo vai trò [${vaiTroMoi.ten}] với ${vaiTroMoi.danhSachQuyen.length} quyền ban đầu.`
        });

        this.ghiNhatKy('Tạo vai trò mới', 'INFO', `Tạo mới vai trò [${vaiTroMoi.ten}].`);
        return { ok: true, data: vaiTroMoi, msg: `Tạo vai trò "${vaiTroMoi.ten}" thành công!` };
    }

    /**
     * Tra cứu lịch sử phân quyền (US-022)
     */
    async layLichSuPhanQuyen() {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_PHAN_QUYEN || 'quanmoc_ls_phan_quyen');
        return raw ? JSON.parse(raw) : [];
    }

    async ghiLichSuPhanQuyen(item) {
        const ls = await this.layLichSuPhanQuyen();
        const idMoi = ls.length > 0 ? Math.max(...ls.map(l => l.id || 0)) + 1 : 1;
        const banGhi = {
            id: idMoi,
            thoiGian: new Date().toISOString().replace('T', ' ').substring(0, 19),
            nguoiThucHien: item.nguoiThucHien || 'Hệ thống',
            vaiTro: item.vaiTro || 'CHUNG',
            hanhDong: item.hanhDong || 'Thay đổi quyền',
            chiTiet: item.chiTiet || ''
        };
        ls.unshift(banGhi); // Thêm lên đầu danh sách
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_PHAN_QUYEN || 'quanmoc_ls_phan_quyen', JSON.stringify(ls));
        return banGhi;
    }

    // =========================================================================
    // CẤU HÌNH NỀN TẢNG & SYSTEM LOGS (Sprint 1 - US-041 -> US-044)
    // Phụ trách: Phong (Frontend Admin)
    // =========================================================================

    async layCauHinhHeThong() {
        const kq = await this.yeuCau('/cau-hinh');
        if (kq && kq.ok) return kq.data;

        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.CAU_HINH_HE_THONG || 'quanmoc_cau_hinh_he_thong');
        return raw ? JSON.parse(raw) : (window.HANG_SO ? window.HANG_SO.NHA_HANG_MAC_DINH : {});
    }

    async luuCauHinhHeThong(cauHinhMoi) {
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.CAU_HINH_HE_THONG || 'quanmoc_cau_hinh_he_thong', JSON.stringify(cauHinhMoi));
        localStorage.setItem('quanmoc_cau_hinh_quan', JSON.stringify(cauHinhMoi));
        if (window.HANG_SO && window.HANG_SO.NHA_HANG_MAC_DINH) {
            Object.assign(window.HANG_SO.NHA_HANG_MAC_DINH, cauHinhMoi);
        }
        this.ghiNhatKy('Cập nhật cấu hình nhà hàng', 'INFO', 'Lưu thay đổi thông tin nhà hàng, thuế VAT hoặc tài khoản VietQR.');
        if (window.ungDung && typeof window.ungDung.dongBoThongTinNhaHangToanCuc === 'function') {
            window.ungDung.dongBoThongTinNhaHangToanCuc(cauHinhMoi);
        }
        return { ok: true, data: cauHinhMoi, msg: 'Lưu thông tin cấu hình nhà hàng thành công!' };
    }

    async layNhatKyHeThong(boLoc = {}) {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.NHAT_KY_HE_THONG || 'quanmoc_nhat_ky_he_thong');
        let logs = raw ? JSON.parse(raw) : [];

        if (boLoc.loai && boLoc.loai !== 'ALL') {
            logs = logs.filter(l => l.loai === boLoc.loai);
        }
        if (boLoc.tuKhoa) {
            const tk = boLoc.tuKhoa.toLowerCase();
            logs = logs.filter(l => 
                (l.hanhDong && l.hanhDong.toLowerCase().includes(tk)) ||
                (l.chiTiet && l.chiTiet.toLowerCase().includes(tk)) ||
                (l.nguoiThucHien && l.nguoiThucHien.toLowerCase().includes(tk))
            );
        }

        return logs;
    }

    ghiNhatKy(hanhDong, loai = 'INFO', chiTiet = '') {
        try {
            const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.NHAT_KY_HE_THONG || 'quanmoc_nhat_ky_he_thong');
            const logs = raw ? JSON.parse(raw) : [];
            const user = this.layThongTinNguoiDung();
            const idMoi = logs.length > 0 ? Math.max(...logs.map(l => l.id || 0)) + 1 : 1;

            logs.unshift({
                id: idMoi,
                thoiGian: new Date().toISOString().replace('T', ' ').substring(0, 19),
                loai: loai.toUpperCase(),
                hanhDong,
                nguoiThucHien: user ? `${user.hoTen} (${user.vaiTro})` : 'Hệ thống',
                diaChiIp: '127.0.0.1 (Local Client)',
                chiTiet
            });

            // Giữ tối đa 200 bản ghi log
            if (logs.length > 200) logs.pop();

            localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.NHAT_KY_HE_THONG || 'quanmoc_nhat_ky_he_thong', JSON.stringify(logs));
        } catch (e) {
            console.error('Không thể ghi nhật ký hệ thống:', e);
        }
    }
}

// Khởi tạo đối tượng toàn cục
window.api = new ApiService();
