const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const cauHinhChung = require('./cauHinh/cauHinhChung');
const xuLyLoi = require('./middleware/xuLyLoi');
const { phanHoiLoi } = require('./tienIch/dinhDangPhanHoi');

// Nạp các module phụ trách của Minh (Sprint 1)
const danhMucModule = require('./modules/danhMucMon');
const thucDonModule = require('./modules/thucDon');
const khuVucModule = require('./modules/khuVuc');
const banAnModule = require('./modules/banAn');
const nhanVienModule = require('./modules/nhanVien');
const vaiTroModule = require('./modules/vaiTro');
const cauHinhModule = require('./modules/cauHinhNhaHang');

// Nạp các module phụ trách của Minh (Sprint 2)
const thucDonPublicRoutes = require('./modules/thucDon/thucDonPublic.routes');
const gioHangModule = require('./modules/gioHang');
const yeuCauHoTroModule = require('./modules/yeuCauHoTro');

// Nạp các module phụ trách của Minh (Sprint 3)
const khuyenMaiModule = require('./modules/khuyenMai');
const donGoiMonModule = require('./modules/donGoiMon');
const hoaDonModule = require('./modules/hoaDon');
const thanhToanModule = require('./modules/thanhToan');

// Nạp các module phụ trách của Minh (Sprint 4)
const danhGiaModule = require('./modules/danhGia');
const caLamViecModule = require('./modules/caLamViec');
const baoCaoModule = require('./modules/baoCao');

const ungDung = express();

// Middleware cơ bản
ungDung.use(cors({
    origin: '*',
    credentials: true
}));
ungDung.use(express.json());
ungDung.use(express.urlencoded({ extended: true }));

// Phục vụ giao diện tĩnh Frontend
ungDung.use(express.static(path.join(__dirname, '../frontend')));

// Cung cấp tệp tĩnh (hình ảnh món ăn tải lên)
ungDung.use('/tepTaiLen', express.static(path.join(__dirname, '../tepTaiLen')));

const nhanVienModel = require('./modules/nhanVien/nhanVien.model');
const { soSanhMatKhau } = require('./tienIch/maHoaMatKhau');
const { kiemTraKetNoiCoSoDuLieu } = require('./cauHinh/ketNoiCoSoDuLieu');

// Tuyến đường kiểm tra sức khỏe hệ thống & CSDL
ungDung.get(['/api/kiem-tra-he-thong', '/api/kiem-tra-suc-khoe'], async (req, res) => {
    const csdl = await kiemTraKetNoiCoSoDuLieu();
    res.json({
        ok: true,
        thoiGian: new Date().toISOString(),
        duAn: 'Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)',
        tacGia: 'Minh - Backend API & Phát - Database DBA',
        sprint: 'Sprint 4 (Kết nối CSDL SQLite hoàn chỉnh)',
        lanIp: cauHinhChung.lanIp,
        congBackend: cauHinhChung.congBackend,
        qrBaseUrl: cauHinhChung.qrBaseUrl,
        coSoDuLieu: csdl
    });
});

