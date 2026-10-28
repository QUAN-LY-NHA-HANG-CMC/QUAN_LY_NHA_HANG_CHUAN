const nhanVienModel = require('./nhanVien.model');
const { bămMatKhau } = require('../../tienIch/maHoaMatKhau');

async function layDanhSachNhanVien(boLoc) {
    return await nhanVienModel.layDanhSach(boLoc);
}

async function layChiTietNhanVien(id) {
    const nv = await nhanVienModel.layTheoId(id);
    if (!nv) {
        const loi = new Error('Không tìm thấy nhân viên');
        loi.status = 404;
        throw loi;
    }
    return nv;
}

async function taoNhanVien(duLieu) {
    const daTonTai = await nhanVienModel.layTheoTenDangNhap(duLieu.tenDangNhap);
    if (daTonTai) {
        const loi = new Error('Tên đăng nhập đã tồn tại trong hệ thống');
        loi.status = 409;
        throw loi;
    }

    const matKhauDaBam = await bămMatKhau(duLieu.matKhau);
    return await nhanVienModel.taoMoi({
        ...duLieu,
        matKhau: matKhauDaBam
    });
}

async function capNhatNhanVien(id, duLieu) {
    await layChiTietNhanVien(id);
    return await nhanVienModel.capNhat(id, duLieu);
}

async function doiTrangThaiNhanVien(id, trangThai) {
    await layChiTietNhanVien(id);
    if (!['HoatDong', 'Khoa'].includes(trangThai)) {
        const loi = new Error('Trạng thái không hợp lệ. Chỉ chấp nhận HoatDong hoặc Khoa');
        loi.status = 400;
        throw loi;
    }
    return await nhanVienModel.doiTrangThai(id, trangThai);
}

async function datLaiMatKhau(id, matKhauMoi) {
    await layChiTietNhanVien(id);
    const matKhauDaBam = await bămMatKhau(matKhauMoi);
    await nhanVienModel.datLaiMatKhau(id, matKhauDaBam);
    return true;
}

module.exports = {
    layDanhSachNhanVien,
    layChiTietNhanVien,
    taoNhanVien,
    capNhatNhanVien,
    doiTrangThaiNhanVien,
    datLaiMatKhau
};
