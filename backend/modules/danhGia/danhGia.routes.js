const express = require('express');
const router = express.Router();
const danhGiaController = require('./danhGia.controller');
const danhGiaValidation = require('./danhGia.validation');

// Thống kê điểm số (US-116)
router.get('/thong-ke', danhGiaController.thongKe);

// Khách hàng gửi đánh giá (US-111, US-112)
router.post('/', danhGiaValidation.kiemTraGuiDanhGia, danhGiaController.guiDanhGia);

// Quản lý xem danh sách và lọc (US-113, US-114)
router.get('/', danhGiaController.layDanhSach);
router.get('/:id', danhGiaController.layChiTiet);

// Quản lý phản hồi (US-115)
router.patch('/:id/phan-hoi', danhGiaValidation.kiemTraPhanHoi, danhGiaController.phanHoi);

module.exports = router;
