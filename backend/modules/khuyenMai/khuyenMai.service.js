/**
 * SERVICE KHUYẾN MÃI (khuyenMai.service.js)
 * Nghiệp vụ kiểm tra điều kiện áp dụng voucher và tính tiền chiết khấu (US-099, US-100)
 */
const khuyenMaiModel = require('./khuyenMai.model');

async function layDanhSachKhuyenMai(boLoc = {}) {
    return await khuyenMaiModel.layTatCa(boLoc);
}

async function layChiTietKhuyenMai(id) {
    const km = await khuyenMaiModel.layTheoId(id);
    if (!km) {
        const loi = new Error('Không tìm thấy chương trình khuyến mãi');
        loi.status = 404;
        throw loi;
    }
    return km;
}

async function taoKhuyenMai(duLieu) {
    const daTonTai = await khuyenMaiModel.layTheoMa(duLieu.maKhuyenMai);
    if (daTonTai) {
        const loi = new Error(`Mã khuyến mãi '${duLieu.maKhuyenMai}' đã tồn tại trên hệ thống`);
        loi.status = 400;
        throw loi;
    }
    return await khuyenMaiModel.taoMoi(duLieu);
}

async function capNhatKhuyenMai(id, duLieu) {
    await layChiTietKhuyenMai(id);
    return await khuyenMaiModel.capNhat(id, duLieu);
}

async function xoaKhuyenMai(id) {
    await layChiTietKhuyenMai(id);
    return await khuyenMaiModel.xoa(id);
}

/**
 * Kiểm tra điều kiện hợp lệ và tính số tiền giảm giá của mã khuyến mãi (US-100)
 * @param {String} maKhuyenMai Mã voucher
 * @param {Number} tongTienTamTinh Tổng tiền món ăn tạm tính của bàn
 */
async function kiemTraVaApDungMa({ maKhuyenMai, tongTienTamTinh }) {
    if (!maKhuyenMai) {
        const loi = new Error('Vui lòng nhập mã khuyến mãi');
        loi.status = 400;
        throw loi;
    }

    const km = await khuyenMaiModel.layTheoMa(maKhuyenMai);
    if (!km) {
        const loi = new Error(`Mã khuyến mãi '${maKhuyenMai}' không tồn tại hoặc đã hết hiệu lực`);
        loi.status = 404;
        throw loi;
    }

    if (km.trangThai !== 'DangApDung') {
        const loi = new Error(`Chương trình khuyến mãi '${km.tenKhuyenMai}' hiện đang tạm dừng hoặc đã kết thúc`);
        loi.status = 400;
        throw loi;
    }

    const now = new Date();
    if (km.ngayBatDau && now < new Date(km.ngayBatDau)) {
        const loi = new Error(`Chương trình khuyến mãi chưa bắt đầu (Bắt đầu từ: ${km.ngayBatDau.toLocaleDateString('vi-VN')})`);
        loi.status = 400;
        throw loi;
    }

    if (km.ngayKetThuc && now > new Date(km.ngayKetThuc)) {
        const loi = new Error(`Mã khuyến mãi đã hết hạn sử dụng vào ngày ${km.ngayKetThuc.toLocaleDateString('vi-VN')}`);
        loi.status = 400;
        throw loi;
    }

    if (km.soLuongToiDa && km.daSuDung >= km.soLuongToiDa) {
        const loi = new Error('Mã khuyến mãi đã hết lượt sử dụng');
        loi.status = 400;
        throw loi;
    }

    const tongTien = Number(tongTienTamTinh) || 0;
    if (km.giaTriDonToiThieu && tongTien < km.giaTriDonToiThieu) {
        const loi = new Error(`Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này (Yêu cầu tối thiểu: ${km.giaTriDonToiThieu.toLocaleString('vi-VN')}đ)`);
        loi.status = 400;
        throw loi;
    }

    // Tính toán số tiền được giảm
    let soTienGiam = 0;
    if (km.loai === 'PHAN_TRAM') {
        soTienGiam = Math.round(tongTien * (km.giaTri / 100));
        if (km.giamToiDa && soTienGiam > km.giamToiDa) {
            soTienGiam = km.giamToiDa;
        }
    } else {
        soTienGiam = Number(km.giaTri);
    }

    // Không cho phép giảm vượt quá tổng tiền đơn
    if (soTienGiam > tongTien) {
        soTienGiam = tongTien;
    }

    return {
        hopLe: true,
        khuyenMaiId: km.id,
        maKhuyenMai: km.maKhuyenMai,
        tenKhuyenMai: km.tenKhuyenMai,
        loai: km.loai,
        giaTri: km.giaTri,
        soTienGiam,
        tongTienSauGiam: Math.max(0, tongTien - soTienGiam),
        thongBao: `Áp dụng thành công mã '${km.maKhuyenMai}'. Bạn được giảm ${soTienGiam.toLocaleString('vi-VN')}đ!`
    };
}

module.exports = {
    layDanhSachKhuyenMai,
    layChiTietKhuyenMai,
    taoKhuyenMai,
    capNhatKhuyenMai,
    xoaKhuyenMai,
    kiemTraVaApDungMa
};
