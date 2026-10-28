function kiemTraTaoDanhMuc(duLieu) {
    const loi = [];
    if (!duLieu.tenDanhMuc || typeof duLieu.tenDanhMuc !== 'string' || duLieu.tenDanhMuc.trim() === '') {
        loi.push('Tên danh mục không được để trống');
    } else if (duLieu.tenDanhMuc.trim().length > 100) {
        loi.push('Tên danh mục không được vượt quá 100 ký tự');
    }

    if (duLieu.thuTuHienThi !== undefined) {
        const thuTu = Number(duLieu.thuTuHienThi);
        if (!Number.isInteger(thuTu) || thuTu < 0) {
            loi.push('Thứ tự hiển thị phải là số nguyên không âm');
        }
    }

    return loi;
}

function kiemTraCapNhatDanhMuc(duLieu) {
    const loi = [];
    if (duLieu.tenDanhMuc !== undefined) {
        if (typeof duLieu.tenDanhMuc !== 'string' || duLieu.tenDanhMuc.trim() === '') {
            loi.push('Tên danh mục không được để trống');
        } else if (duLieu.tenDanhMuc.trim().length > 100) {
            loi.push('Tên danh mục không được vượt quá 100 ký tự');
        }
    }

    if (duLieu.thuTuHienThi !== undefined) {
        const thuTu = Number(duLieu.thuTuHienThi);
        if (!Number.isInteger(thuTu) || thuTu < 0) {
            loi.push('Thứ tự hiển thị phải là số nguyên không âm');
        }
    }

    return loi;
}

module.exports = {
    kiemTraTaoDanhMuc,
    kiemTraCapNhatDanhMuc
};
