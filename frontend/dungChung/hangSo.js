/**
 * HẰNG SỐ DÙNG CHUNG PHÍA FRONTEND (hangSo.js)
 * Dự án Quản lý Nhà hàng & Gọi món QR (Quán Mộc)
 * Phụ trách Sprint 1: Quân (Bàn & Thực đơn) và Phong (Admin Core, Auth, Nhân sự, Phân quyền, Cấu hình)
 */

const HANG_SO = {
    // Cấu hình máy chủ API
    API_BASE_URL: 'http://localhost:3001/api',
    
    // Khóa lưu trữ LocalStorage
    KHOA_LUU_TRU: {
        ACCESS_TOKEN: 'quanmoc_access_token',
        THONG_TIN_NGUOI_DUNG: 'quanmoc_nguoi_dung',
        DANH_SACH_KHU_VUC: 'quanmoc_ds_khu_vuc',
        DANH_SACH_BAN: 'quanmoc_ds_ban',
        DANH_SACH_DANH_MUC: 'quanmoc_ds_danh_muc',
        DANH_SACH_MON_AN: 'quanmoc_ds_mon_an',
        CAU_HINH_QUAN: 'quanmoc_cau_hinh_quan',
        // Sprint 1 - Phần việc của Phong
        DANH_SACH_NHAN_VIEN: 'quanmoc_ds_nhan_vien',
        DANH_SACH_VAI_TRO: 'quanmoc_ds_vai_tro',
        LICH_SU_PHAN_QUYEN: 'quanmoc_ls_phan_quyen',
        NHAT_KY_HE_THONG: 'quanmoc_nhat_ky_he_thong',
        CAU_HINH_HE_THONG: 'quanmoc_cau_hinh_he_thong',
        // Sprint 2 - Phần việc của Phong (Đặt món, Theo dõi đơn, Hỗ trợ tại bàn & Real-time)
        DANH_SACH_DON_GOI: 'quanmoc_ds_don_goi',
        PHIEN_BAN_HIEN_TAI: 'quanmoc_phien_ban_hien_tai',
        DANH_SACH_YEU_CAU_HO_TRO: 'quanmoc_ds_yeu_cau_ho_tro',
        GIO_HANG_TEMPORARY: 'quanmoc_gio_hang_tam'
    },

    // Trạng thái bàn ăn (Rule 2: Tiếng Việt rõ nghĩa)
    TRANG_THAI_BAN: {
        TRONG: { ma: 'TRONG', ten: 'Bàn trống', mau: '#10B981', lopBadge: 'badge-xanh-la' },
        DANG_DUNG: { ma: 'DANG_DUNG', ten: 'Đang có khách', mau: '#3B82F6', lopBadge: 'badge-xanh-duong' },
        CHO_THANH_TOAN: { ma: 'CHO_THANH_TOAN', ten: 'Chờ thanh toán', mau: '#F59E0B', lopBadge: 'badge-vang' },
        CAN_HO_TRO: { ma: 'CAN_HO_TRO', ten: 'Cần hỗ trợ', mau: '#EF4444', lopBadge: 'badge-do' },
        TAM_KHOA: { ma: 'TAM_KHOA', ten: 'Tạm khóa', mau: '#6B7280', lopBadge: 'badge-xam' }
    },

    // Trạng thái món ăn
    TRANG_THAI_MON: {
        DANG_BAN: { ma: 'DANG_BAN', ten: 'Đang bán', giaTri: 1, lopBadge: 'badge-xanh-la' },
        TAM_HET: { ma: 'TAM_HET', ten: 'Tạm hết hàng', giaTri: 0, lopBadge: 'badge-cam' },
        DA_AN: { ma: 'DA_AN', ten: 'Đã ẩn (Ngừng bán)', giaTri: -1, lopBadge: 'badge-xam' }
    },

    // Trạng thái món đã gọi trong đơn (Sprint 2 - US-066, US-068, US-069)
    TRANG_THAI_MON_GOI: {
        CHO_XAC_NHAN: { ma: 'CHO_XAC_NHAN', ten: 'Chờ xác nhận', mau: '#F59E0B', icon: '⏳', lopBadge: 'badge-vang', moTa: 'Đơn mới gửi, đang chờ Bếp/Thu ngân tiếp nhận' },
        DANG_CHE_BIEN: { ma: 'DANG_CHE_BIEN', ten: 'Đang chế biến', mau: '#3B82F6', icon: '👨‍🍳', lopBadge: 'badge-xanh-duong', moTa: 'Bếp đang chế biến món ăn' },
        DA_XONG: { ma: 'DA_XONG', ten: 'Đã nấu xong', mau: '#8B5CF6', icon: '🔔', lopBadge: 'badge-tim', moTa: 'Món ăn đã xong, chờ nhân viên bưng lên bàn' },
        DA_LEN_MON: { ma: 'DA_LEN_MON', ten: 'Đã lên món', mau: '#10B981', icon: '✅', lopBadge: 'badge-xanh-la', moTa: 'Món ăn đã được phục vụ tại bàn' },
        DA_HUY: { ma: 'DA_HUY', ten: 'Đã hủy', mau: '#EF4444', icon: '❌', lopBadge: 'badge-do', moTa: 'Khách yêu cầu hủy khi chưa nấu' },
        TU_CHOI: { ma: 'TU_CHOI', ten: 'Bếp từ chối (Hết món)', mau: '#DC2626', icon: '🚫', lopBadge: 'badge-do', moTa: 'Bếp từ chối do vừa hết nguyên liệu' }
    },

    // Lý do gọi nhân viên hỗ trợ tại bàn (Sprint 2 - US-071, US-072)
    LY_DO_HO_TRO: [
        { ma: 'THEM_BAT_DUA', ten: '🥢 Xin thêm bát, đĩa, đũa, thìa' },
        { ma: 'THEM_KHAN_GIAY', ten: '🧻 Xin thêm khăn giấy, tăm tiệt trùng' },
        { ma: 'THEM_DA_LANH', ten: '🧊 Xin thêm đá lạnh / nước lọc' },
        { ma: 'THEM_GIA_VI', ten: '🌶️ Xin thêm nước chấm, ớt, chanh, tỏi' },
        { ma: 'DON_BAN', ten: '🧹 Yêu cầu dọn bàn / lau bàn sạch' },
        { ma: 'GAP_NHAN_VIEN', ten: '🙋 Khách cần nhân viên hỗ trợ trực tiếp' }
    ],

    // Phương thức thanh toán yêu cầu (Sprint 2 - US-073)
    HINH_THUC_THANH_TOAN_YEU_CAU: {
        TIEN_MAT: { ma: 'TIEN_MAT', ten: '💵 Tiền mặt', moTa: 'Thanh toán trực tiếp bằng tiền mặt tại bàn' },
        CHUYEN_KHOAN: { ma: 'CHUYEN_KHOAN', ten: '💳 Chuyển khoản (VietQR)', moTa: 'Quét mã VietQR chuyển khoản ngân hàng' }
    },

    // Trạng thái nhân viên (Sprint 1 - US-011 -> US-014)
    TRANG_THAI_NHAN_VIEN: {
        DANG_LAM_VIEC: { ma: 'DANG_LAM_VIEC', ten: 'Đang làm việc', lopBadge: 'badge-xanh-la' },
        DA_KHOA: { ma: 'DA_KHOA', ten: 'Đã khóa / Nghỉ việc', lopBadge: 'badge-xam' }
    },

    // Danh sách Vai trò chuẩn (Sprint 1 - US-015 -> US-021)
    VAI_TRO: {
        QUAN_LY: { ma: 'QUAN_LY', ten: 'Quản lý / Chủ quán', mau: '#B85D19', lopBadge: 'badge-cam' },
        THU_NGAN: { ma: 'THU_NGAN', ten: 'Thu ngân', mau: '#2563EB', lopBadge: 'badge-xanh-duong' },
        BEP: { ma: 'BEP', ten: 'Đầu bếp', mau: '#D97706', lopBadge: 'badge-vang' },
        PHUC_VU: { ma: 'PHUC_VU', ten: 'Nhân viên phục vụ', mau: '#10B981', lopBadge: 'badge-xanh-la' }
    },

    // Danh mục mã quyền hệ thống (Permission Matrix)
    DANH_MUC_QUYEN: [
        {
            nhom: 'Quản lý Sơ đồ Bàn & Mã QR',
            quyen: [
                { ma: 'BAN_XEM', ten: 'Xem sơ đồ bàn & QR', moTa: 'Xem danh sách bàn ăn và mã QR từng bàn' },
                { ma: 'BAN_SUA', ten: 'Thêm, sửa, xóa bàn & khu vực', moTa: 'Thao tác CRUD bàn và khu vực phục vụ' },
                { ma: 'BAN_IN_QR', ten: 'Tải và in mã QR Standee', moTa: 'In ấn standee mã QR để bàn' }
            ]
        },
        {
            nhom: 'Quản lý Thực đơn & Món ăn',
            quyen: [
                { ma: 'MON_XEM', ten: 'Xem thực đơn', moTa: 'Xem danh sách món ăn, giá và danh mục' },
                { ma: 'MON_SUA', ten: 'Thêm, sửa, xóa món ăn & danh mục', moTa: 'Quản lý món ăn, tùy chọn size và topping' },
                { ma: 'MON_TRANG_THAI', ten: 'Bật/tắt trạng thái Còn/Hết món', moTa: 'Thao tác bật tắt nhanh trạng thái món' }
            ]
        },
        {
            nhom: 'Thu ngân & Hóa đơn POS',
            quyen: [
                { ma: 'THU_NGAN_XEM', ten: 'Xem hóa đơn & sơ đồ phục vụ', moTa: 'Theo dõi tiến trình thanh toán của các bàn' },
                { ma: 'THU_NGAN_THANH_TOAN', ten: 'Thanh toán & Đóng phiên bàn', moTa: 'Thu tiền, chiết khấu và giải phóng bàn' },
                { ma: 'THU_NGAN_IN_BILL', ten: 'In phiếu tạm tính & hóa đơn', moTa: 'Xuất bill thanh toán cho khách hàng' }
            ]
        },
        {
            nhom: 'Điều phối Bếp (KDS)',
            quyen: [
                { ma: 'BEP_XEM', ten: 'Xem màn hình điều phối món', moTa: 'Tiếp nhận đơn gọi món thời gian thực' },
                { ma: 'BEP_CAP_NHAT', ten: 'Cập nhật tiến độ nấu nướng', moTa: 'Chuyển trạng thái Đang nấu / Hoàn thành' }
            ]
        },
        {
            nhom: 'Nhân sự & Phân quyền',
            quyen: [
                { ma: 'NHAN_VIEN_XEM', ten: 'Xem danh sách nhân sự', moTa: 'Xem hồ sơ danh sách nhân viên' },
                { ma: 'NHAN_VIEN_SUA', ten: 'Thêm, sửa, khóa tài khoản nhân viên', moTa: 'Quản trị tài khoản và reset mật khẩu' },
                { ma: 'PHAN_QUYEN_SUA', ten: 'Cấu hình ma trận phân quyền', moTa: 'Thiết lập vai trò và gán quyền chức năng' }
            ]
        },
        {
            nhom: 'Quản trị hệ thống & Cấu hình',
            quyen: [
                { ma: 'CAU_HINH_XEM', ten: 'Xem cấu hình nhà hàng & logs', moTa: 'Xem thông tin quán, thuế VAT, ngân hàng' },
                { ma: 'CAU_HINH_SUA', ten: 'Chỉnh sửa cấu hình & ngân hàng', moTa: 'Thay đổi thông tin nhà hàng, VietQR, VAT' }
            ]
        }
    ],

    // Thông tin nhà hàng mặc định (fallback khi chưa kết nối API)
    NHA_HANG_MAC_DINH: {
        ten: 'Nhà Hàng Quán Mộc',
        chiNhanh: 'Chi nhánh 1 (Quận 1)',
        diaChi: '123 Đường Ẩm Thực, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        hotline: '028 1234 5678',
        email: 'lienhe@quanmoc.com',
        wifiTen: 'QuanMoc_KhachHang',
        wifiMatKhau: 'quanmoc2026',
        khauHieu: 'Hương vị truyền thống, đậm đà tình thân',
        gioHoatDong: '09:00 - 22:30',
        thueVat: 8, // 8% VAT
        phiPhucVu: 0, // 0%
        nganHang: {
            maNganHang: 'VCB',
            tenNganHang: 'Vietcombank - Ngân hàng Ngoại Thương Việt Nam',
            soTaiKhoan: '9988776655',
            chuTaiKhoan: 'NHA HANG QUAN MOC',
            cuPhapChuyenKhoan: 'QUANMOC {SO_BAN}'
        }
    }
};

if (typeof window !== 'undefined') {
    window.HANG_SO = HANG_SO;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HANG_SO;
}
