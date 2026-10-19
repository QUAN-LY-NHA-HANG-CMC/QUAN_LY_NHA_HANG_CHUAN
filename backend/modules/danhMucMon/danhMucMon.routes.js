const express = require('express');
const router = express.Router();
const danhMucController = require('./danhMucMon.controller');
const xacThuc = require('../../middleware/xacThuc');
const { kiemTraVaiTro } = require('../../middleware/phanQuyen');

// Public hoặc cho phép khách xem danh mục
router.get('/', danhMucController.layTatCa);
router.get('/:id', danhMucController.layChiTiet);

// Quản lý tạo, sửa, xóa
router.post('/', xacThuc, kiemTraVaiTro('QuanLy'), danhMucController.taoMoi);
router.put('/:id', xacThuc, kiemTraVaiTro('QuanLy'), danhMucController.capNhat);
router.delete('/:id', xacThuc, kiemTraVaiTro('QuanLy'), danhMucController.xoa);

module.exports = router;
