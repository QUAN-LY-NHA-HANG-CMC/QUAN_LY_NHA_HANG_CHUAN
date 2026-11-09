const vaiTroModel = require('./vaiTro.model');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

async function layDanhSach(req, res, next) {
    try {
        const ketQua = vaiTroModel.layDanhSach();
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách vai trò thành công');
    } catch (loi) {
        next(loi);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { ma } = req.params;
        const vt = vaiTroModel.layTheoMa(ma);
        if (!vt) return phanHoiLoi(res, 'Không tìm thấy vai trò này', 404);
        return phanHoiThanhCong(res, vt, 'Lấy chi tiết vai trò thành công');
    } catch (loi) {
        next(loi);
    }
}

async function capNhatQuyen(req, res, next) {
    try {
        const { ma } = req.params;
        const { danhSachQuyen } = req.body;
        const vt = vaiTroModel.capNhatQuyen(ma, danhSachQuyen);
        if (!vt) return phanHoiLoi(res, 'Không tìm thấy vai trò cần cập nhật quyền', 404);
        return phanHoiThanhCong(res, vt, `Cập nhật quyền cho vai trò ${vt.ten} thành công`);
    } catch (loi) {
        next(loi);
    }
}

async function dongBo(req, res, next) {
    try {
        const { danhSach } = req.body;
        const dsMoi = vaiTroModel.dongBoDanhSach(Array.isArray(danhSach) ? danhSach : req.body);
        return phanHoiThanhCong(res, dsMoi, 'Đồng bộ danh sách vai trò thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    layDanhSach,
    layChiTiet,
    capNhatQuyen,
    dongBo
};
