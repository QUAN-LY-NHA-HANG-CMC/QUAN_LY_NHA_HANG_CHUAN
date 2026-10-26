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

const ungDung = express();

// Middleware cơ bản
ungDung.use(cors({
    origin: '*',
    credentials: true
}));
ungDung.use(express.json());
ungDung.use(express.urlencoded({ extended: true }));

// Cung cấp tệp tĩnh (hình ảnh món ăn tải lên)
ungDung.use('/tepTaiLen', express.static(path.join(__dirname, 'tepTaiLen')));

// Tuyến đường kiểm tra sức khỏe hệ thống
ungDung.get('/api/kiem-tra-he-thong', (req, res) => {
    res.json({
        ok: true,
        thoiGian: new Date().toISOString(),
        duAn: 'Quản lý Nhà hàng & Gọi món QR (QUANMOC.COM)',
        tacGia: 'Minh - Backend API',
        sprint: 'Sprint 2 (E-Menu QR, Giỏ hàng & Hỗ trợ)'
    });
});

// API Sprint 1
ungDung.use('/api/danh-muc-mon', danhMucModule.router);
ungDung.use('/api/thuc-don', thucDonModule.router);
ungDung.use('/api/khu-vuc', khuVucModule.router);
ungDung.use('/api/ban-an', banAnModule.router);
ungDung.use('/api/nhan-vien', nhanVienModule.router);

// API Sprint 2 (Mới bổ sung)
ungDung.use('/api/public/e-menu', thucDonPublicRoutes);
ungDung.use('/api/gio-hang', gioHangModule.router);
ungDung.use('/api/yeu-cau-ho-tro', yeuCauHoTroModule.router);

// Xử lý tuyến đường không tồn tại (404)
ungDung.use((req, res) => {
    return phanHoiLoi(res, `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại`, 404);
});

// Xử lý lỗi tập trung
ungDung.use(xuLyLoi);

module.exports = ungDung;
