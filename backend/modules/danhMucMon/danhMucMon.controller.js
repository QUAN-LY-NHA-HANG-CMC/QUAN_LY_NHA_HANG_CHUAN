const danhMucService = require('./danhMucMon.service');
const { kiemTraTaoDanhMuc, kiemTraCapNhatDanhMuc } = require('./danhMucMon.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layTatCa(req, res, next) {
    try {
        const danhSach = await danhMucService.layTatCaDanhMuc();
        return phanHoiThanhCong(res, danhSach, 'Lấy danh sách danh mục thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const danhMuc = await danhMucService.layChiTietDanhMuc(id);
        return phanHoiThanhCong(res, danhMuc, 'Lấy thông tin danh mục thành công');
    } catch (loi) {
        next(loi);
    }
}

async function taoMoi(req, res, next) {
    try {
        const loiValidation = kiemTraTaoDanhMuc(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const danhMucMoi = await danhMucService.taoDanhMucMoi(req.body);
        return phanHoiThanhCong(res, danhMucMoi, 'Tạo danh mục món ăn thành công', 201);
    } catch (loi) {
        next(loi);
    }
}

async function capNhat(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraCapNhatDanhMuc(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const danhMucCapNhat = await danhMucService.capNhatDanhMuc(id, req.body);
        return phanHoiThanhCong(res, danhMucCapNhat, 'Cập nhật danh mục thành công');
    } catch (loi) {
        next(loi);
    }
}

async function xoa(req, res, next) {
    try {
        const { id } = req.params;
        await danhMucService.xoaDanhMuc(id);
        return phanHoiThanhCong(res, null, 'Xóa danh mục món ăn thành công');
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
