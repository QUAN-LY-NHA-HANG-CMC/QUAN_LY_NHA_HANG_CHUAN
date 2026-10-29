/**
 * SERVICE CA LÀM VIỆC (caLamViec.service.js)
 * Nghiệp vụ quản lý phiên ca, ghi nhận thu chi và chốt ca thu ngân (US-117 -> US-122)
 */
const caLamViecModel = require('./caLamViec.model');
const hoaDonModel = require('../hoaDon/hoaDon.model');

async function layDanhSachCaMau() {
    return await caLamViecModel.layDanhSachCaMau();
}

/**
 * US-118: Mở ca làm việc và ghi nhận số tiền mặt đầu ca trong két
 */
async function moCaLamViec({ caId, thuNganId, tenThuNgan, tienDauCa }) {
    // 1. Kiểm tra xem thu ngân này có ca nào đang mở chưa
    const caDangMo = await caLamViecModel.layPhienCaDangMo(thuNganId);
    if (caDangMo) {
        const loi = new Error(`Thu ngân hiện đang có ca làm việc '${caDangMo.tenCa}' (${caDangMo.maPhienCa}) chưa đóng`);
        loi.status = 400;
        throw loi;
    }

    const dsCa = await caLamViecModel.layDanhSachCaMau();
    const caChon = dsCa.find(c => c.id === Number(caId)) || dsCa[0];

    const duLieu = {
        caId: caChon.id,
        tenCa: caChon.tenCa,
        thuNganId,
        tenThuNgan: tenThuNgan || 'Thu ngân ca trực',
        tienDauCa: Number(tienDauCa) || 0
    };

    return await caLamViecModel.taoPhienCaMoi(duLieu);
}

/**
 * US-119: Ghi nhận phiếu thu / chi tiền mặt phát sinh trong ca
 */
async function ghiNhanThuChi(phienCaId, { loai, soTien, lyDo }) {
    const phienCa = await caLamViecModel.layPhienCaTheoId(phienCaId);
    if (!phienCa) {
        const loi = new Error('Phiên ca làm việc không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (phienCa.trangThai === 'DaDongCa') {
        const loi = new Error('Không thể thêm phiếu thu chi vào ca đã đóng');
        loi.status = 400;
        throw loi;
    }

    if (!soTien || Number(soTien) <= 0) {
        const loi = new Error('Số tiền thu chi phải lớn hơn 0');
        loi.status = 400;
        throw loi;
    }

    if (!lyDo || !lyDo.trim()) {
        const loi = new Error('Vui lòng nhập lý do thu hoặc chi');
        loi.status = 400;
        throw loi;
    }

    const phieu = await caLamViecModel.themPhieuThuChi(phienCaId, { loai, soTien, lyDo });
    const caCapNhat = await caLamViecModel.layPhienCaTheoId(phienCaId);

    return {
        phieu,
        phienCa: caCapNhat
    };
}

/**
 * US-120: Tự động tổng hợp doanh thu tiền mặt và chuyển khoản phát sinh trong ca
 */
async function layThongTinCaHienTai(thuNganId = null) {
    const phienCa = await caLamViecModel.layPhienCaDangMo(thuNganId);
    if (!phienCa) {
        return null;
    }

    // Tổng hợp doanh thu từ các hóa đơn thanh toán trong khoảng thời gian từ lúc mở ca đến nay
    const danhSachHoaDon = await hoaDonModel.layTatCa({
        trangThai: 'DaThanhToan',
        tuNgay: phienCa.thoiGianMoCa
    });

    let dtTienMat = 0;
    let dtChuyenKhoan = 0;
    let tongSoDon = 0;

    danhSachHoaDon.forEach(hd => {
        tongSoDon++;
        if (hd.phuongThucThanhToan === 'TIEN_MAT') {
            dtTienMat += hd.tongTienThanhToan;
        } else {
            dtChuyenKhoan += hd.tongTienThanhToan;
        }
    });

    // Cập nhật lại vào phiên ca
    phienCa.doanhThuTienMat = dtTienMat;
    phienCa.doanhThuChuyenKhoan = dtChuyenKhoan;
    phienCa.tienMatLyThuyetTrongKet = phienCa.tienDauCa + dtTienMat + phienCa.tongTienMatThuThem - phienCa.tongTienMatChiRa;

    return {
        ...phienCa,
        tongSoDonTrongCa: tongSoDon
    };
}

/**
 * US-121: Thu ngân thực hiện đóng ca, nhập tiền thực tế cuối ca và đối soát chênh lệch
 */
async function dongCaLamViec(phienCaId, { tienMatThucTeCuoiCa, ghiChuKetCa, quanLyId, tenQuanLy }) {
    const phienCa = await caLamViecModel.layPhienCaTheoId(phienCaId);
    if (!phienCa) {
        const loi = new Error('Phiên ca làm việc không tồn tại');
        loi.status = 404;
        throw loi;
    }

    if (phienCa.trangThai === 'DaDongCa') {
        const loi = new Error('Phiên ca này đã được đóng trước đó');
        loi.status = 400;
        throw loi;
    }

    if (tienMatThucTeCuoiCa === undefined || isNaN(Number(tienMatThucTeCuoiCa))) {
        const loi = new Error('Vui lòng nhập số tiền mặt kiểm đếm thực tế cuối ca');
        loi.status = 400;
        throw loi;
    }

    // Tự động tổng hợp số liệu hóa đơn lần cuối trước khi đóng
    await layThongTinCaHienTai(phienCa.thuNganId);

    const caDaDong = await caLamViecModel.dongCa(phienCaId, {
        tienMatThucTeCuoiCa,
        ghiChuKetCa,
        quanLyId,
        tenQuanLy
    });

    return {
        bienBanKetCa: caDaDong,
        thongBao: caDaDong.chenhLech === 0
            ? 'Kết ca thành công! Tiền mặt thực tế khớp 100% với số liệu trên hệ thống.'
            : (caDaDong.chenhLech > 0
                ? `Kết ca thành công! Tiền thực tế thừa ${caDaDong.chenhLech.toLocaleString('vi-VN')}đ so với lý thuyết.`
                : `Kết ca thành công! Cảnh báo: Tiền thực tế thiếu ${Math.abs(caDaDong.chenhLech).toLocaleString('vi-VN')}đ so với lý thuyết.`)
    };
}

/**
 * US-122: Quản lý xem lịch sử bàn giao ca và biên bản kết ca
 */
async function layLichSuPhienCa(boLoc = {}) {
    return await caLamViecModel.layTatCaPhienCa(boLoc);
}

async function layChiTietPhienCa(id) {
    const pc = await caLamViecModel.layPhienCaTheoId(id);
    if (!pc) {
        const loi = new Error('Phiên ca không tồn tại');
        loi.status = 404;
        throw loi;
    }
    return pc;
}

module.exports = {
    layDanhSachCaMau,
    moCaLamViec,
    ghiNhanThuChi,
    layThongTinCaHienTai,
    dongCaLamViec,
    layLichSuPhienCa,
    layChiTietPhienCa
};
