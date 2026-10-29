const danhGiaService = require('./danhGia.service');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

async function guiDanhGia(req, res, next) {
    try {
        const ketQua = await danhGiaService.guiDanhGia(req.body);
        return phanHoiThanhCong(res, ketQua, 'Gửi đánh giá và phản hồi thành công! Cảm ơn quý khách.', 201);
    } catch (e) {
        next(e);
    }
}

async function layDanhSach(req, res, next) {
    try {
        const { soSao, trangThai, tuNgay, denNgay, canXuLyGap } = req.query;
        const ketQua = await danhGiaService.layDanhSach({ soSao, trangThai, tuNgay, denNgay, canXuLyGap });
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách đánh giá thành công');
    } catch (e) {
        next(e);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const ketQua = await danhGiaService.layChiTiet(id);
        return phanHoiThanhCong(res, ketQua, 'Lấy chi tiết đánh giá thành công');
    } catch (e) {
        next(e);
    }
}

async function phanHoi(req, res, next) {
    try {
        const { id } = req.params;
        const { phanHoiCuaQuanLy, nguoiPhanHoiId, tenNguoiPhanHoi } = req.body;
        const ketQua = await danhGiaService.phanHoiDanhGia(id, {
            phanHoiCuaQuanLy,
            nguoiPhanHoiId,
            tenNguoiPhanHoi
        });
        return phanHoiThanhCong(res, ketQua, 'Gửi phản hồi của Quản lý thành công');
    } catch (e) {
        next(e);
    }
}

async function thongKe(req, res, next) {
    try {
        const ketQua = await danhGiaService.thongKeDiemDanhGia();
        return phanHoiThanhCong(res, ketQua, 'Thống kê điểm đánh giá thành công');
    } catch (e) {
        next(e);
    }
}

module.exports = {
    guiDanhGia,
    layDanhSach,
    layChiTiet,
    phanHoi,
    thongKe
};
