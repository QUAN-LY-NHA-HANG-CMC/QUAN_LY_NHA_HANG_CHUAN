/**
 * SERVICE ĐƠN GỌI MÓN (donGoiMon.service.js)
 */
const donGoiMonModel = require('./donGoiMon.model');
const banAnModel = require('../banAn/banAn.model');
const khuVucModel = require('../khuVuc/khuVuc.model');

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
    const danhSachDon = await donGoiMonModel.layDonCuaBan(ban.id);

    let khuVucTen = 'Tầng 1 - Sảnh chính';
    if (ban.khuVucId) {
        const kv = await khuVucModel.layTheoId(ban.khuVucId);
        if (kv) khuVucTen = kv.tenKhuVuc || kv.ten || khuVucTen;
    }

    // Tính tổng tiền lũy kế của bàn (US-070)
    let tongTienLuyKe = 0;
    let tongSoMon = 0;
    const thongKe = {
        tongSoMon: 0,
        choXacNhan: 0,
        dangCheBien: 0,
        daXong: 0,
        daLenMon: 0,
        daHuy: 0,
        tuChoi: 0
    };

    danhSachDon.forEach(don => {
        if (don.tongTien === undefined && don.tongTienDon !== undefined) {
            don.tongTien = don.tongTienDon;
        } else if (don.tongTienDon === undefined && don.tongTien !== undefined) {
            don.tongTienDon = don.tongTien;
        }

        (don.danhSachMon || []).forEach(m => {
            const sl = Number(m.soLuong) || 1;
            const tt = Number(m.thanhTien) || (Number(m.donGia || m.gia || 0) * sl);

            if (m.trangThai !== 'DA_HUY' && m.trangThai !== 'TU_CHOI') {
                tongTienLuyKe += tt;
                tongSoMon += sl;
            }

            if (m.trangThai === 'CHO_XAC_NHAN') {
                thongKe.choXacNhan += sl;
            } else if (m.trangThai === 'DANG_CHE_BIEN') {
                thongKe.dangCheBien += sl;
            } else if (m.trangThai === 'DA_XONG' || m.trangThai === 'DA_NAU_XONG') {
                thongKe.daXong += sl;
            } else if (m.trangThai === 'DA_LEN_MON') {
                thongKe.daLenMon += sl;
            } else if (m.trangThai === 'DA_HUY') {
                thongKe.daHuy += sl;
            } else if (m.trangThai === 'TU_CHOI') {
                thongKe.tuChoi += sl;
            }
        });
    });

    thongKe.tongSoMon = tongSoMon;

    return {
        ban: {
            id: ban.id,
            maBan: ban.maBan,
            tenBan: ban.tenBan,
            khuVucId: ban.khuVucId,
            trangThai: ban.trangThai
        },
        soBan: ban.tenBan || ban.maBan,
        khuVucTen,
        tongSoDon: danhSachDon.length,
        tongSoMon,
        tongTienLuyKe,
        thongKe,
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

    let khuVucTen = '';
    if (ban.khuVucId) {
        const kv = await khuVucModel.layTheoId(ban.khuVucId);
        if (kv) khuVucTen = kv.tenKhuVuc || kv.ten || '';
    }

    const duLieuDayDu = {
        ...duLieu,
        banId: ban.id,
        maBan: ban.maBan,
        tenBan: ban.tenBan,
        khuVucId: ban.khuVucId,
        tenKhuVuc: khuVucTen
    };

    return await donGoiMonModel.taoDon(duLieuDayDu);
}

async function capNhatTrangThaiMon(itemId, trangThaiMoi) {
    if (trangThaiMoi === 'DA_XONG') trangThaiMoi = 'DA_NAU_XONG';
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
