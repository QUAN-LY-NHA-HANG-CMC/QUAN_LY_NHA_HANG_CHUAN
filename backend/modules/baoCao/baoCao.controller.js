const baoCaoService = require('./baoCao.service');
const { phanHoiThanhCong } = require('../../tienIch/dinhDangPhanHoi');

async function layDashboard(req, res, next) {
    try {
        const { ngay } = req.query;
        const ketQua = await baoCaoService.layDashboardTongQuan(ngay);
        return phanHoiThanhCong(res, ketQua, 'Lấy dữ liệu Dashboard tổng quan thành công');
    } catch (e) {
        next(e);
    }
}

async function layBieuDo(req, res, next) {
    try {
        const { kieu, soNgay } = req.query;
        const ketQua = await baoCaoService.layBieuDoDoanhThu({ kieu, soNgay });
        return phanHoiThanhCong(res, ketQua, 'Lấy dữ liệu biểu đồ doanh thu thành công');
    } catch (e) {
        next(e);
    }
}

async function layTyTrong(req, res, next) {
    try {
        const { tuNgay, denNgay } = req.query;
        const ketQua = await baoCaoService.layTyTrongThanhToan({ tuNgay, denNgay });
        return phanHoiThanhCong(res, ketQua, 'Thống kê tỷ trọng thanh toán thành công');
    } catch (e) {
        next(e);
    }
}

async function layDoanhThuDanhMuc(req, res, next) {
    try {
        const ketQua = await baoCaoService.layDoanhThuTheoDanhMuc();
        return phanHoiThanhCong(res, ketQua, 'Thống kê doanh thu theo danh mục thành công');
    } catch (e) {
        next(e);
    }
}

async function layXepHangMon(req, res, next) {
    try {
        const { gioiHan } = req.query;
        const ketQua = await baoCaoService.layXepHangMonAn({ gioiHan });
        return phanHoiThanhCong(res, ketQua, 'Lấy bảng xếp hạng món ăn thành công');
    } catch (e) {
        next(e);
    }
}

async function layKhungGio(req, res, next) {
    try {
        const ketQua = await baoCaoService.layThongKeKhungGioCaoDiem();
        return phanHoiThanhCong(res, ketQua, 'Thống kê khung giờ cao điểm thành công');
    } catch (e) {
        next(e);
    }
}

async function layThongKeHuy(req, res, next) {
    try {
        const ketQua = await baoCaoService.layThongKeDonHuy();
        return phanHoiThanhCong(res, ketQua, 'Thống kê tỷ lệ hủy món thành công');
    } catch (e) {
        next(e);
    }
}

async function traCuuHoaDon(req, res, next) {
    try {
        const { maHoaDon, tuNgay, denNgay, banId, phuongThuc } = req.query;
        const ketQua = await baoCaoService.traCuuLichSuHoaDon({ maHoaDon, tuNgay, denNgay, banId, phuongThuc });
        return phanHoiThanhCong(res, ketQua, 'Tra cứu lịch sử hóa đơn thành công');
    } catch (e) {
        next(e);
    }
}

async function xuatCsvHoaDon(req, res, next) {
    try {
        const { tuNgay, denNgay } = req.query;
        const csvContent = await baoCaoService.xuatCsvHoaDon({ tuNgay, denNgay });
        const fileName = `bao-cao-hoa-don-${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.status(200).send(csvContent);
    } catch (e) {
        next(e);
    }
}

async function xuatCsvThucDon(req, res, next) {
    try {
        const csvContent = await baoCaoService.xuatCsvThucDon();
        const fileName = `danh-muc-thuc-don-${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.status(200).send(csvContent);
    } catch (e) {
        next(e);
    }
}

module.exports = {
    layDashboard,
    layBieuDo,
    layTyTrong,
    layDoanhThuDanhMuc,
    layXepHangMon,
    layKhungGio,
    layThongKeHuy,
    traCuuHoaDon,
    xuatCsvHoaDon,
    xuatCsvThucDon
};
