const yeuCauService = require('./yeuCauHoTro.service');
const { kiemTraTaoYeuCauHoTro, kiemTraCapNhatTrangThai } = require('./yeuCauHoTro.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function taoMoi(req, res, next) {
    try {
        const loiValidation = kiemTraTaoYeuCauHoTro(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const yeuCauMoi = await yeuCauService.taoYeuCau(req.body);
        return phanHoiThanhCong(res, yeuCauMoi, 'Yêu cầu của quý khách đã được gửi tới nhân viên!', 201);
    } catch (loi) {
        next(loi);
    }
}

async function layDanhSach(req, res, next) {
    try {
        const { trangThai, banId } = req.query;
        const danhSach = await yeuCauService.layDanhSachYeuCau({ trangThai, banId });
        return phanHoiThanhCong(res, danhSach, 'Lấy danh sách yêu cầu hỗ trợ thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const yeuCau = await yeuCauService.layChiTietYeuCau(id);
        return phanHoiThanhCong(res, yeuCau, 'Lấy chi tiết yêu cầu hỗ trợ thành công');
    } catch (loi) {
        next(loi);
    }
}

async function doiTrangThai(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraCapNhatTrangThai(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const nguoiXuLyId = req.nguoiDung ? req.nguoiDung.taiKhoanId : null;
        const yeuCauCapNhat = await yeuCauService.capNhatTrangThaiYeuCau(id, req.body.trangThai, nguoiXuLyId);
        return phanHoiThanhCong(res, yeuCauCapNhat, 'Cập nhật trạng thái yêu cầu thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    taoMoi,
    layDanhSach,
    layChiTiet,
    doiTrangThai
};
