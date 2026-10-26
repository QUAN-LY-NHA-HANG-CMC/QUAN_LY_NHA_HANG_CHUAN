let danhSachYeuCau = [
    {
        id: 1,
        banId: 1,
        maBan: 'B101',
        tenBan: 'Bàn 01',
        loaiYeuCau: 'GoiNhanVien', // 'GoiNhanVien', 'YeuCauThanhToan'
        lyDo: 'Xin thêm bát đũa và đá lạnh',
        phuongThucThanhToan: null,
        ghiChu: 'Khách có 4 người',
        trangThai: 'ChoXuLy', // 'ChoXuLy', 'DangXuLy', 'DaHoanThanh', 'HuyBo'
        nguoiTiepNhanId: null,
        thoiGianTao: new Date(Date.now() - 15 * 60 * 1000), // 15 phút trước
        thoiGianCapNhat: new Date(Date.now() - 15 * 60 * 1000)
    }
];

let tuTangId = 2;

async function taoMoi(duLieu) {
    const banGhiMoi = {
        id: tuTangId++,
        banId: Number(duLieu.banId),
        maBan: duLieu.maBan,
        tenBan: duLieu.tenBan,
        loaiYeuCau: duLieu.loaiYeuCau,
        lyDo: duLieu.lyDo ? duLieu.lyDo.trim() : (duLieu.loaiYeuCau === 'YeuCauThanhToan' ? 'Khách gọi thanh toán' : 'Gọi nhân viên'),
        phuongThucThanhToan: duLieu.phuongThucThanhToan || null,
        ghiChu: duLieu.ghiChu ? duLieu.ghiChu.trim() : '',
        trangThai: 'ChoXuLy',
        nguoiTiepNhanId: null,
        thoiGianTao: new Date(),
        thoiGianCapNhat: new Date()
    };
    danhSachYeuCau.push(banGhiMoi);
    return banGhiMoi;
}

async function layTatCa({ trangThai, banId } = {}) {
    let ketQua = [...danhSachYeuCau];

    if (trangThai) {
        ketQua = ketQua.filter(yc => yc.trangThai === trangThai);
    }

    if (banId) {
        ketQua = ketQua.filter(yc => yc.banId === Number(banId));
    }

    // Sắp xếp yêu cầu mới nhất lên đầu (hoặc FIFO tùy chọn)
    return ketQua.sort((a, b) => b.thoiGianTao - a.thoiGianTao);
}

async function layTheoId(id) {
    return danhSachYeuCau.find(yc => yc.id === Number(id)) || null;
}

async function capNhatTrangThai(id, trangThaiMoi, nguoiXuLyId = null) {
    const viTri = danhSachYeuCau.findIndex(yc => yc.id === Number(id));
    if (viTri === -1) return null;

    danhSachYeuCau[viTri] = {
        ...danhSachYeuCau[viTri],
        trangThai: trangThaiMoi,
        nguoiTiepNhanId: nguoiXuLyId || danhSachYeuCau[viTri].nguoiTiepNhanId,
        thoiGianCapNhat: new Date()
    };
    return danhSachYeuCau[viTri];
}

module.exports = {
    taoMoi,
    layTatCa,
    layTheoId,
    capNhatTrangThai
};
