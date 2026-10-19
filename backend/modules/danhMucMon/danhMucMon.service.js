const danhMucModel = require('./danhMucMon.model');

async function layTatCaDanhMuc() {
    return await danhMucModel.layTatCa();
}

async function layChiTietDanhMuc(id) {
    const danhMuc = await danhMucModel.layTheoId(id);
    if (!danhMuc) {
        const loi = new Error('Không tìm thấy danh mục món ăn');
        loi.status = 404;
        throw loi;
    }
    return danhMuc;
}

async function taoDanhMucMoi(duLieu) {
    const daTonTai = await danhMucModel.layTheoTen(duLieu.tenDanhMuc);
    if (daTonTai) {
        const loi = new Error('Tên danh mục món ăn đã tồn tại');
        loi.status = 409;
        throw loi;
    }
    return await danhMucModel.taoMoi(duLieu);
}

async function capNhatDanhMuc(id, duLieu) {
    await layChiTietDanhMuc(id);

    if (duLieu.tenDanhMuc) {
        const daTonTai = await danhMucModel.layTheoTen(duLieu.tenDanhMuc);
        if (daTonTai && daTonTai.id !== Number(id)) {
            const loi = new Error('Tên danh mục món ăn đã bị trùng lặp');
            loi.status = 409;
            throw loi;
        }
    }

    return await danhMucModel.capNhat(id, duLieu);
}

async function xoaDanhMuc(id) {
    await layChiTietDanhMuc(id);
    return await danhMucModel.xoa(id);
}

module.exports = {
    layTatCaDanhMuc,
    layChiTietDanhMuc,
    taoDanhMucMoi,
    capNhatDanhMuc,
    xoaDanhMuc
};
