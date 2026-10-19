/**
 * HẰNG SỐ DÙNG CHUNG PHÍA FRONTEND (hangSo.js)
 * Dự án Quản lý Nhà hàng & Gọi món QR (Quán Mộc)
 * Phụ trách: Quân (Frontend Lead - Client & POS)
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
        CAU_HINH_QUAN: 'quanmoc_cau_hinh_quan'
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

    // Thông tin nhà hàng mặc định (fallback khi chưa kết nối API)
    NHA_HANG_MAC_DINH: {
        ten: 'Nhà Hàng Quán Mộc',
        diaChi: '123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh',
        hotline: '028 1234 5678',
        wifiTen: 'QuanMoc_KhachHang',
        wifiMatKhau: 'quanmoc2026',
        khauHieu: 'Hương vị truyền thống, đậm đà tình thân',
        gioHoatDong: '09:00 - 22:30'
    }
};

if (typeof window !== 'undefined') {
    window.HANG_SO = HANG_SO;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HANG_SO;
}
