function kiemTraTaoKhuVuc(duLieu) {
    const loi = [];
    if (!duLieu.tenKhuVuc || typeof duLieu.tenKhuVuc !== 'string' || duLieu.tenKhuVuc.trim() === '') {
        loi.push('Tên khu vực không được để trống');
    } else if (duLieu.tenKhuVuc.trim().length > 100) {
        loi.push('Tên khu vực không được vượt quá 100 ký tự');
    }
    return loi;
}

function kiemTraCapNhatKhuVuc(duLieu) {
    const loi = [];
    if (duLieu.tenKhuVuc !== undefined) {
        if (typeof duLieu.tenKhuVuc !== 'string' || duLieu.tenKhuVuc.trim() === '') {
            loi.push('Tên khu vực không được để trống');
        } else if (duLieu.tenKhuVuc.trim().length > 100) {
            loi.push('Tên khu vực không được vượt quá 100 ký tự');
        }
    }
    return loi;
}

module.exports = {
    kiemTraTaoKhuVuc,
    kiemTraCapNhatKhuVuc
};
