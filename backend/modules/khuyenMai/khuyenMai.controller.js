const khuyenMaiService = require('./khuyenMai.service');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layDanhSach(req, res, next) {
    try {
        const { trangThai, tuKhoa } = req.query;
        const ketQua = await khuyenMaiService.layDanhSachKhuyenMai({ trangThai, tuKhoa });
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách khuyến mãi thành công');
    } catch (e) {
        next(e);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const ketQua = await khuyenMaiService.layChiTietKhuyenMai(id);
        return phanHoiThanhCong(res, ketQua, 'Lấy chi tiết khuyến mãi thành công');
    } catch (e) {
        next(e);
    }
}

async function taoMoi(req, res, next) {
    try {
        const ketQua = await khuyenMaiService.taoKhuyenMai(req.body);
        return phanHoiThanhCong(res, ketQua, 'Tạo chương trình khuyến mãi mới thành công', 201);
    } catch (e) {
        next(e);
    }
}

async function capNhat(req, res, next) {
    try {
        const { id } = req.params;
        const ketQua = await khuyenMaiService.capNhatKhuyenMai(id, req.body);
        return phanHoiThanhCong(res, ketQua, 'Cập nhật chương trình khuyến mãi thành công');
    } catch (e) {
        next(e);
    }
}

async function xoa(req, res, next) {
    try {
        const { id } = req.params;
        await khuyenMaiService.xoaKhuyenMai(id);
        return phanHoiThanhCong(res, null, 'Xóa chương trình khuyến mãi thành công');
    } catch (e) {
        next(e);
    }
}

async function kiemTraVaApDung(req, res, next) {
    try {
        const { maKhuyenMai, tongTienTamTinh } = req.body;
        const ketQua = await khuyenMaiService.kiemTraVaApDungMa({ maKhuyenMai, tongTienTamTinh });
        return phanHoiThanhCong(res, ketQua, ketQua.thongBao);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    layDanhSach,
    layChiTiet,
    taoMoi,
    capNhat,
    xoa,
    kiemTraVaApDung
};
