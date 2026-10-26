let danhSachKhuVuc = [
    { id: 1, tenKhuVuc: 'Tầng 1 - Sảnh chính', ghiChu: 'Khu vực máy lạnh, gần quầy thu ngân', trangThai: 'HoatDong', ngayTao: new Date() },
    { id: 2, tenKhuVuc: 'Tầng 2 - Ngoài trời', ghiChu: 'Khu vực ban công thoáng mát', trangThai: 'HoatDong', ngayTao: new Date() },
    { id: 3, tenKhuVuc: 'Phòng VIP', ghiChu: 'Khu vực riêng tư cho gia đình hoặc họp mặt', trangThai: 'HoatDong', ngayTao: new Date() }
];

let tuTangId = 4;

async function layTatCa() {
    return danhSachKhuVuc.filter(kv => kv.trangThai !== 'DaXoa');
}

async function layTheoId(id) {
    return danhSachKhuVuc.find(kv => kv.id === Number(id) && kv.trangThai !== 'DaXoa') || null;
}

async function layTheoTen(tenKhuVuc) {
    return danhSachKhuVuc.find(
        kv => kv.tenKhuVuc.toLowerCase() === tenKhuVuc.toLowerCase().trim() && kv.trangThai !== 'DaXoa'
    ) || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        tenKhuVuc: duLieu.tenKhuVuc.trim(),
        ghiChu: duLieu.ghiChu ? duLieu.ghiChu.trim() : '',
        trangThai: 'HoatDong',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachKhuVuc.push(banGhiMoi);
    return banGhiMoi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachKhuVuc.findIndex(kv => kv.id === Number(id) && kv.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachKhuVuc[viTri] = {
        ...danhSachKhuVuc[viTri],
        tenKhuVuc: duLieu.tenKhuVuc !== undefined ? duLieu.tenKhuVuc.trim() : danhSachKhuVuc[viTri].tenKhuVuc,
        ghiChu: duLieu.ghiChu !== undefined ? duLieu.ghiChu.trim() : danhSachKhuVuc[viTri].ghiChu,
        trangThai: duLieu.trangThai || danhSachKhuVuc[viTri].trangThai,
        ngayCapNhat: new Date()
    };
    return danhSachKhuVuc[viTri];
}

async function xoa(id) {
    const viTri = danhSachKhuVuc.findIndex(kv => kv.id === Number(id));
    if (viTri === -1) return false;
    danhSachKhuVuc[viTri].trangThai = 'DaXoa';
    danhSachKhuVuc[viTri].ngayCapNhat = new Date();
    return true;
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoTen,
    taoMoi,
    capNhat,
    xoa
};
