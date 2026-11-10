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
        if (typeof window !== 'undefined' && (!window.location || window.location.protocol === 'file:')) {
            this.serverDangChay = false;
            this.daKiemTraServer = true;
            return false;
        }

        if (this.daKiemTraServer) {
            return this.serverDangChay;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000); // 1000ms
            const phanHoi = await fetch(`${this.baseUrl}/kiem-tra-suc-khoe`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            this.serverDangChay = (phanHoi.status === 200);

            // Khi kết nối với máy chủ thành công, dọn sạch dữ liệu mẫu cũ trong LocalStorage của trình duyệt
            if (this.serverDangChay && !this.daDonDepKhoCu) {
                this.daDonDepKhoCu = true;
                if (!localStorage.getItem('quanmoc_dong_bo_jollibee_v1')) {
                    localStorage.setItem('quanmoc_dong_bo_jollibee_v1', '1');
                    const danhSachKhoaDonDep = [
                        'quanmoc_ds_ban', 'quanmoc_ds_mon_an', 'quanmoc_ds_thuc_don',
                        'quanmoc_ds_khu_vuc', 'quanmoc_ds_danh_muc', 'quanmoc_ds_don_goi',
                        'quanmoc_pos_phien_ban', 'quanmoc_pos_lich_su_hoa_don',
                        'quanmoc_pos_nhat_ky_huy_tra', 'quanmoc_gio_hang',
                        'quanmoc_danh_gia_dich_vu', 'quanmoc_ca_lam_viec_hien_tai',
                        'quanmoc_yeu_cau_ho_tro', 'quanmoc_e_menu_ban_hien_tai'
                    ];
                    danhSachKhoaDonDep.forEach(k => localStorage.removeItem(k));
                }
            }
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
        // Nếu đang kết nối với máy chủ API thực tế -> Không tự động sinh dữ liệu mẫu giả
        if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
            return;
        }

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

        // 10. Dữ liệu Đơn Gọi Món (Khởi tạo mảng rỗng để không sinh đơn ảo)
        if (!localStorage.getItem(KHOA.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi')) {
            localStorage.setItem(KHOA.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi', JSON.stringify([]));
        } else {
            // Tự động dọn dẹp các đơn gọi món giả lập cũ ORD-20261027-
            try {
                const rawDon = localStorage.getItem(KHOA.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
                if (rawDon) {
                    const ds = JSON.parse(rawDon);
                    if (Array.isArray(ds)) {
                        const loc = ds.filter(d => !d.maDon || !d.maDon.startsWith('ORD-20261027-'));
                        if (loc.length !== ds.length) {
                            localStorage.setItem(KHOA.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi', JSON.stringify(loc));
                        }
                    }
                }
            } catch (e) {}
        }

        // 11. Dữ liệu Yêu Cầu Hỗ TrỢ Tại Bàn mẫu (Sprint 2 - US-071 -> US-074)
        if (!localStorage.getItem(KHOA.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro')) {
            const dsHoTroMau = [
                {
                    id: 1,
                    banId: 3,
                    soBan: 'Bàn 03',
                    loaiYeuCau: 'THEM_DA_LANH',
                    tenYeuCau: 'Xin thêm đá lạnh / nước lọc',
                    chiTiet: 'Cho thêm 1 ca đá và 2 ly rỗng',
                    thoiGian: '2026-10-27 19:30:15',
                    trangThai: 'DA_XU_LY',
                    nguoiTiepNhan: 'Phạm Văn Phục Vụ'
                },
                {
                    id: 2,
                    banId: 1,
                    soBan: 'Bàn 01',
                    loaiYeuCau: 'THEM_BAT_DUA',
                    tenYeuCau: '🥢 Xin thêm bát, đĩa, đũa, thìa',
                    chiTiet: 'Khách xin thêm 2 bộ chén đũa cho em bé',
                    thoiGian: '2026-10-27 19:40:00',
                    trangThai: 'CHO_TIEP_NHAN',
                    nguoiTiepNhan: null
                }
            ];
            localStorage.setItem(KHOA.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro', JSON.stringify(dsHoTroMau));
        }

        // 12. Dữ liệu Ca Làm Việc mẫu (Sprint 4 - US-117 -> US-122)
        if (!localStorage.getItem(KHOA.DANH_SACH_CA_LAM_VIEC || 'quanmoc_ds_ca_lam_viec')) {
            const dsCaMau = [
                { id: 1, maCa: 'CA_SANG', tenCa: 'Ca Sáng (08:00 - 15:00)', gioBatDau: '08:00', gioKetThuc: '15:00', moTa: 'Phục vụ điểm tâm và bữa trưa công sở' },
                { id: 2, maCa: 'CA_TOI', tenCa: 'Ca Chiều / Tối (15:00 - 23:00)', gioBatDau: '15:00', gioKetThuc: '23:00', moTa: 'Cao điểm ăn tối gia đình, tiệc tùng' },
                { id: 3, maCa: 'CA_DEM', tenCa: 'Ca Đêm (23:00 - 06:00)', gioBatDau: '23:00', gioKetThuc: '06:00', moTa: 'Phục vụ xuyên đêm & bảo quản dọn dẹp' }
            ];
            localStorage.setItem(KHOA.DANH_SACH_CA_LAM_VIEC || 'quanmoc_ds_ca_lam_viec', JSON.stringify(dsCaMau));
        }

        // 13. Ca làm việc đang mở hiện tại (Active Shift)
        if (!localStorage.getItem(KHOA.CA_HIEN_TAI || 'quanmoc_ca_hien_tai')) {
            const caHienTaiMau = {
                id: 101,
                maCa: 'SHIFT-20261102-02',
                caId: 2,
                tenCa: 'Ca Chiều / Tối (15:00 - 23:00)',
                thuNganId: 2,
                thuNganTen: 'Trần Thị Thu Ngân',
                thoiGianMo: '2026-11-02 15:00:00',
                tienDauCa: 1500000, // 1.500.000đ tiền lẻ thối
                ghiChuMo: 'Tiền mặt đầu ca gồm các mệnh giá 20k, 50k, 100k đủ cơ số',
                trangThai: 'DANG_MO'
            };
            localStorage.setItem(KHOA.CA_HIEN_TAI || 'quanmoc_ca_hien_tai', JSON.stringify(caHienTaiMau));
        }

        // 14. Phiếu Thu / Chi tiền mặt phát sinh trong ca (Sprint 4 - US-119)
        if (!localStorage.getItem(KHOA.PHIEU_THU_CHI || 'quanmoc_phieu_thu_chi')) {
            const dsThuChiMau = [
                {
                    id: 1,
                    maPhieu: 'PT-20261102-001',
                    loai: 'THU',
                    soTien: 500000,
                    lyDo: 'Nạp thêm tiền lẻ thối ca tối (mệnh giá 10k, 20k)',
                    nguoiThucHien: 'Trần Thị Thu Ngân',
                    thoiGian: '2026-11-02 16:30:00',
                    caId: 101
                },
                {
                    id: 2,
                    maPhieu: 'PC-20261102-001',
                    loai: 'CHI',
                    soTien: 85000,
                    lyDo: 'Mua bổ sung 2 bao đá lạnh khẩn cấp khi hết đá',
                    nguoiThucHien: 'Trần Thị Thu Ngân',
                    thoiGian: '2026-11-02 18:15:00',
                    caId: 101
                }
            ];
            localStorage.setItem(KHOA.PHIEU_THU_CHI || 'quanmoc_phieu_thu_chi', JSON.stringify(dsThuChiMau));
        }

        // 15. Lịch sử Biên bản kết ca thu ngân (Sprint 4 - US-121, US-122)
        if (!localStorage.getItem(KHOA.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca')) {
            const lsKetCaMau = [
                {
                    id: 1,
                    maBienBan: 'Z-20261101-01',
                    tenCa: 'Ca Sáng (08:00 - 15:00)',
                    ngay: '2026-11-01',
                    thuNganMo: 'Trần Thị Thu Ngân',
                    thuNganDong: 'Trần Thị Thu Ngân',
                    thoiGianMo: '2026-11-01 08:00:00',
                    thoiGianDong: '2026-11-01 15:05:00',
                    tienDauCa: 1500000,
                    tongDoanhThu: 4850000,
                    doanhThuTienMat: 2150000,
                    doanhThuChuyenKhoan: 2700000,
                    tongThuPhatSinh: 200000,
                    tongChiPhatSinh: 50000,
                    tienMatLyThuyet: 3800000, // 1500k + 2150k + 200k - 50k
                    tienMatThucTe: 3800000,
                    chenhLech: 0,
                    trangThaiChenhLech: 'KHOP_CHUAN',
                    soHoaDon: 8,
                    ghiChu: 'Bàn giao ca sáng khớp 100%, két tiền ngăn nắp'
                },
                {
                    id: 2,
                    maBienBan: 'Z-20261101-02',
                    tenCa: 'Ca Chiều / Tối (15:00 - 23:00)',
                    ngay: '2026-11-01',
                    thuNganMo: 'Trần Thị Thu Ngân',
                    thuNganDong: 'Trần Thị Thu Ngân',
                    thoiGianMo: '2026-11-01 15:00:00',
                    thoiGianDong: '2026-11-01 23:10:00',
                    tienDauCa: 1500000,
                    tongDoanhThu: 12450000,
                    doanhThuTienMat: 5200000,
                    doanhThuChuyenKhoan: 7250000,
                    tongThuPhatSinh: 0,
                    tongChiPhatSinh: 120000,
                    tienMatLyThuyet: 6580000, // 1500k + 5200k - 120k
                    tienMatThucTe: 6600000,
                    chenhLech: 20000, // Dư 20k
                    trangThaiChenhLech: 'THUA_QUY',
                    soHoaDon: 19,
                    ghiChu: 'Thừa 20.000đ do khách không lấy tiền thối lẻ'
                }
            ];
            localStorage.setItem(KHOA.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca', JSON.stringify(lsKetCaMau));
        }

        // 16. Danh sách Hóa Đơn đã thanh toán mẫu (Sprint 4 - US-123 -> US-134)
        if (!localStorage.getItem(KHOA.DANH_SACH_HOA_DON || 'quanmoc_ds_hoa_don')) {
            const dsHoaDonMau = [
                {
                    id: 1,
                    maHoaDon: 'HD-20261102-001',
                    soBan: 'Bàn 01',
                    banId: 1,
                    khuVucTen: 'Tầng 1 (Máy lạnh)',
                    thuNganTen: 'Trần Thị Thu Ngân',
                    thoiGianVao: '2026-11-02 11:30:00',
                    thoiGianThanhToan: '2026-11-02 12:45:00',
                    phuongThuc: 'CHUYEN_KHOAN', // CHUYEN_KHOAN | TIEN_MAT
                    tienMonAn: 520000,
                    tienGiamGia: 0,
                    tienVat: 41600, // 8% VAT
                    tongThanhToan: 561600,
                    tienKhachDua: 561600,
                    tienThua: 0,
                    soKhach: 4,
                    gioThanhToanInt: 12, // Khung giờ 12h
                    danhSachMon: [
                        { monId: 1, tenMon: 'Gà Nướng Ống Tre Tây Bắc', soLuong: 1, donGia: 280000, thanhTien: 280000, danhMucTen: 'Món Nướng Đặc Sắc' },
                        { monId: 7, tenMon: 'Rau Rừng Gia Lai Xào Tỏi', soLuong: 2, donGia: 75000, thanhTien: 150000, danhMucTen: 'Rau & Khai Vị' },
                        { monId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soLuong: 2, donGia: 45000, thanhTien: 90000, danhMucTen: 'Đồ Uống & Tráng Miệng' }
                    ]
                },
                {
                    id: 2,
                    maHoaDon: 'HD-20261102-002',
                    soBan: 'Bàn 05',
                    banId: 5,
                    khuVucTen: 'Tầng 1 (Máy lạnh)',
                    thuNganTen: 'Trần Thị Thu Ngân',
                    thoiGianVao: '2026-11-02 12:05:00',
                    thoiGianThanhToan: '2026-11-02 13:15:00',
                    phuongThuc: 'TIEN_MAT',
                    tienMonAn: 690000,
                    tienGiamGia: 50000, // Voucher 50k
                    tienVat: 51200,
                    tongThanhToan: 691200,
                    tienKhachDua: 700000,
                    tienThua: 8800,
                    soKhach: 3,
                    gioThanhToanInt: 13,
                    danhSachMon: [
                        { monId: 3, tenMon: 'Lẩu Riêu Cua Đồng Bắp Bò', soLuong: 1, donGia: 380000, thanhTien: 380000, danhMucTen: 'Lẩu Dân Dã' },
                        { monId: 2, tenMon: 'Bò Tơ Cuộn Bánh Tráng Phơi Sương', soLuong: 1, donGia: 220000, thanhTien: 220000, danhMucTen: 'Món Nướng Đặc Sắc' },
                        { monId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soLuong: 2, donGia: 45000, thanhTien: 90000, danhMucTen: 'Đồ Uống & Tráng Miệng' }
                    ]
                },
                {
                    id: 3,
                    maHoaDon: 'HD-20261102-003',
                    soBan: 'Bàn 08',
                    banId: 8,
                    khuVucTen: 'Tầng 2 (Ngoài trời)',
                    thuNganTen: 'Trần Thị Thu Ngân',
                    thoiGianVao: '2026-11-02 17:30:00',
                    thoiGianThanhToan: '2026-11-02 19:10:00',
                    phuongThuc: 'CHUYEN_KHOAN',
                    tienMonAn: 975000,
                    tienGiamGia: 0,
                    tienVat: 78000,
                    tongThanhToan: 1053000,
                    tienKhachDua: 1053000,
                    tienThua: 0,
                    soKhach: 5,
                    gioThanhToanInt: 19,
                    danhSachMon: [
                        { monId: 1, tenMon: 'Gà Nướng Ống Tre Tây Bắc', soLuong: 2, donGia: 280000, thanhTien: 560000, danhMucTen: 'Món Nướng Đặc Sắc' },
                        { monId: 4, tenMon: 'Cơm Cháy Kho Quẹt Tôm Thịt Niêu Đất', soLuong: 2, donGia: 95000, thanhTien: 190000, danhMucTen: 'Cơm & Món Chay' },
                        { monId: 6, tenMon: 'Gỏi Ngó Sen Tôm Thịt Hoa Chuối', soLuong: 1, donGia: 110000, thanhTien: 110000, danhMucTen: 'Rau & Khai Vị' },
                        { monId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soLuong: 2, donGia: 55000, thanhTien: 110000, danhMucTen: 'Đồ Uống & Tráng Miệng' }
                    ]
                },
                {
                    id: 4,
                    maHoaDon: 'HD-20261102-004',
                    soBan: 'Bàn 03',
                    banId: 3,
                    khuVucTen: 'Tầng 1 (Máy lạnh)',
                    thuNganTen: 'Trần Thị Thu Ngân',
                    thoiGianVao: '2026-11-02 18:45:00',
                    thoiGianThanhToan: '2026-11-02 20:20:00',
                    phuongThuc: 'TIEN_MAT',
                    tienMonAn: 485000,
                    tienGiamGia: 0,
                    tienVat: 38800,
                    tongThanhToan: 523800,
                    tienKhachDua: 550000,
                    tienThua: 26200,
                    soKhach: 2,
                    gioThanhToanInt: 20,
                    danhSachMon: [
                        { monId: 2, tenMon: 'Bò Tơ Cuộn Bánh Tráng Phơi Sương', soLuong: 1, donGia: 220000, thanhTien: 220000, danhMucTen: 'Món Nướng Đặc Sắc' },
                        { monId: 6, tenMon: 'Gỏi Ngó Sen Tôm Thịt Hoa Chuối', soLuong: 1, donGia: 110000, thanhTien: 110000, danhMucTen: 'Rau & Khai Vị' },
                        { monId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soLuong: 2, donGia: 45000, thanhTien: 90000, danhMucTen: 'Đồ Uống & Tráng Miệng' },
                        { monId: 7, tenMon: 'Rau Rừng Gia Lai Xào Tỏi', soLuong: 1, donGia: 75000, thanhTien: 75000, danhMucTen: 'Rau & Khai Vị' }
                    ]
                },
                {
                    id: 5,
                    maHoaDon: 'HD-20261102-005',
                    soBan: 'Phòng VIP 1',
                    banId: 11,
                    khuVucTen: 'Phòng VIP',
                    thuNganTen: 'Trần Thị Thu Ngân',
                    thoiGianVao: '2026-11-02 19:00:00',
                    thoiGianThanhToan: '2026-11-02 21:05:00',
                    phuongThuc: 'CHUYEN_KHOAN',
                    tienMonAn: 1850000,
                    tienGiamGia: 100000,
                    tienVat: 140000,
                    tongThanhToan: 1890000,
                    tienKhachDua: 1890000,
                    tienThua: 0,
                    soKhach: 8,
                    gioThanhToanInt: 21,
                    danhSachMon: [
                        { monId: 1, tenMon: 'Gà Nướng Ống Tre Tây Bắc', soLuong: 3, donGia: 280000, thanhTien: 840000, danhMucTen: 'Món Nướng Đặc Sắc' },
                        { monId: 3, tenMon: 'Lẩu Riêu Cua Đồng Bắp Bò', soLuong: 2, donGia: 380000, thanhTien: 760000, danhMucTen: 'Lẩu Dân Dã' },
                        { monId: 4, tenMon: 'Cơm Cháy Kho Quẹt Tôm Thịt Niêu Đất', soLuong: 2, donGia: 95000, thanhTien: 190000, danhMucTen: 'Cơm & Món Chay' },
                        { monId: 8, tenMon: 'Trà Sen Vàng Củ Năng Hạt Sen', soLuong: 6, donGia: 45000, thanhTien: 270000, danhMucTen: 'Đồ Uống & Tráng Miệng' }
                    ]
                }
            ];
            localStorage.setItem(KHOA.DANH_SACH_HOA_DON || 'quanmoc_ds_hoa_don', JSON.stringify(dsHoaDonMau));
        }
    }

    // =========================================================================
    // API KHU VỰC & BÀN ĂN (US-023 -> US-030)
    // =========================================================================
    async layDanhSachKhuVuc() {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_KHU_VUC || 'quanmoc_ds_khu_vuc';
        const coServer = await this.kiemTraKetNoiServer();
        if (coServer) {
            const kq = await this.yeuCau('/khu-vuc');
            if (kq && kq.ok && Array.isArray(kq.data)) {
                const parsed = kq.data.map(kv => ({
                    ...kv,
                    ten: kv.ten || kv.tenKhuVuc || `Khu vực ${kv.id}`,
                    tenKhuVuc: kv.tenKhuVuc || kv.ten || `Khu vực ${kv.id}`
                }));
                localStorage.setItem(key, JSON.stringify(parsed));
                return parsed;
            }
        }

        let data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async luuDanhSachKhuVuc(ds) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_KHU_VUC || 'quanmoc_ds_khu_vuc';
        localStorage.setItem(key, JSON.stringify(ds));
        await this.yeuCau('/khu-vuc/dong-bo', { method: 'POST', body: { danhSach: ds } }).catch(() => {});
        this.ghiNhatKy('Cập nhật khu vực bàn', 'INFO', `Cập nhật danh sách khu vực phục vụ (${ds.length} khu vực).`);
    }

    async layDanhSachBan() {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_BAN || 'quanmoc_ds_ban';
        const coServer = await this.kiemTraKetNoiServer();
        if (coServer) {
            const kq = await this.yeuCau('/ban-an');
            if (kq && kq.ok && Array.isArray(kq.data)) {
                const trangThaiMap = {
                    'Trong': 'TRONG',
                    'TRONG': 'TRONG',
                    'DangDung': 'DANG_DUNG',
                    'DangPhucVu': 'DANG_DUNG',
                    'DANG_DUNG': 'DANG_DUNG',
                    'TamKhoa': 'TAM_KHOA',
                    'TAM_KHOA': 'TAM_KHOA',
                    'ChoThanhToan': 'CHO_THANH_TOAN',
                    'CHO_THANH_TOAN': 'CHO_THANH_TOAN'
                };
                const parsed = kq.data.map(b => ({
                    ...b,
                    soBan: b.soBan || b.tenBan || `Bàn ${b.id}`,
                    tenBan: b.tenBan || b.soBan || `Bàn ${b.id}`,
                    qrToken: b.qrToken || b.tokenBaoMat || `tok_b${b.id}`,
                    trangThai: trangThaiMap[b.trangThai] || b.trangThai || 'TRONG',
                    sucChua: b.sucChua || 4
                }));
                localStorage.setItem(key, JSON.stringify(parsed));
                return parsed;
            }
        }

        let data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async layDanhSachBanAn() {
        return this.layDanhSachBan();
    }

    async luuDanhSachBan(ds) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_BAN || 'quanmoc_ds_ban';
        localStorage.setItem(key, JSON.stringify(ds));
        await this.yeuCau('/ban-an/dong-bo', { method: 'POST', body: { danhSach: ds } }).catch(() => {});
        this.ghiNhatKy('Cập nhật sơ đồ bàn', 'INFO', `Cập nhật sơ đồ bàn ăn (${ds.length} bàn).`);
    }

    async capNhatTrangThaiBan(banId, trangThaiMoi) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_BAN || 'quanmoc_ds_ban';
        const dsBan = await this.layDanhSachBanAn();
        const ban = dsBan.find(b => Number(b.id) === Number(banId) || (b.maBan && b.maBan === String(banId)));
        if (ban) {
            ban.trangThai = trangThaiMoi;
            localStorage.setItem(key, JSON.stringify(dsBan));
        }

        try {
            await this.yeuCau(`/ban-an/${ban ? ban.id : banId}/trang-thai`, {
                method: 'PATCH',
                body: { trangThai: trangThaiMoi }
            });
        } catch {
            // Không chặn nếu server chưa hỗ trợ patch
        }

        return { ok: true };
    }

    // =========================================================================
    // API DANH MỤC & THỰC ĐƠN (US-031 -> US-040)
    // =========================================================================
    async layDanhSachDanhMuc() {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DANH_MUC || 'quanmoc_ds_danh_muc';
        const coServer = await this.kiemTraKetNoiServer();
        if (coServer) {
            const kq = await this.yeuCau('/danh-muc');
            if (kq && kq.ok && Array.isArray(kq.data)) {
                const parsed = kq.data.map(dm => ({
                    ...dm,
                    ten: dm.ten || dm.tenDanhMuc || `Danh mục ${dm.id}`,
                    tenDanhMuc: dm.tenDanhMuc || dm.ten || `Danh mục ${dm.id}`,
                    bieuTuong: dm.bieuTuong || '🍽️'
                }));
                localStorage.setItem(key, JSON.stringify(parsed));
                return parsed;
            }
        }

        let data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async luuDanhSachDanhMuc(ds) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DANH_MUC || 'quanmoc_ds_danh_muc';
        localStorage.setItem(key, JSON.stringify(ds));
        await this.yeuCau('/danh-muc-mon/dong-bo', { method: 'POST', body: { danhSach: ds } }).catch(() => {});
        this.ghiNhatKy('Cập nhật danh mục thực đơn', 'INFO', `Cập nhật danh mục thực đơn (${ds.length} danh mục).`);
    }

    async layDanhSachMonAn() {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_MON_AN || 'quanmoc_ds_mon_an';
        const coServer = await this.kiemTraKetNoiServer();
        if (coServer) {
            const kq = await this.yeuCau('/thuc-don');
            if (kq && kq.ok) {
                const rawList = Array.isArray(kq.data) ? kq.data : (kq.data?.danhSach || null);
                if (Array.isArray(rawList)) {
                    const parsed = rawList.map(m => ({
                        ...m,
                        maMon: m.maMon || `MON-${m.id}`,
                        trangThai: (m.trangThai === 'HoatDong' || m.trangThai === 'DangBan' || m.trangThai === 1) ? 1 : ((m.trangThai === 'TamHet' || m.trangThai === 0) ? 0 : ((m.trangThai === 'DaXoa' || m.trangThai === -1) ? -1 : 1)),
                        laBanChay: m.laBanChay !== undefined ? m.laBanChay : (m.noiBat || m.laMonBanChay ? 1 : 0),
                        tuyChonSize: m.tuyChonSize || [],
                        tuyChonTopping: m.tuyChonTopping || []
                    }));
                    localStorage.setItem(key, JSON.stringify(parsed));
                    return parsed;
                }
            }
        }

        let data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async luuDanhSachMonAn(ds) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_MON_AN || 'quanmoc_ds_mon_an';
        localStorage.setItem(key, JSON.stringify(ds));
        await this.yeuCau('/thuc-don/dong-bo', { method: 'POST', body: { danhSach: ds } }).catch(() => {});
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
        const cleanUser = tenDangNhap.trim().toLowerCase();
        const aliasMap = {
            'thungan': 'thungan01',
            'thungan01': 'thungan',
            'bep': 'bep01',
            'bep01': 'bep',
            'phucvu': 'phucvu01',
            'phucvu01': 'phucvu',
            'admin': 'quanly'
        };
        const targetAlias = aliasMap[cleanUser] || cleanUser;

        const timThay = dsNhanVien.find(nv => {
            const nvUser = (nv.tenDangNhap || '').toLowerCase();
            const nvEmail = (nv.email || '').toLowerCase();
            const khopUser = (nvUser === cleanUser || nvUser === targetAlias || nvEmail === cleanUser);
            return khopUser && nv.matKhau === matKhau;
        });

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
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_NHAN_VIEN || 'quanmoc_ds_nhan_vien';
        const coServer = await this.kiemTraKetNoiServer();
        if (coServer) {
            const kq = await this.yeuCau('/nhan-vien');
            if (kq && kq.ok) {
                const rawList = Array.isArray(kq.data) ? kq.data : (kq.data?.danhSach || []);
                if (rawList.length > 0) {
                    const vaiTroMap = {
                        'QuanLy': 'QUAN_LY',
                        'ThuNgan': 'THU_NGAN',
                        'Bep': 'BEP',
                        'PhucVu': 'PHUC_VU',
                        'QUAN_LY': 'QUAN_LY',
                        'THU_NGAN': 'THU_NGAN',
                        'BEP': 'BEP',
                        'PHUC_VU': 'PHUC_VU'
                    };
                    const trangThaiMap = {
                        'HoatDong': 'DANG_LAM_VIEC',
                        'DANG_LAM_VIEC': 'DANG_LAM_VIEC',
                        'Khoa': 'DA_KHOA',
                        'DA_KHOA': 'DA_KHOA'
                    };
                    const parsed = rawList.map(nv => ({
                        ...nv,
                        vaiTro: vaiTroMap[nv.vaiTro] || nv.vaiTro || 'PHUC_VU',
                        trangThai: trangThaiMap[nv.trangThai] || nv.trangThai || 'DANG_LAM_VIEC',
                        matKhau: nv.matKhau || '123456'
                    }));
                    localStorage.setItem(key, JSON.stringify(parsed));
                    return parsed;
                }
            }
        }

        let data = localStorage.getItem(key);
        if (!data) {
            this.khoiTaoDuLieuMauBanDau();
            data = localStorage.getItem(key);
        }
        try {
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async luuDanhSachNhanVien(ds) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_NHAN_VIEN || 'quanmoc_ds_nhan_vien';
        localStorage.setItem(key, JSON.stringify(ds));
        await this.yeuCau('/nhan-vien/dong-bo', { method: 'POST', body: { danhSach: ds } }).catch(() => {});
        this.ghiNhatKy('Cập nhật nhân sự', 'INFO', `Cập nhật danh sách nhân viên (${ds.length} người).`);
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
        if (kq && kq.ok && Array.isArray(kq.data) && kq.data.length > 0) return kq.data;

        let data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro');
        if (!data) {
            this.khoiTaoDuLieuMauBanDau();
            data = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_VAI_TRO || 'quanmoc_ds_vai_tro');
        }
        try {
            const arr = data ? JSON.parse(data) : [];
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
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
        const key = window.HANG_SO?.KHOA_LUU_TRU?.CAU_HINH_HE_THONG || 'quanmoc_cau_hinh_he_thong';
        const coServer = await this.kiemTraKetNoiServer();
        if (coServer) {
            const kq = await this.yeuCau('/cau-hinh');
            if (kq && kq.ok && kq.data) {
                localStorage.setItem(key, JSON.stringify(kq.data));
                return kq.data;
            }
        }

        const raw = localStorage.getItem(key);
        try {
            if (raw) return JSON.parse(raw);
        } catch {}

        return (window.HANG_SO ? window.HANG_SO.NHA_HANG_MAC_DINH : {});
    }

    async luuCauHinhHeThong(cauHinhMoi) {
        const key = window.HANG_SO?.KHOA_LUU_TRU?.CAU_HINH_HE_THONG || 'quanmoc_cau_hinh_he_thong';
        localStorage.setItem(key, JSON.stringify(cauHinhMoi));
        localStorage.setItem('quanmoc_cau_hinh_quan', JSON.stringify(cauHinhMoi));
        if (window.HANG_SO && window.HANG_SO.NHA_HANG_MAC_DINH) {
            Object.assign(window.HANG_SO.NHA_HANG_MAC_DINH, cauHinhMoi);
        }
        // Gửi cập nhật trực tiếp lên Backend API
        this.yeuCau('/cau-hinh', { method: 'POST', body: cauHinhMoi }).catch(() => {});
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

    // =========================================================================
    // SPRINT 2: ĐẶT MÓN, THEO DÕI ĐƠN HÀNG & HỖ TRỢ TẠI BÀN (US-063 -> US-078)
    // Phụ trách: Phong (Frontend Lead)
    // =========================================================================

    /**
     * US-063 & US-064: Gửi đơn đặt món (Order) từ giỏ hàng bàn khách xuống hệ thống
     * @param {Object} donGoi { banId, soBan, danhSachMon: [{ monId, tenMon, donGia, soLuong, size, topping, ghiChu, thanhTien }], ghiChuDon }
     */
    async taoDonGoiMon(donGoi) {
        if (!donGoi || !donGoi.banId || !Array.isArray(donGoi.danhSachMon) || donGoi.danhSachMon.length === 0) {
            return { ok: false, msg: 'Giỏ hàng trống hoặc chưa xác định bàn ăn!' };
        }

        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        const dsDon = raw ? JSON.parse(raw) : [];

        // Lấy danh sách đơn của bàn này để tính lượt gọi món (US-067: Lượt 1, Lượt 2, ...)
        const donCuaBan = dsDon.filter(d => Number(d.banId) === Number(donGoi.banId) || String(d.banId) === String(donGoi.banId));
        const luotGoi = donCuaBan.length + 1;

        const idMoi = dsDon.length > 0 ? Math.max(...dsDon.map(d => d.id || 0)) + 1 : 1;
        let maDon = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(idMoi).padStart(3, '0')}`;
        const thoiGianTao = new Date().toISOString().replace('T', ' ').substring(0, 19);

        // Chuẩn hóa từng món trong đơn với ID chi tiết và trạng thái mặc định "Chờ xác nhận"
        let baseItemId = Date.now();
        let tongTienDon = 0;
        const danhSachMonChuan = donGoi.danhSachMon.map(m => {
            const donGia = Number(m.donGia || 0);
            const soLuong = Number(m.soLuong || 1);
            const thanhTien = Number(m.thanhTien || (donGia * soLuong));
            tongTienDon += thanhTien;

            let size = m.size || 'Tiêu chuẩn';
            let topping = m.topping || '';
            if (Array.isArray(m.tuyChonChon)) {
                const sizeOpt = m.tuyChonChon.find(tc => tc.tenNhom?.toLowerCase().includes('size') || tc.tenNhom?.toLowerCase().includes('kích cỡ'));
                if (sizeOpt) size = sizeOpt.ten;
                const toppingOpts = m.tuyChonChon.filter(tc => !tc.tenNhom?.toLowerCase().includes('size') && !tc.tenNhom?.toLowerCase().includes('kích cỡ'));
                if (toppingOpts.length > 0) topping = toppingOpts.map(t => t.ten).join(', ');
            }

            return {
                id: ++baseItemId,
                monId: Number(m.monId || m.monAnId || m.id || 0),
                tenMon: m.tenMon,
                size,
                topping,
                donGia,
                soLuong,
                thanhTien,
                ghiChu: m.ghiChu || '',
                trangThai: m.trangThai || 'CHO_XAC_NHAN',
                thoiGianCapNhat: thoiGianTao
            };
        });

        // Tìm thông tin bàn để lưu tên khu vực
        const dsBan = await this.layDanhSachBanAn();
        const thongTinBan = dsBan.find(b => Number(b.id) === Number(donGoi.banId) || (b.maBan && b.maBan === donGoi.maBan));
        const soBan = donGoi.soBan || (thongTinBan ? (thongTinBan.soBan || thongTinBan.tenBan) : `Bàn ${donGoi.banId}`);
        const khuVucTen = thongTinBan ? (thongTinBan.khuVucTen || thongTinBan.tenKhuVuc || 'Tầng 1') : 'Nhà hàng';

        // Gọi Backend API POST /api/don-goi-mon để đồng bộ thời gian thực cho Bếp & POS
        let donTuServer = null;
        try {
            const bodyServer = {
                banId: thongTinBan ? thongTinBan.id : (Number(donGoi.banId) || donGoi.banId),
                maBan: donGoi.maBan || (thongTinBan ? thongTinBan.maBan : undefined),
                tenBan: soBan,
                ghiChuDon: donGoi.ghiChuDon || donGoi.ghiChuChung || '',
                danhSachMon: danhSachMonChuan
            };
            const resServer = await this.yeuCau('/don-goi-mon', {
                method: 'POST',
                body: bodyServer
            });
            if (resServer && resServer.ok && resServer.data) {
                donTuServer = resServer.data;
                if (donTuServer.maDon) maDon = donTuServer.maDon;
            }
        } catch (errServer) {
            console.warn('Lỗi đồng bộ đơn đặt món lên Backend Server:', errServer);
        }

        const donMoi = donTuServer || {
            id: idMoi,
            maDon,
            banId: Number(donGoi.banId) || (thongTinBan ? thongTinBan.id : donGoi.banId),
            soBan,
            khuVucTen,
            luotGoi,
            thoiGianTao,
            ghiChuDon: donGoi.ghiChuDon || donGoi.ghiChuChung || '',
            tongTien: tongTienDon,
            danhSachMon: danhSachMonChuan
        };

        dsDon.push(donMoi);
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi', JSON.stringify(dsDon));

        // Cập nhật trạng thái bàn sang DANG_DUNG nếu bàn đang TRONG
        if (thongTinBan && (thongTinBan.trangThai === 'TRONG' || thongTinBan.trangThai === 'Trong')) {
            await this.capNhatTrangThaiBan(donGoi.banId, 'DANG_DUNG');
        }

        // US-075 & US-078: Phát sự kiện Socket.io + Chuông báo thời gian thực
        if (window.socketClient) {
            window.socketClient.phatSuKien('order:moi', donMoi);
            window.socketClient.phatAmThanh('donMoi');
        }

        this.ghiNhatKy(`Đặt món thành công (${soBan} - Lượt ${luotGoi})`, 'INFO', `Tạo đơn ${maDon} gồm ${danhSachMonChuan.length} món. Tổng: ${tongTienDon.toLocaleString('vi-VN')}đ`);

        return {
            ok: true,
            data: donMoi,
            msg: `Đặt món thành công! Đơn hàng của ${soBan} (Lượt ${luotGoi}) đã được chuyển đến Bếp.`
        };
    }

    async guiDonDatMon(donGoi) {
        return this.taoDonGoiMon(donGoi);
    }

    /**
     * US-065 & US-070: Lấy danh sách toàn bộ các món đã gọi trong phiên và tính tổng tiền lũy kế
     * ĐỒNG BỘ TOÀN DIỆN: Hợp nhất đơn gọi từ Server API, Đơn gọi món QR (quanmoc_ds_don_goi) và Phiên bàn POS (quanmoc_pos_phien_ban)
     * @param {number|string} banId ID của bàn ăn
     */
    async layDanhSachDonTheoBan(banId) {
        let danhSachDon = [];
        let banInfo = null;

        // 1. Thử lấy từ Backend API
        try {
            const kqServer = await this.yeuCau(`/don-goi-mon/ban/${encodeURIComponent(banId)}`);
            if (kqServer && kqServer.ok && kqServer.data) {
                if (Array.isArray(kqServer.data.danhSachDon)) {
                    danhSachDon = [...kqServer.data.danhSachDon];
                }
                if (kqServer.data.ban) {
                    banInfo = kqServer.data.ban;
                }
            }
        } catch (e) {
            console.warn('Lỗi gọi /api/don-goi-mon/ban:', e);
        }

        // 2. Đồng bộ thêm từ localStorage: Đơn gọi món QR ('quanmoc_ds_don_goi')
        const rawDonGoi = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        if (rawDonGoi) {
            try {
                const dsDonLocal = JSON.parse(rawDonGoi);
                const donCuaBan = (dsDonLocal || []).filter(d => Number(d.banId) === Number(banId) || String(d.banId) === String(banId));
                donCuaBan.forEach(dLocal => {
                    const tonTai = danhSachDon.find(d => (dLocal.id && d.id === dLocal.id) || (dLocal.maDon && d.maDon === dLocal.maDon));
                    if (!tonTai) {
                        danhSachDon.push(dLocal);
                    }
                });
            } catch (e) {
                console.warn('Lỗi đọc quanmoc_ds_don_goi:', e);
            }
        }

        // 3. ĐỒNG BỘ QUAN TRỌNG: Lấy từ phiên bàn POS ('quanmoc_pos_phien_ban')
        const rawPosPhien = localStorage.getItem('quanmoc_pos_phien_ban');
        if (rawPosPhien) {
            try {
                const phienMap = JSON.parse(rawPosPhien);
                const phien = phienMap[String(banId)] || phienMap[Number(banId)];
                if (phien && Array.isArray(phien.danhSachMon) && phien.danhSachMon.length > 0) {
                    if (danhSachDon.length === 0) {
                        // Nếu chưa có đơn gọi nào (ví dụ tạo trực tiếp từ POS) -> tạo thành Lượt gọi #1
                        danhSachDon.push({
                            id: `DON-POS-${banId}`,
                            maDon: `DON-POS-${banId}`,
                            banId: Number(banId),
                            luotGoi: 1,
                            thoiGianTao: phien.thoiGianBatDau || new Date().toISOString(),
                            thoiGianTaoVN: phien.thoiGianBatDau || new Date().toISOString(),
                            trangThai: 'DANG_XU_LY',
                            tongTien: phien.danhSachMon.reduce((sum, m) => m.trangThai === 'DA_HUY' ? sum : sum + (Number(m.donGia || 0) * (m.soLuong || 1)), 0),
                            danhSachMon: phien.danhSachMon.map(m => {
                                let tt = m.trangThai || 'CHO_XAC_NHAN';
                                if (tt === 'DA_CHE_BIEN') tt = 'DA_XONG';
                                else if (tt === 'DA_PHUC_VU') tt = 'DA_LEN_MON';
                                return {
                                    id: m.id,
                                    monAnId: m.monAnId,
                                    tenMon: m.tenMon,
                                    soLuong: m.soLuong || 1,
                                    donGia: m.donGia || 0,
                                    thanhTien: (m.donGia || 0) * (m.soLuong || 1),
                                    trangThai: tt,
                                    tuyChon: m.tuyChon || '',
                                    ghiChu: m.ghiChu || ''
                                };
                            })
                        });
                    } else {
                        // Nếu đã có đơn, đồng bộ trạng thái món hoặc thêm các món mới từ POS vào đơn
                        const donDau = danhSachDon[0];
                        if (donDau && Array.isArray(donDau.danhSachMon)) {
                            phien.danhSachMon.forEach(m => {
                                const monHienTai = donDau.danhSachMon.find(em => 
                                    (em.id && String(em.id) === String(m.id)) ||
                                    (em.tenMon && em.tenMon === m.tenMon)
                                );
                                let tt = m.trangThai || 'CHO_XAC_NHAN';
                                if (tt === 'DA_CHE_BIEN') tt = 'DA_XONG';
                                else if (tt === 'DA_PHUC_VU') tt = 'DA_LEN_MON';

                                if (monHienTai) {
                                    monHienTai.trangThai = tt;
                                } else {
                                    donDau.danhSachMon.push({
                                        id: m.id,
                                        monAnId: m.monAnId,
                                        tenMon: m.tenMon,
                                        soLuong: m.soLuong || 1,
                                        donGia: m.donGia || 0,
                                        thanhTien: (m.donGia || 0) * (m.soLuong || 1),
                                        trangThai: tt,
                                        tuyChon: m.tuyChon || '',
                                        ghiChu: m.ghiChu || ''
                                    });
                                }
                            });
                        }
                    }
                }
            } catch (e) {
                console.warn('Lỗi đồng bộ quanmoc_pos_phien_ban sang layDanhSachDonTheoBan:', e);
            }
        }

        // 4. Tính toán tổng hợp thongKe và tongTienLuyKe
        let tongTienLuyKe = 0;
        let tongSoMon = 0;
        let choXacNhan = 0;
        let dangCheBien = 0;
        let daXong = 0;
        let daLenMon = 0;
        let daHuy = 0;
        let tuChoi = 0;

        danhSachDon.forEach(don => {
            if (don.tongTien === undefined && don.tongTienDon !== undefined) don.tongTien = don.tongTienDon;
            else if (don.tongTienDon === undefined && don.tongTien !== undefined) don.tongTienDon = don.tongTien;

            (don.danhSachMon || []).forEach(m => {
                const sl = Number(m.soLuong) || 1;
                const tt = m.trangThai || 'CHO_XAC_NHAN';

                if (tt !== 'DA_HUY' && tt !== 'TU_CHOI') {
                    tongSoMon += sl;
                    tongTienLuyKe += Number(m.thanhTien || (m.donGia * sl) || 0);
                }

                if (tt === 'CHO_XAC_NHAN' || tt === 'CHO_CHE_BIEN') choXacNhan += sl;
                else if (tt === 'DANG_CHE_BIEN') dangCheBien += sl;
                else if (tt === 'DA_XONG' || tt === 'DA_NAU_XONG' || tt === 'DA_CHE_BIEN') daXong += sl;
                else if (tt === 'DA_LEN_MON' || tt === 'DA_PHUC_VU') daLenMon += sl;
                else if (tt === 'DA_HUY') daHuy += sl;
                else if (tt === 'TU_CHOI') tuChoi += sl;
            });
        });

        // 5. Lấy thông tin bàn ăn
        if (!banInfo) {
            const dsBan = await this.layDanhSachBanAn();
            banInfo = (dsBan || []).find(b => Number(b.id) === Number(banId) || b.maBan === String(banId));
        }

        return {
            ok: true,
            data: {
                banId: Number(banId) || banId,
                soBan: banInfo ? (banInfo.soBan || banInfo.tenBan) : `Bàn ${banId}`,
                khuVucTen: banInfo ? (banInfo.khuVucTen || banInfo.tenKhuVuc || 'Tầng 1') : 'Tầng 1',
                danhSachDon,
                tongTienLuyKe,
                thongKe: {
                    tongSoMon,
                    choXacNhan,
                    dangCheBien,
                    daXong,
                    daLenMon,
                    daHuy,
                    tuChoi
                }
            }
        };
    }

    /**
     * Lấy toàn bộ đơn đặt món trong hệ thống
     * ĐỒNG BỘ: Tự động tổng hợp từ cả đơn gọi món QR và phiên bàn POS của Quân ('quanmoc_pos_phien_ban')
     */
    async layTatCaDonGoiMon() {
        let ds = [];
        let coServer = false;
        try {
            const resServer = await this.yeuCau('/don-goi-mon');
            if (resServer && resServer.ok && Array.isArray(resServer.data)) {
                ds = resServer.data;
                coServer = true;
            }
        } catch (e) {
            console.warn('Lỗi lấy đơn từ server, dùng fallback localStorage:', e);
        }

        // Đồng bộ thêm các đơn gọi món từ localStorage ('quanmoc_ds_don_goi')
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        let dsLocal = [];
        try {
            dsLocal = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(dsLocal)) dsLocal = [];
        } catch {
            dsLocal = [];
        }

        // Hợp nhất đơn từ localStorage vào ds nếu chưa có
        dsLocal.forEach(localItem => {
            const existing = ds.find(d => 
                (localItem.id && d.id === localItem.id) || 
                (localItem.maDon && d.maDon === localItem.maDon)
            );
            if (!existing) {
                ds.push(localItem);
            }
        });

        // ĐỒNG BỘ: Gộp toàn diện các món từ phiên bàn POS ('quanmoc_pos_phien_ban') vào cùng 1 bill của bàn
        const rawPosPhien = localStorage.getItem('quanmoc_pos_phien_ban');
        if (rawPosPhien) {
            try {
                const phienMap = JSON.parse(rawPosPhien);
                Object.values(phienMap).forEach(phien => {
                    if (phien && Array.isArray(phien.danhSachMon) && phien.danhSachMon.length > 0) {
                        const bId = Number(phien.banId);
                        const thoiGianBanDau = phien.thoiGianBatDau || new Date().toISOString().replace('T', ' ').substring(0, 19);

                        // Phân tích: có món cũ đã hoàn tất phục vụ và có món mới đang chờ -> Gọi thêm món
                        const coMonDaPhucVu = phien.danhSachMon.some(m => m.trangThai === 'DA_PHUC_VU' || m.trangThai === 'DA_LEN_MON');
                        const coMonDangCho = phien.danhSachMon.some(m => m.trangThai === 'CHO_XAC_NHAN' || m.trangThai === 'CHO_CHE_BIEN' || m.trangThai === 'DANG_CHE_BIEN');
                        const laGoiThem = coMonDaPhucVu && coMonDangCho;

                        // Tìm thời gian của món gọi thêm mới nhất
                        let thoiGianGoiMoi = phien.thoiGianGoiMoiNhat || null;
                        if (!thoiGianGoiMoi) {
                            for (const m of phien.danhSachMon) {
                                if (m.trangThai === 'CHO_XAC_NHAN' || m.trangThai === 'CHO_CHE_BIEN' || m.trangThai === 'DANG_CHE_BIEN') {
                                    if (m.thoiGianTao) {
                                        thoiGianGoiMoi = m.thoiGianTao;
                                        break;
                                    } else if (m.id && Number(m.id) > 1700000000000) {
                                        thoiGianGoiMoi = new Date(Number(m.id)).toISOString();
                                        break;
                                    }
                                }
                            }
                        }

                        // CHỈ gộp vào đơn ĐANG HOẠT ĐỘNG của bàn này trên server (KHÔNG gộp vào đơn đã hoàn tất / đã thanh toán / đã hủy)
                        const donCungBan = ds.find(d => Number(d.banId) === bId && d.trangThai !== 'HOAN_THANH' && d.trangThai !== 'DA_THANH_TOAN' && d.trangThai !== 'DA_HUY');

                        if (donCungBan) {
                            // Bàn đã có đơn đang hoạt động -> Gộp toàn bộ món ăn vào chung 1 đơn duy nhất của bàn
                            if (!Array.isArray(donCungBan.danhSachMon)) donCungBan.danhSachMon = [];
                            phien.danhSachMon.forEach((m, idx) => {
                                const monHienTai = donCungBan.danhSachMon.find(existing => 
                                    (m.id && Number(existing.id) === Number(m.id)) ||
                                    (m.id && String(existing.id) === String(m.id))
                                );

                                let ttChuan = m.trangThai || 'CHO_XAC_NHAN';
                                if (ttChuan === 'CHO_CHE_BIEN') ttChuan = 'CHO_XAC_NHAN';
                                else if (ttChuan === 'DA_CHE_BIEN') ttChuan = 'DA_XONG';
                                else if (ttChuan === 'DA_PHUC_VU') ttChuan = 'DA_LEN_MON';

                                if (monHienTai) {
                                    monHienTai.trangThai = ttChuan;
                                    if (m.thoiGianCapNhat) monHienTai.thoiGianCapNhat = m.thoiGianCapNhat;
                                } else {
                                    let itemThoiGian = m.thoiGianTao || m.thoiGianCapNhat;
                                    if (!itemThoiGian) {
                                        if (m.id && Number(m.id) > 1700000000000) itemThoiGian = new Date(Number(m.id)).toISOString();
                                        else if (laGoiThem && (ttChuan === 'CHO_XAC_NHAN' || ttChuan === 'DANG_CHE_BIEN')) itemThoiGian = thoiGianGoiMoi || new Date().toISOString();
                                        else itemThoiGian = thoiGianBanDau;
                                    }

                                    donCungBan.danhSachMon.push({
                                        id: m.id || (bId * 100 + donCungBan.danhSachMon.length + 1),
                                        monAnId: m.monAnId,
                                        tenMon: m.tenMon,
                                        soLuong: m.soLuong || 1,
                                        donGia: m.donGia || 0,
                                        thanhTien: (m.soLuong || 1) * (m.donGia || 0),
                                        tuyChon: m.tuyChon || '',
                                        ghiChu: m.ghiChu || '',
                                        trangThai: ttChuan,
                                        thoiGianTao: itemThoiGian,
                                        thoiGianCapNhat: itemThoiGian,
                                        lanGoiMoi: laGoiThem
                                    });
                                    if (laGoiThem) {
                                        donCungBan.thoiGianGoiMoiNhat = itemThoiGian;
                                        donCungBan.soLuotGoi = Math.max(donCungBan.soLuotGoi || 1, 2);
                                        donCungBan.luotGoi = donCungBan.soLuotGoi;
                                    }
                                }
                            });
                        } else {
                            // Chưa có đơn nào của bàn này -> Tạo thẻ đơn mới chuẩn hóa
                            const thoiGianHieuLuc = (laGoiThem && thoiGianGoiMoi) ? thoiGianGoiMoi : thoiGianBanDau;
                            const maDonPhien = `DON-POS-BAN-${bId}`;
                            ds.push({
                                id: `pos_phien_${bId}`,
                                maDon: maDonPhien,
                                banId: bId,
                                soBan: `Bàn ${String(bId).padStart(2, '0')}`,
                                thoiGianDat: thoiGianHieuLuc,
                                thoiGianTao: thoiGianHieuLuc,
                                thoiGianBatDau: thoiGianBanDau,
                                thoiGianGoiMoiNhat: thoiGianGoiMoi,
                                luotGoi: laGoiThem ? (phien.soLuotGoi || 2) : 1,
                                soLuotGoi: laGoiThem ? (phien.soLuotGoi || 2) : 1,
                                laGoiThem: laGoiThem,
                                khuVucTen: 'Tầng 1',
                                phienPos: true,
                                danhSachMon: phien.danhSachMon.map((m, idx) => {
                                    let ttChuan = m.trangThai || 'CHO_XAC_NHAN';
                                    if (ttChuan === 'CHO_CHE_BIEN') ttChuan = 'CHO_XAC_NHAN';
                                    else if (ttChuan === 'DA_CHE_BIEN') ttChuan = 'DA_XONG';
                                    else if (ttChuan === 'DA_PHUC_VU') ttChuan = 'DA_LEN_MON';

                                    let itemThoiGian = m.thoiGianTao || m.thoiGianCapNhat;
                                    if (!itemThoiGian) {
                                        if (m.id && Number(m.id) > 1700000000000) {
                                            itemThoiGian = new Date(Number(m.id)).toISOString();
                                        } else if (laGoiThem && (ttChuan === 'CHO_XAC_NHAN' || ttChuan === 'DANG_CHE_BIEN')) {
                                            itemThoiGian = thoiGianGoiMoi || new Date().toISOString();
                                        } else {
                                            itemThoiGian = thoiGianBanDau;
                                        }
                                    }

                                    return {
                                        id: m.id || (bId * 100 + idx + 1),
                                        monAnId: m.monAnId,
                                        tenMon: m.tenMon,
                                        soLuong: m.soLuong || 1,
                                        donGia: m.donGia || 0,
                                        thanhTien: (m.soLuong || 1) * (m.donGia || 0),
                                        tuyChon: m.tuyChon || '',
                                        ghiChu: m.ghiChu || '',
                                        trangThai: ttChuan,
                                        thoiGianTao: itemThoiGian,
                                        thoiGianCapNhat: itemThoiGian,
                                        lanGoiMoi: laGoiThem && (ttChuan === 'CHO_XAC_NHAN' || ttChuan === 'DANG_CHE_BIEN')
                                    };
                                })
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn('Lỗi đồng bộ phiên bàn POS sang KDS:', e);
            }
        }

        return ds;
    }

    /**
     * US-068: Khách hàng yêu cầu hủy món khi món vẫn đang ở trạng thái "Chờ xác nhận"
     */
    async huyMonChuaCheBien(idMonChiTiet, banId, lyDo = 'Khách đổi ý') {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        if (!raw) return { ok: false, msg: 'Không tìm thấy dữ liệu đơn hàng!' };

        const dsDon = JSON.parse(raw);
        let daTimThay = false;
        let tenMonDaHuy = '';

        for (const don of dsDon) {
            if (Number(don.banId) === Number(banId)) {
                const mon = don.danhSachMon.find(m => Number(m.id) === Number(idMonChiTiet));
                if (mon) {
                    if (mon.trangThai !== 'CHO_XAC_NHAN') {
                        return { ok: false, msg: `Món [${mon.tenMon}] đã được Bếp chế biến hoặc phục vụ, không thể hủy!` };
                    }
                    mon.trangThai = 'DA_HUY';
                    mon.lyDoHuy = lyDo;
                    mon.thoiGianCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);
                    tenMonDaHuy = mon.tenMon;
                    daTimThay = true;
                    break;
                }
            }
        }

        if (!daTimThay) {
            return { ok: false, msg: 'Không tìm thấy món cần hủy!' };
        }

        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi', JSON.stringify(dsDon));

        // US-076: Phát sự kiện cập nhật
        if (window.socketClient) {
            window.socketClient.phatSuKien('order:capNhatTrangThai', { idMonChiTiet, banId, trangThai: 'DA_HUY', lyDo });
        }

        this.ghiNhatKy(`Khách hủy món (${tenMonDaHuy})`, 'WARN', `Bàn ${banId} hủy món: ${tenMonDaHuy}. Lý do: ${lyDo}`);

        return { ok: true, msg: `Đã hủy thành công món [${tenMonDaHuy}]. Tổng tiền đã được khấu trừ.` };
    }

    /**
     * US-069: Bếp từ chối món do vừa hết nguyên liệu
     */
    async tuChoiMonTuBep(idMonChiTiet, banId, lyDo = 'Bếp vừa hết nguyên liệu trong ngày') {
        let daTimThay = false;
        let tenMonTuChoi = '';

        // 1. Gọi API Backend đồng bộ trạng thái từ chối lên máy chủ
        try {
            await this.yeuCau('/don-goi-mon/mon-an/' + encodeURIComponent(idMonChiTiet) + '/trang-thai', {
                method: 'PATCH',
                body: { trangThai: 'TU_CHOI' }
            });
        } catch (err) {
            console.warn('Lỗi đồng bộ từ chối món lên server:', err);
        }

        // 2. Cập nhật localStorage
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        let dsDon = raw ? JSON.parse(raw) : [];

        for (const don of dsDon) {
            const mon = (don.danhSachMon || []).find(m => Number(m.id) === Number(idMonChiTiet));
            if (mon) {
                mon.trangThai = 'TU_CHOI';
                mon.lyDoTuChoi = lyDo;
                mon.thoiGianCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);
                tenMonTuChoi = mon.tenMon;
                daTimThay = true;
                break;
            }
        }

        if (daTimThay) {
            localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi', JSON.stringify(dsDon));
        }

        // US-069 & US-078: Bắn thông báo về khách + Phát âm thanh cảnh báo
        if (window.socketClient) {
            window.socketClient.phatSuKien('order:tuChoiMon', { idMonChiTiet, banId, tenMon: tenMonTuChoi, lyDo });
            window.socketClient.phatSuKien('order:capNhatTrangThai', { idMonChiTiet, banId, trangThai: 'TU_CHOI', lyDo });
            window.socketClient.phatAmThanh('tuChoi');
        }

        this.ghiNhatKy(`Bếp từ chối món (${tenMonTuChoi})`, 'WARN', `Bàn ${banId} - Món: ${tenMonTuChoi}. Lý do từ chối: ${lyDo}`);

        return { ok: true, msg: `Đã ghi nhận từ chối món [${tenMonTuChoi}] và phát cảnh báo đến khách hàng.` };
    }

    /**
     * US-066 & US-076: Cập nhật trạng thái chế biến món ăn thời gian thực
     * ĐỒNG BỘ: Cập nhật đồng thời vào Backend Server, danh sách đơn QR và phiên bàn POS của Quân ('quanmoc_pos_phien_ban')
     */
    async capNhatTrangThaiMonAn(idMonChiTiet, banId, trangThaiMoi) {
        let daTimThay = false;
        let thongTinMon = null;

        // Chuẩn hóa tên trạng thái tương thích Backend & Frontend
        let trangThaiGuiServer = trangThaiMoi;
        if (trangThaiGuiServer === 'DA_XONG') trangThaiGuiServer = 'DA_NAU_XONG';
        if (trangThaiGuiServer === 'CHO_CHE_BIEN') trangThaiGuiServer = 'CHO_XAC_NHAN';
        if (trangThaiGuiServer === 'DA_CHE_BIEN') trangThaiGuiServer = 'DANG_CHE_BIEN';
        if (trangThaiGuiServer === 'DA_PHUC_VU') trangThaiGuiServer = 'DA_LEN_MON';

        // 1. Gửi request cập nhật trạng thái lên Backend Server qua API PATCH
        try {
            const resServer = await this.yeuCau('/don-goi-mon/mon-an/' + encodeURIComponent(idMonChiTiet) + '/trang-thai', {
                method: 'PATCH',
                body: { trangThai: trangThaiGuiServer }
            });
            if (resServer && resServer.ok && resServer.data) {
                daTimThay = true;
                thongTinMon = resServer.data.mon;
            }
        } catch (err) {
            console.warn('Lỗi gọi API cập nhật trạng thái món lên Backend server:', err);
        }

        // 2. Cập nhật và đồng bộ vào danh sách đơn gọi trong localStorage
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        let dsDon = raw ? JSON.parse(raw) : [];

        // Tìm kiếm chính xác món theo id và ưu tiên bàn nếu có
        for (const don of dsDon) {
            if (banId && don.banId && Number(don.banId) !== Number(banId)) continue;
            const mon = (don.danhSachMon || []).find(m => 
                (m.id && Number(m.id) === Number(idMonChiTiet)) || 
                (m.id && String(m.id) === String(idMonChiTiet))
            );
            if (mon) {
                mon.trangThai = trangThaiMoi;
                mon.thoiGianCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);
                if (!thongTinMon) thongTinMon = mon;
                daTimThay = true;
                break;
            }
        }

        // Nếu chưa tìm thấy theo bàn, tìm tự do không phân biệt bàn
        if (!daTimThay) {
            for (const don of dsDon) {
                const mon = (don.danhSachMon || []).find(m => 
                    (m.id && Number(m.id) === Number(idMonChiTiet)) || 
                    (m.id && String(m.id) === String(idMonChiTiet))
                );
                if (mon) {
                    mon.trangThai = trangThaiMoi;
                    mon.thoiGianCapNhat = new Date().toISOString().replace('T', ' ').substring(0, 19);
                    if (!thongTinMon) thongTinMon = mon;
                    daTimThay = true;
                    break;
                }
            }
        }

        if (daTimThay) {
            localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi', JSON.stringify(dsDon));
        }

        // 3. ĐỒNG BỘ: Cập nhật luôn vào phiên bàn POS ('quanmoc_pos_phien_ban')
        const rawPosPhien = localStorage.getItem('quanmoc_pos_phien_ban');
        if (rawPosPhien) {
            try {
                const phienMap = JSON.parse(rawPosPhien);
                const banKey = banId ? String(banId) : null;
                const keysToSearch = (banKey && phienMap[banKey]) ? [banKey] : Object.keys(phienMap);
                for (const bKey of keysToSearch) {
                    const phien = phienMap[bKey];
                    if (phien && Array.isArray(phien.danhSachMon)) {
                        const mPos = phien.danhSachMon.find(m => 
                            (m.id && Number(m.id) === Number(idMonChiTiet)) || 
                            (m.id && String(m.id) === String(idMonChiTiet)) || 
                            (thongTinMon && thongTinMon.tenMon && m.tenMon === thongTinMon.tenMon)
                        );
                        if (mPos) {
                            let posTt = trangThaiMoi;
                            if (trangThaiMoi === 'DA_LEN_MON' || trangThaiMoi === 'DA_PHUC_VU') posTt = 'DA_PHUC_VU';
                            else if (trangThaiMoi === 'DA_XONG' || trangThaiMoi === 'DA_NAU_XONG' || trangThaiMoi === 'DA_CHE_BIEN') posTt = 'DA_XONG';
                            else if (trangThaiMoi === 'DANG_CHE_BIEN') posTt = 'DANG_CHE_BIEN';
                            mPos.trangThai = posTt;
                            mPos.thoiGianCapNhat = new Date().toISOString();
                            if (!thongTinMon) thongTinMon = mPos;
                            daTimThay = true;
                            localStorage.setItem('quanmoc_pos_phien_ban', JSON.stringify(phienMap));
                            break;
                        }
                    }
                }
            } catch (e) {
                console.warn('Lỗi đồng bộ trạng thái món sang POS:', e);
            }
        }

        // Đảm bảo luôn có thông tin món để phản hồi giao diện tức thì
        if (!thongTinMon) {
            thongTinMon = { id: idMonChiTiet, banId, trangThai: trangThaiMoi, tenMon: 'Món ăn' };
            daTimThay = true;
        }

        // 4. Đồng bộ thời gian thực qua Web Broadcast & Socket
        if (window.socketClient) {
            window.socketClient.phatSuKien('order:capNhatTrangThai', { 
                idMonChiTiet, 
                banId, 
                trangThai: trangThaiMoi, 
                mon: thongTinMon 
            });
        }

        return { 
            ok: true, 
            data: thongTinMon, 
            msg: `Cập nhật trạng thái món [${thongTinMon?.tenMon || idMonChiTiet}] sang: ${trangThaiMoi}` 
        };
    }

    /**
     * US-071 & US-072: Gửi yêu cầu gọi nhân viên hỗ trợ tại bàn
     * @param {number} banId ID bàn
     * @param {string} loaiYeuCau Mã loại (THEM_BAT_DUA, THEM_KHAN_GIAY, THEM_DA_LANH, ...)
     * @param {string} chiTiet Ghi chú chi tiết yêu cầu
     */
    async guiYeuCauHoTroTaiBan(banId, loaiYeuCau, chiTiet = '') {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro');
        const ds = raw ? JSON.parse(raw) : [];

        const dsBan = await this.layDanhSachBanAn();
        const ban = dsBan.find(b => Number(b.id) === Number(banId));
        const soBan = ban ? ban.soBan : `Bàn ${banId}`;

        // Tìm tên hiển thị của yêu cầu
        const danhSachLyDo = window.HANG_SO?.LY_DO_HO_TRO || [];
        const timLyDo = danhSachLyDo.find(l => l.ma === loaiYeuCau);
        const tenYeuCau = timLyDo ? timLyDo.ten : 'Cần nhân viên hỗ trợ';

        const idMoi = ds.length > 0 ? Math.max(...ds.map(y => y.id || 0)) + 1 : 1;
        const thoiGian = (window.DinhDang && window.DinhDang.layThoiGianHienTaiVN) ? window.DinhDang.layThoiGianHienTaiVN() : new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());

        const yeuCauMoi = {
            id: idMoi,
            banId: Number(banId),
            soBan,
            loaiYeuCau,
            tenYeuCau,
            chiTiet,
            thoiGian,
            trangThai: 'CHO_TIEP_NHAN', // CHO_TIEP_NHAN -> DA_TIEP_NHAN -> DA_XU_LY
            nguoiTiepNhan: null
        };

        ds.unshift(yeuCauMoi);
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro', JSON.stringify(ds));

        // Cập nhật trạng thái bàn sang CAN_HO_TRO nếu bàn không phải CHO_THANH_TOAN
        if (ban && ban.trangThai !== 'CHO_THANH_TOAN') {
            await this.capNhatTrangThaiBan(banId, 'CAN_HO_TRO');
        }

        // US-075 & US-078: Phát sự kiện và chuông gọi phục vụ
        if (window.socketClient) {
            window.socketClient.phatSuKien('hoTro:yeuCauMoi', yeuCauMoi);
            window.socketClient.phatAmThanh('hoTro');
        }

        this.ghiNhatKy(`Khách gọi hỗ trợ (${soBan})`, 'INFO', `${soBan} gửi yêu cầu: ${tenYeuCau}. Ghi chú: ${chiTiet || 'Không'}`);

        return {
            ok: true,
            data: yeuCauMoi,
            msg: `Đã gửi yêu cầu [${tenYeuCau}] đến nhân viên! Nhân viên phục vụ sẽ đến bàn bạn ngay.`
        };
    }

    /**
     * US-073: Gửi yêu cầu thanh toán tại bàn kèm phương thức dự kiến
     * @param {number} banId ID bàn
     * @param {string} phuongThuc 'TIEN_MAT' | 'CHUYEN_KHOAN'
     * @param {string} ghiChu Ghi chú thêm (xuất VAT, tách bill...)
     */
    async guiYeuCauThanhToan(banId, phuongThuc = 'TIEN_MAT', ghiChu = '') {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro');
        const ds = raw ? JSON.parse(raw) : [];

        const dsBan = await this.layDanhSachBanAn();
        const ban = dsBan.find(b => Number(b.id) === Number(banId));
        const soBan = ban ? ban.soBan : `Bàn ${banId}`;

        // Lấy tổng tiền lũy kế hiện tại
        const kqDon = await this.layDanhSachDonTheoBan(banId);
        const tongTien = kqDon.ok ? kqDon.data.tongTienLuyKe : 0;

        const tenPhuongThuc = phuongThuc === 'CHUYEN_KHOAN' ? 'Chuyển khoản VietQR' : 'Tiền mặt';

        const idMoi = ds.length > 0 ? Math.max(...ds.map(y => y.id || 0)) + 1 : 1;
        const thoiGian = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const yeuCauMoi = {
            id: idMoi,
            banId: Number(banId),
            soBan,
            loaiYeuCau: 'THANH_TOAN',
            tenYeuCau: `💳 Yêu cầu thanh toán (${tenPhuongThuc})`,
            phuongThuc,
            tongTamTinh: tongTien,
            chiTiet: ghiChu || `Khách chọn thanh toán bằng ${tenPhuongThuc}. Tạm tính: ${tongTien.toLocaleString('vi-VN')}đ`,
            thoiGian,
            trangThai: 'CHO_TIEP_NHAN',
            nguoiTiepNhan: null
        };

        ds.unshift(yeuCauMoi);
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro', JSON.stringify(ds));

        // Cập nhật trạng thái bàn sang CHO_THANH_TOAN
        await this.capNhatTrangThaiBan(banId, 'CHO_THANH_TOAN');

        // Phát sự kiện Socket và chuông thanh toán
        if (window.socketClient) {
            window.socketClient.phatSuKien('thanhToan:yeuCau', yeuCauMoi);
            window.socketClient.phatAmThanh('thanhToan');
        }

        this.ghiNhatKy(`Khách gọi thanh toán (${soBan})`, 'INFO', `${soBan} yêu cầu thanh toán [${tenPhuongThuc}], tạm tính: ${tongTien.toLocaleString('vi-VN')}đ`);

        return {
            ok: true,
            data: yeuCauMoi,
            msg: `Đã gửi yêu cầu thanh toán! Thu ngân đang kiểm tra hóa đơn và mang phiếu thanh toán ra bàn.`
        };
    }

    /**
     * US-074: Lấy danh sách yêu cầu hỗ trợ (tất cả hoặc theo bàn)
     */
    async layDanhSachYeuCauHoTro(banId = null) {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro');
        let ds = raw ? JSON.parse(raw) : [];
        if (banId !== null && banId !== undefined) {
            ds = ds.filter(y => Number(y.banId) === Number(banId));
        }
        return ds;
    }

    /**
     * US-074: Nhân viên tiếp nhận yêu cầu hỗ trợ
     */
    async tiepNhanYeuCauHoTro(idYeuCau, nguoiNhan = 'Nhân viên phục vụ') {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro');
        if (!raw) return { ok: false, msg: 'Không tìm thấy yêu cầu!' };

        const ds = JSON.parse(raw);
        const yc = ds.find(y => Number(y.id) === Number(idYeuCau));
        if (!yc) return { ok: false, msg: 'Không tìm thấy yêu cầu hỗ trợ!' };

        yc.trangThai = 'DA_TIEP_NHAN';
        yc.nguoiTiepNhan = nguoiNhan;
        yc.thoiGianTiepNhan = new Date().toISOString().replace('T', ' ').substring(0, 19);

        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro', JSON.stringify(ds));

        // Phát sự kiện thông báo cho máy khách
        if (window.socketClient) {
            window.socketClient.phatSuKien('hoTro:tiepNhan', yc);
        }

        return { ok: true, data: yc, msg: `Đã tiếp nhận yêu cầu hỗ trợ của ${yc.soBan}.` };
    }

    /**
     * Hoàn tất xử lý yêu cầu hỗ trợ
     */
    async hoanTatYeuCauHoTro(idYeuCau) {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro');
        if (!raw) return { ok: false, msg: 'Không tìm thấy yêu cầu!' };

        const ds = JSON.parse(raw);
        const yc = ds.find(y => Number(y.id) === Number(idYeuCau));
        if (!yc) return { ok: false, msg: 'Không tìm thấy yêu cầu!' };

        yc.trangThai = 'DA_XU_LY';
        yc.thoiGianHoanTat = new Date().toISOString().replace('T', ' ').substring(0, 19);

        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro', JSON.stringify(ds));

        // Kiểm tra xem bàn còn yêu cầu nào chưa xử lý không, nếu hết thì trả trạng thái bàn về DANG_DUNG
        const conYeuCauKhac = ds.some(y => Number(y.banId) === Number(yc.banId) && y.trangThai !== 'DA_XU_LY');
        if (!conYeuCauKhac) {
            const dsBan = await this.layDanhSachBanAn();
            const ban = dsBan.find(b => Number(b.id) === Number(yc.banId));
            if (ban && ban.trangThai === 'CAN_HO_TRO') {
                await this.capNhatTrangThaiBan(yc.banId, 'DANG_DUNG');
            }
        }

        return { ok: true, msg: 'Đã hoàn tất hỗ trợ khách hàng!' };
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

        // Đồng bộ vào kho yêu cầu hỗ trợ chung của hệ thống (Sprint 2 - Phong & Minh)
        const keyChung = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_YEU_CAU_HO_TRO || 'quanmoc_ds_yeu_cau_ho_tro';
        const dsChung = JSON.parse(localStorage.getItem(keyChung) || '[]');
        const ycChung = {
            id: ycMoi.id,
            banId: Number(banId),
            soBan: `Bàn ${banId}`,
            loaiYeuCau: loaiYeuCau === 'YeuCauThanhToan' ? 'THANH_TOAN' : 'GAP_NHAN_VIEN',
            tenYeuCau: loaiYeuCau === 'YeuCauThanhToan' ? `💳 Yêu cầu thanh toán (${body.phuongThucThanhToan || 'Tiền mặt'})` : `🙋 Hỗ trợ tại bàn: ${body.lyDo || 'Xin hỗ trợ'}`,
            chiTiet: ghiChu || body.lyDo || '',
            thoiGian: new Date().toISOString().replace('T', ' ').substring(0, 19),
            trangThai: 'CHO_TIEP_NHAN',
            nguoiTiepNhan: null
        };
        dsChung.unshift(ycChung);
        localStorage.setItem(keyChung, JSON.stringify(dsChung));

        if (window.socketClient) {
            window.socketClient.phatSuKien('hoTro:yeuCauMoi', ycChung);
            window.socketClient.phatAmThanh('hoTro');
        }

        return {
            ok: true,
            data: ycMoi,
            msg: 'Yêu cầu của quý khách đã được gửi tới nhân viên! (chế độ dự phòng)'
        };
    }

    // =========================================================================
    // PHẦN 4: BỘ API QUẢN LÝ CA LÀM VIỆC & KẾT CA (US-117 -> US-122)
    // =========================================================================

    /**
     * US-117: Lấy danh sách các ca làm việc trong ngày
     */
    async layDanhSachCaLamViec() {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_CA_LAM_VIEC || 'quanmoc_ds_ca_lam_viec');
        return raw ? JSON.parse(raw) : [];
    }

    /**
     * US-118: Lấy thông tin ca làm việc đang mở hiện tại
     */
    async layCaHienTai() {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.CA_HIEN_TAI || 'quanmoc_ca_hien_tai');
        return raw ? JSON.parse(raw) : null;
    }

    /**
     * US-118: Thu ngân thực hiện mở ca làm việc và nhập tiền đầu ca
     */
    async moCaLamViec({ caId, tenCa, thuNganId, thuNganTen, tienDauCa, ghiChuMo }) {
        const caDangMo = await this.layCaHienTai();
        if (caDangMo) {
            return { ok: false, msg: `Đang có ca [${caDangMo.tenCa}] chưa đóng! Vui lòng kết ca hiện tại trước khi mở ca mới.` };
        }

        const id = Date.now();
        const now = new Date();
        const ngay = now.toISOString().slice(0, 10);
        const maCa = `SHIFT-${ngay.replace(/-/g, '')}-${String(Math.floor(Math.random()*90)+10)}`;
        const thoiGianMoIso = now.toISOString();
        const thoiGianMo = thoiGianMoIso.replace('T', ' ').substring(0, 19);

        const caMoi = {
            id,
            maCa,
            caId: Number(caId || 1),
            tenCa: tenCa || 'Ca Sáng',
            thuNganId: Number(thuNganId || 2),
            thuNganTen: thuNganTen || 'Thu ngân',
            thoiDiemMo: id,
            thoiGianMoIso,
            thoiGianMo,
            tienDauCa: Number(tienDauCa || 0),
            ghiChuMo: ghiChuMo || '',
            trangThai: 'DANG_MO'
        };

        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.CA_HIEN_TAI || 'quanmoc_ca_hien_tai', JSON.stringify(caMoi));
        this.ghiNhatKy(`Mở ca làm việc (${caMoi.tenCa})`, 'INFO', `Thu ngân [${caMoi.thuNganTen}] mở ca. Tiền mặt đầu ca: ${caMoi.tienDauCa.toLocaleString('vi-VN')}đ`);

        return {
            ok: true,
            data: caMoi,
            msg: `Mở ca [${caMoi.tenCa}] thành công! Tiền đầu ca: ${caMoi.tienDauCa.toLocaleString('vi-VN')} đ`
        };
    }

    /**
     * US-119: Ghi nhận phiếu thu / chi tiền mặt phát sinh trong ca
     */
    async taoPhieuThuChi({ loai, soTien, lyDo, nguoiThucHien, caId }) {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.PHIEU_THU_CHI || 'quanmoc_phieu_thu_chi');
        const ds = raw ? JSON.parse(raw) : [];

        const id = Date.now();
        const ngay = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const maPhieu = `${loai === 'THU' ? 'PT' : 'PC'}-${ngay}-${String(ds.length + 1).padStart(3, '0')}`;
        const thoiGian = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const phieuMoi = {
            id,
            maPhieu,
            loai, // 'THU' | 'CHI'
            soTien: Number(soTien || 0),
            lyDo: lyDo || (loai === 'THU' ? 'Thu tiền mặt phát sinh' : 'Chi tiền mặt phát sinh'),
            nguoiThucHien: nguoiThucHien || 'Thu ngân',
            thoiGian,
            caId: caId || 101
        };

        ds.unshift(phieuMoi);
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.PHIEU_THU_CHI || 'quanmoc_phieu_thu_chi', JSON.stringify(ds));

        this.ghiNhatKy(
            `Tạo phiếu ${loai === 'THU' ? 'thu' : 'chi'} tiền mặt`,
            loai === 'CHI' ? 'WARN' : 'INFO',
            `Mã ${maPhieu}: ${phieuMoi.soTien.toLocaleString('vi-VN')}đ. Lý do: ${phieuMoi.lyDo}`
        );

        return {
            ok: true,
            data: phieuMoi,
            msg: `Tạo phiếu ${loai === 'THU' ? 'thu' : 'chi'} [${maPhieu}] thành công!`
        };
    }

    /**
     * US-119: Lấy danh sách phiếu thu chi trong ca
     */
    async layDanhSachPhieuThuChi(caId = null) {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.PHIEU_THU_CHI || 'quanmoc_phieu_thu_chi');
        let ds = raw ? JSON.parse(raw) : [];
        if (caId) {
            ds = ds.filter(p => Number(p.caId) === Number(caId));
        }
        return ds;
    }

    /**
     * US-120: Tự động tổng hợp số liệu doanh thu và tiền mặt trong ca
     */
    async tinhTongKetCa(caId = null) {
        const ca = await this.layCaHienTai();
        const tienDauCa = ca ? Number(ca.tienDauCa || 0) : 0;

        // Lấy các phiếu thu chi của ca
        const dsPhieu = await this.layDanhSachPhieuThuChi(ca ? ca.id : null);
        let tongThuPhatSinh = 0;
        let tongChiPhatSinh = 0;
        dsPhieu.forEach(p => {
            if (p.loai === 'THU') tongThuPhatSinh += Number(p.soTien || 0);
            else if (p.loai === 'CHI') tongChiPhatSinh += Number(p.soTien || 0);
        });

        // Lấy các hóa đơn phát sinh trong ca hiện tại
        const dsHoaDon = await this.layDanhSachHoaDon();
        let doanhThuTienMat = 0;
        let doanhThuChuyenKhoan = 0;
        let soHoaDon = 0;
        const dsHoaDonCa = [];

        if (ca) {
            // Tập hợp các hóa đơn đã nằm trong các ca đã kết thúc trước đó
            const setIdDaDong = new Set();
            const setKhoaDaDong = new Set();
            const setMaHdDaDong = new Set();
            try {
                const rawLs = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca');
                const dsLs = rawLs ? JSON.parse(rawLs) : [];
                if (Array.isArray(dsLs)) {
                    dsLs.forEach(bb => {
                        if (Array.isArray(bb.dsHoaDon)) {
                            bb.dsHoaDon.forEach(h => {
                                if (!h) return;
                                if (h.id && !String(h.id).startsWith('HD-')) setIdDaDong.add(String(h.id));
                                const ma = String(h.maHoaDon || '').trim();
                                const tg = String(h.thoiGianThanhToan || h.thoiGian || '');
                                const tien = Number(h.tongThanhToan || h.tongTien || 0);
                                if (ma && tg) setKhoaDaDong.add(`${ma}|${tg}|${tien}`);
                                else if (ma) setMaHdDaDong.add(ma);
                            });
                        }
                    });
                }
            } catch (e) {
                console.warn('Lỗi đọc quanmoc_ls_ket_ca:', e);
            }

            const parseTs = (str) => {
                if (!str) return 0;
                if (typeof str === 'number') return str;
                let s = String(str).trim();
                if (!s) return 0;
                if (/^\d+$/.test(s)) return parseInt(s, 10);
                s = s.replace(' ', 'T');
                if (!s.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(s)) {
                    s += 'Z';
                }
                const d = new Date(s);
                return isNaN(d.getTime()) ? 0 : d.getTime();
            };

            const tsMoCa = ca.thoiDiemMo || parseTs(ca.thoiGianMoIso || ca.thoiGianMo);

            dsHoaDon.forEach(hd => {
                const maHd = String(hd.maHoaDon || '').trim();
                const tgHd = String(hd.thoiGianThanhToan || hd.thoiGian || '');
                const tienHd = Number(hd.tongThanhToan || hd.tongTien || 0);
                const khoaHd = `${maHd}|${tgHd}|${tienHd}`;

                // Nếu hóa đơn đã được đánh dấu đóng hoặc khớp với biên bản ca cũ -> BỎ QUA NGAY
                if (
                    hd.daKetCa ||
                    (hd.id && setIdDaDong.has(String(hd.id))) ||
                    setKhoaDaDong.has(khoaHd) ||
                    (setMaHdDaDong.has(maHd) && (!hd.caId || String(hd.caId) !== String(ca.id)))
                ) {
                    return;
                }

                let thuocCa = false;

                // 1. Kiểm tra theo caId hoặc maCa
                if (hd.caId) {
                    thuocCa = (String(hd.caId) === String(ca.id) || Number(hd.caId) === Number(ca.id));
                } else if (hd.maCa) {
                    thuocCa = (hd.maCa === ca.maCa);
                } else {
                    // 2. Nếu hóa đơn chưa gắn caId (ví dụ từ POS cũ), kiểm tra theo mốc thời gian mở ca
                    const tsHd = hd.thoiDiemThanhToan || parseTs(hd.thoiGianThanhToan || hd.thoiGian);
                    if (tsHd >= tsMoCa && tsMoCa > 0) {
                        thuocCa = true;
                    }
                }

                if (thuocCa) {
                    dsHoaDonCa.push(hd);
                    const tongTien = Number(hd.tongThanhToan || hd.tongTien || 0);
                    if (hd.phuongThuc === 'TIEN_MAT') {
                        doanhThuTienMat += tongTien;
                    } else {
                        doanhThuChuyenKhoan += tongTien;
                    }
                    soHoaDon++;
                }
            });
        }

        const tongDoanhThu = doanhThuTienMat + doanhThuChuyenKhoan;
        const tienMatLyThuyet = tienDauCa + doanhThuTienMat + tongThuPhatSinh - tongChiPhatSinh;

        // Lấy các phiên bàn đang phục vụ (chưa thanh toán hóa đơn)
        let tongTienChuaThu = 0;
        const dsBanChuaThu = [];
        const rawPosPhien = localStorage.getItem('quanmoc_pos_phien_ban');
        if (rawPosPhien) {
            try {
                const phienMap = JSON.parse(rawPosPhien);
                Object.entries(phienMap).forEach(([banId, phien]) => {
                    if (phien && Array.isArray(phien.danhSachMon) && phien.danhSachMon.length > 0) {
                        const tienBan = phien.danhSachMon.reduce((sum, m) => {
                            if (m.trangThai === 'DA_HUY' || m.trangThai === 'TU_CHOI') return sum;
                            return sum + (Number(m.thanhTien) || (Number(m.donGia || 0) * Number(m.soLuong || 1)) || 0);
                        }, 0);
                        if (tienBan > 0) {
                            tongTienChuaThu += tienBan;
                            dsBanChuaThu.push({
                                banId,
                                soBan: phien.soBan || `Bàn ${banId}`,
                                tienBan,
                                soLuongMon: phien.danhSachMon.length,
                                thoiGianBatDau: phien.thoiGianBatDau
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn('Lỗi đọc phiên bàn đang phục vụ:', e);
            }
        }

        return {
            ca,
            tienDauCa,
            tongDoanhThu,
            doanhThuTienMat,
            doanhThuChuyenKhoan,
            tongThuPhatSinh,
            tongChiPhatSinh,
            tienMatLyThuyet,
            soHoaDon,
            dsHoaDonCa,
            dsPhieu,
            tongTienChuaThu,
            dsBanChuaThu
        };
    }

    /**
     * US-121: Thu ngân đóng ca, kiểm đếm thực tế và đối soát chênh lệch
     */
    async dongCaLamViec({ tienMatThucTe, chiTietKiemDem, ghiChu, thuNganDongTen }) {
        const ca = await this.layCaHienTai();
        if (!ca) {
            return { ok: false, msg: 'Hiện không có ca làm việc nào đang mở để đóng!' };
        }

        const tongKet = await this.tinhTongKetCa(ca.id);
        const thucTe = Number(tienMatThucTe || 0);
        const lyThuyet = tongKet.tienMatLyThuyet;
        const chenhLech = thucTe - lyThuyet;

        let trangThaiChenhLech = 'KHOP_CHUAN';
        if (chenhLech > 0) trangThaiChenhLech = 'THUA_QUY';
        else if (chenhLech < 0) trangThaiChenhLech = 'THIEU_QUY';

        const id = Date.now();
        const ngay = new Date().toISOString().slice(0, 10);
        const maBienBan = `Z-${ngay.replace(/-/g, '')}-${String(Math.floor(Math.random()*90)+10)}`;
        const thoiGianDong = (window.DinhDang && window.DinhDang.layThoiGianHienTaiVN) ? window.DinhDang.layThoiGianHienTaiVN() : new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());

        const bienBanKetCa = {
            id,
            maBienBan,
            caId: ca.caId,
            tenCa: ca.tenCa,
            ngay,
            thuNganMo: ca.thuNganTen,
            thuNganDong: thuNganDongTen || ca.thuNganTen,
            thoiGianMo: ca.thoiGianMo,
            thoiGianDong,
            tienDauCa: ca.tienDauCa,
            tongDoanhThu: tongKet.tongDoanhThu,
            doanhThuTienMat: tongKet.doanhThuTienMat,
            doanhThuChuyenKhoan: tongKet.doanhThuChuyenKhoan,
            tongThuPhatSinh: tongKet.tongThuPhatSinh,
            tongChiPhatSinh: tongKet.tongChiPhatSinh,
            tienMatLyThuyet: lyThuyet,
            tienMatThucTe: thucTe,
            chenhLech,
            trangThaiChenhLech,
            soHoaDon: tongKet.soHoaDon,
            dsHoaDon: tongKet.dsHoaDonCa || [],
            tongTienChuaThu: tongKet.tongTienChuaThu || 0,
            soBanChuaThu: (tongKet.dsBanChuaThu || []).length,
            chiTietKiemDem: chiTietKiemDem || null,
            ghiChu: ghiChu || ''
        };

        // Lưu vào lịch sử kết ca
        const rawLs = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca');
        const dsLs = rawLs ? JSON.parse(rawLs) : [];
        dsLs.unshift(bienBanKetCa);
        localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca', JSON.stringify(dsLs));

        // Đánh dấu các hóa đơn trong ca là đã kết ca
        if (Array.isArray(bienBanKetCa.dsHoaDon) && bienBanKetCa.dsHoaDon.length > 0) {
            try {
                const setMaHdDong = new Set(bienBanKetCa.dsHoaDon.map(h => String(h.maHoaDon || h.id)));
                const rawPos = localStorage.getItem('quanmoc_pos_lich_su_hoa_don');
                if (rawPos) {
                    const dsPos = JSON.parse(rawPos);
                    dsPos.forEach(h => {
                        if (setMaHdDong.has(String(h.maHoaDon || h.id))) {
                            h.daKetCa = true;
                            h.maBienBanKetCa = maBienBan;
                            h.caIdDaKet = ca.id;
                        }
                    });
                    localStorage.setItem('quanmoc_pos_lich_su_hoa_don', JSON.stringify(dsPos));
                }
                const rawAll = localStorage.getItem('quanmoc_ds_hoa_don');
                if (rawAll) {
                    const dsAll = JSON.parse(rawAll);
                    dsAll.forEach(h => {
                        if (setMaHdDong.has(String(h.maHoaDon || h.id))) {
                            h.daKetCa = true;
                            h.maBienBanKetCa = maBienBan;
                            h.caIdDaKet = ca.id;
                        }
                    });
                    localStorage.setItem('quanmoc_ds_hoa_don', JSON.stringify(dsAll));
                }
            } catch (e) {
                console.warn('Lỗi đánh dấu daKetCa cho hóa đơn:', e);
            }
        }

        // Xóa ca hiện tại (đã đóng thành công)
        localStorage.removeItem(window.HANG_SO?.KHOA_LUU_TRU?.CA_HIEN_TAI || 'quanmoc_ca_hien_tai');

        this.ghiNhatKy(
            `Kết ca làm việc (${bienBanKetCa.tenCa})`,
            chenhLech !== 0 ? 'WARN' : 'INFO',
            `Biên bản [${maBienBan}]: Doanh thu ${bienBanKetCa.tongDoanhThu.toLocaleString('vi-VN')}đ. Chênh lệch két: ${chenhLech.toLocaleString('vi-VN')}đ (${trangThaiChenhLech})`
        );

        return {
            ok: true,
            data: bienBanKetCa,
            msg: `Kết ca [${bienBanKetCa.tenCa}] thành công! Biên bản đối soát: ${maBienBan}`
        };
    }

    /**
     * US-122: Quản lý xem toàn bộ lịch sử biên bản kết ca
     */
    async layLichSuKetCa() {
        const raw = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca');
        return raw ? JSON.parse(raw) : [];
    }

    // =========================================================================
    // PHẦN 5: BỘ API BÁO CÁO DOANH THU, DASHBOARD & HÓA ĐƠN (US-123 -> US-134)
    // =========================================================================

    /**
     * Chuẩn hóa và làm giàu thông tin món ăn trên hóa đơn (danh mục, đơn giá, thành tiền)
     */
    async lamGiauThongTinMonHoaDon(danhSachMon) {
        if (!Array.isArray(danhSachMon)) return [];
        let dsMonThucDon = [];
        let dsDanhMuc = [];
        try {
            dsMonThucDon = await this.layDanhSachMonAn();
            dsDanhMuc = await this.layDanhSachDanhMuc();
        } catch (e) {}

        const mapMonTheoId = {};
        const mapMonTheoTen = {};
        (dsMonThucDon || []).forEach(m => {
            if (m.id) mapMonTheoId[String(m.id)] = m;
            if (m.maMon) mapMonTheoId[String(m.maMon).toLowerCase()] = m;
            if (m.tenMon) mapMonTheoTen[m.tenMon.toLowerCase().trim()] = m;
        });

        const mapDmTheoId = {};
        (dsDanhMuc || []).forEach(d => {
            mapDmTheoId[String(d.id)] = d.ten || d.tenDanhMuc;
        });

        return danhSachMon.map(m => {
            let tenDm = m.danhMucTen || m.tenDanhMuc;
            const mId = String(m.monAnId || m.monId || m.id || '');
            const tenMon = (m.tenMon || m.ten || '').toLowerCase().trim();

            const monGoc = mapMonTheoId[mId] || mapMonTheoTen[tenMon];
            if (monGoc) {
                if (!tenDm && monGoc.danhMucId && mapDmTheoId[String(monGoc.danhMucId)]) {
                    tenDm = mapDmTheoId[String(monGoc.danhMucId)];
                } else if (!tenDm && (monGoc.danhMucTen || monGoc.tenDanhMuc)) {
                    tenDm = monGoc.danhMucTen || monGoc.tenDanhMuc;
                }
            }

            // Phân loại danh mục dự phòng theo thực đơn chuẩn của nhà hàng
            if (!tenDm) {
                if (tenMon.includes('gà giòn') || tenMon.includes('gà rán') || tenMon.includes('popcorn') || tenMon.includes('chickenjoy')) {
                    tenDm = 'Gà Giòn Vui Vẻ';
                } else if (tenMon.includes('mì ý') || tenMon.includes('spaghetti')) {
                    tenDm = 'Mì Ý Sốt Bò Bằm';
                } else if (tenMon.includes('burger') || tenMon.includes('cơm')) {
                    tenDm = 'Burger & Cơm';
                } else if (tenMon.includes('khoai tây') || tenMon.includes('bánh pie') || tenMon.includes('kem') || tenMon.includes('trà') || tenMon.includes('nước') || tenMon.includes('uống')) {
                    tenDm = 'Tráng Miệng & Thức Uống';
                } else {
                    tenDm = 'Món khác';
                }
            }

            const gia = Number(m.donGia || m.giaBan || (monGoc ? monGoc.giaBan : 0));
            const sl = Number(m.soLuong || 1);
            const thanhTien = Number(m.thanhTien) || (gia * sl);

            return {
                ...m,
                tenMon: m.tenMon || m.ten || (monGoc ? monGoc.tenMon : 'Món ăn'),
                danhMucTen: tenDm,
                donGia: gia,
                soLuong: sl,
                thanhTien: thanhTien
            };
        });
    }

    /**
     * US-131: Tra cứu danh sách toàn bộ hóa đơn đã thanh toán kèm bộ lọc
     * ĐỒNG BỘ: Tự động tổng hợp từ POS thu ngân, lưu trữ hóa đơn và các biên bản kết ca
     */
    _laCungHoaDon(a, b) {
        if (!a || !b) return false;
        const aId = a.id != null ? String(a.id).trim() : '';
        const bId = b.id != null ? String(b.id).trim() : '';
        // Chỉ so khớp theo id nếu id là mã định danh duy nhất (không phải mã HD-... dễ trùng ở dữ liệu cũ)
        if (aId && bId && !aId.startsWith('HD-') && !bId.startsWith('HD-') && aId === bId) {
            return true;
        }
        const aTg = String(a.thoiGianThanhToan || a.thoiGian || '').trim();
        const bTg = String(b.thoiGianThanhToan || b.thoiGian || '').trim();
        const aTien = Number(a.tongThanhToan ?? a.tongTien ?? 0);
        const bTien = Number(b.tongThanhToan ?? b.tongTien ?? 0);
        const aBan = String(a.soBan || a.banSo || a.banId || '').trim().toLowerCase();
        const bBan = String(b.soBan || b.banSo || b.banId || '').trim().toLowerCase();
        if (aTg && bTg && aTg === bTg && aTien === bTien && (!aBan || !bBan || aBan === bBan)) {
            return true;
        }
        const aMa = String(a.maHoaDon || '').trim();
        const bMa = String(b.maHoaDon || '').trim();
        if (aMa && bMa && aMa === bMa && aTien === bTien && (!aBan || !bBan || aBan === bBan)) {
            const tsA = Number(a.thoiDiemThanhToan) || (aTg ? Date.parse(aTg) : 0);
            const tsB = Number(b.thoiDiemThanhToan) || (bTg ? Date.parse(bTg) : 0);
            if (!tsA || !tsB || Math.abs(tsA - tsB) < 5000) {
                return true;
            }
        }
        return false;
    }

    _layNgayStrVN(hd) {
        const ma = String(hd?.maHoaDon || '').trim();
        const mNgay = ma.match(/^HD-(\d{8})-/i);
        if (mNgay) return mNgay[1];
        const ts = Number(hd?.thoiDiemThanhToan) || Date.parse(hd?.thoiGianThanhToan || hd?.thoiGian || '');
        if (ts && !isNaN(ts)) {
            try {
                return new Intl.DateTimeFormat('sv-SE', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(new Date(ts)).replace(/-/g, '');
            } catch (e) {}
        }
        const thoiGian = String(hd?.thoiGianThanhToan || hd?.thoiGian || '');
        if (/^\d{4}-\d{2}-\d{2}/.test(thoiGian)) {
            return thoiGian.slice(0, 10).replace(/-/g, '');
        }
        return new Date().toISOString().slice(0, 10).replace(/-/g, '');
    }

    _layMaBanChuan(hd) {
        const ma = String(hd?.maHoaDon || '').trim();
        const mBan = ma.match(/^HD-\d{8}-([A-Z0-9]+?)(?:-\d+)?$/i);
        if (mBan) return mBan[1].toUpperCase();
        if (hd?.maBan) return String(hd.maBan).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const bId = hd?.banId != null && hd.banId !== '' ? String(hd.banId) : '';
        if (bId) return ('B' + (bId.length === 1 ? '0' + bId : bId)).toUpperCase();
        if (hd?.soBan || hd?.banSo) {
            return String(hd.soBan || hd.banSo).replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'B0';
        }
        return 'B0';
    }

    chuanHoaDanhSachHoaDonTheoThoiGian(dsPos, dsAll = null) {
        const coDsAll = Array.isArray(dsAll);
        const nguon = [];
        if (Array.isArray(dsPos)) {
            dsPos.forEach((hd, idx) => {
                if (hd) nguon.push({ hd, nguon: 'POS', originalIdx: idx });
            });
        }
        if (coDsAll) {
            dsAll.forEach((hd, idx) => {
                if (!hd) return;
                const daCoTrongPos = nguon.some(item => this._laCungHoaDon(item.hd, hd));
                if (!daCoTrongPos) {
                    nguon.push({ hd, nguon: 'ALL', originalIdx: 100000 + idx });
                }
            });
        }
        if (nguon.length === 0) return dsPos || [];

        const nhom = {};
        nguon.forEach((entry) => {
            const ma = String(entry.hd.maHoaDon || '').trim();
            if (!ma || /^HD-20261102-\d+$/i.test(ma) || /^HD-SPLIT-/i.test(ma)) return;
            const ngayStr = this._layNgayStrVN(entry.hd);
            const maBan = this._layMaBanChuan(entry.hd);
            const key = `${ngayStr}_${maBan}`;
            if (!nhom[key]) nhom[key] = [];
            nhom[key].push(entry);
        });

        let coThayDoiPos = false;
        let coThayDoiAll = false;

        Object.keys(nhom).forEach(key => {
            const items = nhom[key];
            const [ngayStr, maBan] = key.split('_');

            // Sắp xếp các hóa đơn cùng bàn trong ngày theo thứ tự thời gian tăng dần (cũ trước, mới sau)
            items.sort((a, b) => {
                const tsA = Number(a.hd.thoiDiemThanhToan) || (a.hd.thoiGianThanhToan ? new Date(a.hd.thoiGianThanhToan).getTime() : 0);
                const tsB = Number(b.hd.thoiDiemThanhToan) || (b.hd.thoiGianThanhToan ? new Date(b.hd.thoiGianThanhToan).getTime() : 0);
                if (tsA !== tsB) return tsA - tsB;
                return a.originalIdx - b.originalIdx;
            });

            // Gán số thứ tự lượt bill chuẩn xác: -01, -02, -03...
            items.forEach((item, seq) => {
                const luotStr = String(seq + 1).padStart(2, '0');
                const maChuan = `HD-${ngayStr}-${maBan}-${luotStr}`;
                const ts = Number(item.hd.thoiDiemThanhToan) || (item.hd.thoiGianThanhToan ? new Date(item.hd.thoiGianThanhToan).getTime() : Date.now());
                const idStr = item.hd.id != null ? String(item.hd.id) : '';
                const idChuan = (!idStr || idStr.startsWith('HD-')) ? `ID-${maChuan}-${ts}` : item.hd.id;

                if (item.hd.maHoaDon !== maChuan || item.hd.id !== idChuan) {
                    // Đồng bộ sang bản ghi tương ứng ở mảng còn lại trước khi gán
                    if (coDsAll) {
                        dsAll.forEach(hAll => {
                            if (this._laCungHoaDon(item.hd, hAll)) {
                                if (hAll.maHoaDon !== maChuan) { hAll.maHoaDon = maChuan; coThayDoiAll = true; }
                                const hAllIdStr = hAll.id != null ? String(hAll.id) : '';
                                if (!hAllIdStr || hAllIdStr.startsWith('HD-')) { hAll.id = idChuan; coThayDoiAll = true; }
                            }
                        });
                    }
                    item.hd.maHoaDon = maChuan;
                    item.hd.id = idChuan;
                    if (item.nguon === 'POS') coThayDoiPos = true;
                    else coThayDoiAll = true;
                }
            });
        });

        if (coThayDoiPos && Array.isArray(dsPos)) {
            try {
                localStorage.setItem('quanmoc_pos_lich_su_hoa_don', JSON.stringify(dsPos));
            } catch (e) {}
        }
        if (coThayDoiAll && coDsAll) {
            try {
                localStorage.setItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_HOA_DON || 'quanmoc_ds_hoa_don', JSON.stringify(dsAll));
            } catch (e) {}
        }

        return dsPos;
    }

    _chuanHoaBanGhiHoaDon(hd, macDinhThuNgan = 'Thu ngân') {
        const tg = hd.thoiGianThanhToan || hd.thoiGian || new Date().toISOString();
        const ts = Number(hd.thoiDiemThanhToan) || (hd.thoiGianThanhToan ? new Date(hd.thoiGianThanhToan).getTime() : Date.now());
        return {
            id: hd.id != null ? hd.id : String(hd.maHoaDon || ''),
            maHoaDon: String(hd.maHoaDon || '').trim(),
            banSo: hd.soBan || hd.banSo,
            soBan: hd.soBan || hd.banSo,
            banId: hd.banId || null,
            maBan: hd.maBan || null,
            caId: hd.caId || null,
            maCa: hd.maCa || null,
            daKetCa: Boolean(hd.daKetCa),
            thoiDiemThanhToan: isNaN(ts) ? Date.now() : ts,
            thoiGianThanhToan: tg,
            thoiGian: tg,
            tamTinh: Number(hd.tongTienMon || hd.tamTinh || hd.tienMonAn || hd.tongThanhToan || 0),
            giamGia: Number(hd.giamGia || hd.tienGiamGia || 0),
            vat: Number(hd.vat || hd.tienVat || 0),
            tongThanhToan: Number(hd.tongThanhToan || hd.tongTien || 0),
            tongTien: Number(hd.tongThanhToan || hd.tongTien || 0),
            phuongThuc: hd.phuongThuc || 'TIEN_MAT',
            thuNganTen: hd.thuNganTen || hd.thuNgan || macDinhThuNgan,
            thuNgan: hd.thuNganTen || hd.thuNgan || macDinhThuNgan,
            danhSachMon: Array.isArray(hd.danhSachMon) ? hd.danhSachMon : []
        };
    }

    async layDanhSachHoaDon(boLoc = {}) {
        let ds = [];

        let dsPos = [];
        try {
            const rawPos = localStorage.getItem('quanmoc_pos_lich_su_hoa_don');
            if (rawPos) {
                const parsed = JSON.parse(rawPos);
                if (Array.isArray(parsed)) dsPos = parsed;
            }
        } catch (e) {
            console.warn('Lỗi đọc quanmoc_pos_lich_su_hoa_don:', e);
        }

        let dsAll = [];
        const khoaHoaDon = window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_HOA_DON || 'quanmoc_ds_hoa_don';
        try {
            const raw = localStorage.getItem(khoaHoaDon);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) dsAll = parsed;
            }
        } catch (e) {
            console.warn('Lỗi đọc quanmoc_ds_hoa_don:', e);
        }

        // Chuẩn hóa mã hóa đơn đồng bộ trên cả 2 kho theo đúng số thứ tự lượt thời gian (-01, -02, -03...)
        try {
            this.chuanHoaDanhSachHoaDonTheoThoiGian(dsPos, dsAll);
        } catch (e) {
            console.warn('Lỗi chuẩn hóa mã hóa đơn:', e);
        }

        // 1. Nạp từ hóa đơn POS thu ngân ('quanmoc_pos_lich_su_hoa_don')
        dsPos.forEach((hdPos) => {
            if (!hdPos) return;
            const ma = String(hdPos.maHoaDon || '').trim();
            if (!ma || /^HD-20261102-\d+$/.test(ma)) return;
            const banGhi = this._chuanHoaBanGhiHoaDon(hdPos, 'Quân (Thu ngân POS)');
            if (!ds.some(h => this._laCungHoaDon(h, banGhi))) {
                ds.push(banGhi);
            }
        });

        // 2. Nạp từ kho hóa đơn hệ thống ('quanmoc_ds_hoa_don')
        dsAll.forEach((hd) => {
            if (!hd) return;
            const ma = String(hd.maHoaDon || '').trim();
            if (!ma || /^HD-20261102-\d+$/.test(ma)) return;
            const banGhi = this._chuanHoaBanGhiHoaDon(hd, 'Thu ngân');
            if (!ds.some(h => this._laCungHoaDon(h, banGhi))) {
                ds.push(banGhi);
            }
        });

        // 3. Đọc từ lịch sử kết ca ('quanmoc_ls_ket_ca')
        const rawLs = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca');
        if (rawLs) {
            try {
                const dsLs = JSON.parse(rawLs);
                if (Array.isArray(dsLs)) {
                    dsLs.forEach(bb => {
                        if (Array.isArray(bb.dsHoaDon)) {
                            bb.dsHoaDon.forEach(hdCa => {
                                if (!hdCa) return;
                                const ma = String(hdCa.maHoaDon || '').trim();
                                if (!ma || /^HD-20261102-\d+$/.test(ma)) return;
                                const banGhi = { ...this._chuanHoaBanGhiHoaDon(hdCa, 'Thu ngân'), daKetCa: true };
                                if (!ds.some(h => this._laCungHoaDon(h, banGhi))) {
                                    ds.push(banGhi);
                                }
                            });
                        }
                    });
                }
            } catch (e) {}
        }

        // Sắp xếp hóa đơn mới nhất lên trên
        ds.sort((a, b) => {
            const tsA = a.thoiDiemThanhToan || (a.thoiGianThanhToan ? new Date(a.thoiGianThanhToan).getTime() : 0);
            const tsB = b.thoiDiemThanhToan || (b.thoiGianThanhToan ? new Date(b.thoiGianThanhToan).getTime() : 0);
            return tsB - tsA;
        });

        // Áp dụng bộ lọc nếu có
        if (boLoc) {
            if (boLoc.tuNgay) {
                const tu = new Date(boLoc.tuNgay).getTime();
                ds = ds.filter(h => new Date(h.thoiGian).getTime() >= tu);
            }
            if (boLoc.denNgay) {
                const den = new Date(boLoc.denNgay).getTime() + 86400000;
                ds = ds.filter(h => new Date(h.thoiGian).getTime() <= den);
            }
            if (boLoc.phuongThuc && boLoc.phuongThuc !== 'TAT_CA') {
                ds = ds.filter(h => h.phuongThuc === boLoc.phuongThuc);
            }
            if (boLoc.maHoaDon) {
                const maNorm = boLoc.maHoaDon.trim().toLowerCase();
                ds = ds.filter(h => String(h.maHoaDon || '').toLowerCase().includes(maNorm));
            }
        }

        return ds;
    }

    /**
     * US-132: Xem chi tiết hóa đơn cũ
     */
    async layChiTietHoaDon(id) {
        const idStr = String(id || '').trim().toLowerCase();
        if (!idStr) return { ok: false, msg: 'Mã hóa đơn không hợp lệ' };

        const ds = await this.layDanhSachHoaDon();
        let hd = ds.find(h => 
            String(h.id || '').trim().toLowerCase() === idStr || 
            String(h.maHoaDon || '').trim().toLowerCase() === idStr ||
            (idStr && String(h.maHoaDon || '').trim().toLowerCase().includes(idStr))
        );

        // 1. Tìm trực tiếp trong lịch sử hóa đơn POS nếu chưa thấy
        if (!hd) {
            try {
                const rawPos = localStorage.getItem('quanmoc_pos_lich_su_hoa_don');
                if (rawPos) {
                    const dsPos = JSON.parse(rawPos);
                    hd = (Array.isArray(dsPos) ? dsPos : []).find(h => 
                        String(h.id || '').trim().toLowerCase() === idStr || 
                        String(h.maHoaDon || '').trim().toLowerCase() === idStr ||
                        (idStr && String(h.maHoaDon || '').trim().toLowerCase().includes(idStr))
                    );
                }
            } catch (e) {}
        }

        // 2. Tìm trong kho hóa đơn dùng chung
        if (!hd) {
            try {
                const rawAll = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_HOA_DON || 'quanmoc_ds_hoa_don');
                if (rawAll) {
                    const dsAll = JSON.parse(rawAll);
                    hd = (Array.isArray(dsAll) ? dsAll : []).find(h => 
                        String(h.id || '').trim().toLowerCase() === idStr || 
                        String(h.maHoaDon || '').trim().toLowerCase() === idStr ||
                        (idStr && String(h.maHoaDon || '').trim().toLowerCase().includes(idStr))
                    );
                }
            } catch (e) {}
        }

        // 3. Thử tìm trong các biên bản kết ca cũ
        if (!hd) {
            const rawLs = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.LICH_SU_KET_CA || 'quanmoc_ls_ket_ca');
            if (rawLs) {
                try {
                    const dsLs = JSON.parse(rawLs);
                    for (const bb of dsLs) {
                        if (Array.isArray(bb.dsHoaDon)) {
                            const found = bb.dsHoaDon.find(h => 
                                String(h.id || '').trim().toLowerCase() === idStr || 
                                String(h.maHoaDon || '').trim().toLowerCase() === idStr ||
                                (idStr && String(h.maHoaDon || '').trim().toLowerCase().includes(idStr))
                            );
                            if (found) { hd = found; break; }
                        }
                    }
                } catch (e) {}
            }
        }

        if (hd) {
            return {
                ok: true,
                data: {
                    ...hd,
                    danhSachMon: Array.isArray(hd.danhSachMon) ? hd.danhSachMon : []
                }
            };
        }
        return { ok: false, msg: 'Không tìm thấy thông tin hóa đơn!' };
    }

    /**
     * US-123 & US-124 & US-125: Thống kê số liệu Dashboard tổng quan trong ngày & chuỗi thời gian 7 ngày thực tế
     */
    async layThongKeDoanhThu(ky = 'HOM_NAY') {
        const dsTatCa = await this.layDanhSachHoaDon();
        const homNayStr = new Date().toISOString().slice(0, 10);

        // Lọc hóa đơn trong ngày hôm nay
        const dsHomNay = dsTatCa.filter(hd => {
            const ngayHd = (hd.thoiGianThanhToan || hd.thoiGian || '').slice(0, 10);
            return ngayHd === homNayStr;
        });

        // Tập hóa đơn sử dụng để tính KPIs chính
        const dsKpi = (ky === 'HOM_NAY' || !ky) ? dsHomNay : dsTatCa;

        let tongDoanhThu = 0;
        let tongTienMat = 0;
        let tongChuyenKhoan = 0;
        let tongMonPhucVu = 0;
        let tongKhach = 0;
        const soHoaDon = dsKpi.length;

        dsKpi.forEach(hd => {
            const tien = Number(hd.tongThanhToan || hd.tongTien || 0);
            tongDoanhThu += tien;
            if (hd.phuongThuc === 'TIEN_MAT') {
                tongTienMat += tien;
            } else {
                tongChuyenKhoan += tien;
            }

            tongKhach += Number(hd.soKhach || 2);
            (hd.danhSachMon || []).forEach(m => {
                tongMonPhucVu += Number(m.soLuong || 1);
            });
        });

        const giaTriTrungBinhDon = soHoaDon > 0 ? Math.round(tongDoanhThu / soHoaDon) : 0;

        // Chuỗi dữ liệu biểu đồ doanh thu theo 7 ngày gần nhất dựa trên lịch thực tế của hệ thống
        const bieuDo7Ngay = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const isoDate = d.toISOString().slice(0, 10);
            const label = (i === 0) ? 'Hôm nay' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

            const dsNgay = dsTatCa.filter(hd => (hd.thoiGianThanhToan || hd.thoiGian || '').slice(0, 10) === isoDate);
            const dtNgay = dsNgay.reduce((sum, h) => sum + Number(h.tongThanhToan || h.tongTien || 0), 0);
            const donNgay = dsNgay.length;

            bieuDo7Ngay.push({
                ngay: label,
                nhan: label,
                isoDate: isoDate,
                doanhThu: dtNgay,
                soDon: donNgay
            });
        }

        const tongThuPt = tongTienMat + tongChuyenKhoan;
        return {
            tongDoanhThu,
            soHoaDon,
            giaTriTrungBinhDon,
            tongKhach,
            tongMonPhucVu,
            tyTrongThanhToan: {
                tienMat: tongTienMat,
                chuyenKhoan: tongChuyenKhoan,
                phanTramTienMat: tongThuPt > 0 ? Math.round((tongTienMat / tongThuPt) * 100) : 0,
                phanTramChuyenKhoan: tongThuPt > 0 ? Math.round((tongChuyenKhoan / tongThuPt) * 100) : 0
            },
            bieuDo7Ngay
        };
    }

    /**
     * US-126: Thống kê doanh thu theo từng danh mục thực đơn thực tế
     */
    async layThongKeDoanhThuTheoDanhMuc() {
        const ds = await this.layDanhSachHoaDon();
        let dsDanhMuc = [];
        try {
            dsDanhMuc = await this.layDanhSachDanhMuc();
        } catch (e) {}

        const mapDanhMuc = {};
        // Đảm bảo tất cả các danh mục có trong hệ thống đều xuất hiện
        (dsDanhMuc || []).forEach(dm => {
            const ten = dm.ten || dm.tenDanhMuc;
            if (ten) mapDanhMuc[ten] = { ten: ten, doanhThu: 0, soLuong: 0 };
        });

        ds.forEach(hd => {
            (hd.danhSachMon || []).forEach(m => {
                const tenDm = m.danhMucTen || 'Món khác';
                if (!mapDanhMuc[tenDm]) mapDanhMuc[tenDm] = { ten: tenDm, doanhThu: 0, soLuong: 0 };
                mapDanhMuc[tenDm].doanhThu += Number(m.thanhTien || 0);
                mapDanhMuc[tenDm].soLuong += Number(m.soLuong || 1);
            });
        });

        const ketQua = Object.values(mapDanhMuc).sort((a, b) => b.doanhThu - a.doanhThu);
        const tongAll = ketQua.reduce((s, d) => s + d.doanhThu, 0);
        ketQua.forEach(d => {
            d.phanTram = tongAll > 0 ? Math.round((d.doanhThu / tongAll) * 100) : 0;
        });
        return ketQua;
    }

    /**
     * US-127: Bảng xếp hạng Top món ăn bán chạy nhất
     */
    async layTopMonBanChay(gioiHan = 5) {
        const ds = await this.layDanhSachHoaDon();
        const mapMon = {};

        ds.forEach(hd => {
            (hd.danhSachMon || []).forEach(m => {
                const key = m.monAnId || m.monId || m.tenMon;
                if (!key) return;
                if (!mapMon[key]) {
                    mapMon[key] = {
                        monId: m.monAnId || m.monId || m.id,
                        tenMon: m.tenMon,
                        danhMucTen: m.danhMucTen || '',
                        soLuongBan: 0,
                        tongTien: 0
                    };
                }
                mapMon[key].soLuongBan += Number(m.soLuong || 1);
                mapMon[key].tongTien += Number(m.thanhTien || 0);
            });
        });

        let ketQua = Object.values(mapMon).sort((a, b) => b.soLuongBan - a.soLuongBan || b.tongTien - a.tongTien);

        // Nếu chưa phát sinh đơn bán, hiển thị các món ăn đặc sắc từ thực đơn
        if (ketQua.length === 0) {
            try {
                const dsMon = await this.layDanhSachMonAn();
                ketQua = (dsMon || []).slice(0, gioiHan).map(m => ({
                    monId: m.id,
                    tenMon: m.tenMon,
                    danhMucTen: m.tenDanhMuc || '',
                    soLuongBan: 0,
                    tongTien: 0
                }));
            } catch (e) {}
        }

        return ketQua.slice(0, gioiHan);
    }

    /**
     * US-128: Thống kê các món ăn ít người gọi để tối ưu thực đơn
     */
    async layThongKeMonBanCham(gioiHan = 5) {
        const dsMonThucDon = await this.layDanhSachMonAn();
        const topBan = await this.layTopMonBanChay(100);
        const mapDaBan = {};
        topBan.forEach(m => {
            if (m.tenMon) mapDaBan[m.tenMon.toLowerCase().trim()] = m.soLuongBan;
        });

        const dsCham = (dsMonThucDon || []).map(m => {
            const tenMonNorm = (m.tenMon || '').toLowerCase().trim();
            const slBan = mapDaBan[tenMonNorm] || 0;
            return {
                id: m.id,
                tenMon: m.tenMon,
                giaBan: m.giaBan,
                soLuongBan: slBan,
                deXuat: slBan === 0 ? 'Chưa phát sinh lượt gọi nào trong ngày' : 'Sản lượng thấp, nên xem xét combo ưu đãi'
            };
        }).sort((a, b) => a.soLuongBan - b.soLuongBan).slice(0, gioiHan);

        return dsCham;
    }

    /**
     * US-129: Thống kê khung giờ cao điểm (Peak Hours)
     */
    async layThongKeKhungGioCaoDiem() {
        const ds = await this.layDanhSachHoaDon();
        const khungGio = [
            { gio: '08h - 11h', nhan: 'Buổi sáng', soDon: 0, doanhThu: 0 },
            { gio: '11h - 14h', nhan: 'Trưa cao điểm', soDon: 0, doanhThu: 0, laCaoDiem: true },
            { gio: '14h - 17h', nhan: 'Chiều xế', soDon: 0, doanhThu: 0 },
            { gio: '17h - 21h', nhan: 'Tối cao điểm', soDon: 0, doanhThu: 0, laCaoDiem: true },
            { gio: '21h - 23h', nhan: 'Đêm muộn', soDon: 0, doanhThu: 0 }
        ];

        ds.forEach(hd => {
            const g = (hd.gioThanhToanInt !== undefined) ? hd.gioThanhToanInt : 12;
            const tien = Number(hd.tongThanhToan || hd.tongTien || 0);
            if (g >= 8 && g < 11) { khungGio[0].soDon++; khungGio[0].doanhThu += tien; }
            else if (g >= 11 && g < 14) { khungGio[1].soDon++; khungGio[1].doanhThu += tien; }
            else if (g >= 14 && g < 17) { khungGio[2].soDon++; khungGio[2].doanhThu += tien; }
            else if (g >= 17 && g < 21) { khungGio[3].soDon++; khungGio[3].doanhThu += tien; }
            else { khungGio[4].soDon++; khungGio[4].doanhThu += tien; }
        });

        return khungGio;
    }

    /**
     * US-130: Thống kê tỷ lệ đơn hủy / món hủy từ thực tế vận hành
     */
    async layThongKeHuyMon() {
        const dsHuy = [];
        let tongMon = 0;
        let soMonHuy = 0;
        let giaTriHuy = 0;
        const lyDoHuyMap = {};

        // 1. Quét từ các đơn gọi món trong hệ thống
        const rawDon = localStorage.getItem(window.HANG_SO?.KHOA_LUU_TRU?.DANH_SACH_DON_GOI || 'quanmoc_ds_don_goi');
        const dsDon = rawDon ? JSON.parse(rawDon) : [];
        (dsDon || []).forEach(d => {
            (d.danhSachMon || []).forEach(m => {
                const sl = Number(m.soLuong || 1);
                tongMon += sl;
                if (m.trangThai === 'DA_HUY' || m.trangThai === 'TU_CHOI') {
                    const gia = Number(m.donGia || m.giaBan || 0);
                    const tien = Number(m.thanhTien) || (gia * sl);
                    soMonHuy += sl;
                    giaTriHuy += tien;
                    const lyDo = m.lyDoHuy || m.lyDoTuChoi || 'Hủy từ màn hình KDS';
                    lyDoHuyMap[lyDo] = (lyDoHuyMap[lyDo] || 0) + sl;

                    dsHuy.push({
                        id: m.id || Date.now(),
                        thoiGian: m.thoiGianCapNhat || d.thoiGianTao || new Date().toISOString(),
                        soBan: d.soBan || `Bàn ${d.banId}`,
                        tenMon: m.tenMon,
                        soLuong: sl,
                        thanhTien: tien,
                        lyDoHuy: lyDo,
                        nguoiHuy: 'Đầu bếp KDS'
                    });
                }
            });
        });

        // 2. Quét từ nhật ký hủy trả POS
        const rawPosHuy = localStorage.getItem('quanmoc_pos_nhat_ky_huy_tra');
        if (rawPosHuy) {
            try {
                const dsPosHuy = JSON.parse(rawPosHuy);
                if (Array.isArray(dsPosHuy)) {
                    dsPosHuy.forEach(h => {
                        const sl = Number(h.soLuong || 1);
                        const tien = Number(h.thanhTien || 0);
                        soMonHuy += sl;
                        giaTriHuy += tien;
                        const lyDo = h.lyDo || h.lyDoHuy || 'Hủy tại quầy POS';
                        lyDoHuyMap[lyDo] = (lyDoHuyMap[lyDo] || 0) + sl;

                        dsHuy.push({
                            id: h.id || Date.now(),
                            thoiGian: h.thoiGian || new Date().toISOString(),
                            soBan: h.soBan || 'Bàn POS',
                            tenMon: h.tenMon,
                            soLuong: sl,
                            thanhTien: tien,
                            lyDoHuy: lyDo,
                            nguoiHuy: h.nhanVien || 'Thu ngân POS'
                        });
                    });
                }
            } catch (e) {
                console.warn('Lỗi đọc nhật ký hủy POS:', e);
            }
        }

        const tyLeHuy = tongMon > 0 ? ((soMonHuy / tongMon) * 100).toFixed(1) : '0';

        return {
            tongMon,
            soMonHuy,
            giaTriHuy,
            tongThatThoat: giaTriHuy,
            tyLeHuy,
            dsHuy,
            lyDoHuyList: Object.entries(lyDoHuyMap).map(([lyDo, sl]) => ({ lyDo, soLuong: sl }))
        };
    }
}

// Khởi tạo đối tượng toàn cục
window.api = new ApiService();
