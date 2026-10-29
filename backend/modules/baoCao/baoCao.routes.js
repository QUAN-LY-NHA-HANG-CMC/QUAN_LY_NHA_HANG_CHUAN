const express = require('express');
const router = express.Router();
const baoCaoController = require('./baoCao.controller');

// US-123: Dashboard tổng quan
router.get('/tong-quan', baoCaoController.layDashboard);

// US-124: Biểu đồ doanh thu
router.get('/bieu-do-doanh-thu', baoCaoController.layBieuDo);

// US-125: Tỷ trọng thanh toán tiền mặt vs chuyển khoản
router.get('/ty-trong-thanh-toan', baoCaoController.layTyTrong);

// US-126: Doanh thu theo danh mục
router.get('/doanh-thu-danh-muc', baoCaoController.layDoanhThuDanhMuc);

// US-127 & US-128: Xếp hạng món bán chạy & bán chậm
router.get('/xep-hang-mon-an', baoCaoController.layXepHangMon);

// US-129: Khung giờ cao điểm
router.get('/khung-gio-cao-diem', baoCaoController.layKhungGio);

// US-130: Thống kê hủy đơn / hủy món
router.get('/thong-ke-huy', baoCaoController.layThongKeHuy);

// US-131 & US-132: Tra cứu lịch sử hóa đơn
router.get('/lich-su-hoa-don', baoCaoController.traCuuHoaDon);

// US-133: Xuất file CSV hóa đơn
router.get('/xuat-csv/hoa-don', baoCaoController.xuatCsvHoaDon);

// US-134: Xuất file CSV thực đơn
router.get('/xuat-csv/thuc-don', baoCaoController.xuatCsvThucDon);

module.exports = router;
