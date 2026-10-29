const { phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

function kiemTraMoCa(req, res, next) {
    const { caId, tienDauCa } = req.body || {};

    if (!caId || isNaN(Number(caId))) {
        return phanHoiLoi(res, 'Vui lòng chọn ca làm việc hợp lệ', 400);
    }

    if (tienDauCa === undefined || isNaN(Number(tienDauCa)) || Number(tienDauCa) < 0) {
        return phanHoiLoi(res, 'Số tiền mặt đầu ca trong két không được âm', 400);
    }

    next();
}

function kiemTraThuChi(req, res, next) {
    const { loai, soTien, lyDo } = req.body || {};

    if (!loai || !['THU', 'CHI'].includes(loai)) {
        return phanHoiLoi(res, "Loại phiếu phải là 'THU' hoặc 'CHI'", 400);
    }

    if (soTien === undefined || isNaN(Number(soTien)) || Number(soTien) <= 0) {
        return phanHoiLoi(res, 'Số tiền phát sinh phải là số dương lớn hơn 0', 400);
    }

    if (!lyDo || !lyDo.trim()) {
        return phanHoiLoi(res, 'Vui lòng nhập lý do thu hoặc chi', 400);
    }

    next();
}

function kiemTraDongCa(req, res, next) {
    const { tienMatThucTeCuoiCa } = req.body || {};

    if (tienMatThucTeCuoiCa === undefined || isNaN(Number(tienMatThucTeCuoiCa)) || Number(tienMatThucTeCuoiCa) < 0) {
        return phanHoiLoi(res, 'Vui lòng nhập số tiền mặt kiểm đếm thực tế cuối ca', 400);
    }

    next();
}

module.exports = {
    kiemTraMoCa,
    kiemTraThuChi,
    kiemTraDongCa
};
