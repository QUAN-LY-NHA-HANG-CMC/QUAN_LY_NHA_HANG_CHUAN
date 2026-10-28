const { phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

function kiemTraTongHopHoaDon(req, res, next) {
    const { banId } = req.params;
    if (!banId || isNaN(Number(banId))) {
        return phanHoiLoi(res, 'Vui lòng cung cấp mã ID bàn ăn hợp lệ', 400);
    }
    next();
}

function kiemTraTachHoaDon(req, res, next) {
    const { danhSachMonTach } = req.body || {};
    if (!Array.isArray(danhSachMonTach) || danhSachMonTach.length === 0) {
        return phanHoiLoi(res, 'Vui lòng cung cấp danh sách món cần tách (danhSachMonTach)', 400);
    }
    next();
}

module.exports = {
    kiemTraTongHopHoaDon,
    kiemTraTachHoaDon
};
