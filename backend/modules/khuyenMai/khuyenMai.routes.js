const express = require('express');
const router = express.Router();
const khuyenMaiController = require('./khuyenMai.controller');
const khuyenMaiValidation = require('./khuyenMai.validation');

// Tuyến đường kiểm tra mã voucher (dành cho cả khách hàng và thu ngân)
router.post('/kiem-tra', khuyenMaiValidation.kiemTraApDungMa, khuyenMaiController.kiemTraVaApDung);

// Tuyến đường quản lý CRUD khuyến mãi
router.get('/', khuyenMaiController.layDanhSach);
router.get('/:id', khuyenMaiController.layChiTiet);
router.post('/', khuyenMaiValidation.kiemTraTaoKhuyenMai, khuyenMaiController.taoMoi);
router.put('/:id', khuyenMaiController.capNhat);
router.delete('/:id', khuyenMaiController.xoa);

module.exports = router;
