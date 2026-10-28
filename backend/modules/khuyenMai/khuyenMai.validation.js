const { phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

function kiemTraTaoKhuyenMai(req, res, next) {
    const { maKhuyenMai, tenKhuyenMai, loai, giaTri } = req.body || {};

    if (!maKhuyenMai || !maKhuyenMai.trim()) {
        return phanHoiLoi(res, 'Vui lòng cung cấp mã khuyến mãi', 400);
    }

    if (!tenKhuyenMai || !tenKhuyenMai.trim()) {
        return phanHoiLoi(res, 'Vui lòng cung cấp tên chương trình khuyến mãi', 400);
    }

    if (!loai || !['SO_TIEN', 'PHAN_TRAM'].includes(loai)) {
        return phanHoiLoi(res, "Loại khuyến mãi phải là 'SO_TIEN' hoặc 'PHAN_TRAM'", 400);
    }

    if (giaTri === undefined || isNaN(Number(giaTri)) || Number(giaTri) <= 0) {
        return phanHoiLoi(res, 'Giá trị khuyến mãi phải là số dương lớn hơn 0', 400);
    }

    if (loai === 'PHAN_TRAM' && (Number(giaTri) <= 0 || Number(giaTri) > 100)) {
        return phanHoiLoi(res, 'Tỷ lệ phần trăm giảm giá phải nằm trong khoảng từ 1% đến 100%', 400);
    }

    next();
}

function kiemTraApDungMa(req, res, next) {
    const { maKhuyenMai, tongTienTamTinh } = req.body || {};

    if (!maKhuyenMai || !maKhuyenMai.trim()) {
        return phanHoiLoi(res, 'Vui lòng nhập mã khuyến mãi cần kiểm tra', 400);
    }

    if (tongTienTamTinh === undefined || isNaN(Number(tongTienTamTinh)) || Number(tongTienTamTinh) < 0) {
        return phanHoiLoi(res, 'Tổng tiền tạm tính của đơn hàng không hợp lệ', 400);
    }

    next();
}

module.exports = {
    kiemTraTaoKhuyenMai,
    kiemTraApDungMa
};
