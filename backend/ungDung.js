const path = require('path');
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

// Nạp các module phụ trách của Minh (Sprint 2)
const thucDonPublicRoutes = require('./modules/thucDon/thucDonPublic.routes');
const gioHangModule = require('./modules/gioHang');
const yeuCauHoTroModule = require('./modules/yeuCauHoTro');

// Nạp các module phụ trách của Minh (Sprint 3)
const khuyenMaiModule = require('./modules/khuyenMai');
const donGoiMonModule = require('./modules/donGoiMon');
const hoaDonModule = require('./modules/hoaDon');
const thanhToanModule = require('./modules/thanhToan');

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
ungDung.use('/tepTaiLen', express.static(path.join(__dirname, 'tepTaiLen')));

const nhanVienModel = require('./modules/nhanVien/nhanVien.model');
const { soSanhMatKhau } = require('./tienIch/maHoaMatKhau');

// Tuyến đường kiểm tra sức khỏe hệ thống
ungDung.get(['/api/kiem-tra-he-thong', '/api/kiem-tra-suc-khoe'], (req, res) => {
    res.json({
        ok: true,
        thoiGian: new Date().toISOString(),
        duAn: 'Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)',
        tacGia: 'Minh - Backend API',
        sprint: 'Sprint 2 (E-Menu QR, Giỏ hàng & Hỗ trợ)'
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

        // Chấp nhận mật khẩu test mặc định 123456
        if (!hopLe && matKhau === '123456') {
            hopLe = true;
        }

        if (!hopLe) {
            return phanHoiLoi(res, 'Tên đăng nhập hoặc mật khẩu không chính xác', 401);
        }

        const vaiTroMap = {
            'QuanLy': 'QUAN_LY',
            'ThuNgan': 'THU_NGAN',
            'Bep': 'BEP',
            'PhucVu': 'PHUC_VU'
        };

        const duLieuNguoiDung = {
            id: nv.id,
            tenDangNhap: nv.tenDangNhap,
            hoTen: nv.hoTen,
            email: nv.email || `${nv.tenDangNhap}@quanmoc.com`,
            soDienThoai: nv.soDienThoai || '',
            vaiTro: vaiTroMap[nv.vaiTro] || nv.vaiTro,
            trangThai: nv.trangThai
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

// API Sprint 2
ungDung.use('/api/public/e-menu', thucDonPublicRoutes);
ungDung.use('/api/gio-hang', gioHangModule.router);
ungDung.use('/api/yeu-cau-ho-tro', yeuCauHoTroModule.router);

// API Sprint 3 (Khuyến mãi, Đơn gọi món, Hóa đơn, Thanh toán & VietQR)
ungDung.use('/api/khuyen-mai', khuyenMaiModule.router);
ungDung.use('/api/don-goi-mon', donGoiMonModule.router);
ungDung.use('/api/hoa-don', hoaDonModule.router);
ungDung.use('/api/thanh-toan', thanhToanModule.router);

// Xử lý tuyến đường không tồn tại (404)
ungDung.use((req, res) => {
    return phanHoiLoi(res, `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại`, 404);
});

// Xử lý lỗi tập trung
ungDung.use(xuLyLoi);

module.exports = ungDung;
