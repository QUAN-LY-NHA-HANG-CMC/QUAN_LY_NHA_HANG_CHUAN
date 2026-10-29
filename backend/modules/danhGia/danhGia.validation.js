const { phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

function kiemTraGuiDanhGia(req, res, next) {
    const { diemDichVu } = req.body || {};

    if (diemDichVu === undefined || isNaN(Number(diemDichVu))) {
        return phanHoiLoi(res, 'Vui lòng cung cấp điểm đánh giá dịch vụ (1 - 5 sao)', 400);
    }

    const diem = Number(diemDichVu);
    if (diem < 1 || diem > 5) {
        return phanHoiLoi(res, 'Điểm đánh giá dịch vụ phải nằm trong thang điểm từ 1 đến 5 sao', 400);
    }

    next();
}

function kiemTraPhanHoi(req, res, next) {
    const { phanHoiCuaQuanLy } = req.body || {};

    if (!phanHoiCuaQuanLy || !phanHoiCuaQuanLy.trim()) {
        return phanHoiLoi(res, 'Vui lòng nhập nội dung phản hồi của quản lý', 400);
    }

    next();
}

module.exports = {
    kiemTraGuiDanhGia,
    kiemTraPhanHoi
};
