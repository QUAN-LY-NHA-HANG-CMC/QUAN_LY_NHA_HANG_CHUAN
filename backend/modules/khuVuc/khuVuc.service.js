const khuVucModel = require('./khuVuc.model');

async function layTatCaKhuVuc() {
    return await khuVucModel.layTatCa();
}

async function layChiTietKhuVuc(id) {
    const khuVuc = await khuVucModel.layTheoId(id);
    if (!khuVuc) {
        const loi = new Error('Không tìm thấy khu vực');
        loi.status = 404;
        throw loi;
    }
    return khuVuc;
}

async function taoKhuVuc(duLieu) {
    const daTonTai = await khuVucModel.layTheoTen(duLieu.tenKhuVuc);
    if (daTonTai) {
        const loi = new Error('Tên khu vực đã tồn tại');
        loi.status = 409;
        throw loi;
    }
    return await khuVucModel.taoMoi(duLieu);
}

async function capNhatKhuVuc(id, duLieu) {
    await layChiTietKhuVuc(id);

    if (duLieu.tenKhuVuc) {
        const daTonTai = await khuVucModel.layTheoTen(duLieu.tenKhuVuc);
        if (daTonTai && daTonTai.id !== Number(id)) {
            const loi = new Error('Tên khu vực đã bị trùng lặp');
            loi.status = 409;
            throw loi;
        }
    }

    return await khuVucModel.capNhat(id, duLieu);
}

async function xoaKhuVuc(id) {
    await layChiTietKhuVuc(id);
    return await khuVucModel.xoa(id);
}

module.exports = {
    layTatCaKhuVuc,
    layChiTietKhuVuc,
    taoKhuVuc,
    capNhatKhuVuc,
    xoaKhuVuc
};
