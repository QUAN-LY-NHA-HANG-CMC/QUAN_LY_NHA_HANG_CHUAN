/**
 * TIỆN ÍCH DỌN DẸP DỮ LIỆU MẪU (xoaDuLieuMau.js)
 * Xóa toàn bộ dữ liệu mẫu (thực đơn, bàn ăn, khu vực, danh mục, đơn món, hóa đơn, kds, giỏ hàng...)
 * trong cả CSDL SQLite và các tệp JSON lưu trữ bền vững.
 * Giữ lại tài khoản quản trị (quanly/123456), vai trò và cấu hình hệ thống để người dùng tự tạo dữ liệu.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DUONG_DAN_SQLITE = path.join(__dirname, '../../database/quan_ly_nha_hang.sqlite');
const THU_MUC_DU_LIEU = path.join(__dirname, '../duLieu');

function xoaDuLieuMau() {
    console.log('🧹 Đang bắt đầu làm sạch toàn bộ dữ liệu mẫu...');

    // 1. Dọn dẹp trong CSDL SQLite
    try {
        if (fs.existsSync(DUONG_DAN_SQLITE)) {
            const db = new DatabaseSync(DUONG_DAN_SQLITE);
            db.exec('PRAGMA foreign_keys = OFF;');

            const cacBangCanXoa = [
                'chi_tiet_don_hang',
                'chi_tiet_don_hang_tuy_chon',
                'don_hang',
                'phien_phuc_vu',
                'chi_tiet_hoa_don',
                'hoa_don_khuyen_mai',
                'giao_dich_thanh_toan',
                'hoa_don',
                'hinh_anh_mon_an',
                'tuy_chon_mon',
                'nhom_tuy_chon_mon',
                'mon_an',
                'danh_muc_mon',
                'ma_qr_ban',
                'ban_an',
                'khu_vuc',
                'hang_doi_bep',
                'lich_su_mon_bep',
                'yeu_cau_ho_tro_ban',
                'yeu_cau_huy_tra_mon',
                'danh_gia_khach_hang',
                'phan_hoi_quan_ly',
                'ca_lam_viec',
                'bien_ban_giao_ca',
                'phieu_thu_chi_ca',
                'chuong_trinh_khuyen_mai',
                'ma_giam_gia',
                'gio_hang_item_tuy_chon',
                'gio_hang_item',
                'gio_hang',
                'lich_su_chuyen_ban',
                'lich_su_ghep_ban',
                'lich_su_that_thoat_mon',
                'lich_su_trang_thai_don_hang',
                'lich_su_xuat_bao_cao',
                'thong_ke_khung_gio',
                'thong_ke_mon_an',
                'tong_hop_doanh_thu_ngay',
                'tong_hop_doanh_thu_thang'
            ];

            for (const bang of cacBangCanXoa) {
                try {
                    db.exec(`DELETE FROM ${bang};`);
                } catch (e) {
                    // Bảng có thể chưa tồn tại, bỏ qua
                }
            }

            // Khởi tạo lại các khu vực mặc định cho nhà hàng
            db.exec(`
                INSERT INTO khu_vuc (id, ten_khu_vuc, ghi_chu, trang_thai) VALUES
                (1, 'Tầng 1', 'Khu vực tầng 1 trong nhà', 'HoatDong'),
                (2, 'Tầng 2', 'Khu vực tầng 2 lầu cao', 'HoatDong'),
                (3, 'Ngoài trời', 'Khu vực sân vườn ngoài trời thoáng mát', 'HoatDong'),
                (4, 'Phòng VIP', 'Khu vực phòng VIP máy lạnh riêng tư', 'HoatDong');
            `);

            db.exec('PRAGMA foreign_keys = ON;');
            console.log('✅ Đã xóa sạch dữ liệu mẫu trong CSDL SQLite (giữ lại tài khoản đăng nhập, vai trò & khu vực chuẩn).');
        }
    } catch (e) {
        console.error('❌ Lỗi khi dọn dẹp SQLite:', e.message);
    }

    // 2. Dọn dẹp trong các tệp JSON lưu trữ backend/duLieu/
    try {
        if (!fs.existsSync(THU_MUC_DU_LIEU)) {
            fs.mkdirSync(THU_MUC_DU_LIEU, { recursive: true });
        }

        const cacTepLamRong = ['thucDon', 'banAn', 'danhMucMon', 'donGoiMon'];
        for (const t of cacTepLamRong) {
            const p = path.join(THU_MUC_DU_LIEU, `${t}.json`);
            fs.writeFileSync(p, JSON.stringify([], null, 2), 'utf8');
            console.log(`✅ Đã đặt tệp backend/duLieu/${t}.json về mảng rỗng []`);
        }

        // Khởi tạo 4 khu vực chuẩn cho khuVuc.json
        const dsKhuVucChuan = [
            { id: 1, ma: 'KV_1', ten: 'Tầng 1', tenKhuVuc: 'Tầng 1', ghiChu: 'Khu vực tầng 1 trong nhà', thuTu: 1, trangThai: 'HoatDong' },
            { id: 2, ma: 'KV_2', ten: 'Tầng 2', tenKhuVuc: 'Tầng 2', ghiChu: 'Khu vực tầng 2 lầu cao', thuTu: 2, trangThai: 'HoatDong' },
            { id: 3, ma: 'KV_3', ten: 'Ngoài trời', tenKhuVuc: 'Ngoài trời', ghiChu: 'Khu vực sân vườn ngoài trời thoáng mát', thuTu: 3, trangThai: 'HoatDong' },
            { id: 4, ma: 'KV_4', ten: 'Phòng VIP', tenKhuVuc: 'Phòng VIP', ghiChu: 'Khu vực phòng VIP máy lạnh riêng tư', thuTu: 4, trangThai: 'HoatDong' }
        ];
        fs.writeFileSync(path.join(THU_MUC_DU_LIEU, 'khuVuc.json'), JSON.stringify(dsKhuVucChuan, null, 2), 'utf8');
        console.log('✅ Đã đặt tệp backend/duLieu/khuVuc.json về 4 khu vực chuẩn (Tầng 1, Tầng 2, Ngoài trời, Phòng VIP)');
    } catch (e) {
        console.error('❌ Lỗi khi dọn dẹp tệp JSON:', e.message);
    }

    console.log('🎉 Hoàn tất làm sạch! Hệ thống hiện tại hoàn toàn trống để bạn tự tạo dữ liệu.');
}

if (require.main === module) {
    xoaDuLieuMau();
}

module.exports = { xoaDuLieuMau };
