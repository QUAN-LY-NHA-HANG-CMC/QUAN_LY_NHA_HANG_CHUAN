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

        // Định dạng thời gian chuẩn giờ Việt Nam (Asia/Ho_Chi_Minh - GMT+7)
        if (don.thoiGianTao) {
            try {
                const d = new Date(don.thoiGianTao);
                if (!isNaN(d.getTime())) {
                    don.thoiGianTaoVN = new Intl.DateTimeFormat('vi-VN', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour12: false
                    }).format(d).replace(',', '');
                }
            } catch (e) {}
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
    if (trangThaiMoi === 'CHO_CHE_BIEN') trangThaiMoi = 'CHO_XAC_NHAN';
    if (trangThaiMoi === 'DA_CHE_BIEN') trangThaiMoi = 'DANG_CHE_BIEN';
    if (trangThaiMoi === 'DA_PHUC_VU') trangThaiMoi = 'DA_LEN_MON';
    const cacTrangThaiHopLe = ['CHO_XAC_NHAN', 'DANG_CHE_BIEN', 'DA_NAU_XONG', 'DA_LEN_MON', 'DA_HUY', 'TU_CHOI'];
    if (!cacTrangThaiHopLe.includes(trangThaiMoi)) {
        const loi = new Error(`Trạng thái không hợp lệ. Phải là một trong: ${cacTrangThaiHopLe.join(', ')}`);
        loi.status = 400;
        throw loi;
    }

    let kq = await donGoiMonModel.capNhatTrangThaiMon(itemId, trangThaiMoi);
    if (!kq) {
        // Fallback mềm dẻo cho món tạo từ client / mô phỏng KDS / POS
        kq = {
            don: null,
            mon: { id: isNaN(Number(itemId)) ? itemId : Number(itemId), trangThai: trangThaiMoi }
        };
    }
    return kq;
}

async function huyMon(itemId, lyDo) {
    let kq = await donGoiMonModel.huyMon(itemId, lyDo);
    if (!kq) {
        kq = {
            don: null,
            mon: { id: isNaN(Number(itemId)) ? itemId : Number(itemId), trangThai: 'DA_HUY', lyDoHuy: lyDo }
        };
    }
    return kq;
}

module.exports = {
    layDanhSachDon,
    layDonCuaBan,
    taoDonGoiMon,
    capNhatTrangThaiMon,
    huyMon
};
