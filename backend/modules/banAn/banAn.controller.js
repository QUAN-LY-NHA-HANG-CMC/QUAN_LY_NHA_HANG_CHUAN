const banAnService = require('./banAn.service');
const { kiemTraTaoBanAn, kiemTraCapNhatBanAn } = require('./banAn.validation');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layTatCa(req, res, next) {
    try {
        const { khuVucId, trangThai } = req.query;
        const danhSach = await banAnService.layDanhSachBanAn({ khuVucId, trangThai });
        return phanHoiThanhCong(res, danhSach, 'Lấy danh sách bàn ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const ban = await banAnService.layChiTietBanAn(id);
        return phanHoiThanhCong(res, ban, 'Lấy chi tiết bàn ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function taoMoi(req, res, next) {
    try {
        const loiValidation = kiemTraTaoBanAn(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const banMoi = await banAnService.taoBanAn(req.body);
        return phanHoiThanhCong(res, banMoi, 'Tạo bàn ăn và mã QR thành công', 201);
    } catch (loi) {
        next(loi);
    }
}

async function capNhatTrangThai(req, res, next) {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;
        const banAnModel = require('./banAn.model');
        const ban = await banAnModel.layTheoId(id);
        if (!ban) {
            return phanHoiLoi(res, 'Không tìm thấy bàn ăn', 404);
        }
        const trangThaiChuan = {
            'TRONG': 'Trong',
            'DANG_DUNG': 'DangPhucVu',
            'CHO_THANH_TOAN': 'ChoThanhToan',
            'CAN_HO_TRO': 'CanHoTro',
            'TAM_KHOA': 'TamKhoa'
        }[trangThai] || trangThai;
        const banCapNhat = await banAnModel.capNhat(id, { trangThai: trangThaiChuan });
        return phanHoiThanhCong(res, banCapNhat, 'Cập nhật trạng thái bàn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function capNhat(req, res, next) {
    try {
        const { id } = req.params;
        const loiValidation = kiemTraCapNhatBanAn(req.body);
        if (loiValidation.length > 0) {
            return phanHoiLoi(res, loiValidation.join(', '), 400);
        }

        const banCapNhat = await banAnService.capNhatBanAn(id, req.body);
        return phanHoiThanhCong(res, banCapNhat, 'Cập nhật bàn ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function xoa(req, res, next) {
    try {
        const { id } = req.params;
        await banAnService.xoaBanAn(id);
        return phanHoiThanhCong(res, null, 'Xóa bàn ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layQr(req, res, next) {
    try {
        const { id } = req.params;
        const duLieuQr = await banAnService.layMaQrBanAn(id);
        return phanHoiThanhCong(res, duLieuQr, 'Lấy mã QR bàn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function lamMoiQr(req, res, next) {
    try {
        const { id } = req.params;
        const banCapNhat = await banAnService.lamMoiTokenQr(id);
        return phanHoiThanhCong(res, banCapNhat, 'Làm mới mã bảo mật QR bàn thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layQrKhuVuc(req, res, next) {
    try {
        const { khuVucId } = req.params;
        const danhSachQr = await banAnService.layQrTatCaBanTheoKhuVuc(khuVucId);
        return phanHoiThanhCong(res, danhSachQr, 'Lấy danh sách mã QR theo khu vực thành công');
    } catch (loi) {
        next(loi);
    }
}

async function dongBo(req, res, next) {
    try {
        const { danhSach } = req.body;
        const banAnModel = require('./banAn.model');
        const dsMoi = await banAnModel.dongBoDanhSach(Array.isArray(danhSach) ? danhSach : (Array.isArray(req.body) ? req.body : []));
        return phanHoiThanhCong(res, dsMoi, 'Đồng bộ danh sách bàn ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    layTatCa,
    capNhatTrangThai,
    layChiTiet,
    taoMoi,
    capNhat,
    xoa,
    layQr,
    lamMoiQr,
    layQrKhuVuc,
    dongBo
};
