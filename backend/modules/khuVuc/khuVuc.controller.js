const khuVucService = require('./khuVuc.service');
const { kiemTraTaoKhuVuc, kiemTraCapNhatKhuVuc } = require('./khuVuc.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layTatCa(req, res, next) {
    try {
        const danhSach = await khuVucService.layTatCaKhuVuc();
        return phanHoiThanhCong(res, danhSach, 'Lấy danh sách khu vực thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const khuVuc = await khuVucService.layChiTietKhuVuc(id);
        return phanHoiThanhCong(res, khuVuc, 'Lấy chi tiết khu vực thành công');
    } catch (loi) {
        next(loi);
    }
}

async function taoMoi(req, res, next) {
    try {
        const loiValidation = kiemTraTaoKhuVuc(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const khuVucMoi = await khuVucService.taoKhuVuc(req.body);
        return phanHoiThanhCong(res, khuVucMoi, 'Tạo khu vực thành công', 201);
    } catch (loi) {
        next(loi);
    }
}

async function capNhat(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraCapNhatKhuVuc(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const khuVucCapNhat = await khuVucService.capNhatKhuVuc(id, req.body);
        return phanHoiThanhCong(res, khuVucCapNhat, 'Cập nhật khu vực thành công');
    } catch (loi) {
        next(loi);
    }
}

async function xoa(req, res, next) {
    try {
        const { id } = req.params;
        await khuVucService.xoaKhuVuc(id);
        return phanHoiThanhCong(res, null, 'Xóa khu vực thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    layTatCa,
    layChiTiet,
    taoMoi,
    capNhat,
    xoa
};
