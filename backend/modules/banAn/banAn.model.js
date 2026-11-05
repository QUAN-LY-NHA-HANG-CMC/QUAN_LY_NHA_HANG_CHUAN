const { taoTokenBaoMatQr } = require('../../tienIch/taoMaQr');
const { docDuLieu, ghiDuLieu } = require('../../tienIch/luuTruDuLieu');

const duLieuBanMacDinh = [
    // Tầng 1 (Khu vực 1)
    { id: 1, maBan: 'B101', tenBan: 'Bàn 01', soBan: 'Bàn 01', khuVucId: 1, sucChua: 4, tokenBaoMat: 'tok_t1_b01_998', qrToken: 'tok_t1_b01_998', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: 'Gần cửa sổ', ngayTao: new Date() },
    { id: 2, maBan: 'B102', tenBan: 'Bàn 02', soBan: 'Bàn 02', khuVucId: 1, sucChua: 4, tokenBaoMat: 'tok_t1_b02_874', qrToken: 'tok_t1_b02_874', trangThai: 'DangDung', daPhatSinhGiaoDich: true, ghiChu: 'Khách gia đình', ngayTao: new Date() },
    { id: 3, maBan: 'B103', tenBan: 'Bàn 03', soBan: 'Bàn 03', khuVucId: 1, sucChua: 6, tokenBaoMat: 'tok_t1_b03_321', qrToken: 'tok_t1_b03_321', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: 'Bàn giữa', ngayTao: new Date() },
    { id: 4, maBan: 'B104', tenBan: 'Bàn 04', soBan: 'Bàn 04', khuVucId: 1, sucChua: 8, tokenBaoMat: 'tok_t1_b04_552', qrToken: 'tok_t1_b04_552', trangThai: 'ChoThanhToan', daPhatSinhGiaoDich: true, ghiChu: 'Gần quầy bar', ngayTao: new Date() },
    { id: 5, maBan: 'B105', tenBan: 'Bàn 05', soBan: 'Bàn 05', khuVucId: 1, sucChua: 4, tokenBaoMat: 'tok_t1_b05_641', qrToken: 'tok_t1_b05_641', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: '', ngayTao: new Date() },
    { id: 6, maBan: 'B106', tenBan: 'Bàn 06', soBan: 'Bàn 06', khuVucId: 1, sucChua: 2, tokenBaoMat: 'tok_UPkcC3fpL9eq', qrToken: 'tok_UPkcC3fpL9eq', trangThai: 'DangPhucVu', daPhatSinhGiaoDich: true, ghiChu: 'Bàn đôi', ngayTao: new Date() },
    
    // Tầng 2 (Khu vực 2)
    { id: 7, maBan: 'B201', tenBan: 'Bàn 07', soBan: 'Bàn 07', khuVucId: 2, sucChua: 4, tokenBaoMat: 'tok_t2_b07_441', qrToken: 'tok_t2_b07_441', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: 'Ban công', ngayTao: new Date() },
    { id: 8, maBan: 'B202', tenBan: 'Bàn 08', soBan: 'Bàn 08', khuVucId: 2, sucChua: 6, tokenBaoMat: 'tok_t2_b08_229', qrToken: 'tok_t2_b08_229', trangThai: 'DangDung', daPhatSinhGiaoDich: true, ghiChu: 'Bàn dài', ngayTao: new Date() },
    { id: 9, maBan: 'B203', tenBan: 'Bàn 09', soBan: 'Bàn 09', khuVucId: 2, sucChua: 4, tokenBaoMat: 'tok_t2_b09_773', qrToken: 'tok_t2_b09_773', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: '', ngayTao: new Date() },

    // Sân vườn (Khu vực 3)
    { id: 10, maBan: 'BSV1', tenBan: 'Bàn 10', soBan: 'Bàn 10', khuVucId: 3, sucChua: 8, tokenBaoMat: 'tok_sv_b10_884', qrToken: 'tok_sv_b10_884', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: 'Dưới tán cây', ngayTao: new Date() },
    { id: 11, maBan: 'BSV2', tenBan: 'Bàn 11', soBan: 'Bàn 11', khuVucId: 3, sucChua: 10, tokenBaoMat: 'tok_sv_b11_332', qrToken: 'tok_sv_b11_332', trangThai: 'DangDung', daPhatSinhGiaoDich: true, ghiChu: 'Tiệc họp mặt', ngayTao: new Date() },

    // VIP (Khu vực 4)
    { id: 12, maBan: 'VIP1', tenBan: 'VIP 01', soBan: 'VIP 01', khuVucId: 4, sucChua: 12, tokenBaoMat: 'tok_vip01_991', qrToken: 'tok_vip01_991', trangThai: 'Trong', daPhatSinhGiaoDich: false, ghiChu: 'Phòng Sen Vàng', ngayTao: new Date() },
    { id: 13, maBan: 'VIP2', tenBan: 'VIP 02', soBan: 'VIP 02', khuVucId: 4, sucChua: 16, tokenBaoMat: 'tok_vip02_882', qrToken: 'tok_vip02_882', trangThai: 'TamKhoa', daPhatSinhGiaoDich: false, ghiChu: 'Đang bảo dưỡng đèn', ngayTao: new Date() }
];

let danhSachBanAn = docDuLieu('banAn', duLieuBanMacDinh);
let tuTangId = Math.max(...danhSachBanAn.map(b => b.id || 0), 0) + 1;

