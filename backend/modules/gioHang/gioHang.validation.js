function kiemTraDuLieuGioHang(duLieu) {
    const loi = [];

    if (!duLieu.banId || !Number.isInteger(Number(duLieu.banId)) || Number(duLieu.banId) <= 0) {
        loi.push('ID bàn không hợp lệ');
    }

    if (!Array.isArray(duLieu.danhSachMon) || duLieu.danhSachMon.length === 0) {
        loi.push('Giỏ hàng trống. Vui lòng chọn ít nhất 1 món ăn');
    } else {
        duLieu.danhSachMon.forEach((item, index) => {
            if (!item.monAnId || !Number.isInteger(Number(item.monAnId)) || Number(item.monAnId) <= 0) {
                loi.push(`Món ăn tại vị trí ${index + 1} có ID không hợp lệ`);
            }
            if (!item.soLuong || !Number.isInteger(Number(item.soLuong)) || Number(item.soLuong) <= 0) {
                loi.push(`Số lượng món tại vị trí ${index + 1} phải là số nguyên lớn hơn 0`);
            }
        });
    }

    return loi;
}

module.exports = {
    kiemTraDuLieuGioHang
};
