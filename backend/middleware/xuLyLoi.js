const { phanHoiLoi } = require('../tienIch/dinhDangPhanHoi');

function xuLyLoi(loi, req, res, next) {
    console.error('Lỗi hệ thống:', loi);
    const maTrangThai = loi.status || loi.statusCode || 500;
    const thongDiep = loi.message || 'Lỗi máy chủ nội bộ';
    return phanHoiLoi(res, thongDiep, maTrangThai, loi.duLieuLoi || null);
}

module.exports = xuLyLoi;
