const express = require('express');
const router = express.Router();
const gioHangController = require('./gioHang.controller');

// Khách hàng gọi API kiểm tra giỏ hàng trước khi đặt món
router.post('/kiem-tra-va-tinh-tien', gioHangController.kiemTraVaTinhTien);

module.exports = router;