function luu() {
    ghiDuLieu('banAn', danhSachBanAn);
}

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
    if (!id) return null;
    const str = String(id).toLowerCase().trim();
    return danhSachBanAn.find(
        b => (b.id === Number(id) || 
              (b.maBan && b.maBan.toLowerCase() === str) ||
              (b.tenBan && b.tenBan.toLowerCase() === str) ||
              (b.soBan && b.soBan.toLowerCase() === str)) && b.trangThai !== 'DaXoa'
    ) || null;
}

async function layTheoMaBan(maBan) {
    if (!maBan) return null;
    const str = maBan.toLowerCase().trim();
    return danhSachBanAn.find(
        b => (b.maBan.toLowerCase() === str || (b.tenBan && b.tenBan.toLowerCase() === str) || (b.soBan && b.soBan.toLowerCase() === str)) && b.trangThai !== 'DaXoa'
    ) || null;
}

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        maBan: duLieu.maBan.trim().toUpperCase(),
        tenBan: duLieu.tenBan.trim(),
        soBan: duLieu.soBan ? duLieu.soBan.trim() : duLieu.tenBan.trim(),
        khuVucId: Number(duLieu.khuVucId),
        sucChua: Number(duLieu.sucChua) || 4,
        tokenBaoMat: taoTokenBaoMatQr(),
        qrToken: taoTokenBaoMatQr(),
        trangThai: duLieu.trangThai || 'Trong',
        daPhatSinhGiaoDich: false,
        ghiChu: duLieu.ghiChu || '',
        ngayTao: new Date(),
        ngayCapNhat: new Date()
    };
    danhSachBanAn.push(banGhiMoi);
    luu();
    return banGhiMoi;
}

async function capNhat(id, duLieu) {
    const viTri = danhSachBanAn.findIndex(b => (b.id === Number(id) || (b.maBan && b.maBan.toUpperCase() === String(id).toUpperCase().trim())) && b.trangThai !== 'DaXoa');
    if (viTri === -1) return null;

    danhSachBanAn[viTri] = {
        ...danhSachBanAn[viTri],
        maBan: duLieu.maBan !== undefined ? duLieu.maBan.trim().toUpperCase() : danhSachBanAn[viTri].maBan,
        tenBan: duLieu.tenBan !== undefined ? duLieu.tenBan.trim() : danhSachBanAn[viTri].tenBan,
        soBan: duLieu.soBan !== undefined ? duLieu.soBan.trim() : (duLieu.tenBan !== undefined ? duLieu.tenBan.trim() : danhSachBanAn[viTri].soBan),
        khuVucId: duLieu.khuVucId !== undefined ? Number(duLieu.khuVucId) : danhSachBanAn[viTri].khuVucId,
        sucChua: duLieu.sucChua !== undefined ? Number(duLieu.sucChua) : danhSachBanAn[viTri].sucChua,
        trangThai: duLieu.trangThai || danhSachBanAn[viTri].trangThai,
        ghiChu: duLieu.ghiChu !== undefined ? duLieu.ghiChu : danhSachBanAn[viTri].ghiChu,
        ngayCapNhat: new Date()
    };
    luu();
    return danhSachBanAn[viTri];
}

async function lamMoiToken(id, tokenMoi) {
    const ban = await layTheoId(id);
    if (!ban) return null;
    ban.tokenBaoMat = tokenMoi;
    ban.qrToken = tokenMoi;
    ban.ngayCapNhat = new Date();
    luu();
    return ban;
}

async function xoa(id) {
    const viTri = danhSachBanAn.findIndex(b => b.id === Number(id));
    if (viTri === -1) return false;
    danhSachBanAn[viTri].trangThai = 'DaXoa';
    danhSachBanAn[viTri].ngayCapNhat = new Date();
    luu();
    return true;
}

async function dongBoDanhSach(danhSachMoi) {
    if (!Array.isArray(danhSachMoi)) return danhSachBanAn;
    danhSachBanAn = danhSachMoi.map((b, idx) => ({
        id: Number(b.id) || (idx + 1),
        maBan: (b.maBan || `B${b.id || (idx + 1)}`).toUpperCase().trim(),
        tenBan: (b.tenBan || b.soBan || `Bàn ${b.id}`).trim(),
        soBan: (b.soBan || b.tenBan || `Bàn ${b.id}`).trim(),
        khuVucId: Number(b.khuVucId) || 1,
        sucChua: Number(b.sucChua) || 4,
        tokenBaoMat: b.qrToken || b.tokenBaoMat || `tok_b${b.id}`,
        qrToken: b.qrToken || b.tokenBaoMat || `tok_b${b.id}`,
        trangThai: b.trangThai === 'DANG_DUNG' ? 'DangDung' : (b.trangThai === 'TAM_KHOA' ? 'TamKhoa' : (b.trangThai === 'CHO_THANH_TOAN' ? 'ChoThanhToan' : (b.trangThai || 'Trong'))),
        daPhatSinhGiaoDich: Boolean(b.daPhatSinhGiaoDich),
        ghiChu: b.ghiChu || '',
        ngayTao: b.ngayTao ? new Date(b.ngayTao) : new Date(),
        ngayCapNhat: new Date()
    }));
    tuTangId = Math.max(...danhSachBanAn.map(b => b.id || 0), 0) + 1;
    luu();
    return danhSachBanAn;
}

module.exports = {
    layTatCa,
    layTheoId,
    layTheoMaBan,
    taoMoi,
    capNhat,
    lamMoiToken,
    xoa,
    dongBoDanhSach
};
