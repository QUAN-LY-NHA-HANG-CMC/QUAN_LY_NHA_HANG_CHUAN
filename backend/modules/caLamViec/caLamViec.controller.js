const caLamViecService = require('./caLamViec.service');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

async function layDanhSachCa(req, res, next) {
    try {
        const ketQua = await caLamViecService.layDanhSachCaMau();
        return phanHoiThanhCong(res, ketQua, 'Lấy danh sách cấu hình ca làm việc thành công');
    } catch (e) {
        next(e);
    }
}

async function moCa(req, res, next) {
    try {
        const ketQua = await caLamViecService.moCaLamViec(req.body);
        return phanHoiThanhCong(res, ketQua, `Mở ca làm việc thành công! Bắt đầu ${ketQua.tenCa}`, 201);
    } catch (e) {
        next(e);
    }
}

async function layCaHienTai(req, res, next) {
    try {
        const { thuNganId } = req.query;
        const ketQua = await caLamViecService.layThongTinCaHienTai(thuNganId);
        return phanHoiThanhCong(res, ketQua, ketQua ? 'Lấy thông tin ca hiện tại thành công' : 'Hiện chưa có ca làm việc nào đang mở');
    } catch (e) {
        next(e);
    }
}

async function taoThuChi(req, res, next) {
    try {
        const { phienCaId } = req.params;
        const { loai, soTien, lyDo } = req.body;
        const ketQua = await caLamViecService.ghiNhanThuChi(phienCaId, { loai, soTien, lyDo });
        return phanHoiThanhCong(res, ketQua, `Ghi nhận phiếu ${loai} thành công!`);
    } catch (e) {
        next(e);
    }
}

async function dongCa(req, res, next) {
    try {
        const { phienCaId } = req.params;
        const { tienMatThucTeCuoiCa, ghiChuKetCa, quanLyId, tenQuanLy } = req.body;
        const ketQua = await caLamViecService.dongCaLamViec(phienCaId, {
            tienMatThucTeCuoiCa,
            ghiChuKetCa,
            quanLyId,
            tenQuanLy
        });
        return phanHoiThanhCong(res, ketQua, ketQua.thongBao);
    } catch (e) {
        next(e);
    }
}

async function layLichSu(req, res, next) {
    try {
        const { thuNganId, trangThai, tuNgay, denNgay } = req.query;
        const ketQua = await caLamViecService.layLichSuPhienCa({ thuNganId, trangThai, tuNgay, denNgay });
        return phanHoiThanhCong(res, ketQua, 'Lấy lịch sử phiên ca thu ngân thành công');
    } catch (e) {
        next(e);
    }
}

async function layChiTiet(req, res, next) {
    try {
        const { id } = req.params;
        const ketQua = await caLamViecService.layChiTietPhienCa(id);
        return phanHoiThanhCong(res, ketQua, 'Lấy chi tiết phiên ca thành công');
    } catch (e) {
        next(e);
    }
}

module.exports = {
    layDanhSachCa,
    moCa,
    layCaHienTai,
    taoThuChi,
    dongCa,
    layLichSu,
    layChiTiet
};
