const { taoTokenBaoMatQr } = require('../../tienIch/taoMaQr');

let danhSachBanAn = [
    { id: 1, maBan: 'B101', tenBan: 'Bàn 01', khuVucId: 1, sucChua: 4, tokenBaoMat: taoTokenBaoMatQr(), trangThai: 'Trong', daPhatSinhGiaoDich: false, ngayTao: new Date() },
    { id: 2, maBan: 'B102', tenBan: 'Bàn 02', khuVucId: 1, sucChua: 4, tokenBaoMat: taoTokenBaoMatQr(), trangThai: 'Trong', daPhatSinhGiaoDich: false, ngayTao: new Date() },
    { id: 3, maBan: 'B103', tenBan: 'Bàn 03', khuVucId: 1, sucChua: 6, tokenBaoMat: taoTokenBaoMatQr(), trangThai: 'Trong', daPhatSinhGiaoDich: false, ngayTao: new Date() },
    { id: 4, maBan: 'B201', tenBan: 'Bàn 11 (Tầng 2)', khuVucId: 2, sucChua: 4, tokenBaoMat: taoTokenBaoMatQr(), trangThai: 'Trong', daPhatSinhGiaoDich: false, ngayTao: new Date() },
    { id: 5, maBan: 'VIP1', tenBan: 'Phòng VIP 1', khuVucId: 3, sucChua: 10, tokenBaoMat: taoTokenBaoMatQr(), trangThai: 'Trong', daPhatSinhGiaoDich: false, ngayTao: new Date() }
];

let tuTangId = 6;

async function layTatCa({ khuVucId, trangThai } = {}) {
    let ketQua = danhSachBanAn.filter(b => b.trangThai !== 'DaXoa');
    if (khuVucId) {
        ketQua = ketQua.filter(b => b.khuVucId === Number(khuVucId));
    }
    if (trangThai) {
        ketQua = ketQua.filter(b => b.trangThai === trangThai);
    }
    return ketQua;
}

async function layTheoId(id) {
    return danhSachBanAn.find(b => b.id === Number(id) && b.trangThai !== 'DaXoa') || null;
}

async function layTheoMaBan(maBan) {
    return danhSachBanAn.find(
        b => b.maBan.toLowerCase() === maBan.toLowerCase().trim() && b.trangThai !== 'DaXoa'
    ) || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        maBan: duLieu.maBan.trim().toUpperCase(),
        tenBan: duLieu.tenBan.trim(),
        khuVucId: Number(duLieu.khuVucId),
        sucChua: Number(duLieu.sucChua) || 4,
        tokenBaoMat: taoTokenBaoMatQr(),
        trangThai: duLieu.trangThai || 'Trong', // 'Trong', 'DangPhucVu', 'TamKhoa', 'DaXoa'
        daPhatSinhGiaoDich: false,
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachBanAn.push(banGhiMoi);
    return banGhiMoi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachBanAn.findIndex(b => b.id === Number(id) && b.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachBanAn[viTri] = {
        ...danhSachBanAn[viTri],
        maBan: duLieu.maBan !== undefined ? duLieu.maBan.trim().toUpperCase() : danhSachBanAn[viTri].maBan,
        tenBan: duLieu.tenBan !== undefined ? duLieu.tenBan.trim() : danhSachBanAn[viTri].tenBan,
        khuVucId: duLieu.khuVucId !== undefined ? Number(duLieu.khuVucId) : danhSachBanAn[viTri].khuVucId,
        sucChua: duLieu.sucChua !== undefined ? Number(duLieu.sucChua) : danhSachBanAn[viTri].sucChua,
        trangThai: duLieu.trangThai || danhSachBanAn[viTri].trangThai,
        ngayCapNhat: new Date()
    };
    return danhSachBanAn[viTri];
}

async function lamMoiToken(id, tokenMoi) {
    const ban = await layTheoId(id);
    if (!ban) return null;
    ban.tokenBaoMat = tokenMoi;
    ban.ngayCapNhat = new Date();
    return ban;
}

async function xoa(id) {
    const viTri = danhSachBanAn.findIndex(b => b.id === Number(id));
    if (viTri === -1) return false;
    danhSachBanAn[viTri].trangThai = 'DaXoa';
    danhSachBanAn[viTri].ngayCapNhat = new Date();
    return true;
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoMaBan,
    taoMoi,
    capNhat,
    lamMoiToken,
    xoa
};
