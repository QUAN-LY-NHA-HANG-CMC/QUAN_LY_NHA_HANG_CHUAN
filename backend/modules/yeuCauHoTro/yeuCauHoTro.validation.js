function kiemTraTaoYeuCauHoTro(duLieu) {
    const loi = [];

    if (!duLieu.banId && !duLieu.maBan) {
        loi.push('ID bàn không hợp lệ');
    }

    const danhSachLoaiYeuCau = [
        'GoiNhanVien',
        'YeuCauThanhToan',
        'THANH_TOAN',
        'THEM_BAT_DUA',
        'THEM_KHAN_GIAY',
        'THEM_DA_LANH',
        'THEM_GIA_VI',
        'DON_BAN',
        'GAP_NHAN_VIEN'
    ];
    if (!duLieu.loaiYeuCau || !danhSachLoaiYeuCau.includes(duLieu.loaiYeuCau)) {
        loi.push(`Loại yêu cầu không hợp lệ. Chỉ chấp nhận: ${danhSachLoaiYeuCau.join(', ')}`);
    }

    const laThanhToan = duLieu.loaiYeuCau === 'YeuCauThanhToan' || duLieu.loaiYeuCau === 'THANH_TOAN';
    const pt = duLieu.phuongThucThanhToan || duLieu.phuongThuc;
    if (laThanhToan && pt) {
        const danhSachPT = ['TienMat', 'ChuyenKhoan', 'TIEN_MAT', 'CHUYEN_KHOAN'];
        if (!danhSachPT.includes(pt)) {
            loi.push('Phương thức thanh toán phải là TienMat hoặc ChuyenKhoan');
        }
    }

    return loi;
}

function kiemTraCapNhatTrangThai(duLieu) {
    const loi = [];
    const cacTrangThaiHopLe = [
        'ChoXuLy', 'DangXuLy', 'DaHoanThanh', 'HuyBo',
        'CHO_TIEP_NHAN', 'DA_TIEP_NHAN', 'DA_XU_LY'
    ];

    if (!duLieu.trangThai || !cacTrangThaiHopLe.includes(duLieu.trangThai)) {
        loi.push(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${cacTrangThaiHopLe.join(', ')}`);
    }

    return loi;
}

module.exports = {
    kiemTraTaoYeuCauHoTro,
    kiemTraCapNhatTrangThai
};
