/**
 * SERVICE ĐƠN GỌI MÓN (donGoiMon.service.js)
 */
const donGoiMonModel = require('./donGoiMon.model');
const banAnModel = require('../banAn/banAn.model');

async function layDanhSachDon(boLoc = {}) {
    return await donGoiMonModel.layTatCa(boLoc);
}

async function layDonCuaBan(banId) {
    const ban = await banAnModel.layTheoId(banId);
    if (!ban) {
        const loi = new Error('Bàn ăn không tồn tại');
        loi.status = 404;
        throw loi;
    }
    const danhSachDon = await donGoiMonModel.layDonCuaBan(banId);

    // Tính tổng tiền lũy kế của bàn (US-070)
    let tongTienLuyKe = 0;
    let tongSoMon = 0;

    danhSachDon.forEach(don => {
        don.danhSachMon.forEach(m => {
            if (m.trangThai !== 'DA_HUY') {
                tongTienLuyKe += m.thanhTien;
                tongSoMon += m.soLuong;
            }
        });
    });

    return {
        ban: {
            id: ban.id,
            maBan: ban.maBan,
            tenBan: ban.tenBan,
            khuVucId: ban.khuVucId,
            trangThai: ban.trangThai
        },
        tongSoDon: danhSachDon.length,
        tongSoMon,
        tongTienLuyKe,
        danhSachDon
    };
}

async function taoDonGoiMon(duLieu) {
    const ban = await banAnModel.layTheoId(duLieu.banId);
    if (!ban) {
        const loi = new Error('Bàn ăn không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (ban.trangThai === 'TamKhoa') {
        const loi = new Error('Bàn này đang tạm khóa phục vụ');
        loi.status = 403;
        throw loi;
    }

    // Đổi trạng thái bàn thành Đang phục vụ nếu bàn đang trống
    if (ban.trangThai === 'Trong') {
        await banAnModel.capNhat(ban.id, {
            trangThai: 'DangPhucVu',
            daPhatSinhGiaoDich: true
        });
    }

    const duLieuDayDu = {
        ...duLieu,
        maBan: ban.maBan,
        tenBan: ban.tenBan,
        khuVucId: ban.khuVucId
    };

    return await donGoiMonModel.taoDon(duLieuDayDu);
}

async function capNhatTrangThaiMon(itemId, trangThaiMoi) {
    const cacTrangThaiHopLe = ['CHO_XAC_NHAN', 'DANG_CHE_BIEN', 'DA_NAU_XONG', 'DA_LEN_MON', 'DA_HUY'];
    if (!cacTrangThaiHopLe.includes(trangThaiMoi)) {
        const loi = new Error(`Trạng thái không hợp lệ. Phải là một trong: ${cacTrangThaiHopLe.join(', ')}`);
        loi.status = 400;
        throw loi;
    }

    const kq = await donGoiMonModel.capNhatTrangThaiMon(itemId, trangThaiMoi);
    if (!kq) {
        const loi = new Error('Không tìm thấy món ăn trong các đơn đặt hàng');
        loi.status = 404;
        throw loi;
    }
    return kq;
}

async function huyMon(itemId, lyDo) {
    return await donGoiMonModel.huyMon(itemId, lyDo);
}

module.exports = {
    layDanhSachDon,
    layDonCuaBan,
    taoDonGoiMon,
    capNhatTrangThaiMon,
    huyMon
};
