/**
 * MODEL GIAO DỊCH THANH TOÁN (thanhToan.model.js)
 * Lưu trữ lịch sử giao dịch thanh toán Tiền mặt và Chuyển khoản VietQR (US-105 -> US-110)
 */

let danhSachGiaoDich = [
    {
        id: 1,
        maGiaoDich: 'GD-20261028-001',
        hoaDonId: 1,
        maHoaDon: 'HD-20261028-001',
        banId: 2,
        maBan: 'B102',
        phuongThuc: 'CHUYEN_KHOAN_VIETQR',
        soTienCanThanhToan: 578880,
        soTienKhachDua: 578880,
        soTienThua: 0,
        maGiaoDichNganHang: 'MBB_REF_8839219',
        noiDungChuyenKhoan: 'THANH TOAN HD-20261028-001 B102',
        trangThai: 'THANH_CONG', // 'CHO_THANH_TOAN', 'THANH_CONG', 'THAT_BAI'
        thuNganId: 2,
        tenThuNgan: 'Trần Thị Thu Ngân',
        thoiGianTao: new Date(Date.now() - 6 * 60 * 1000),
        thoiGianHoanTat: new Date(Date.now() - 5 * 60 * 1000)
    }
];

let tuTangId = 2;

async function layTatCa({ hoaDonId, banId, phuongThuc, trangThai } = {}) {
    let ketQua = [...danhSachGiaoDich];

    if (hoaDonId) {
        ketQua = ketQua.filter(gd => gd.hoaDonId === Number(hoaDonId));
    }
    if (banId) {
        ketQua = ketQua.filter(gd => gd.banId === Number(banId));
    }
    if (phuongThuc) {
        ketQua = ketQua.filter(gd => gd.phuongThuc === phuongThuc);
    }
    if (trangThai) {
        ketQua = ketQua.filter(gd => gd.trangThai === trangThai);
    }

    return ketQua.sort((a, b) => b.id - a.id);
}

async function layTheoId(id) {
    return danhSachGiaoDich.find(gd => gd.id === Number(id)) || null;
}

async function layTheoMaGiaoDich(maGiaoDich) {
    if (!maGiaoDich) return null;
    return danhSachGiaoDich.find(gd => gd.maGiaoDich.toUpperCase() === maGiaoDich.trim().toUpperCase()) || null;
}

async function taoMoi(duLieu) {
    const ngayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const maGiaoDich = `GD-${ngayStr}-${String(tuTangId).padStart(3, '0')}`;

    const banGhi = {
        id: tuTangId++,
        maGiaoDich,
        hoaDonId: Number(duLieu.hoaDonId),
        maHoaDon: duLieu.maHoaDon,
        banId: Number(duLieu.banId),
        maBan: duLieu.maBan,
        phuongThuc: duLieu.phuongThuc, // 'TIEN_MAT' hoặc 'CHUYEN_KHOAN_VIETQR'
        soTienCanThanhToan: Number(duLieu.soTienCanThanhToan) || 0,
        soTienKhachDua: Number(duLieu.soTienKhachDua) || 0,
        soTienThua: Number(duLieu.soTienThua) || 0,
        maGiaoDichNganHang: duLieu.maGiaoDichNganHang || null,
        noiDungChuyenKhoan: duLieu.noiDungChuyenKhoan || `THANH TOAN ${duLieu.maHoaDon}`,
        trangThai: duLieu.trangThai || 'CHO_THANH_TOAN',
        thuNganId: duLieu.thuNganId || null,
        tenThuNgan: duLieu.tenThuNgan || '',
        thoiGianTao: new Date(),
        thoiGianHoanTat: duLieu.trangThai === 'THANH_CONG' ? new Date() : null
    };

    danhSachGiaoDich.push(banGhi);
    return banGhi;
}

async function capNhatTrangThai(id, trangThai, { maGiaoDichNganHang, soTienKhachDua, soTienThua } = {}) {
    const viTri = danhSachGiaoDich.findIndex(gd => gd.id === Number(id));
    if (viTri === -1) return null;

    danhSachGiaoDich[viTri] = {
        ...danhSachGiaoDich[viTri],
        trangThai,
        maGiaoDichNganHang: maGiaoDichNganHang || danhSachGiaoDich[viTri].maGiaoDichNganHang,
        soTienKhachDua: soTienKhachDua !== undefined ? Number(soTienKhachDua) : danhSachGiaoDich[viTri].soTienKhachDua,
        soTienThua: soTienThua !== undefined ? Number(soTienThua) : danhSachGiaoDich[viTri].soTienThua,
        thoiGianHoanTat: trangThai === 'THANH_CONG' ? new Date() : danhSachGiaoDich[viTri].thoiGianHoanTat
    };

    return danhSachGiaoDich[viTri];
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoMaGiaoDich,
    taoMoi,
    capNhatTrangThai
};
