let danhSachDanhMuc = [
    { id: 1, tenDanhMuc: 'Khai vị', thuTuHienThi: 1, trangThai: 'HoatDong', ngayTao: new Date() },
    { id: 2, tenDanhMuc: 'Món chính', thuTuHienThi: 2, trangThai: 'HoatDong', ngayTao: new Date() },
    { id: 3, tenDanhMuc: 'Lẩu', thuTuHienThi: 3, trangThai: 'HoatDong', ngayTao: new Date() },
    { id: 4, tenDanhMuc: 'Đồ uống', thuTuHienThi: 4, trangThai: 'HoatDong', ngayTao: new Date() },
    { id: 5, tenDanhMuc: 'Tráng miệng', thuTuHienThi: 5, trangThai: 'HoatDong', ngayTao: new Date() }
];

let tuTangId = 6;

async function layTatCa() {
    return danhSachDanhMuc
        .filter(dm => dm.trangThai !== 'DaXoa')
        .sort((a, b) => a.thuTuHienThi - b.thuTuHienThi);
}

async function layTheoId(id) {
    return danhSachDanhMuc.find(dm => dm.id === Number(id) && dm.trangThai !== 'DaXoa') || null;
}

async function layTheoTen(tenDanhMuc) {
    return danhSachDanhMuc.find(
        dm => dm.tenDanhMuc.toLowerCase() === tenDanhMuc.toLowerCase().trim() && dm.trangThai !== 'DaXoa'
    ) || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        tenDanhMuc: duLieu.tenDanhMuc.trim(),
        thuTuHienThi: duLieu.thuTuHienThi || danhSachDanhMuc.length + 1,
        trangThai: 'HoatDong',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachDanhMuc.push(banGhiMoi);
    return banGhiMoi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachDanhMuc.findIndex(dm => dm.id === Number(id) && dm.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachDanhMuc[viTri] = {
        ...danhSachDanhMuc[viTri],
        tenDanhMuc: duLieu.tenDanhMuc !== undefined ? duLieu.tenDanhMuc.trim() : danhSachDanhMuc[viTri].tenDanhMuc,
        thuTuHienThi: duLieu.thuTuHienThi !== undefined ? Number(duLieu.thuTuHienThi) : danhSachDanhMuc[viTri].thuTuHienThi,
        trangThai: duLieu.trangThai || danhSachDanhMuc[viTri].trangThai,
        ngayCapNhat: new Date()
    };
    return danhSachDanhMuc[viTri];
}

async function xoa(id) {
    const viTri = danhSachDanhMuc.findIndex(dm => dm.id === Number(id));
    if (viTri === -1) return false;
    danhSachDanhMuc[viTri].trangThai = 'DaXoa';
    danhSachDanhMuc[viTri].ngayCapNhat = new Date();
    return true;
}

async function dongBoDanhSach(danhSachMoi) {
    if (!Array.isArray(danhSachMoi)) return danhSachDanhMuc;
    danhSachDanhMuc = danhSachMoi.map((dm, idx) => ({
        id: Number(dm.id) || (idx + 1),
        tenDanhMuc: (dm.tenDanhMuc || dm.ten || `Danh mục ${dm.id}`).trim(),
        thuTuHienThi: Number(dm.thuTuHienThi) || (idx + 1),
        trangThai: dm.trangThai || 'HoatDong',
        ngayTao: dm.ngayTao ? new Date(dm.ngayTao) : new Date(),
        ngayCapNhat: new Date()
    }));
    tuTangId = Math.max(...danhSachDanhMuc.map(dm => dm.id || 0), 0) + 1;
    return danhSachDanhMuc;
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoTen,
    taoMoi,
    capNhat,
    xoa,
    dongBoDanhSach
};
