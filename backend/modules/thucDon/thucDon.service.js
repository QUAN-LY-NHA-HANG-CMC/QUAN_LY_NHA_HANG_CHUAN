const thucDonModel = require('./thucDon.model');
const danhMucModel = require('../danhMucMon/danhMucMon.model');

async function layDanhSachMonAn(boLoc) {
    return await thucDonModel.layDanhSach(boLoc);
}

async function layChiTietMonAn(id) {
    const mon = await thucDonModel.layTheoId(id);
    if (!mon) {
        const loi = new Error('Không tìm thấy món ăn');
        loi.status = 404;
        throw loi;
    }
    return mon;
}

async function taoMonAn(duLieu) {
    const danhMuc = await danhMucModel.layTheoId(duLieu.danhMucId);
    if (!danhMuc) {
        const loi = new Error('Danh mục món ăn không tồn tại');
        loi.status = 400;
        throw loi;
    }

    const daTonTai = await thucDonModel.layTheoTen(duLieu.tenMon);
    if (daTonTai) {
        const loi = new Error('Tên món ăn đã tồn tại');
        loi.status = 409;
        throw loi;
    }

    return await thucDonModel.taoMoi(duLieu);
}

async function capNhatMonAn(id, duLieu) {
    await layChiTietMonAn(id);

    if (duLieu.danhMucId) {
        const danhMuc = await danhMucModel.layTheoId(duLieu.danhMucId);
        if (!danhMuc) {
            const loi = new Error('Danh mục món ăn không tồn tại');
            loi.status = 400;
            throw loi;
        }
    }

    if (duLieu.tenMon) {
        const daTonTai = await thucDonModel.layTheoTen(duLieu.tenMon);
        if (daTonTai && daTonTai.id !== Number(id)) {
            const loi = new Error('Tên món ăn đã bị trùng lặp');
            loi.status = 409;
            throw loi;
        }
    }

    return await thucDonModel.capNhat(id, duLieu);
}

async function capNhatHinhAnh(id, duongDanHinhAnh) {
    await layChiTietMonAn(id);
    return await thucDonModel.capNhat(id, { hinhAnh: duongDanHinhAnh });
}

async function doiTrangThaiMonAn(id, trangThai) {
    await layChiTietMonAn(id);
    if (!['DangBan', 'TamHet'].includes(trangThai)) {
        const loi = new Error('Trạng thái không hợp lệ. Chỉ chấp nhận DangBan hoặc TamHet');
        loi.status = 400;
        throw loi;
    }
    return await thucDonModel.doiTrangThai(id, trangThai);
}

async function danhDauMonBanChay(id, laBanChay) {
    await layChiTietMonAn(id);
    return await thucDonModel.danhDauBanChay(id, laBanChay);
}

async function thietLapTuyChon(id, tuyChon) {
    await layChiTietMonAn(id);
    if (!Array.isArray(tuyChon)) {
        const loi = new Error('Tùy chọn món ăn phải là một mảng');
        loi.status = 400;
        throw loi;
    }
    return await thucDonModel.capNhat(id, { tuyChon });
}

async function xoaMemMonAn(id) {
    await layChiTietMonAn(id);
    return await thucDonModel.xoaMem(id);
}

module.exports = {
    layDanhSachMonAn,
    layChiTietMonAn,
    taoMonAn,
    capNhatMonAn,
    capNhatHinhAnh,
    doiTrangThaiMonAn,
    danhDauMonBanChay,
    thietLapTuyChon,
    xoaMemMonAn
};
