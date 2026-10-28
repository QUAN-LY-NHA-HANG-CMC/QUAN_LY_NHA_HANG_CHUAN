const hoaDonService = require('./hoaDon.service');
const hoaDonModel = require('./hoaDon.model');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

async function layDanhSach(req, res, next) {
    try {
        const { banId, trangThai, tuNgay, denNgay } = req.query;
        const ketQua = await hoaDonModel.layTatCa({ banId, trangThai, tuNgay, denNgay });
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách hóa đơn thành công');
    } catch (e) {
        next(e);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const ketQua = await hoaDonModel.layTheoId(id);
        if (!ketQua) {
            const loi = new Error('Hóa đơn không tồn tại');
            loi.status = 404;
            throw loi;
        }
        return phanHoiThanhCong(res, ketQua, 'Lấy chi tiết hóa đơn thành công');
    } catch (e) {
        next(e);
    }
}

async function tongHopHoaDon(req, res, next) {
    try {
        const { banId } = req.params;
        const ketQua = await hoaDonService.tongHopHoaDonTuBan(banId, req.body);
        return phanHoiThanhCong(res, ketQua, 'Tổng hợp hóa đơn bàn thành công', 200);
    } catch (e) {
        next(e);
    }
}

async function layPhieuTamTinh(req, res, next) {
    try {
        const { idHoacBanId } = req.params;
        const ketQua = await hoaDonService.layPhieuTamTinh(idHoacBanId);
        return phanHoiThanhCong(res, ketQua, 'Lấy thông tin phiếu tạm tính in ấn thành công');
    } catch (e) {
        next(e);
    }
}

async function tachHoaDon(req, res, next) {
    try {
        const { id } = req.params;
        const ketQua = await hoaDonService.tachHoaDon(id, req.body);
        return phanHoiThanhCong(res, ketQua, 'Tách hóa đơn bàn thành công');
    } catch (e) {
        next(e);
    }
}

module.exports = {
    layDanhSach,
    layChiTiet,
    tongHopHoaDon,
    layPhieuTamTinh,
    tachHoaDon
};
