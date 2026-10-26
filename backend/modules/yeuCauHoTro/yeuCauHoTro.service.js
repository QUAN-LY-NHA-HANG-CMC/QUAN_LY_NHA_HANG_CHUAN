const yeuCauModel = require('./yeuCauHoTro.model');
const banAnModel = require('../banAn/banAn.model');

async function taoYeuCau(duLieu) {
    const ban = await banAnModel.layTheoId(duLieu.banId);
    if (!ban) {
        const loi = new Error('Bàn ăn không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (duLieu.token && ban.tokenBaoMat !== duLieu.token) {
        const loi = new Error('Mã QR bảo mật bàn không hợp lệ');
        loi.status = 403;
        throw loi;
    }

    const yeuCauMoi = await yeuCauModel.taoMoi({
        ...duLieu,
        maBan: ban.maBan,
        tenBan: ban.tenBan
    });

    return yeuCauMoi;
}

async function layDanhSachYeuCau(boLoc) {
    return await yeuCauModel.layTatCa(boLoc);
}

async function layChiTietYeuCau(id) {
    const yc = await yeuCauModel.layTheoId(id);
    if (!yc) {
        const loi = new Error('Không tìm thấy yêu cầu hỗ trợ');
        loi.status = 404;
        throw loi;
    }
    return yc;
}

async function capNhatTrangThaiYeuCau(id, trangThaiMoi, nguoiXuLyId) {
    await layChiTietYeuCau(id);
    return await yeuCauModel.capNhatTrangThai(id, trangThaiMoi, nguoiXuLyId);
}

module.exports = {
    taoYeuCau,
    layDanhSachYeuCau,
    layChiTietYeuCau,
    capNhatTrangThaiYeuCau
};
