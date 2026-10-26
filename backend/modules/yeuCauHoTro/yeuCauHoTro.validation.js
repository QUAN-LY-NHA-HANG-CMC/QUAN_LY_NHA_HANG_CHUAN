function kiemTraTaoYeuCauHoTro(duLieu) {
    const loi = [];

    if (!duLieu.banId || !Number.isInteger(Number(duLieu.banId)) || Number(duLieu.banId) <= 0) {
        loi.push('ID bàn không hợp lệ');
    }

    const danhSachLoaiYeuCau = ['GoiNhanVien', 'YeuCauThanhToan'];
    if (!duLieu.loaiYeuCau || !danhSachLoaiYeuCau.includes(duLieu.loaiYeuCau)) {
        loi.push(`Loại yêu cầu không hợp lệ. Chỉ chấp nhận: ${danhSachLoaiYeuCau.join(', ')}`);
    }

    if (duLieu.loaiYeuCau === 'YeuCauThanhToan' && duLieu.phuongThucThanhToan) {
        const danhSachPT = ['TienMat', 'ChuyenKhoan'];
        if (!danhSachPT.includes(duLieu.phuongThucThanhToan)) {
            loi.push('Phương thức thanh toán phải là TienMat hoặc ChuyenKhoan');
        }
    }

    return loi;
}

function kiemTraCapNhatTrangThai(duLieu) {
    const loi = [];
    const cacTrangThaiHopLe = ['ChoXuLy', 'DangXuLy', 'DaHoanThanh', 'HuyBo'];

    if (!duLieu.trangThai || !cacTrangThaiHopLe.includes(duLieu.trangThai)) {
        loi.push(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${cacTrangThaiHopLe.join(', ')}`);
    }

    return loi;
}

module.exports = {
    kiemTraTaoYeuCauHoTro,
    kiemTraCapNhatTrangThai
};
