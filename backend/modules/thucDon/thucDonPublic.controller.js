const thucDonModel = require('./thucDon.model');
const thucDonService = require('./thucDon.service');
const danhMucModel = require('../danhMucMon/danhMucMon.model');
const banAnModel = require('../banAn/banAn.model');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

// US-050: Lấy toàn bộ thông tin E-Menu khi khách quét mã QR
async function layTrangChuEMenu(req, res, next) {
    try {
        const { banId, token } = req.query;

        if (!banId) {
            return phanHoiLoi(res, 'Thiếu thông tin ID bàn', 400);
        }

        const ban = await banAnModel.layTheoId(banId);
        if (!ban) {
            return phanHoiLoi(res, 'Bàn ăn không tồn tại', 404);
        }

        // Kiểm tra token bảo mật của bàn
        if (token && ban.tokenBaoMat !== token) {
            return phanHoiLoi(res, 'Mã QR bàn không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ nhân viên để lấy mã QR mới.', 403);
        }

        if (ban.trangThai === 'TamKhoa') {
            return phanHoiLoi(res, 'Bàn này hiện đang tạm ngưng phục vụ', 403);
        }

        // Lấy danh mục đang hoạt động
        const danhMuc = await danhMucModel.layTatCa();

        // Lấy danh sách món bán chạy
        const ketQuaMon = await thucDonModel.layDanhSach({ chiLayDangBan: true, soLuong: 50 });
        const monBanChay = ketQuaMon.danhSach.filter(m => m.laMonBanChay);

        const thongTinNhaHang = {
            tenQuan: 'Nhà Hàng Quán Mộc',
            diaChi: '123 Đường Ẩm Thực, Quận 1, TP.HCM',
            hotline: '1900 6868',
            wifi: 'QuanMoc_Guest (Pass: 88888888)',
            banner: '/tepTaiLen/banner-quanmoc.jpg'
        };

        const thongTinBan = {
            banId: ban.id,
            maBan: ban.maBan,
            tenBan: ban.tenBan,
            khuVucId: ban.khuVucId,
            sucChua: ban.sucChua
        };

        return phanHoiThanhCong(res, {
            nhaHang: thongTinNhaHang,
            thongTinBan,
            danhMuc,
            monBanChay
        }, 'Lấy thông tin E-Menu thành công');
    } catch (loi) {
        next(loi);
    }
}

// US-051, US-053, US-054, US-056: Lọc và tìm kiếm món ăn trên E-Menu
async function layDanhSachMonAnPublic(req, res, next) {
    try {
        const { danhMucId, tuKhoa, giaMin, giaMax, trang = 1, soLuong = 100 } = req.query;

        const ketQua = await thucDonModel.layDanhSach({
            danhMucId,
            tuKhoa,
            giaTu: giaMin,
            giaDen: giaMax,
            trang,
            soLuong
        });

        return phanHoiThanhCong(res, ketQua.danhSach, 'Lấy danh sách món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

// US-055: Xem chi tiết món ăn và các tùy chọn size/topping
async function layChiTietMonAnPublic(req, res, next) {
    try {
        const { id } = req.params;
        const mon = await thucDonService.layChiTietMonAn(id);
        return phanHoiThanhCong(res, mon, 'Lấy chi tiết món ăn thành công');
    } catch (loi) {
        next(loi);
    }
}

// US-052: Lấy riêng danh sách món bán chạy
async function layMonBanChayPublic(req, res, next) {
    try {
        const ketQua = await thucDonModel.layDanhSach({ chiLayDangBan: true, soLuong: 50 });
        const monBanChay = ketQua.danhSach.filter(m => m.laMonBanChay);
        return phanHoiThanhCong(res, monBanChay, 'Lấy danh sách món bán chạy thành công');
    } catch (loi) {
        next(loi);
    }
}

// Lấy danh mục món ăn cho khách
async function layDanhMucPublic(req, res, next) {
    try {
        const danhMuc = await danhMucModel.layTatCa();
        return phanHoiThanhCong(res, danhMuc, 'Lấy danh sách danh mục thành công');
    } catch (loi) {
        next(loi);
    }
}

module.exports = {
    layTrangChuEMenu,
    layDanhSachMonAnPublic,
    layChiTietMonAnPublic,
    layMonBanChayPublic,
    layDanhMucPublic
};
