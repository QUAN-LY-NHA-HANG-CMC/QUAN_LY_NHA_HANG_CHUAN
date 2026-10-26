const gioHangService = require('./gioHang.service');
const { kiemTraDuLieuGioHang } = require('./gioHang.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function kiemTraVaTinhTien(req, res, next) {
    try {
        const loiValidation = kiemTraDuLieuGioHang(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const ketQua = await gioHangService.kiemTraVaTinhTienGioHang(req.body);
        return phanHoiThanhCong(res, ketQua, 'Giỏ hàng hợp lệ');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    kiemTraVaTinhTien
};
