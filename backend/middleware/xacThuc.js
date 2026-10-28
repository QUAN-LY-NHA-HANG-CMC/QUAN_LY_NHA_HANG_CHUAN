const { phanHoiLoi } = require('../tienIch/dinhDangPhanHoi');

function xacThuc(req, res, next) {
    const authorization = req.headers['authorization'];
    // Nếu chưa có token, cho phép chế độ development với tài khoản Quản lý mặc định để tiện test
    if (!authorization) {
        req.nguoiDung = {
            taiKhoanId: 1,
            tenDangNhap: 'quanly',
            vaiTro: 'QuanLy'
        };
        return next();
    }

    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization;
    if (!token) {
        return phanHoiLoi(res, 'Chưa được xác thực. Vui lòng đăng nhập.', 401);
    }

    // Gắn thông tin người dùng giả lập hoặc giải mã token
    req.nguoiDung = {
        taiKhoanId: 1,
        tenDangNhap: 'quanly',
        vaiTro: 'QuanLy'
    };
    next();
}

module.exports = xacThuc;
