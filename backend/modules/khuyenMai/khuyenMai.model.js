/**
 * MODEL KHUYẾN MÃI & MÃ GIẢM GIÁ (khuyenMai.model.js)
 * Quản lý danh sách chương trình ưu đãi, voucher giảm giá (US-099, US-100)
 */

let danhSachKhuyenMai = [
    {
        id: 1,
        maKhuyenMai: 'CHAOMUNG50K',
        tenKhuyenMai: 'Khuyến mãi khai trương chào mừng',
        loai: 'SO_TIEN', // 'SO_TIEN' hoặc 'PHAN_TRAM'
        giaTri: 50000,
        giamToiDa: 50000,
        giaTriDonToiThieu: 200000,
        soLuongToiDa: 100,
        daSuDung: 12,
        ngayBatDau: new Date('2026-01-01'),
        ngayKetThuc: new Date('2026-12-31'),
        moTa: 'Giảm ngay 50.000đ cho đơn hàng từ 200.000đ',
        trangThai: 'DangApDung', // 'DangApDung', 'TamDung', 'HetHan', 'DaXoa'
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 2,
        maKhuyenMai: 'GIAM10',
        tenKhuyenMai: 'Giảm giá 10% tổng hóa đơn',
        loai: 'PHAN_TRAM',
        giaTri: 10, // 10%
        giamToiDa: 100000, // Tối đa giảm 100.000đ
        giaTriDonToiThieu: 300000,
        soLuongToiDa: 200,
        daSuDung: 45,
        ngayBatDau: new Date('2026-01-01'),
        ngayKetThuc: new Date('2026-12-31'),
        moTa: 'Giảm 10% tổng hóa đơn (tối đa 100k) cho bàn ăn trên 300k',
        trangThai: 'DangApDung',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    },
    {
        id: 3,
        maKhuyenMai: 'VIP20',
        tenKhuyenMai: 'Ưu đãi khách hàng VIP 20%',
        loai: 'PHAN_TRAM',
        giaTri: 20,
        giamToiDa: 200000,
        giaTriDonToiThieu: 500000,
        soLuongToiDa: 50,
        daSuDung: 5,
        ngayBatDau: new Date('2026-01-01'),
        ngayKetThuc: new Date('2026-12-31'),
        moTa: 'Dành riêng cho khách hàng VIP và bàn tiệc gia đình',
        trangThai: 'DangApDung',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    }
];

let tuTangId = 4;

async function layTatCa({ trangThai, tuKhoa } = {}) {
    let ketQua = danhSachKhuyenMai.filter(km => km.trangThai !== 'DaXoa');

    if (trangThai) {
        ketQua = ketQua.filter(km => km.trangThai === trangThai);
    }

    if (tuKhoa) {
        const keyword = tuKhoa.toLowerCase().trim();
        ketQua = ketQua.filter(km =>
            km.maKhuyenMai.toLowerCase().includes(keyword) ||
            km.tenKhuyenMai.toLowerCase().includes(keyword)
        );
    }

    return ketQua.sort((a, b) => b.id - a.id);
}

async function layTheoId(id) {
    return danhSachKhuyenMai.find(km => km.id === Number(id) && km.trangThai !== 'DaXoa') || null;
}

async function layTheoMa(maKhuyenMai) {
    if (!maKhuyenMai) return null;
    const ma = maKhuyenMai.trim().toUpperCase();
    return danhSachKhuyenMai.find(km => km.maKhuyenMai === ma && km.trangThai !== 'DaXoa') || null;
}

async function taoMoi(duLieu) {
    const banGhi = {
        id: tuTangId++,
        maKhuyenMai: duLieu.maKhuyenMai.trim().toUpperCase(),
        tenKhuyenMai: duLieu.tenKhuyenMai.trim(),
        loai: duLieu.loai === 'PHAN_TRAM' ? 'PHAN_TRAM' : 'SO_TIEN',
        giaTri: Number(duLieu.giaTri) || 0,
        giamToiDa: Number(duLieu.giamToiDa) || (duLieu.loai === 'SO_TIEN' ? Number(duLieu.giaTri) : 0),
        giaTriDonToiThieu: Number(duLieu.giaTriDonToiThieu) || 0,
        soLuongToiDa: duLieu.soLuongToiDa ? Number(duLieu.soLuongToiDa) : null,
        daSuDung: 0,
        ngayBatDau: duLieu.ngayBatDau ? new Date(duLieu.ngayBatDau) : new Date(),
        ngayKetThuc: duLieu.ngayKetThuc ? new Date(duLieu.ngayKetThuc) : new Date(Date.now() + 30 * 24 * 3600 * 1000),
        moTa: duLieu.moTa ? duLieu.moTa.trim() : '',
        trangThai: duLieu.trangThai || 'DangApDung',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };

    danhSachKhuyenMai.push(banGhi);
    return banGhi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachKhuyenMai.findIndex(km => km.id === Number(id) && km.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    const kmCu = danhSachKhuyenMai[viTri];
    danhSachKhuyenMai[viTri] = {
        ...kmCu,
        tenKhuyenMai: duLieu.tenKhuyenMai ? duLieu.tenKhuyenMai.trim() : kmCu.tenKhuyenMai,
        loai: duLieu.loai ? duLieu.loai : kmCu.loai,
        giaTri: duLieu.giaTri !== undefined ? Number(duLieu.giaTri) : kmCu.giaTri,
        giamToiDa: duLieu.giamToiDa !== undefined ? Number(duLieu.giamToiDa) : kmCu.giamToiDa,
        giaTriDonToiThieu: duLieu.giaTriDonToiThieu !== undefined ? Number(duLieu.giaTriDonToiThieu) : kmCu.giaTriDonToiThieu,
        soLuongToiDa: duLieu.soLuongToiDa !== undefined ? (duLieu.soLuongToiDa ? Number(duLieu.soLuongToiDa) : null) : kmCu.soLuongToiDa,
        ngayBatDau: duLieu.ngayBatDau ? new Date(duLieu.ngayBatDau) : kmCu.ngayBatDau,
        ngayKetThuc: duLieu.ngayKetThuc ? new Date(duLieu.ngayKetThuc) : kmCu.ngayKetThuc,
        moTa: duLieu.moTa !== undefined ? duLieu.moTa.trim() : kmCu.moTa,
        trangThai: duLieu.trangThai || kmCu.trangThai,
        ngayCapNhat: new Date()
    };

    return danhSachKhuyenMai[viTri];
}

async function tangSoLanSuDung(id) {
    const km = await layTheoId(id);
    if (!km) return false;
    km.daSuDung = (km.daSuDung || 0) + 1;
    km.ngayCapNhat = new Date();
    if (km.soLuongToiDa && km.daSuDung >= km.soLuongToiDa) {
        km.trangThai = 'HetHan';
    }
    return true;
}

async function xoa(id) {
    const viTri = danhSachKhuyenMai.findIndex(km => km.id === Number(id));
    if (viTri === -1) return false;
    danhSachKhuyenMai[viTri].trangThai = 'DaXoa';
    danhSachKhuyenMai[viTri].ngayCapNhat = new Date();
    return true;
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoMa,
    taoMoi,
    capNhat,
    tangSoLanSuDung,
    xoa
};