// Tuyến đường xác thực & đăng nhập tài khoản nhân viên (US-007)
ungDung.post(['/api/tai-khoan/dang-nhap', '/api/dang-nhap'], async (req, res) => {
    try {
        const { tenDangNhap, matKhau } = req.body || {};
        if (!tenDangNhap || !matKhau) {
            return phanHoiLoi(res, 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu', 400);
        }

        const nv = await nhanVienModel.layTheoTenDangNhap(tenDangNhap);
        if (!nv) {
            return phanHoiLoi(res, 'Tên đăng nhập hoặc mật khẩu không chính xác', 401);
        }

        if (nv.trangThai === 'Khoa') {
            return phanHoiLoi(res, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.', 403);
        }

        let hopLe = false;
        if (nv.matKhau && (nv.matKhau.startsWith('$2a$') || nv.matKhau.startsWith('$2b$'))) {
            hopLe = await soSanhMatKhau(matKhau, nv.matKhau);
        } else {
            hopLe = (matKhau === nv.matKhau);
        }

        if (!hopLe) {
            return phanHoiLoi(res, 'Tên đăng nhập hoặc mật khẩu không chính xác', 401);
        }

        const vaiTroMap = {
            'QuanLy': 'QUAN_LY',
            'QUAN_LY': 'QUAN_LY',
            'ThuNgan': 'THU_NGAN',
            'THU_NGAN': 'THU_NGAN',
            'Bep': 'BEP',
            'BEP': 'BEP',
            'PhucVu': 'PHUC_VU',
            'PHUC_VU': 'PHUC_VU'
        };

        const duLieuNguoiDung = {
            id: nv.id,
            tenDangNhap: nv.tenDangNhap,
            hoTen: nv.hoTen,
            email: nv.email || `${nv.tenDangNhap}@quanmoc.com`,
            soDienThoai: nv.soDienThoai || '',
            vaiTro: vaiTroMap[nv.vaiTro] || nv.vaiTro,
            trangThai: nv.trangThai,
            thoiGianDangNhap: new Date().toISOString()
        };

        return res.json({
            ok: true,
            data: {
                token: 'quanmoc_jwt_' + Date.now() + '_' + nv.id,
                nguoiDung: duLieuNguoiDung
            },
            msg: `Đăng nhập thành công! Chào mừng ${nv.hoTen}`
        });
    } catch (e) {
        return phanHoiLoi(res, 'Lỗi hệ thống khi đăng nhập', 500);
    }
});

// API Sprint 1
ungDung.use(['/api/danh-muc-mon', '/api/danh-muc'], danhMucModule.router);
ungDung.use('/api/thuc-don', thucDonModule.router);
ungDung.use('/api/khu-vuc', khuVucModule.router);
ungDung.use('/api/ban-an', banAnModule.router);
ungDung.use('/api/nhan-vien', nhanVienModule.router);
ungDung.use('/api/vai-tro', vaiTroModule.router);
ungDung.use('/api/cau-hinh', cauHinhModule.router);

// API Sprint 2
ungDung.use('/api/public/e-menu', thucDonPublicRoutes);
ungDung.use('/api/gio-hang', gioHangModule.router);
ungDung.use('/api/yeu-cau-ho-tro', yeuCauHoTroModule.router);

// API Sprint 3 (Khuyến mãi, Đơn gọi món, Hóa đơn, Thanh toán & VietQR)
ungDung.use('/api/khuyen-mai', khuyenMaiModule.router);
ungDung.use('/api/don-goi-mon', donGoiMonModule.router);
ungDung.use('/api/hoa-don', hoaDonModule.router);
ungDung.use('/api/thanh-toan', thanhToanModule.router);

// API Sprint 4 (Đánh giá & Phản hồi, Ca làm việc & Kết ca, Báo cáo thống kê & Xuất CSV)
ungDung.use('/api/danh-gia', danhGiaModule.router);
ungDung.use('/api/ca-lam-viec', caLamViecModule.router);
ungDung.use('/api/bao-cao', baoCaoModule.router);

// API TIỆN ÍCH KIỂM THỬ & DỌN DẸP DỮ LIỆU TEST (Hỗ trợ reset nhanh cả SQL và JSON)
ungDung.post(['/api/kiem-thu/reset', '/api/kiem-thu/xoa-du-lieu-test'], (req, res) => {
    try {
        const phanHe = req.body?.phanHe || 'ALL';
        const DUONG_DAN_SQLITE = path.join(__dirname, '../database/quan_ly_nha_hang.sqlite');
        const THU_MUC_DU_LIEU = path.join(__dirname, 'duLieu');

        // 1. Reset các tệp JSON lưu trữ
        if (phanHe === 'ALL' || phanHe === 'BAN' || phanHe === 'BEP') {
            const donGoiPath = path.join(THU_MUC_DU_LIEU, 'donGoiMon.json');
            fs.writeFileSync(donGoiPath, JSON.stringify([], null, 2), 'utf8');

            const banAnPath = path.join(THU_MUC_DU_LIEU, 'banAn.json');
            if (fs.existsSync(banAnPath)) {
                try {
                    const dsBan = JSON.parse(fs.readFileSync(banAnPath, 'utf8'));
                    if (Array.isArray(dsBan)) {
                        dsBan.forEach(b => {
                            b.trangThai = 'Trong';
                            b.daPhatSinhGiaoDich = false;
                            b.ngayCapNhat = new Date().toISOString();
                        });
                        fs.writeFileSync(banAnPath, JSON.stringify(dsBan, null, 2), 'utf8');
                    }
                } catch (e) {}
            }
        }

        // 2. Reset trong CSDL SQLite nếu có
        if (fs.existsSync(DUONG_DAN_SQLITE)) {
            try {
                const { DatabaseSync } = require('node:sqlite');
                const db = new DatabaseSync(DUONG_DAN_SQLITE);
                db.exec('PRAGMA foreign_keys = OFF;');

                if (phanHe === 'ALL') {
                    const cacBang = [
                        'chi_tiet_don_hang', 'chi_tiet_don_hang_tuy_chon', 'don_hang', 'phien_phuc_vu',
                        'chi_tiet_hoa_don', 'hoa_don_khuyen_mai', 'giao_dich_thanh_toan', 'hoa_don',
                        'hang_doi_bep', 'lich_su_mon_bep', 'yeu_cau_ho_tro_ban', 'yeu_cau_huy_tra_mon',
                        'ca_lam_viec', 'bien_ban_giao_ca', 'phieu_thu_chi_ca', 'gio_hang_item', 'gio_hang'
                    ];
                    for (const b of cacBang) {
                        try { db.exec(`DELETE FROM ${b};`); } catch (err) {}
                    }
                    try { db.exec("UPDATE ban_an SET trang_thai = 'TRONG';"); } catch (err) {}
                } else if (phanHe === 'BAN') {
                    try { db.exec("DELETE FROM chi_tiet_don_hang; DELETE FROM don_hang; DELETE FROM phien_phuc_vu; UPDATE ban_an SET trang_thai = 'TRONG';"); } catch (err) {}
                } else if (phanHe === 'BEP') {
                    try { db.exec("DELETE FROM hang_doi_bep; DELETE FROM lich_su_mon_bep;"); } catch (err) {}
                } else if (phanHe === 'HOA_DON') {
                    try { db.exec("DELETE FROM chi_tiet_hoa_don; DELETE FROM hoa_don_khuyen_mai; DELETE FROM giao_dich_thanh_toan; DELETE FROM hoa_don;"); } catch (err) {}
                } else if (phanHe === 'CA') {
                    try { db.exec("DELETE FROM ca_lam_viec; DELETE FROM bien_ban_giao_ca; DELETE FROM phieu_thu_chi_ca;"); } catch (err) {}
                }

                db.exec('PRAGMA foreign_keys = ON;');
            } catch (sqlErr) {
                console.warn('Lỗi khi dọn dẹp SQLite trong API reset:', sqlErr.message);
            }
        }

        return res.json({
            ok: true,
            msg: `Đã làm sạch dữ liệu kiểm thử phân hệ [${phanHe}] thành công!`
        });
    } catch (e) {
        return res.status(500).json({ ok: false, msg: 'Lỗi khi làm sạch dữ liệu kiểm thử: ' + e.message });
    }
});

// Phục vụ giao diện E-Menu Gọi món QR & Single Page Application (SPA)
ungDung.get(['/e-menu', '/e-menu/*', '/menu', '/menu/*', '/theo-doi-don', '/bep-kds', '/pos'], (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Fallback phục vụ Single Page Application cho các yêu cầu GET không phải API
ungDung.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/tepTaiLen')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Xử lý tuyến đường không tồn tại (404)
ungDung.use((req, res) => {
    return phanHoiLoi(res, `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại`, 404);
});

// Xử lý lỗi tập trung
ungDung.use(xuLyLoi);

module.exports = ungDung;
