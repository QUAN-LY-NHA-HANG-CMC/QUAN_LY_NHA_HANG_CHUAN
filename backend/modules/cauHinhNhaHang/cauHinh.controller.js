const cauHinhModel = require('./cauHinh.model');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layCauHinh(req, res, next) {
    try {
        const data = await cauHinhModel.layCauHinh();
        return phanHoiThanhCong(res, data, 'Lấy cấu hình nhà hàng thành công');
    } catch (e) {
        next(e);
    }
}

async function capNhatCauHinh(req, res, next) {
    try {
        const duLieuMoi = req.body;
        if (!duLieuMoi || typeof duLieuMoi !== 'object') {
            return phanHoiLoi(res, 'Dữ liệu cấu hình không hợp lệ', 400);
        }
        const data = await cauHinhModel.capNhatCauHinh(duLieuMoi);
        return phanHoiThanhCong(res, data, 'Cập nhật cấu hình nhà hàng thành công');
    } catch (e) {
        next(e);
    }
}

module.exports = {
    layCauHinh,
    capNhatCauHinh
};
