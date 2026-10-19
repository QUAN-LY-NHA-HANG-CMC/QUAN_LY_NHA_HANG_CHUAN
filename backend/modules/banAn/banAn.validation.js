function kiemTraTaoBanAn(duLieu) {
    const loi = [];

    if (!duLieu.maBan || typeof duLieu.maBan !== 'string' || duLieu.maBan.trim() === '') {
        loi.push('Mã bàn không được để trống (ví dụ: B101, VIP1)');
    }

    if (!duLieu.tenBan || typeof duLieu.tenBan !== 'string' || duLieu.tenBan.trim() === '') {
        loi.push('Tên bàn không được để trống');
    }

    if (!duLieu.khuVucId || !Number.isInteger(Number(duLieu.khuVucId)) || Number(duLieu.khuVucId) <= 0) {
        loi.push('ID khu vực không hợp lệ');
    }

    if (duLieu.sucChua !== undefined) {
        const sucChua = Number(duLieu.sucChua);
        if (!Number.isInteger(sucChua) || sucChua <= 0) {
            loi.push('Sức chứa bàn phải là số nguyên dương');
        }
    }

    return loi;
}

function kiemTraCapNhatBanAn(duLieu) {
    const loi = [];

    if (duLieu.maBan !== undefined && (typeof duLieu.maBan !== 'string' || duLieu.maBan.trim() === '')) {
        loi.push('Mã bàn không được để trống');
    }

    if (duLieu.tenBan !== undefined && (typeof duLieu.tenBan !== 'string' || duLieu.tenBan.trim() === '')) {
        loi.push('Tên bàn không được để trống');
    }

    if (duLieu.khuVucId !== undefined && (!Number.isInteger(Number(duLieu.khuVucId)) || Number(duLieu.khuVucId) <= 0)) {
        loi.push('ID khu vực không hợp lệ');
    }

    if (duLieu.sucChua !== undefined) {
        const sucChua = Number(duLieu.sucChua);
        if (!Number.isInteger(sucChua) || sucChua <= 0) {
            loi.push('Sức chứa bàn phải là số nguyên dương');
        }
    }

    if (duLieu.trangThai && !['Trong', 'DangPhucVu', 'TamKhoa'].includes(duLieu.trangThai)) {
        loi.push('Trạng thái bàn phải là Trong, DangPhucVu hoặc TamKhoa');
    }

    return loi;
}

module.exports = {
    kiemTraTaoBanAn,
    kiemTraCapNhatBanAn
};
