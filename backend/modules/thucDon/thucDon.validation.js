function kiemTraTaoMonAn(duLieu) {
    const loi = [];

    if (!duLieu.tenMon || typeof duLieu.tenMon !== 'string' || duLieu.tenMon.trim() === '') {
        loi.push('Tên món ăn không được để trống');
    }

    if (!duLieu.danhMucId || !Number.isInteger(Number(duLieu.danhMucId)) || Number(duLieu.danhMucId) <= 0) {
        loi.push('ID danh mục món ăn không hợp lệ');
    }

    if (duLieu.giaBan === undefined || isNaN(Number(duLieu.giaBan)) || Number(duLieu.giaBan) < 0) {
        loi.push('Giá bán món ăn phải là số lớn hơn hoặc bằng 0');
    }

    if (duLieu.trangThai && !['DangBan', 'TamHet'].includes(duLieu.trangThai)) {
        loi.push('Trạng thái món ăn phải là DangBan hoặc TamHet');
    }

    return loi;
}

function kiemTraCapNhatMonAn(duLieu) {
    const loi = [];

    if (duLieu.tenMon !== undefined && (typeof duLieu.tenMon !== 'string' || duLieu.tenMon.trim() === '')) {
        loi.push('Tên món ăn không được để trống');
    }

    if (duLieu.danhMucId !== undefined && (!Number.isInteger(Number(duLieu.danhMucId)) || Number(duLieu.danhMucId) <= 0)) {
        loi.push('ID danh mục món ăn không hợp lệ');
    }

    if (duLieu.giaBan !== undefined && (isNaN(Number(duLieu.giaBan)) || Number(duLieu.giaBan) < 0)) {
        loi.push('Giá bán món ăn phải là số lớn hơn hoặc bằng 0');
    }

    if (duLieu.trangThai && !['DangBan', 'TamHet'].includes(duLieu.trangThai)) {
        loi.push('Trạng thái món ăn phải là DangBan hoặc TamHet');
    }

    return loi;
}

module.exports = {
    kiemTraTaoMonAn,
    kiemTraCapNhatMonAn
};
