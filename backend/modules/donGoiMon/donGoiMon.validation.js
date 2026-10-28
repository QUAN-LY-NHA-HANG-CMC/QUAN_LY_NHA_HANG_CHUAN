const { phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

function kiemTraTaoDon(req, res, next) {
    const { banId, danhSachMon } = req.body || {};

    if (!banId || isNaN(Number(banId))) {
        return phanHoiLoi(res, 'Vui lòng cung cấp mã ID bàn ăn hợp lệ', 400);
    }

    if (!Array.isArray(danhSachMon) || danhSachMon.length === 0) {
        return phanHoiLoi(res, 'Danh sách món ăn đặt hàng không được để trống', 400);
    }

    next();
}

module.exports = {
    kiemTraTaoDon
};
