const yeuCauModel = require('./yeuCauHoTro.model');
const banAnModel = require('../banAn/banAn.model');
const donGoiMonModel = require('../donGoiMon/donGoiMon.model');

async function taoYeuCau(duLieu) {
    let ban = null;
    if (duLieu.banId) {
        ban = await banAnModel.layTheoId(duLieu.banId);
    }
    if (!ban && duLieu.maBan) {
        ban = await banAnModel.layTheoMaBan(duLieu.maBan);
    }
    if (!ban) {
        const loi = new Error('Bàn ăn không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (duLieu.token) {
        const hopLe = (ban.tokenBaoMat && ban.tokenBaoMat === duLieu.token) ||
                      (ban.qrToken && ban.qrToken === duLieu.token);
        if (!hopLe) {
            const loi = new Error('Mã QR bảo mật bàn không hợp lệ');
            loi.status = 403;
            throw loi;
        }
    }

    const laThanhToan = duLieu.loaiYeuCau === 'YeuCauThanhToan' || duLieu.loaiYeuCau === 'THANH_TOAN';

    // Tự động tính tạm tính từ đơn của bàn nếu là yêu cầu thanh toán và chưa truyền tongTamTinh
    let tongTamTinh = Number(duLieu.tongTamTinh || 0);
    if (laThanhToan && !tongTamTinh) {
        try {
            const dsDon = await donGoiMonModel.layDonCuaBan(ban.id);
            (dsDon || []).forEach(don => {
                (don.danhSachMon || []).forEach(m => {
                    if (m.trangThai !== 'DA_HUY' && m.trangThai !== 'TU_CHOI') {
                        const sl = Number(m.soLuong) || 1;
                        tongTamTinh += Number(m.thanhTien) || (Number(m.donGia || m.gia || 0) * sl);
                    }
                });
            });
        } catch {}
    }

    // Cập nhật trạng thái bàn thực tế trên hệ thống để POS / Thu ngân thấy ngay
    if (laThanhToan) {
        await banAnModel.capNhat(ban.id, { trangThai: 'ChoThanhToan' });
    } else if (ban.trangThai !== 'ChoThanhToan' && ban.trangThai !== 'CHO_THANH_TOAN') {
        await banAnModel.capNhat(ban.id, { trangThai: 'CanHoTro' });
    }

    const yeuCauMoi = await yeuCauModel.taoMoi({
        ...duLieu,
        banId: ban.id,
        maBan: ban.maBan,
        tenBan: ban.tenBan || ban.soBan || `Bàn ${ban.id}`,
        soBan: ban.soBan || ban.tenBan || `Bàn ${ban.id}`,
        tongTamTinh
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

async function capNhatTrangThaiYeuCau(id, trangThaiMoi, nguoiXuLyId, nguoiTiepNhan = null) {
    const ycCu = await layChiTietYeuCau(id);
    const ycCapNhat = await yeuCauModel.capNhatTrangThai(id, trangThaiMoi, nguoiXuLyId, nguoiTiepNhan);

    // Nếu đã hoàn tất xử lý và bàn đang ở CanHoTro, trả lại trạng thái DangPhucVu (nếu có đơn) hoặc Trong
    if (ycCapNhat && yeuCauModel.chuanHoaTrangThai(ycCapNhat.trangThai) === 'DA_XU_LY') {
        const conYeuCauCho = (await yeuCauModel.layTatCa({ banId: ycCu.banId }))
            .some(y => yeuCauModel.chuanHoaTrangThai(y.trangThai) !== 'DA_XU_LY');
        if (!conYeuCauCho) {
            const ban = await banAnModel.layTheoId(ycCu.banId);
            if (ban && (ban.trangThai === 'CanHoTro' || ban.trangThai === 'CAN_HO_TRO')) {
                const dsDon = await donGoiMonModel.layDonCuaBan(ban.id);
                await banAnModel.capNhat(ban.id, {
                    trangThai: (dsDon && dsDon.length > 0) ? 'DangPhucVu' : 'Trong'
                });
            }
        }
    }

    return ycCapNhat;
}

module.exports = {
    taoYeuCau,
    layDanhSachYeuCau,
    layChiTietYeuCau,
    capNhatTrangThaiYeuCau
};
