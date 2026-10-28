const { phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

function kiemTraThanhToanTienMat(req, res, next) {
    const { hoaDonId, soTienKhachDua } = req.body || {};

    if (!hoaDonId || isNaN(Number(hoaDonId))) {
        return phanHoiLoi(res, 'Vui lòng cung cấp mã ID hóa đơn cần thanh toán', 400);
    }

    if (soTienKhachDua === undefined || isNaN(Number(soTienKhachDua)) || Number(soTienKhachDua) <= 0) {
        return phanHoiLoi(res, 'Vui lòng nhập số tiền khách đưa hợp lệ', 400);
    }

    next();
}

function kiemTraTaoVietQr(req, res, next) {
    const { hoaDonId } = req.params;
    if (!hoaDonId || isNaN(Number(hoaDonId))) {
        return phanHoiLoi(res, 'Mã ID hóa đơn không hợp lệ', 400);
    }
    next();
}

function kiemTraXacNhanVietQr(req, res, next) {
    const { hoaDonId } = req.body || {};
    if (!hoaDonId || isNaN(Number(hoaDonId))) {
        return phanHoiLoi(res, 'Vui lòng cung cấp mã ID hóa đơn', 400);
    }
    next();
}

module.exports = {
    kiemTraThanhToanTienMat,
    kiemTraTaoVietQr,
    kiemTraXacNhanVietQr
};
